// src/lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be defined in .env.local");
}

// Declare a global variable to cache the connection in development
declare global {
  var _mongo: { database?: mongoose.Mongoose } | undefined;
}

let mongoGlobal = global._mongo || {};
if (process.env.NODE_ENV === "development") {
  global._mongo = mongoGlobal;
}

export default async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (mongoGlobal.database) {
    return mongoGlobal.database;
  }

  // Assert that MONGODB_URI is a string with !
  const database = await mongoose.connect(MONGODB_URI!);

  mongoGlobal.database = database;
  console.log("MongoDB connected!");
  return database;
}
