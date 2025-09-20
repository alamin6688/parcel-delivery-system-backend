import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExixt = await User.findOne({ email });

  if (isUserExixt) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exixt");
  }

  const hashPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // const isPasswordMatch = await bcryptjs.compare(password as string, hashPassword)

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  // Default role = USER (Receiver)
  const role = payload.role ?? Role.RECEIVER;

  const user = await User.create({
    email,
    password: hashPassword,
    role,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!");
  }

  const isSelfUpdate = decodedToken.userId === userId;
  const isAdmin =
    decodedToken.role === Role.ADMIN || decodedToken.role === Role.SUPER_ADMIN;

  // Restrict email update
  if (payload.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email cannot be updated");
  }

  // Restrict role & status updates
  if (
    payload.role ||
    payload.isActive ||
    payload.isDeleted ||
    payload.isVerified
  ) {
    if (!isAdmin) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to update these fields"
      );
    }

    // Extra protection: Admin cannot promote to SUPER_ADMIN
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Only SuperAdmin can promote to SuperAdmin"
      );
    }
  }

  // Self update: only allow name, phone, address, password
  if (!isAdmin && !isSelfUpdate) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own profile"
    );
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.RECEIVER ||
      decodedToken.role === Role.AGENT
    ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // if (payload.isActive || payload.isDeleted || payload.isVerified) {
  //   if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
  //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  //   }
  // }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

// ✅ Block a user
export const blockUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isBlocked = true;
  await user.save();

  return user;
};

// ✅ Unblock a user
export const unblockUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isBlocked = false;
  await user.save();

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  blockUser,
  unblockUser,
};
