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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = exports.unblockUser = exports.blockUser = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExixt = yield user_model_1.User.findOne({ email });
    if (isUserExixt) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exixt");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // const isPasswordMatch = await bcryptjs.compare(password as string, hashPassword)
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    // Default role = USER (Receiver)
    const role = (_a = payload.role) !== null && _a !== void 0 ? _a : user_interface_1.Role.RECEIVER;
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, role, auths: [authProvider] }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found!");
    }
    const isSelfUpdate = decodedToken.userId === userId;
    const isAdmin = decodedToken.role === user_interface_1.Role.ADMIN || decodedToken.role === user_interface_1.Role.SUPER_ADMIN;
    // Restrict email update
    if (payload.email) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Email cannot be updated");
    }
    // Restrict role & status updates
    if (payload.role ||
        payload.isActive ||
        payload.isDeleted ||
        payload.isVerified) {
        if (!isAdmin) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update these fields");
        }
        // Extra protection: Admin cannot promote to SUPER_ADMIN
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only SuperAdmin can promote to SuperAdmin");
        }
    }
    // Self update: only allow name, phone, address, password
    if (!isAdmin && !isSelfUpdate) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only update your own profile");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.RECEIVER ||
            decodedToken.role === user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        if (payload.role === user_interface_1.Role.SUPER_ADMIN && decodedToken.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // if (payload.isActive || payload.isDeleted || payload.isVerified) {
    //   if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
    //     throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    //   }
    // }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
});
// ✅ Block a user
const blockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    user.isBlocked = true;
    yield user.save();
    return user;
});
exports.blockUser = blockUser;
// ✅ Unblock a user
const unblockUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    user.isBlocked = false;
    yield user.save();
    return user;
});
exports.unblockUser = unblockUser;
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    blockUser: exports.blockUser,
    unblockUser: exports.unblockUser,
};
