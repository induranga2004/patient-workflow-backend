export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function api(path, { method='GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const auth = token ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (auth) headers['Authorization'] = `Bearer ${auth}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data;
}