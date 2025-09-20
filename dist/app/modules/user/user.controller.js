"use strict";
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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //   message: "User creates successfully!",
    //   user,
    // });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User creates successfully!",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload
    const verifiedToken = req.user;
    const payload = req.body;
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Updated Successfully",
        data: user,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All users retrieved successfully!",
    //   data: users,
    // });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All users retrieved successfully!",
        data: result.data,
        meta: result.meta,
    });
}));
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
const getCurrentUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Current user info retrieved successfully!",
        data: user,
    });
}));
// Block a user
const blockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.blockUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User blocked successfully",
        data: result,
    });
}));
// Unblock a user
const unblockUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.unblockUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "User unblocked successfully",
        data: result,
    });
}));
exports.UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    getCurrentUser,
    blockUser,
    unblockUser,
};
