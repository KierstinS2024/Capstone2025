import mongoose from "mongoose";

// The connection string to your MongoDB database
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env file");
}

// Keep track of the database connection
// This avoids creating multiple connections in development (Next.js hot reloads)
let mongoConnection = null;

async function connectToDatabase() {
  if (mongoConnection) {
    // If we already have a connection, return it
    return mongoConnection;
  }

  try {
    // Connect to MongoDB
    mongoConnection = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
    return mongoConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectToDatabase;
