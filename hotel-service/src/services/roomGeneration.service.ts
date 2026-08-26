import { RoomCategory } from "@prisma/client";

import { RoomGenerationJob } from "../dto/roomGeneration.dto";

import { findRoomCategoryById } from "../repositories/roomCategory.repository";
import { bulkInsertRooms, findByRoomCategoryIdAndDate } from "../repositories/room.repository";

export async function generateRooms(jobData: RoomGenerationJob) {
    let totalRoomsCreated = 0;
    let totalDatesProcessed = 0;
    const roomCategory = await findRoomCategoryById(jobData.roomCategoryId);

    if(!roomCategory) {
        throw new Error(`Room with category-id ${jobData.roomCategoryId} not found`)
    }

    const startDate = new Date(jobData.startDate), endDate = new Date(jobData.endDate);

    if(startDate > endDate) {
        throw new Error('Start date must be less than end date');
    }

    const batchSize = jobData.batchSize || 100;
    const currentDate = new Date(startDate);

    while(currentDate < endDate) {
        const batchEndDate = new Date(currentDate);
        batchEndDate.setDate(batchEndDate.getDate() + batchSize);
        if(batchEndDate > endDate ) {
            batchEndDate.setTime(endDate.getTime());
        }

        const batchResult = await processDateBatch(roomCategory, currentDate, batchEndDate, jobData.priceOverride);
        totalRoomsCreated += batchResult.roomsCreated;
        totalDatesProcessed += batchResult.datesProcessed;
        currentDate.setTime(batchEndDate.getTime());
    }

    return {
        totalRoomsCreated,
        totalDatesProcessed,
    }
}

export async function processDateBatch(roomCategory: RoomCategory, startDate: Date, endDate: Date, priceOverride?: number) {
    let roomsCreated = 0, datesProcessed = 0;
    const roomsToCreate = [];

    const existingRooms = await findByRoomCategoryIdAndDate(roomCategory.id, startDate, endDate);

    const existingDates = new Set(
        existingRooms.map((room) => room.dateOfAvailability.getTime())
    );
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const date = new Date(currentDate);
    
        if (!existingDates.has(date.getTime())) {
          roomsToCreate.push({
            hotelId: roomCategory.hotelId,
            roomCategoryId: roomCategory.id,
            dateOfAvailability: date,
            price: priceOverride ?? roomCategory.price,
          });
        }
    
        currentDate.setDate(currentDate.getDate() + 1);
        datesProcessed++;
    }

    if (roomsToCreate.length > 0) {
        roomsCreated = await bulkInsertRooms(roomsToCreate);
    }

    return {
        roomsCreated,
        datesProcessed,
    };
}