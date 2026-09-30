import express from 'express';
import multer from 'multer';
import { uploadProductImages, uploadVideo } from '../controllers/uploadController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory storage for multer to pass buffers to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max per file for high-res images and videos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// POST /api/upload - Accepts product images and videos
router.post('/', upload.array('images', 10), uploadProductImages);

// POST /api/upload/video - Accepts product video
router.post('/video', upload.single('video'), uploadVideo);

export default router;
