"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// Schema for creating a parcel (SENDER)
exports.createParcelZodSchema = zod_1.z.object({
    receiverId: zod_1.z.string().min(1, "Receiver ID is required"),
    parcelType: zod_1.z.string().min(1, "Parcel type is required"),
    weight: zod_1.z.number().positive("Weight must be positive"),
    pickupAddress: zod_1.z.string().min(1, "Pickup address is required"),
    deliveryAddress: zod_1.z.string().min(1, "Delivery address is required"),
    fee: zod_1.z.number().optional(),
});
// Corrected schema for updating parcel status (ADMIN or AGENT)
exports.updateParcelStatusZodSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(parcel_interface_1.ParcelStatus),
    note: zod_1.z.string().optional(),
});
