import { RequestHandler } from 'express';
import { UserService } from './user.service';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/utils/sendResponse';
import { IUser } from '../auth/auth.interface';


export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserService.getUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: users,
      message: 'Users retrieved successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUser(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: user,
      message: 'User retrieved successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData: IUser = req.body;
    await UserService.updateUser(id, userData);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};


export const UserController = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
  };