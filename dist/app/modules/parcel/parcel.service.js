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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unblockParcel = exports.blockParcel = exports.deleteParcel = exports.confirmDelivery = exports.cancelParcel = exports.updateParcelStatus = exports.getParcelById = exports.getIncomingParcels = exports.getUserParcels = exports.getAllParcels = exports.createParcel = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = require("../user/user.model");
const parcel_model_1 = require("./parcel.model");
const parcel_interface_1 = require("./parcel.interface");
// Create a parcel (Sender only)
const createParcel = (senderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId, parcelType, weight, pickupAddress, deliveryAddress, fee, } = payload;
    if (!mongoose_1.default.Types.ObjectId.isValid(receiverId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid Receiver ID");
    }
    const receiver = yield user_model_1.User.findById(receiverId);
    if (!receiver)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver not found");
    const trackingId = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const parcel = yield parcel_model_1.Parcel.create({
        senderId: new mongoose_1.Types.ObjectId(senderId),
        receiverId: new mongoose_1.Types.ObjectId(receiverId),
        parcelType,
        weight,
        pickupAddress,
        deliveryAddress,
        fee: fee !== null && fee !== void 0 ? fee : weight * 10,
        trackingId,
        status: parcel_interface_1.ParcelStatus.REQUESTED,
        statusLogs: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
                updatedBy: new mongoose_1.Types.ObjectId(senderId),
                updatedAt: new Date(),
                note: "Parcel requested",
            },
        ],
    });
    return parcel;
});
exports.createParcel = createParcel;
// Get all parcels (Admin)
const getAllParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    return parcel_model_1.Parcel.find().populate("senderId receiverId");
});
exports.getAllParcels = getAllParcels;
// Get parcels for a specific user (Sender or Receiver)
const getUserParcels = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return parcel_model_1.Parcel.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
    }).populate("senderId receiverId");
});
exports.getUserParcels = getUserParcels;
// Get incoming parcels (Receiver only)
const getIncomingParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    return parcel_model_1.Parcel.find({ receiverId }).populate("senderId receiverId");
});
exports.getIncomingParcels = getIncomingParcels;
// Get parcel by ID
const getParcelById = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(parcelId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid Parcel ID");
    }
    const parcel = yield parcel_model_1.Parcel.findById(parcelId).populate("senderId receiverId");
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    return parcel;
});
exports.getParcelById = getParcelById;
// Update parcel status (Admin or Agent)
const updateParcelStatus = (parcelId, status, updatedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.statusLogs = parcel.statusLogs || [];
    parcel.status = status;
    parcel.statusLogs.push({
        status,
        updatedBy: new mongoose_1.Types.ObjectId(updatedBy),
        updatedAt: new Date(),
        note: `Status updated to ${status}`,
    });
    yield parcel.save();
    return parcel;
});
exports.updateParcelStatus = updateParcelStatus;
// Cancel parcel (Sender only, if not dispatched)
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.senderId.toString() !== senderId)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You cannot cancel this parcel");
    if (![parcel_interface_1.ParcelStatus.REQUESTED, parcel_interface_1.ParcelStatus.APPROVED].includes(parcel.status))
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cancel dispatched or in-transit parcel");
    parcel.statusLogs = parcel.statusLogs || [];
    parcel.status = parcel_interface_1.ParcelStatus.CANCELED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.CANCELED,
        updatedBy: new mongoose_1.Types.ObjectId(senderId),
        updatedAt: new Date(),
        note: "Parcel canceled by sender",
    });
    yield parcel.save();
    return parcel;
});
exports.cancelParcel = cancelParcel;
// Confirm delivery (Receiver only)
const confirmDelivery = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!parcelId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel ID is required");
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(parcelId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid Parcel ID");
    }
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (parcel.receiverId.toString() !== receiverId)
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You cannot confirm this delivery");
    if (parcel.status !== parcel_interface_1.ParcelStatus.IN_TRANSIT)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel is not in transit");
    parcel.statusLogs = parcel.statusLogs || [];
    parcel.status = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.statusLogs.push({
        status: parcel_interface_1.ParcelStatus.DELIVERED,
        updatedBy: new mongoose_1.Types.ObjectId(receiverId),
        updatedAt: new Date(),
        note: "Delivery confirmed by receiver",
    });
    yield parcel.save();
    return parcel;
});
exports.confirmDelivery = confirmDelivery;
// Delete parcel (Admin only)
const deleteParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(parcelId)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid Parcel ID");
    }
    const parcel = yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    return parcel;
});
exports.deleteParcel = deleteParcel;
// ✅ Block a parcel
const blockParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Add isBlocked field if not already in schema
    parcel.isBlocked = true;
    yield parcel.save();
    return parcel;
});
exports.blockParcel = blockParcel;
// ✅ Unblock a parcel
const unblockParcel = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    parcel.isBlocked = false;
    yield parcel.save();
    return parcel;
});
exports.unblockParcel = unblockParcel;
