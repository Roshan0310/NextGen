import express from 'express';
const router = express.Router();
import orderRouter from './orderRoute.js';
import productRouter from './productRoute.js';
import userRouter from './userRoute.js';

router.use('/v1', orderRouter, productRouter, userRouter);
router.get('/', (_req, res) =>
  res.status(200).json({
    status: 'success',
    message: 'You have successfully reached out supply chain server API',
  })
);

export default router;
