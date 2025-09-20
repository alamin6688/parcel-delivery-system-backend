"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const user_interface_1 = require("./user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
/**
 * @desc Register a new user (Sender/Receiver by default = USER)
 * @access Public
 */
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
/**
 * @desc Get all users (Admin only)
 * @access ADMIN | SUPER_ADMIN
 */
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUsers);
/**
 * @desc Get current logged-in user info
 * @access USER | RECIVER | AGENT | ADMIN | SUPER_ADMIN
 */
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER, user_interface_1.Role.RECEIVER, user_interface_1.Role.AGENT, user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getCurrentUser);
// ADMIN Block User
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.blockUser);
// ADMIN Unblock User
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.unblockUser);
router.patch("/:id", (0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.updateUser);
// /api/v1/user/:id
exports.UserRoutes = router;
