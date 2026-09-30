import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/track', protect, trackOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
