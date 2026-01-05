import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 50 },   // Ramp up to 50 users
        { duration: '5m', target: 50 },   // Stay at 50 users
        { duration: '2m', target: 100 },  // Ramp up to 100 users
        { duration: '5m', target: 100 },  // Stay at 100 users
        { duration: '2m', target: 0 },    // Ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],   // Error rate should be below 1%
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';

export default function () {
    // Test 1: Health check
    let healthRes = http.get(`${BASE_URL}/health`);
    check(healthRes, {
        'health check status is 200': (r) => r.status === 200,
        'health check time < 200ms': (r) => r.timings.duration < 200,
    });

    sleep(1);

    // Test 2: Get services
    let servicesRes = http.get(`${BASE_URL}/api/services`);
    check(servicesRes, {
        'services endpoint status is 200': (r) => r.status === 200,
        'services response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);

    // Test 3: Search workers
    let searchRes = http.post(
        `${BASE_URL}/api/search/workers`,
        JSON.stringify({
            skills: ['plumber'],
            maxPrice: 1000,
        }),
        {
            headers: { 'Content-Type': 'application/json' },
        }
    );
    check(searchRes, {
        'search endpoint status is 200': (r) => r.status === 200,
        'search response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    sleep(2);

    // Test 4: Create booking (authenticated)
    const token = __ENV.AUTH_TOKEN;
    if (token) {
        let bookingRes = http.post(
            `${BASE_URL}/api/bookings`,
            JSON.stringify({
                serviceId: 'test-service-id',
                date: new Date().toISOString(),
                address: 'Test Address',
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        check(bookingRes, {
            'booking creation status is 201': (r) => r.status === 201,
            'booking response time < 1000ms': (r) => r.timings.duration < 1000,
        });
    }

    sleep(2);
}

// Spike test configuration
export function handleSummary(data) {
    return {
        'load-test-results.json': JSON.stringify(data),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}
