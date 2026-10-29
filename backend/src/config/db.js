import mongoose from 'mongoose';
import './env.js';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is missing. Put your MongoDB connection string in backend/.env as MONGODB_URI=...'
    );
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected (${mongoose.connection.name})`);
}
