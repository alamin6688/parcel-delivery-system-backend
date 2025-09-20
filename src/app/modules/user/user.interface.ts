import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  AGENT = "AGENT",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  isDeleted?: boolean;
  role: Role;
  isActive?: IsActive;
  isVerified?: boolean;
  isBlocked?: boolean;
  auths: IAuthProvider[];
}
