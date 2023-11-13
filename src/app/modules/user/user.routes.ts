import express from 'express';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

const userRoutes = express.Router();

userRoutes.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.getUsers
);
userRoutes.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getUser
);
userRoutes.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  UserController.updateUser
);
userRoutes.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

export default userRoutes;
