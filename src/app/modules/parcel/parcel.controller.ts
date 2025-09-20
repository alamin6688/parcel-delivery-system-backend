import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createParcel,
  getAllParcels,
  getUserParcels,
  getParcelById,
  updateParcelStatus,
  deleteParcel,
  cancelParcel,
  confirmDelivery,
  getIncomingParcels,
} from "./parcel.service";
import { ParcelStatus } from "./parcel.interface";
// import AppError from "../../errorHelpers/AppError";
// import { Parcel } from "./parcel.model";
import * as ParcelService from "./parcel.service";

// Create a parcel (Sender)
const createParcelController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    const parcel = await createParcel(req.user.userId as string, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Parcel created successfully",
      data: parcel,
    });
  }
);

// Get all parcels (Admin)
const getAllParcelsController = catchAsync(
  async (_req: Request, res: Response) => {
    const parcels = await getAllParcels();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All parcels retrieved successfully",
      data: parcels,
    });
  }
);

// Get parcels for logged-in user (Sender or Receiver)
const getMyParcelsController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    const parcels = await getUserParcels(req.user.userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User parcels retrieved successfully",
      data: parcels,
    });
  }
);

// Get incoming parcels (Receiver)
const getIncomingParcelsController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    const parcels = await getIncomingParcels(req.user.userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Incoming parcels retrieved successfully",
      data: parcels,
    });
  }
);

// Get parcel by ID
const getParcelByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const parcelId = req.params.id;
    const parcel = await getParcelById(parcelId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel retrieved successfully",
      data: parcel,
    });
  }
);

// Update parcel status (Admin)
const updateParcelStatusController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    const parcelId = req.params.id;
    const { status } = req.body as { status: ParcelStatus };

    const parcel = await updateParcelStatus(
      parcelId,
      status,
      req.user.userId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel status updated successfully",
      data: parcel,
    });
  }
);

// Cancel parcel (Sender)
const cancelParcelController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    const parcelId = req.params.id;
    const parcel = await cancelParcel(parcelId, req.user.userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel canceled successfully",
      data: parcel,
    });
  }
);

// Confirm delivery (Receiver)
const confirmDeliveryController = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user || !("userId" in req.user))
      throw new Error("User not authenticated");

    // Accept parcel id from URL param (preferred) or request body (compatible)
    const parcelId =
      req.params.id || (req.body && (req.body.id || req.body.parcelId));

    const parcel = await confirmDelivery(
      parcelId as string,
      req.user.userId as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Delivery confirmed successfully",
      data: parcel,
    });
  }
);

// ✅ Block a parcel
const blockParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParcelService.blockParcel(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel blocked successfully",
    data: result,
  });
});

// ✅ Unblock a parcel
const unblockParcel = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ParcelService.unblockParcel(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Parcel unblocked successfully",
    data: result,
  });
});

// Delete parcel (Admin)
const deleteParcelController = catchAsync(
  async (req: Request, res: Response) => {
    const parcelId = req.params.id;
    const parcel = await deleteParcel(parcelId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Parcel deleted successfully",
      data: parcel,
    });
  }
);

export const ParcelControllers = {
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
