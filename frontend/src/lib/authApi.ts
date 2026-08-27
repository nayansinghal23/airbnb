/**
 * Auth service API client.
 *
 * The base URL comes from the VITE_AUTH_API_URL env var (see `.env`), so it can
 * be changed in one place per environment without touching component code.
 */

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL

export interface RegisterPayload {
  username: string
  email: string
  password: string
  role: string
}

export interface AuthResult<T = unknown> {
  ok: boolean
  status: number
  data: T | null
}

/** POST the registration payload to `${VITE_AUTH_API_URL}/register`. */
export async function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  const url = `${AUTH_API_URL}/register`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  // Response may or may not be JSON — parse defensively.
  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return { ok: response.ok, status: response.status, data }
}
