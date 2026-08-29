/**
 * Auth service API client. Built on the shared apiClient so the base URL and
 * credentialed-fetch behaviour live in one place.
 */

import { apiGet, apiPost } from './apiClient'
import type { ApiResult } from './apiClient'

// Backwards-compatible alias for existing imports.
export type AuthResult<T = unknown> = ApiResult<T>

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

/** POST the registration payload to `${API_BASE}/register`. */
export function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  return apiPost('/register', payload)
}

export interface LoginResponse {
  message: string
  token: string
  userId: number
}

/**
 * POST credentials to `${API_BASE}/login`. On success the service responds with
 * an httpOnly `access_token` cookie (stored by the browser) and a body
 * containing `{ token, userId }`.
 */
export function loginUser(payload: LoginPayload): Promise<AuthResult<LoginResponse>> {
  return apiPost<LoginResponse>('/login', payload)
}

export interface UserRolesResponse {
  success: boolean
  role: string
  message: string
}

/** GET `${API_BASE}/user/:userId/roles`. Requires the auth cookie. */
export function fetchUserRoles(userId: number): Promise<AuthResult<UserRolesResponse>> {
  return apiGet<UserRolesResponse>(`/user/${userId}/roles`)
}

/** POST `${API_BASE}/logout` to clear the auth cookie server-side. */
export function logoutUser(): Promise<AuthResult> {
  return apiPost('/logout', {})
}
