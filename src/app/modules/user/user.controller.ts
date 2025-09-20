/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   message: "User creates successfully!",
    //   user,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User creates successfully!",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;

    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All users retrieved successfully!",
    //   data: users,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("Fake err");
//     // throw new AppError(httpStatus.BAD_REQUEST, "Fake err");
//     const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       message: "User creates successfully",
//       user,
//     });

//   } catch (err: any) {
//     console.log(err);
//     next(err);
//   }
// };

// const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await UserServices.getAllUsers();

//     return users;
//   } catch (err: any) {
//     console.log(err);
//     next();
//   }
// };

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Current user info retrieved successfully!",
    data: user,
  });
});

// Block a user
const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.blockUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User blocked successfully",
    data: result,
  });
});

// Unblock a user
const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.unblockUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User unblocked successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getCurrentUser,
  blockUser,
  unblockUser,
};
