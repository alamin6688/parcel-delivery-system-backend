import { z } from "zod";
import { ParcelStatus } from "./parcel.interface";

// Schema for creating a parcel (SENDER)
export const createParcelZodSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  parcelType: z.string().min(1, "Parcel type is required"),
  weight: z.number().positive("Weight must be positive"),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  deliveryAddress: z.string().min(1, "Delivery address is required"),
  fee: z.number().optional(),
});

// Corrected schema for updating parcel status (ADMIN or AGENT)
export const updateParcelStatusZodSchema = z.object({
  status: z.nativeEnum(ParcelStatus),
  note: z.string().optional(),
});

// export const updateParcelStatusZodSchema = z.object({
//   status: z
//     .enum([
//       "REQUESTED",
//       "APPROVED",
//       "DISPATCHED",
//       "IN_TRANSIT",
//       "DELIVERED",
//       "CANCELED",
//     ])
//     .optional(),
//   note: z.string().optional(),
// });

export type CreateParcelInput = z.infer<typeof createParcelZodSchema>;
export type UpdateParcelStatusInput = z.infer<
  typeof updateParcelStatusZodSchema
>;
