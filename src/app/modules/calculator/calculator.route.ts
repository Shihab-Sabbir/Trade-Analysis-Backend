import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createCalculatorZodSchema } from './calculator.validation';
import { calculatorController } from './calculator.controller';

const calculateRoutes = express.Router();

calculateRoutes.post(
  '/',
  auth(),
  validateRequest(createCalculatorZodSchema),
  calculatorController.getHealthData
);

export default calculateRoutes;
