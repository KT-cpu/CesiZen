import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { thresholds, visiteurAnonyme, utilisateurConnecte } from './common.js';

export { visiteurAnonyme, utilisateurConnecte };

export const options = {
  scenarios: {
    visiteurs_anonymes: {
      executor: 'ramping-vus', exec: 'visiteurAnonyme', startVUs: 0,
      stages: [
        { duration: '30s', target: 12 },
        { duration: '1m', target: 12 },
        { duration: '30s', target: 0 },
      ],
    },
    utilisateurs_connectes: {
      executor: 'ramping-vus', exec: 'utilisateurConnecte', startVUs: 0,
      stages: [
        { duration: '30s', target: 8 },
        { duration: '1m', target: 8 },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds,
};

export function handleSummary(data) {
  return {
    'load-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}