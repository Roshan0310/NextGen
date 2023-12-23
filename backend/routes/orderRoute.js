import express from 'express';
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';

const orderRouter = express.Router();

import { isAuthenticatedUser, authorizedRoles } from '../middleWare/auth.js';

orderRouter.route('/order/new').post(isAuthenticatedUser, newOrder);

orderRouter.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);

orderRouter.route('/orders/me').get(isAuthenticatedUser, myOrders);

orderRouter
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizedRoles('admin'), getAllOrders);

orderRouter
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizedRoles('admin'), updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteOrder);

export default orderRouter;
