import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} from '../controllers/productController.js';

import { isAuthenticatedUser, authorizedRoles } from '../middleWare/auth.js';

const productRouter = express.Router();

productRouter.route('/products').get(getAllProducts);

productRouter
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizedRoles('admin'), createProduct);

productRouter
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizedRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteProduct);

productRouter.route('/product/:id').get(getProductDetails);

productRouter.route('/review').put(isAuthenticatedUser, createProductReview);

productRouter
  .route('/reviews')
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

export default productRouter;
