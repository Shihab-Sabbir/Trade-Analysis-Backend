import httpStatus from 'http-status';
import { CookieOptions, RequestHandler } from 'express';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/utils/sendResponse';
import { ILogin, ILoginResponse } from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';

const loginUser: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const payload: ILogin = req.body;
    const refreshToken = req.cookies.refreshToken;
    const clearCookie = () => {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    };
    const result = await AuthService.loginUser(
      payload,
      refreshToken,
      clearCookie
    );

    const { newRefreshToken, ...rest } = result;

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    sendResponse<ILoginResponse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: rest,
      message: 'Login successfully !',
    });
  } catch (error) {
    next(error);
  }
};

const createUser: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const userData = req.body;
    const result = await AuthService.createUser(userData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'User created successfully !',
    });
  } catch (error) {
    next(error);
  }
};

const userRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'No refresh token!');
    }
    const clearCookie = () => {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    };
    const result = await AuthService.userRefreshToken(
      refreshToken,
      clearCookie
    );

    sendResponse<ILoginResponse>(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: result,
      message: 'New AccessToken Issued Successfully!',
    });
  } catch (err) {
    next(err);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user as JwtPayload;
    await AuthService.changePassword(oldPassword, newPassword, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Password changed successfully !',
    });
  } catch (err) {
    next(err);
  }
};

const handleLogout: RequestHandler = async (req, res, next) => {
  // On client, also delete the accessToken
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(httpStatus.FORBIDDEN, 'No refresh token!'); //No content
    }
    const clearCookie = () => {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    };
    await AuthService.logOutService(refreshToken, clearCookie);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged out successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const AuthController = {
  loginUser,
  createUser,
  userRefreshToken,
  changePassword,
  handleLogout,
};
