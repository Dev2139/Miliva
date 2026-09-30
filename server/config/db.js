import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}). Starting in-memory MongoDB fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    } catch (memError) {
      console.error(`MongoDB Memory Server Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
