import express from 'express';
import auth from '../../middlewares/auth';
import { ProfileController } from './profile.controller';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

const profileRoutes = express.Router();

profileRoutes.get('/:id', auth(), ProfileController.getProfile);
profileRoutes.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.USER),
  ProfileController.updateProfile
);

export default profileRoutes;
