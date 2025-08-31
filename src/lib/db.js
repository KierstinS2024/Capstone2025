import mongoose from "mongoose";

// This is my MongoDB connection string from my .env file
const MONGODB_URI = process.env.MONGODB_URI;

// I need this value, otherwise my app cannot connect to the database
if (!MONGODB_URI) {
  throw new Error("I must define MONGODB_URI in my .env file");
}

// I’m keeping track of my database connection here
// This way I don’t open a new connection every time Next.js hot reloads
let myMongoConnection = null;

async function connectToDatabase() {
  // If I already have a connection, I just return it
  if (myMongoConnection) {
    return myMongoConnection;
  }

  try {
    // I connect to MongoDB using Mongoose
    myMongoConnection = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB is connected!");
    return myMongoConnection;
  } catch (error) {
    // If something goes wrong, I log it so I can fix it
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectToDatabase;
