import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../../shared/utils/sendResponse';
import { ICalculatorData } from './calculator.interface';
import { businessHealthService } from './calculator.service';

export const getHealthData: RequestHandler = async (req, res, next) => {
  try {
    const businessHealthData: ICalculatorData = req.body;

    const result: number = await businessHealthService.getBusinessHealths(
      businessHealthData
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Business health created successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const calculatorController = {
  getHealthData,
};
