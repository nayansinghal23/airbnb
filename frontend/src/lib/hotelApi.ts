/**
 * Hotel service API client (via the gateway at `${API_BASE}/hotel`).
 * Requires an authenticated admin cookie.
 */

import { apiGet, apiPost } from './apiClient'
import type { ApiResult } from './apiClient'

export interface Hotel {
  id: number
  name: string
  address: string
  location: string
  rating: number | null
  ratingCount: number | null
  ownerId: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateHotelPayload {
  name: string
  address: string
  location: string
  ownerId: number
}

/** POST a new hotel to `${API_BASE}/hotel`. */
export function createHotel(payload: CreateHotelPayload): Promise<ApiResult> {
  return apiPost('/hotel', payload)
}

interface HotelsResponse {
  success: boolean
  data: Hotel[]
  message: string
}

/** GET the hotels belonging to an owner from `${API_BASE}/hotel/owner/:ownerId`. */
export function listHotelsByOwner(
  ownerId: number,
): Promise<ApiResult<HotelsResponse>> {
  return apiGet<HotelsResponse>(`/hotel/owner/${ownerId}`)
}

export type RoomType = 'SINGLE' | 'DOUBLE' | 'FAMILY' | 'DELUXE' | 'SUITE'

export interface RoomCategory {
  id: number
  hotelId: number
  price: number
  roomType: RoomType
  roomCount: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface RoomCategoriesResponse {
  success: boolean
  data: RoomCategory[]
  message: string
}

/**
 * GET a hotel's room categories from
 * `${API_BASE}/hotel/:hotelId/room-categories`.
 */
export function listRoomCategories(
  hotelId: number,
): Promise<ApiResult<RoomCategoriesResponse>> {
  return apiGet<RoomCategoriesResponse>(`/hotel/${hotelId}/room-categories`)
}
