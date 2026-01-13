const request = require('supertest');
const express = require('express');
const { errorHandler, notFound } = require('../../middleware/errorHandler');

// Create a separate app instance for testing to avoid port conflicts
const app = express();
app.get('/health', (req, res) => {
    const dbStatus = require('mongoose').connection.readyState;
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

describe('Health Check API', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/health');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('database');
        expect(res.body).toHaveProperty('uptime');
    });
});
