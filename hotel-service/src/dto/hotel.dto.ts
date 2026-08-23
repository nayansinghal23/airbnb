import { z } from "zod";

import { createHotelSchema } from "../validators/hotel.validator";

export type CreateHotelDTO = z.infer<typeof createHotelSchema>;