import express from 'express';
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getuserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { isAuthenticatedUser, authorizedRoles } from '../middleWare/auth.js';
const userRouter = express.Router();

userRouter.route('/register').post(registerUser);

userRouter.route('/login').post(loginUser);

userRouter.route('/password/forgot').post(forgotPassword);

userRouter.route('/password/reset/:token').put(resetPassword);

userRouter.route('/logout').get(logout);

userRouter.route('/me').get(isAuthenticatedUser, getuserDetails);

userRouter.route('/password/update').put(isAuthenticatedUser, updatePassword);

userRouter.route('/me/update').put(isAuthenticatedUser, updateProfile);

userRouter
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizedRoles('admin'), getAllUser);

userRouter
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizedRoles('admin'), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles('admin'), updateUserRole)
  .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteUser);

export default userRouter;
