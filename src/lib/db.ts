// path: src/lib/db.ts
import mongoose from "mongoose";

// Connect to MongoDB
export async function connectDb() {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set in .env");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}
