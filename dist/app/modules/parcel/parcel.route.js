"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const parcel_controller_1 = require("./parcel.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parcel_validation_1 = require("./parcel.validation");
const router = (0, express_1.Router)();
// 1️⃣ SENDER creates a parcel
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelZodSchema), parcel_controller_1.ParcelControllers.createParcelController);
// 2️⃣ SENDER gets their own parcels
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.getMyParcelsController);
// 3️⃣ RECEIVER List incoming parcels
router.get("/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getIncomingParcelsController);
// 4️⃣ ADMIN gets all parcels
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.getAllParcelsController);
// 5️⃣ ADMIN Block parcel (example, implement in service if needed)
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.blockParcel);
// 6️⃣ ADMIN Unblock parcel
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.unblockParcel);
// 7️⃣ ADMIN update parcel status
router.patch("/status/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateParcelStatusZodSchema), parcel_controller_1.ParcelControllers.updateParcelStatusController);
// 8️⃣ SENDER cancels parcel if not dispatched
router.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.cancelParcelController);
// 9️⃣ RECEIVER confirms delivery
router.patch("/confirm/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.confirmDeliveryController);
// 🔟 View parcel status log (Admin, Agent, Sender or Receiver)
router.get("/:id/status-log", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.AGENT, user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getParcelByIdController);
// 1️⃣1️⃣ Delete a parcel (Admin only)
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), parcel_controller_1.ParcelControllers.deleteParcelController);
exports.ParcelRoutes = router;
