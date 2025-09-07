/** src/lib/db.ts
 * MongoDB connection utility
 * Ensures a singleton connection across API routes
 */
import mongoose from "mongoose";
import "dotenv/config";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/meal-planner";

if (!MONGODB_URI)
  throw new Error("MONGODB_URI environment variable is required.");

// Enable strictQuery globally (type-safe)
mongoose.set("strictQuery", true);

declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      }
    | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export default async function connectToDatabase(): Promise<mongoose.Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        autoIndex: true,
      })
      .then((mongoose) => mongoose.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
