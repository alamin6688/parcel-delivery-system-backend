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
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
// import AppError from "../../errorHelpers/AppError";
// import { Parcel } from "./parcel.model";
const ParcelService = __importStar(require("./parcel.service"));
// Create a parcel (Sender)
const createParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    const parcel = yield (0, parcel_service_1.createParcel)(req.user.userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: parcel,
    });
}));
// Get all parcels (Admin)
const getAllParcelsController = (0, catchAsync_1.catchAsync)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield (0, parcel_service_1.getAllParcels)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All parcels retrieved successfully",
        data: parcels,
    });
}));
// Get parcels for logged-in user (Sender or Receiver)
const getMyParcelsController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    const parcels = yield (0, parcel_service_1.getUserParcels)(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User parcels retrieved successfully",
        data: parcels,
    });
}));
// Get incoming parcels (Receiver)
const getIncomingParcelsController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    const parcels = yield (0, parcel_service_1.getIncomingParcels)(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        data: parcels,
    });
}));
// Get parcel by ID
const getParcelByIdController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield (0, parcel_service_1.getParcelById)(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel retrieved successfully",
        data: parcel,
    });
}));
// Update parcel status (Admin)
const updateParcelStatusController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    const parcelId = req.params.id;
    const { status } = req.body;
    const parcel = yield (0, parcel_service_1.updateParcelStatus)(parcelId, status, req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status updated successfully",
        data: parcel,
    });
}));
// Cancel parcel (Sender)
const cancelParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    const parcelId = req.params.id;
    const parcel = yield (0, parcel_service_1.cancelParcel)(parcelId, req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel canceled successfully",
        data: parcel,
    });
}));
// Confirm delivery (Receiver)
const confirmDeliveryController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !("userId" in req.user))
        throw new Error("User not authenticated");
    // Accept parcel id from URL param (preferred) or request body (compatible)
    const parcelId = req.params.id || (req.body && (req.body.id || req.body.parcelId));
    const parcel = yield (0, parcel_service_1.confirmDelivery)(parcelId, req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Delivery confirmed successfully",
        data: parcel,
    });
}));
// ✅ Block a parcel
const blockParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ParcelService.blockParcel(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel blocked successfully",
        data: result,
    });
}));
// ✅ Unblock a parcel
const unblockParcel = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield ParcelService.unblockParcel(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Parcel unblocked successfully",
        data: result,
    });
}));
// Delete parcel (Admin)
const deleteParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield (0, parcel_service_1.deleteParcel)(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel deleted successfully",
        data: parcel,
    });
}));
exports.ParcelControllers = {
    createParcelController,
    getAllParcelsController,
    getMyParcelsController,
    getIncomingParcelsController,
    getParcelByIdController,
    updateParcelStatusController,
    blockParcel,
    unblockParcel,
    cancelParcelController,
    confirmDeliveryController,
    deleteParcelController,
};
