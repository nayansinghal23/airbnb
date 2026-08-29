/**
 * Booking service API client (via the gateway at `${API_BASE}/booking`).
 * Requires an authenticated cookie.
 */

import { apiGet, apiPost } from './apiClient'
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

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: number
  userId: number
  hotelId: number
  checkInDate: string
  checkOutDate: string
  roomCategoryId: number
  createdAt: string
  updatedAt: string
  amount: number
  status: BookingStatus
  totalGuests: number
}

interface BookingsResponse {
  success: boolean
  data: Booking[]
  message: string
}

/** GET a user's bookings from `${API_BASE}/booking/user/:userId`. */
export function listUserBookings(
  userId: number,
): Promise<ApiResult<BookingsResponse>> {
  return apiGet<BookingsResponse>(`/booking/user/${userId}`)
}
