import express from 'express';
import auth from '../../middlewares/auth';
import { BusinessHealthController } from './data.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBusinessHealthDataZodSchema,
  updateBusinessHealthZodSchema,
} from './data.validation';

const businessHealthRoutes = express.Router();

businessHealthRoutes.get(
  '/',
  auth(),
  BusinessHealthController.getBusinessHealths
);

businessHealthRoutes.get(
  '/:id',
  auth(),
  BusinessHealthController.getBusinessHealth
);

businessHealthRoutes.post(
  '/',
  auth(),
  validateRequest(createBusinessHealthDataZodSchema),
  BusinessHealthController.createBusinessHealth
);

businessHealthRoutes.patch(
  '/:id',
  auth(),
  validateRequest(updateBusinessHealthZodSchema),
  BusinessHealthController.updateBusinessHealth
);

businessHealthRoutes.delete(
  '/:id',
  auth(),
  BusinessHealthController.deleteBusinessHealth
);

export default businessHealthRoutes;
