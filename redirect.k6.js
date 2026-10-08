import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const redirectLatency = new Trend('custom_redirect_latency');
const dbFallbackCounter = new Counter('db_fallback_count');
const errorRate = new Rate('error_rate');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const SCENARIO = __ENV.SCENARIO || 'hit';
const KNOWN_SLUG = 'd7GZxzJ';

export const options = {
    scenarios: {
        peak_load: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '15s', target: 25 }, //ramp up to 25 concurrent users
                { duration: '30s', target: 25 }, //hold peak traffic
                { duration: '15s', target: 0 },   //cool down
            ],
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.01'],             //global error rate must be < 1%
        'custom_redirect_latency': ['p(95)<50'],      //95% of all redirects must be < 50ms
        'custom_redirect_latency{type:hit}': ['p(99)<20'], //99% of Cache Hits must be < 20ms
    }
};

export default function () {
    let slug = KNOWN_SLUG;
    let expectedStatus = 302;
    let requestType = 'hit';

    //route traffic based on injected environment variables
    if (SCENARIO === 'notfound') {
        slug = `missing-${randomString(6)}`;
        expectedStatus = 307;
        requestType = 'miss';
        dbFallbackCounter.add(1);
    } else if (SCENARIO === 'mixed') {
        // 80% cache hits / 20% cache misses
        if (Math.random() > 0.8) {
            slug = `missing-${randomString(6)}`;
            expectedStatus = 307;
            requestType = 'miss';
            dbFallbackCounter.add(1);
        }
    }

    //execute request without following the redirect
    const res = http.get(`${BASE_URL}/${slug}`, {
        redirects: 0,
        tags: { type: requestType } //tagging allows filtering in Grafana/Datadog
    });

    //record custom metrics
    redirectLatency.add(res.timings.duration, { type: requestType });

    const success = check(res, {
        'status matches expected': (r) => r.status === expectedStatus,
        'contains location header': (r) => r.headers['Location'] !== undefined,
    });

    errorRate.add(!success);

    //prevent local TCP port exhaustion on windows during high-throughput tests
    sleep(0.05);
}
