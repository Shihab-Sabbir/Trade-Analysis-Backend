import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/utils/sendResponse';
import { IBusinessHealth } from './data.interface';
import BusinessHealthModel from './data.model';

export const createBusinessHealth: RequestHandler = async (req, res, next) => {
  try {
    const businessHealthData: IBusinessHealth = req.body;

    const owner = req!.user!.email;
    const businessHealth = new BusinessHealthModel(businessHealthData);
    businessHealth["owner"] = owner;
    await businessHealth.save();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Business health created successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const updateBusinessHealth: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessHealthData: IBusinessHealth = req.body;
    await BusinessHealthModel.findByIdAndUpdate(id, businessHealthData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Business health updated successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessHealth: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BusinessHealthModel.findByIdAndDelete(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Business health deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessHealths: RequestHandler = async (req, res, next) => {
  try {
    const owner = req!.user!.email;
    const businessHealths = await BusinessHealthModel.find({owner:owner});

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: businessHealths,
      message: 'Business healths retrieved successfully!',
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessHealth: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessHealth = await BusinessHealthModel.findById(id);

    if (!businessHealth) {
      sendResponse(res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: 'Business health not found',
      });
    } else {
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        data: businessHealth,
        message: 'Business health retrieved successfully!',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const BusinessHealthController = {
  createBusinessHealth,
  updateBusinessHealth,
  deleteBusinessHealth,
  getBusinessHealths,
  getBusinessHealth,
};
