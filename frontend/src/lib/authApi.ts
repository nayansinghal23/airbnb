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

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResult<T = unknown> {
  ok: boolean
  status: number
  data: T | null
}

/**
 * Small wrapper around fetch for the auth service.
 * `credentials: 'include'` lets the browser store/send the httpOnly
 * `access_token` cookie the service sets on login/register.
 */
async function postJson(path: string, payload: unknown): Promise<AuthResult> {
  const response = await fetch(`${AUTH_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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

/** POST the registration payload to `${VITE_AUTH_API_URL}/register`. */
export function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  return postJson('/register', payload)
}

export interface LoginResponse {
  message: string
  token: string
  userId: number
}

/**
 * POST credentials to `${VITE_AUTH_API_URL}/login`. On success the service
 * responds with an httpOnly `access_token` cookie (stored by the browser)
 * and a body containing `{ token, userId }`.
 */
export function loginUser(payload: LoginPayload): Promise<AuthResult<LoginResponse>> {
  return postJson('/login', payload) as Promise<AuthResult<LoginResponse>>
}

export interface UserRolesResponse {
  success: boolean
  role: string
  message: string
}

/**
 * GET `${VITE_AUTH_API_URL}/user/:userId/roles`. Requires the auth cookie, so
 * the request is sent with credentials.
 */
export async function fetchUserRoles(
  userId: number,
): Promise<AuthResult<UserRolesResponse>> {
  const response = await fetch(`${AUTH_API_URL}/user/${userId}/roles`, {
    method: 'GET',
    credentials: 'include',
  })

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  return { ok: response.ok, status: response.status, data: data as UserRolesResponse | null }
}

/** POST `${VITE_AUTH_API_URL}/logout` to clear the auth cookie server-side. */
export function logoutUser(): Promise<AuthResult> {
  return postJson('/logout', {})
}
