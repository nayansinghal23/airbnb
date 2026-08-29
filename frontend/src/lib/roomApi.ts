/**
 * Room service API client (via the gateway at `${API_BASE}/room`).
 * Requires an authenticated admin cookie.
 */

import { apiPost } from './apiClient'
import type { ApiResult } from './apiClient'

export const SCHEDULE_TYPES = ['immediate', 'scheduled'] as const
export type ScheduleType = (typeof SCHEDULE_TYPES)[number]

export interface AddRoomsPayload {
  roomCategoryId: number
  /** ISO datetime string, e.g. "2026-11-02T00:00:00.000Z" */
  startDate: string
  /** ISO datetime string, e.g. "2026-11-05T00:00:00.000Z" */
  endDate: string
}

/**
 * Create rooms for a category via
 * `POST ${API_BASE}/room?scheduleType=<immediate|scheduled>`.
 */
export function addRooms(
  scheduleType: ScheduleType,
  payload: AddRoomsPayload,
): Promise<ApiResult> {
  return apiPost(`/room?scheduleType=${scheduleType}`, payload)
}
