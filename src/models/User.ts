//src/models/User.ts

import mongoose from 'mongoose';

// This is my User schema: it defines how my user data looks in the database
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // I need email to log in
  passwordHash: { type: String, required: true }, // I store hashed password
  preferences: { type: Object, default: {} }, // I can save dietary preferences here
  avatarUrl: { type: String } // Optional profile picture
});

// I export the model so I can use it in my API routes
export default mongoose.models.User || mongoose.model('User', UserSchema);
