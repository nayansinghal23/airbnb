import { RoomGenerationDTO } from "../dto/roomGeneration.dto";

import { roomGenerationQueue } from "../queues/roomGeneration.queue";

export const ROOM_GENERATION_PAYLOAD = "payload:roomGeneration";

export const addRoomsToQueue = async (payload: RoomGenerationDTO) => {
    await roomGenerationQueue.add(ROOM_GENERATION_PAYLOAD, payload);
}