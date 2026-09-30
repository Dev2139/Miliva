import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloud_name = (process.env.CLOUDINARY_CLOUD_NAME || 'urzka7oz').trim();
const api_key = (process.env.CLOUDINARY_API_KEY || '189918724675551').trim();
const api_secret = (process.env.CLOUDINARY_API_SECRET || 'nWnbteQwJMQMYM4lAU-w4RhrRto').trim();

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true
});

export default cloudinary;
