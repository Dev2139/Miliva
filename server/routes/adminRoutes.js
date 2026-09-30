import express from 'express';
import {
  getDashboardStats,
  getCustomers,
  toggleUserStatus,
  getInventoryReport
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.put('/customers/:id/toggle', toggleUserStatus);
router.get('/inventory', getInventoryReport);

export default router;
