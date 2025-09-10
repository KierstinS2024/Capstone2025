// src/lib/db.ts
// MongoDB connection helper with TS-safe global cache

import mongoose, { ConnectOptions } from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend globalThis for TypeScript
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use cached connection if exists
const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("MONGODB_URI not defined in .env");

    cached.promise = mongoose
      .connect(MONGODB_URI, {} as ConnectOptions)
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
