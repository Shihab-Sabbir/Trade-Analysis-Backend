import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/utils/sendResponse';
import { IProfile } from './profile.interface';
import { ProfileService } from './profile.service';

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await ProfileService.getProfile(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: profile,
      message: 'Profile retrieved successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profileData: IProfile = req.body;
    await ProfileService.updateProfile(id, profileData);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const ProfileController = {
  getProfile,
  updateProfile,
};
