import { API_BASE } from '../config/env.js';

export const buildUrl = (path, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
};

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}${text ? ` - ${text}` : ''}`);
  }
  return res.json();
}

// Verbos básicos — por ahora usamos GET, pero dejo el resto preparado
export async function apiGet(path, { params, signal, headers } = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url, { method: 'GET', signal, headers });
  return handle(res);
}

export async function apiPost(path, { body, signal, headers } = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: JSON.stringify(body ?? {}),
  });
  return handle(res);
}

export async function apiPut(path, { body, signal, headers } = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: 'PUT',
    signal,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: JSON.stringify(body ?? {}),
  });
  return handle(res);
}

export async function apiDelete(path, { signal, headers } = {}) {
  const url = buildUrl(path);
  const res = await fetch(url, { method: 'DELETE', signal, headers });
  return handle(res);
}
