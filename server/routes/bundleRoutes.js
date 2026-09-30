import express from 'express';
import {
  getBundles,
  getBundleBySlug,
  createBundle,
  updateBundle,
  deleteBundle
} from '../controllers/bundleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBundles);
router.get('/:slug', getBundleBySlug);

// Admin routes
router.post('/', protect, admin, createBundle);
router.put('/:id', protect, admin, updateBundle);
router.delete('/:id', protect, admin, deleteBundle);

export default router;
