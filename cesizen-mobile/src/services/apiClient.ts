import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE = 'http://10.64.128.119:5000/api';
const TOKEN_KEY = 'cesizen_token';

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await AsyncStorage.removeItem(TOKEN_KEY);
    throw new Error('Identifiants incorrects');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Une erreur est survenue.',
    }));
    throw new Error(error.message ?? 'Une erreur est survenue.');
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
  saveToken: (token: string) => AsyncStorage.setItem(TOKEN_KEY, token),
  removeToken: () => AsyncStorage.removeItem(TOKEN_KEY),
};