import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { visiteurAnonyme, utilisateurConnecte } from './common.js';

export { visiteurAnonyme, utilisateurConnecte };

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus', exec: 'utilisateurConnecte', startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },
        { duration: '1m', target: 40 },
        { duration: '1m', target: 60 },
        { duration: '1m', target: 80 },
        { duration: '30s', target: 0 },
      ],
    },
  },
};

export function handleSummary(data) {
  return {
    'stress-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}