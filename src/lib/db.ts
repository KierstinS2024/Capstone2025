// src/lib/db.ts
import mongoose from "mongoose";

// I read the MongoDB connection string from my environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// I make sure the connection string exists, otherwise I stop the app
if (!MONGODB_URI) {
  throw new Error("I must define MONGODB_URI in my .env.local file");
}

// I store my MongoDB connection here so I can reuse it across requests
let databaseConnection: mongoose.Mongoose | null = null;

// I connect to MongoDB and return the connection
export default async function connectToDatabase() {
  // If I already have a connection, I reuse it
  if (databaseConnection) {
    return databaseConnection;
  }

  // I create a new connection because I don’t have one yet
  databaseConnection = await mongoose.connect(MONGODB_URI!);

  console.log("MongoDB connected!");

  return databaseConnection;
}
