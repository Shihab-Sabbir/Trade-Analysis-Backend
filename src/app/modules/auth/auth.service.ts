import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  ILogin,
  ILoginResponse,
  IRefreshToken,
  IUser,
  LOCKED_REASON_ENUM,
} from './auth.interface';
import {
  BCRYPT_SALT_ROUNDS,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN_NOT_REMEMBER,
  JWT_REFRESH_EXPIRES_IN_REMEMBER,
  JWT_SECRET_KEY,
  JWT_SECRET_REFRESH_KEY,
} from '../../../config';
import { generateJWT_Token } from '../../../shared/utils/jwt/generateJWT_Token';
import { verifyJWT_Token } from '../../../shared/utils/jwt/verifyJWT_Token';
import { User } from './auth.model';
import mongoose from 'mongoose';
import { Profile } from '../profile/profile.model';

const loginUser = async (
  loginInfo: ILogin,
  refreshToken: string,
  clearCookie: () => void
): Promise<ILoginResponse> => {
  const { email, password, remember } = loginInfo;

  const dbUser = await User.findOne({ email }).exec();

  if (!dbUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found!');
  }

  const isPasswordMatch: boolean = await User.isPasswordMatched(
    password,
    dbUser.password
  );
    // Ensure profile will be locked when three consecutive login attempts occurs
  if (!isPasswordMatch) {
    if (dbUser.invalidLoginAttemps >= 3) {
      dbUser.invalidLoginAttemps += 1;
      dbUser.isLocked.status = true;
      dbUser.isLocked.reason = LOCKED_REASON_ENUM.INVALID_ATTEMPTS;

      await dbUser.save();
      
      throw new ApiError(
        httpStatus.LOCKED,
        "Invalid attempts exceeded limit, please contact admin to unlock the account"
      );
    }
    dbUser.invalidLoginAttemps += 1;
    await dbUser.save();
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password does not match!');
  }

  // Ensure to prevent user from login even password is correct after profile has been locked
  if (dbUser.isLocked.status) {
    throw new ApiError(httpStatus.LOCKED, dbUser.isLocked.reason === LOCKED_REASON_ENUM.INVALID_ATTEMPTS ? "Invalid attempts exceeded limit, please contact admin to unlock the account":dbUser.isLocked.reason);
  }

  // if user is already logged in / has refresh token already, filter this token from database because we will replace the user with new refresh token
  let newRefreshTokenArray = !refreshToken
    ? dbUser.refreshToken
    : dbUser.refreshToken.filter(rt => rt !== refreshToken);

  if (refreshToken) {
    /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
    const isTokenFound = dbUser.refreshToken.includes(refreshToken);
    if (!isTokenFound) {
      // Detected refresh token reuse!
      // clear out ALL previous refresh tokens
      newRefreshTokenArray = [];
    }
    clearCookie();
  }

  const tokenData = {
    email: dbUser?.email,
    role: dbUser?.role,
  };

  const accessToken = generateJWT_Token(
    tokenData,
    JWT_SECRET_KEY as string,
    JWT_EXPIRES_IN as string
  );

  const newRefreshToken = generateJWT_Token(
    tokenData,
    JWT_SECRET_REFRESH_KEY as string,
    remember
      ? (JWT_REFRESH_EXPIRES_IN_REMEMBER as string)
      : (JWT_REFRESH_EXPIRES_IN_NOT_REMEMBER as string)
  );

  dbUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
  //Ensure invalid login attempts reset upon successful login
  dbUser.invalidLoginAttemps=0
  await dbUser.save();

  const result = {
    user: dbUser.getResponseFields(),
    accessToken,
    newRefreshToken,
  };

  return result;
};

const createUser = async (userData: IUser): Promise<Partial<IUser>> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const createdUser = await User.create([userData], { session });
    const userProfile = {
      user: createdUser[0]._id,
    };
    await Profile.create([userProfile], { session });

    await session.commitTransaction();
    session.endSession();

    return createdUser[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const userRefreshToken = async (
  refreshToken: string,
  clearCookie: () => void
): Promise<IRefreshToken> => {
    // Verify the provided refresh token
  const verifiedRefreshToken: JwtPayload | null =
    (await verifyJWT_Token(refreshToken, JWT_SECRET_REFRESH_KEY as string)) ||
    null;
  // If the refresh token is invalid, throw an error
  if (!verifiedRefreshToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid refresh token!');
  }
  // Extract the user email from the verified refresh token
  const { email } = verifiedRefreshToken as JwtPayload;

  // Find the user associated with the provided user email
  const dbUser = await User.findOne({ email });

  // If the user does not exist, throw an error
  if (!dbUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }
  // Check if the provided refresh token exists in the user's database
  const refreshTokenExists = dbUser.refreshToken.includes(refreshToken);
  if (!refreshTokenExists) {
    // reuse or hacked user detected, needed to clear all RTs when user logs in
    dbUser.refreshToken=[];
    await dbUser.save();
    clearCookie();
    throw new ApiError(httpStatus.FORBIDDEN, 'Refresh token not found in user data!');
  }
  // Generate a new token
  const newAccessToken = generateJWT_Token(
    dbUser,
    JWT_SECRET_KEY as string,
    JWT_EXPIRES_IN as string
  );

  const result = {
    accessToken: newAccessToken,
    user: dbUser.getResponseFields(),
  };

  return result;
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  id: string
): Promise<void> => {
  const dbUser = await User.findById(id).exec();

  if (!dbUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not Found !');
  }
  const savedOldPasswordInDb: string = dbUser?.password as string;
  const isPasswordMatch: boolean = await User.isPasswordMatched(
    oldPassword,
    savedOldPasswordInDb
  );
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect old password !');
  }
  //hash password before saving it.
  const newHshedPassword = await bcrypt.hash(
    newPassword,
    Number(BCRYPT_SALT_ROUNDS)
  );
  // update password
  dbUser.password = newHshedPassword;
  await dbUser.save();
};


const logOutService = async (refreshToken:string, clearCookie: () => void) =>{
  const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      clearCookie()
      throw new ApiError(httpStatus.NO_CONTENT, 'Refresh token not found in user data!'); ;
    }
    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(
      rt => rt !== refreshToken
    );
    await foundUser.save();
    clearCookie();
}

export const AuthService = {
  loginUser,
  userRefreshToken,
  changePassword,
  createUser,
  logOutService
};
