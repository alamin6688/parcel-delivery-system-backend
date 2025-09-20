"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const parcel_interface_1 = require("./parcel.interface");
const StatusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
}, { _id: false });
const ParcelSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    parcelType: { type: String, required: true },
    weight: { type: Number, required: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    trackingId: { type: String, unique: true },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    statusLogs: { type: [StatusLogSchema], default: [] },
    fee: { type: Number },
}, { timestamps: true });
// Auto-generate trackingId if missing
ParcelSchema.pre("save", function (next) {
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
exports.Parcel = mongoose_1.default.model("Parcel", ParcelSchema);
