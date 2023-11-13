import express from 'express';
import authRoutes from '../app/modules/auth/auth.route';
import userRoutes from '../app/modules/user/user.routes';
import profileRoutes from '../app/modules/profile/profile.routes';
import dataRoutes from '../app/modules/bussinessData/data.route';
import calculateRoutes from '../app/modules/calculator/calculator.route';
import auth from '../app/middlewares/auth';

const router = express.Router();

// shared routes
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/calculate',
    route: calculateRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/profile',
    route: profileRoutes,
  },
  {
    path: '/data',
    route: dataRoutes,
  },
];

defaultRoutes.forEach(route => {
  if (route.path === '/auth') {
    router.use(route.path, route.route);
  } else {
    router.use(route.path, auth(), route.route);
  }
});

export default router;
