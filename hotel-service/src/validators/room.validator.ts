import z from "zod";

export const getAvailableRoomsSchema = z.object({
    roomCategoryId: z.coerce
      .number({ message: "Room category id must be present" })
      .int("Room category id must be an integer")
      .positive("Room category id must be positive"),
  
    checkInDate: z.coerce.date({
      message: "Invalid check-in date",
    }),
  
    checkOutDate: z.coerce.date({
      message: "Invalid check-out date",
    }),
  }).refine(
    (data) => data.checkOutDate > data.checkInDate,
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDate"],
    }
  );

export const updateBookingIdToRoomsSchema = z.object({
    bookingId: z.number({ message: "Booking ID must be present" }),
    roomIds: z.array(z.number({ message: "Room IDs must be present" })),
});