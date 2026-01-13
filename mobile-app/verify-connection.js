/* eslint-disable @typescript-eslint/no-require-imports */
const http = require('http');

// The IP from your mobile-app/.env
const API_HOST = '192.168.119.1';
const API_PORT = 5000;

console.log(`Testing connection to http://${API_HOST}:${API_PORT}...`);

const options = {
    hostname: API_HOST,
    port: API_PORT,
    path: '/',
    method: 'GET',
    timeout: 5000 // 5 second timeout
};

const req = http.request(options, (res) => {
    console.log(`✅ Connection Successful! Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response Body:', data);
    });
});

req.on('error', (e) => {
    console.error(`❌ Connection Failed: ${e.message}`);
    console.log('Hint: Ensure the backend is running and listening on all interfaces (0.0.0.0), not just localhost.');
});

req.on('timeout', () => {
    req.destroy();
    console.error('❌ Connection Timed Out');
});

req.end();
