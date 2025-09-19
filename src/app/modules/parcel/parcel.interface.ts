import { Document, Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  DISPATCHED = "DISPATCHED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface IStatusLog {
  status: ParcelStatus;
  updatedAt: Date;
  updatedBy: Types.ObjectId;
  note?: string;
}

// export interface IsBlocked {
//   type: Boolean,
//   default: false,
// }

export interface IParcel extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  parcelType: string;
  weight: number;
  pickupAddress: string;
  deliveryAddress: string;
  trackingId?: string;
  status: ParcelStatus;
  isBlocked?: boolean;
  statusLogs?: IStatusLog[];
  fee: number;
  createdAt?: Date;
  updatedAt?: Date;
}
