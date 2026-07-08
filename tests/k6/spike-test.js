import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { login, visiteurAnonyme, utilisateurConnecte } from './common.js';

export { visiteurAnonyme, utilisateurConnecte };

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus', exec: 'visiteurAnonyme', startVUs: 5,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '10s', target: 100 },
        { duration: '30s', target: 100 },
        { duration: '10s', target: 5 },
        { duration: '30s', target: 5 },
        { duration: '10s', target: 0 },
      ],
    },
  },
};

export function setup() {
  return { token: login() };
}

export function handleSummary(data) {
  return {
    'spike-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}