import express from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  changePasswordZodSchema,
  createUserZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
} from './auth.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';
const authRoutes = express.Router();

authRoutes.post(
  '/login',
  validateRequest(loginZodSchema),
  AuthController.loginUser
);

authRoutes.post(
  '/register',
  validateRequest(createUserZodSchema),
  AuthController.createUser
);

authRoutes.post(
  '/refresh-token',
  validateRequest(refreshTokenZodSchema),
  AuthController.userRefreshToken
);

authRoutes.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(changePasswordZodSchema),
  AuthController.changePassword
);

authRoutes.get('/logout', auth(), AuthController.handleLogout);

export default authRoutes;
