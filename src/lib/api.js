const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(message.message || 'Request failed');
  }

  return response.json();
}

export async function apiPost(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiGet(path) {
  return request(path, { method: 'GET' });
}

export async function apiPatch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}
