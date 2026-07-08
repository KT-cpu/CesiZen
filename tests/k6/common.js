import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const loginDuration = new Trend('login_duration');

export const BASE_URL = __ENV.BASE_URL || 'https://cesizen-api-staging.onrender.com';
const TEST_EMAIL = __ENV.TEST_EMAIL;
const TEST_PASSWORD = __ENV.TEST_PASSWORD;

export const thresholds = {
  http_req_duration: ['p(95)<3000'],
  http_req_failed: ['rate<0.1'],
  errors: ['rate<0.15'],
};

// Login unique, appelé dans setup()
export function login() {
  const payload = JSON.stringify({ email: TEST_EMAIL, motDePasse: TEST_PASSWORD });
  const params = { headers: { 'Content-Type': 'application/json' }, timeout: '70s' };

  const res = http.post(`${BASE_URL}/api/Auth/login`, payload, params);
  loginDuration.add(res.timings.duration);

  const success = check(res, {
    'login status 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('token') !== undefined,
  });
  errorRate.add(!success);
  return success ? res.json('token') : null;
}

// Parcours visiteur anonyme (ressources publiques)
export function visiteurAnonyme() {
  group('Anonyme - Consultation ressources', () => {
    const resInfo = http.get(`${BASE_URL}/api/Information`);
    check(resInfo, { 'GET Information 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.5);
    const resEmotion = http.get(`${BASE_URL}/api/Emotion`);
    check(resEmotion, { 'GET Emotion 200': (r) => r.status === 200 }) || errorRate.add(1);
  });
  sleep(1);
}

// Parcours utilisateur connecté
export function utilisateurConnecte(data) {
  const token = data && data.token;
  if (!token) {
    errorRate.add(1);
    return;
  }
  const authParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  group('Connecte - Consultation tracker', () => {
    const resTracker = http.get(`${BASE_URL}/api/TrackerEmotion`, authParams);
    check(resTracker, { 'GET TrackerEmotion 200': (r) => r.status === 200 }) || errorRate.add(1);
    sleep(0.5);
    const resRapport = http.get(`${BASE_URL}/api/TrackerEmotion/rapport`, authParams);
    check(resRapport, { 'GET rapport ok': (r) => r.status === 200 || r.status === 204 }) || errorRate.add(1);
  });
  sleep(1);
}