import express from 'express';
import auth from '../../middlewares/auth';
import { BusinessHealthController } from './data.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBusinessHealthDataZodSchema,
  updateBusinessHealthZodSchema,
} from './data.validation';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

const businessHealthRoutes = express.Router();

businessHealthRoutes.get(
  '/',
  auth(ENUM_USER_ROLE.USER),
  BusinessHealthController.getBusinessHealths
);

businessHealthRoutes.get(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  BusinessHealthController.getBusinessHealth
);

businessHealthRoutes.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(createBusinessHealthDataZodSchema),
  BusinessHealthController.createBusinessHealth
);

businessHealthRoutes.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(updateBusinessHealthZodSchema),
  BusinessHealthController.updateBusinessHealth
);

businessHealthRoutes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  BusinessHealthController.deleteBusinessHealth
);

export default businessHealthRoutes;
