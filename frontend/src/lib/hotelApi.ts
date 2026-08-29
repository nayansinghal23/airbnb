/**
 * Hotel service API client (via the gateway at `${API_BASE}/hotel`).
 * Requires an authenticated admin cookie.
 */

import { apiPost } from './apiClient'
import type { ApiResult } from './apiClient'

export interface CreateHotelPayload {
  name: string
  address: string
  location: string
}

/** POST a new hotel to `${API_BASE}/hotel`. */
export function createHotel(payload: CreateHotelPayload): Promise<ApiResult> {
  return apiPost('/hotel', payload)
}
