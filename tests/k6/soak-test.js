import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { login, visiteurAnonyme, utilisateurConnecte } from './common.js';

export { visiteurAnonyme, utilisateurConnecte };

export const options = {
  scenarios: {
    soak: {
      executor: 'ramping-vus', exec: 'utilisateurConnecte', startVUs: 0,
      stages: [
        { duration: '2m', target: 15 },
        { duration: '20m', target: 15 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.1'],
  },
};

export function setup() {
  return { token: login() };
}

export function handleSummary(data) {
  return {
    'soak-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}