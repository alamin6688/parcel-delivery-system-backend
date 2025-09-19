import { Router } from "express";
import { ParcelControllers } from "./parcel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createParcelZodSchema,
  updateParcelStatusZodSchema,
} from "./parcel.validation";

const router = Router();

// 1️⃣ SENDER creates a parcel
router.post(
  "/",
  checkAuth(Role.SENDER),
  validateRequest(createParcelZodSchema),
  ParcelControllers.createParcelController
);

// 2️⃣ SENDER gets their own parcels
router.get(
  "/me",
  checkAuth(Role.SENDER),
  ParcelControllers.getMyParcelsController
);

// 3️⃣ RECEIVER List incoming parcels
router.get(
  "/incoming",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getIncomingParcelsController
);

// 4️⃣ ADMIN gets all parcels
router.get(
  "/",
  checkAuth(Role.ADMIN),
  ParcelControllers.getAllParcelsController
);

// 5️⃣ ADMIN Block parcel (example, implement in service if needed)
router.patch(
  "/block/:id",
  checkAuth(Role.ADMIN),
  ParcelControllers.blockParcel
);

// 6️⃣ ADMIN Unblock parcel
router.patch(
  "/unblock/:id",
  checkAuth(Role.ADMIN),
  ParcelControllers.unblockParcel
);

// 7️⃣ ADMIN update parcel status
router.patch(
  "/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateParcelStatusZodSchema),
  ParcelControllers.updateParcelStatusController
);

// 8️⃣ SENDER cancels parcel if not dispatched
router.patch(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcelController
);

// 9️⃣ RECEIVER confirms delivery
router.patch(
  "/confirm/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.confirmDeliveryController
);

// 🔟 View parcel status log (Admin, Agent, Sender or Receiver)
router.get(
  "/:id/status-log",
  checkAuth(Role.ADMIN, Role.AGENT, Role.SENDER, Role.RECEIVER),
  ParcelControllers.getParcelByIdController
);

// 1️⃣1️⃣ Delete a parcel (Admin only)
router.delete(
  "/:id",
  checkAuth(Role.ADMIN),
  ParcelControllers.deleteParcelController
);

export const ParcelRoutes = router;
