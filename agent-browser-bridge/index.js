require('dotenv').config();
const express = require('express');
const { chromium } = require('playwright');
const ngrok = require('@ngrok/ngrok');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Generate a scoped token for this session
const SESSION_TOKEN = `kbc_tkn_${crypto.randomBytes(16).toString('hex')}`;
const PORT = process.env.PORT || 9000;

const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.log(`[Agent] [Error] Malformed JSON payload received`);
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next();
});
// Chalk for terminal coloring (using dynamic import for ESM compatibility if chalk v5 is installed)
let chalk;
(async () => {
  try {
    const chalkModule = await import('chalk');
    chalk = chalkModule.default;
  } catch (e) {
    // Fallback to basic logging if chalk fails to load
    chalk = {
      green: (s) => `\x1b[32m${s}\x1b[0m`,
      blue: (s) => `\x1b[34m${s}\x1b[0m`,
      red: (s) => `\x1b[31m${s}\x1b[0m`,
      yellow: (s) => `\x1b[33m${s}\x1b[0m`,
      bold: (s) => `\x1b[1m${s}\x1b[0m`,
      cyan: (s) => `\x1b[36m${s}\x1b[0m`,
      gray: (s) => `\x1b[90m${s}\x1b[0m`,
    };
  }
})();

function logActivity(action, details, success = true, duration = 0) {
  if (!chalk) return;
  const status = success ? chalk.green('Success') : chalk.red('Failed');
  const durStr = duration > 0 ? chalk.gray(`, ${duration}ms`) : '';
  console.log(`${chalk.blue('[Agent]')} ${chalk.bold(`[${action}]`)} ${details} (${status}${durStr})`);
}

// Global state
let browser;
let browserContext;
const agentTabs = new Map(); // tabId -> Playwright Page object

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logActivity('Auth', 'Missing or invalid Authorization header', false);
    return res.status(401).json({ error: 'Unauthorized: Missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];
  if (token !== SESSION_TOKEN) {
    logActivity('Auth', 'Invalid token attempt', false);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
  next();
};

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each token to 30 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logActivity('RateLimit', 'Too many requests', false);
    res.status(options.statusCode).send(options.message);
  }
});

app.use('/api', authMiddleware, apiLimiter);

// ─── API Routes ─────────────────────────────────────────────────────────────

app.post('/api/tabs', async (req, res) => {
  const start = Date.now();
  try {
    const page = await browserContext.newPage();
    const tabId = `tab_${crypto.randomBytes(8).toString('hex')}`;
    agentTabs.set(tabId, page);
    logActivity('NewTab', `Created tab ${tabId}`, true, Date.now() - start);
    res.json({ tabId });
  } catch (error) {
    logActivity('NewTab', error.message, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

const getPage = (req, res, next) => {
  const { tabId } = req.params;
  const page = agentTabs.get(tabId);
  if (!page) {
    logActivity('TabLookup', `Tab ${tabId} not found`, false);
    return res.status(404).json({ error: 'Tab not found' });
  }
  req.page = page;
  next();
};

app.post('/api/tabs/:tabId/navigate', getPage, async (req, res) => {
  const start = Date.now();
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  try {
    await req.page.goto(url, { waitUntil: 'domcontentloaded' });
    logActivity('Navigate', `Tab ${req.params.tabId} -> ${url}`, true, Date.now() - start);
    res.json({ success: true, url });
  } catch (error) {
    logActivity('Navigate', `Tab ${req.params.tabId} -> ${url}: ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tabs/:tabId/click', getPage, async (req, res) => {
  const start = Date.now();
  const { selector } = req.body;
  if (!selector) return res.status(400).json({ error: 'selector is required' });

  try {
    await req.page.click(selector);
    logActivity('Click', `Tab ${req.params.tabId} clicked '${selector}'`, true, Date.now() - start);
    res.json({ success: true });
  } catch (error) {
    logActivity('Click', `Tab ${req.params.tabId} clicked '${selector}': ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tabs/:tabId/type', getPage, async (req, res) => {
  const start = Date.now();
  const { selector, text } = req.body;
  if (!selector || text === undefined) return res.status(400).json({ error: 'selector and text are required' });

  try {
    await req.page.fill(selector, text);
    logActivity('Type', `Tab ${req.params.tabId} typed into '${selector}'`, true, Date.now() - start);
    res.json({ success: true });
  } catch (error) {
    logActivity('Type', `Tab ${req.params.tabId} typed into '${selector}': ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tabs/:tabId/screenshot', getPage, async (req, res) => {
  const start = Date.now();
  try {
    const buffer = await req.page.screenshot();
    logActivity('Screenshot', `Tab ${req.params.tabId}`, true, Date.now() - start);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    logActivity('Screenshot', `Tab ${req.params.tabId}: ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tabs/:tabId/html', getPage, async (req, res) => {
  const start = Date.now();
  try {
    const html = await req.page.content();
    logActivity('HTML', `Tab ${req.params.tabId}`, true, Date.now() - start);
    res.set('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    logActivity('HTML', `Tab ${req.params.tabId}: ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tabs/:tabId', getPage, async (req, res) => {
  const start = Date.now();
  try {
    await req.page.close();
    agentTabs.delete(req.params.tabId);
    logActivity('CloseTab', `Tab ${req.params.tabId}`, true, Date.now() - start);
    res.json({ success: true });
  } catch (error) {
    logActivity('CloseTab', `Tab ${req.params.tabId}: ${error.message}`, false, Date.now() - start);
    res.status(500).json({ error: error.message });
  }
});

// ─── Initialization ─────────────────────────────────────────────────────────

async function start() {
  if (chalk) {
    console.log(chalk.cyan.bold('\nStarting Multi-Agent Browser Coordinator...\n'));
  } else {
    console.log('\nStarting Multi-Agent Browser Coordinator...\n');
  }

  try {
    // 1. Launch Playwright
    browser = await chromium.launch({ headless: false });
    browserContext = await browser.newContext();
    
    // 2. Start Express
    app.listen(PORT, () => {
      // Server started
    });

    // 3. Start Ngrok
    let tunnelUrl = `http://localhost:${PORT}`;
    if (process.env.NGROK_AUTHTOKEN) {
      try {
        const listener = await ngrok.forward({ addr: PORT, authtoken: process.env.NGROK_AUTHTOKEN });
        tunnelUrl = listener.url();
      } catch (err) {
        if (chalk) {
          console.log(chalk.red(`Failed to start ngrok tunnel: ${err.message}`));
          console.log(chalk.yellow(`Falling back to localhost mapping.`));
        }
      }
    } else {
      if (chalk) {
        console.log(chalk.yellow('No NGROK_AUTHTOKEN found in environment. Ngrok tunnel will not be created.'));
        console.log(chalk.yellow('Remote agents will not be able to connect unless they are on the same local network.'));
      }
    }

    // Print connection info
    if (chalk) {
      console.log(chalk.green('==========================================================='));
      console.log(chalk.green.bold('🚀 Bridge Active and Ready'));
      console.log(chalk.cyan(`🌐 Endpoint: `) + chalk.bold(tunnelUrl));
      console.log(chalk.cyan(`🔑 Token:    `) + chalk.bold(SESSION_TOKEN));
      console.log(chalk.green('===========================================================\n'));
      
      console.log(chalk.yellow('Copy and paste this configuration to your AI agent:\n'));
      console.log(`curl -X POST ${tunnelUrl}/api/tabs \\`);
      console.log(`  -H "Authorization: Bearer ${SESSION_TOKEN}"\n`);
    } else {
      console.log('===========================================================');
      console.log('🚀 Bridge Active and Ready');
      console.log(`🌐 Endpoint: ${tunnelUrl}`);
      console.log(`🔑 Token:    ${SESSION_TOKEN}`);
      console.log('===========================================================\n');
      console.log('Copy and paste this configuration to your AI agent:\n');
      console.log(`curl -X POST ${tunnelUrl}/api/tabs \\`);
      console.log(`  -H "Authorization: Bearer ${SESSION_TOKEN}"\n`);
    }

  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
}

// ensure cleanup on exit
process.on('SIGINT', async () => {
  if (chalk) console.log(chalk.yellow('\nShutting down...'));
  else console.log('\nShutting down...');
  if (browser) await browser.close();
  try {
      await ngrok.disconnect();
  } catch(e) {}
  process.exit(0);
});

// Run
setTimeout(start, 100);
