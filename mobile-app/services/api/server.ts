// Minimal Express server for KULABOUR backend (placeholder)
// Install dependencies: npm i express compression
import express from 'express';
import compression from 'compression';

const app = express();

// Enable gzip compression for all responses
app.use(compression());

// JSON body parsing (if needed)
app.use(express.json());

// Simple health check endpoint (used for warm‑up ping)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// TODO: mount real API routes here (e.g., import { router } from './router'; app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[API] Server listening on port ${PORT}`);
});
