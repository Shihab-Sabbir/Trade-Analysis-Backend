import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createCalculatorZodSchema } from './calculator.validation';
import { calculatorController } from './calculator.controller';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

const calculateRoutes = express.Router();

calculateRoutes.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(createCalculatorZodSchema),
  calculatorController.getHealthData
);

export default calculateRoutes;
