/**
 * Shared API client for the backend gateway.
 *
 * The base URL comes from VITE_AUTH_API_URL (see `.env`) so it can be changed in
 * one place per environment. Every request sends `credentials: 'include'` so the
 * httpOnly `access_token` cookie (set by the server on login) is attached — this
 * is how the backend authenticates each request via `req.cookies['access_token']`.
 */

export const API_BASE = import.meta.env.VITE_AUTH_API_URL

export interface ApiResult<T = unknown> {
  ok: boolean
  status: number
  data: T | null
}

async function parse<T>(response: Response): Promise<ApiResult<T>> {
  // Response may or may not be JSON — parse defensively.
  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }
  return { ok: response.ok, status: response.status, data: data as T | null }
}

export async function apiPost<T = unknown>(
  path: string,
  payload: unknown,
): Promise<ApiResult<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send the access_token cookie
    body: JSON.stringify(payload),
  })
  return parse<T>(response)
}

export async function apiGet<T = unknown>(path: string): Promise<ApiResult<T>> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    credentials: 'include', // send the access_token cookie
  })
  return parse<T>(response)
}
