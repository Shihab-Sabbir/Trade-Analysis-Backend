import { Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

export interface ILogin {
  email: string;
  password: string;
  remember?: boolean;
}

export enum LOCKED_REASON_ENUM {
  LOCKED_BY_ADMIN = 'Locked by Admin',
  REFRESH_TOKEN = 'Refresh Token Issue',
  INVALID_ATTEMPTS = 'Invalid Attempts',
}

export interface IUser extends Document {
  role: ENUM_USER_ROLE;
  companyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber?: string;
  needsPasswordChange: boolean;
  isLocked: {
    status: boolean;
    reason: LOCKED_REASON_ENUM;
  };
  refreshToken: string[];
  invalidLoginAttemps: number;
  getResponseFields(): Partial<IUser>;
}

export type ILoginResponse = {
  accessToken: string;
  newRefreshToken?: string;
  needsToChangePassword?: boolean;
};

export type IRefreshToken = {
  accessToken: string;
};

export interface IUserModel extends Model<IUser> {
  isPasswordMatched(password: string, savedPassword: string): Promise<boolean>;
}

export type LoginModel = Model<ILogin, Record<string, unknown>>;
