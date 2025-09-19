import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

/**
 * @desc Register a new user (Sender/Receiver by default = USER)
 * @access Public
 */
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

/**
 * @desc Get all users (Admin only)
 * @access ADMIN | SUPER_ADMIN
 */
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

/**
 * @desc Get current logged-in user info
 * @access USER | RECIVER | AGENT | ADMIN | SUPER_ADMIN
 */
router.get(
  "/me",
  checkAuth(Role.SENDER, Role.RECEIVER, Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getCurrentUser
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.updateUser
);

// /api/v1/user/:id

export const UserRoutes = router;
