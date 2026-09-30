import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { checkPincodeDelivery } from './utils/pincodeData.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bundleRoutes from './routes/bundleRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Security & Body parser middleware
app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = [
  'https://bemiliva.netlify.app',
  'https://bemiliva-admin.netlify.app',
  'http://localhost:5173',
  'http://localhost:5175',
  process.env.CLIENT_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.netlify.app') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Welcome & API Status Endpoints
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Miliva Cosmetics Backend API is running smoothly' });
});

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Miliva Cosmetics API Server', health: '/api/health' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bundles', bundleRoutes);
app.use('/api/upload', uploadRoutes);

// Delivery Pincode checker route
app.get('/api/pincode/:code', (req, res) => {
  const result = checkPincodeDelivery(req.params.code);
  res.json({ success: result.serviceable, data: result });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Miliva Cosmetics API Server running smoothly' });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Miliva Backend Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;

