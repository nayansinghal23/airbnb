import * as cron from 'node-cron';

import { findByRoomCategoryIdAndDate, findLatestDatesForAllCategories } from '../repositories/room.repository';
import { findRoomCategoryById } from '../repositories/roomCategory.repository';

import { addRoomsToQueue } from '../producers/roomGeneration.producer';

let cronJob: cron.ScheduledTask | null = null;

export const startScheduler = (): void => {
    if (cronJob) return;

    // Schedule job to run every minute
    cronJob = cron.schedule(process.env.ROOM_CRON || '* * * * *', async () => {
        try {
            await extendRoomAvailability();
        } catch (error) {
            throw new Error(`Error in room availability extension scheduler: ${error}`);
        }
    }, {
        timezone: 'UTC'
    });
    cronJob.start();
};

export const stopScheduler = (): void => {
    if (cronJob) {
        cronJob.stop();
        cronJob = null;
    }
};

export const getSchedulerStatus = (): { isRunning: boolean } => {
    return {
        isRunning: cronJob !== null
    };
};

const extendRoomAvailability = async (): Promise<void> => {
    try {
        const roomCategoriesWithLatestDates = await findLatestDatesForAllCategories();
        if (roomCategoriesWithLatestDates.length === 0) return;

        for (const categoryData of roomCategoriesWithLatestDates) {
            await extendCategoryAvailability(categoryData);
        }
    } catch (error) {
        throw error;
    }
};

const extendCategoryAvailability = async (
    categoryData: { roomCategoryId: number; latestDate: Date }
): Promise<void> => {
    try {
        const { roomCategoryId, latestDate } = categoryData;

        const nextDate = new Date(latestDate);
        nextDate.setDate(nextDate.getDate() + 1);

        const endDate = new Date(nextDate);
        endDate.setDate(endDate.getDate() + 1);

        const roomCategory = await findRoomCategoryById(roomCategoryId);

        if (!roomCategory) return;

        const existingRoom = await findByRoomCategoryIdAndDate(
            roomCategoryId,
            nextDate,
            endDate
        );

        if (existingRoom.length > 0) return;

        await addRoomsToQueue({
            roomCategoryId,
            startDate: nextDate,
            endDate,
        });
    } catch (error) {
        throw error;
    }
};

export const manualExtendAvailability = async (): Promise<void> => {
    await extendRoomAvailability();
};