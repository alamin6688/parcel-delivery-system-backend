/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import mongoose, { Types } from "mongoose";
import { User } from "../user/user.model";
import { Parcel } from "./parcel.model";
import { ParcelStatus } from "./parcel.interface";

// Payload interface for parcel creation
interface ICreateParcelPayload {
  receiverId: string;
  parcelType: string;
  weight: number;
  pickupAddress: string;
  deliveryAddress: string;
  fee?: number;
}

// Create a parcel (Sender only)
export const createParcel = async (
  senderId: string,
  payload: ICreateParcelPayload
) => {
  const {
    receiverId,
    parcelType,
    weight,
    pickupAddress,
    deliveryAddress,
    fee,
  } = payload;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Receiver ID");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) throw new AppError(httpStatus.NOT_FOUND, "Receiver not found");

  const trackingId = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const parcel = await Parcel.create({
    senderId: new Types.ObjectId(senderId),
    receiverId: new Types.ObjectId(receiverId),
    parcelType,
    weight,
    pickupAddress,
    deliveryAddress,
    fee: fee ?? weight * 10,
    trackingId,
    status: ParcelStatus.REQUESTED,
    statusLogs: [
      {
        status: ParcelStatus.REQUESTED,
        updatedBy: new Types.ObjectId(senderId),
        updatedAt: new Date(),
        note: "Parcel requested",
      },
    ],
  });

  return parcel;
};

// Get all parcels (Admin)
export const getAllParcels = async () => {
  return Parcel.find().populate("senderId receiverId");
};

// Get parcels for a specific user (Sender or Receiver)
export const getUserParcels = async (userId: string) => {
  return Parcel.find({
    $or: [{ senderId: userId }, { receiverId: userId }],
  }).populate("senderId receiverId");
};

// Get incoming parcels (Receiver only)
export const getIncomingParcels = async (receiverId: string) => {
  return Parcel.find({ receiverId }).populate("senderId receiverId");
};

// Get parcel by ID
export const getParcelById = async (parcelId: string) => {
  if (!mongoose.Types.ObjectId.isValid(parcelId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Parcel ID");
  }

  const parcel = await Parcel.findById(parcelId).populate(
    "senderId receiverId"
  );
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  return parcel;
};

// Update parcel status (Admin or Agent)
export const updateParcelStatus = async (
  parcelId: string,
  status: ParcelStatus,
  updatedBy: string
) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  parcel.statusLogs = parcel.statusLogs || [];
  parcel.status = status;
  parcel.statusLogs.push({
    status,
    updatedBy: new Types.ObjectId(updatedBy),
    updatedAt: new Date(),
    note: `Status updated to ${status}`,
  });

  await parcel.save();
  return parcel;
};

// Cancel parcel (Sender only, if not dispatched)
export const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  if (parcel.senderId.toString() !== senderId)
    throw new AppError(httpStatus.FORBIDDEN, "You cannot cancel this parcel");

  if (![ParcelStatus.REQUESTED, ParcelStatus.APPROVED].includes(parcel.status))
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel dispatched or in-transit parcel"
    );

  parcel.statusLogs = parcel.statusLogs || [];
  parcel.status = ParcelStatus.CANCELED;
  parcel.statusLogs.push({
    status: ParcelStatus.CANCELED,
    updatedBy: new Types.ObjectId(senderId),
    updatedAt: new Date(),
    note: "Parcel canceled by sender",
  });

  await parcel.save();
  return parcel;
};

// Confirm delivery (Receiver only)
export const confirmDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  if (parcel.receiverId.toString() !== receiverId)
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot confirm this delivery"
    );

  if (parcel.status !== ParcelStatus.IN_TRANSIT)
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel is not in transit");

  parcel.statusLogs = parcel.statusLogs || [];
  parcel.status = ParcelStatus.DELIVERED;
  parcel.statusLogs.push({
    status: ParcelStatus.DELIVERED,
    updatedBy: new Types.ObjectId(receiverId),
    updatedAt: new Date(),
    note: "Delivery confirmed by receiver",
  });

  await parcel.save();
  return parcel;
};

// Delete parcel (Admin only)
export const deleteParcel = async (parcelId: string) => {
  if (!mongoose.Types.ObjectId.isValid(parcelId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Parcel ID");
  }

  const parcel = await Parcel.findByIdAndDelete(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  return parcel;
};

// ✅ Block a parcel
export const blockParcel = async (id: string) => {
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  // Add isBlocked field if not already in schema
  parcel.isBlocked = true;
  await parcel.save();

  return parcel;
};

// ✅ Unblock a parcel
export const unblockParcel = async (id: string) => {
  const parcel = await Parcel.findById(id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  parcel.isBlocked = false;
  await parcel.save();

  return parcel;
};
