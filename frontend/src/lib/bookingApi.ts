/**
 * Booking service API client (via the gateway at `${API_BASE}/booking`).
 * Requires an authenticated cookie.
 */

import { apiPost } from './apiClient'
import type { ApiResult } from './apiClient'

export interface CreateBookingPayload {
  hotelId: number
  totalGuests: number
  amount: number
  /** Date-only string, e.g. "2026-09-28" */
  checkInDate: string
  /** Date-only string, e.g. "2026-09-30" */
  checkOutDate: string
  roomCategoryId: number
}

/** POST a booking to `${API_BASE}/booking`. */
export function createBooking(payload: CreateBookingPayload): Promise<ApiResult> {
  return apiPost('/booking', payload)
}
