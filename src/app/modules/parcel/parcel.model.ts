import mongoose, { Schema } from "mongoose";
import { IParcel, ParcelStatus, IStatusLog } from "./parcel.interface";

const StatusLogSchema = new Schema<IStatusLog>(
  {
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
  },
  { _id: false }
);

const ParcelSchema = new Schema<IParcel>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parcelType: { type: String, required: true },
    weight: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    trackingId: { type: String, unique: true },
    status: {
      type: String,
      enum: Object.values(ParcelStatus),
      default: ParcelStatus.REQUESTED,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    statusLogs: { type: [StatusLogSchema], default: [] },
    fee: { type: Number },
  },
  { timestamps: true }
);

// Auto-generate trackingId if missing
ParcelSchema.pre<IParcel>("save", function (next) {
  if (!this.trackingId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    this.trackingId = `TRK-${yyyy}${mm}${dd}-${random}`;
  }
  // Optional fee calculation
  if (!this.fee) {
    this.fee = this.weight * 10;
  }
  next();
});

// Indexes for faster queries
ParcelSchema.index({ senderId: 1 });
ParcelSchema.index({ receiverId: 1 });
ParcelSchema.index({ trackingId: 1 }, { unique: true });

export const Parcel = mongoose.model<IParcel>("Parcel", ParcelSchema);
