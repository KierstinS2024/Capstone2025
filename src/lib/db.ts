// path: src/lib/db.ts
/**     
 * MongoDB Database Connection
 *
 * Provides a reusable function to connect to MongoDB using Mongoose.
 * Ensures a single connection is reused across serverless function calls
 * to prevent multiple connections in development/production.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

// Global cached connection to prevent multiple connections in dev
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
