// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// This handles registering a new user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // I only want POST requests here
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Connect to my MongoDB database
  await connectToDatabase();

  const { email, password } = req.body;

  // Make sure both email and password were sent
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if this email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Hash the password so I never store it in plain text
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const newUser = await User.create({ email, passwordHash: hashedPassword });

  // Create a JWT so the user can stay logged in
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("I must define JWT_SECRET in my .env.local file");

  const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: "7d" });

  // Send back the token and basic user info
  return res.status(201).json({ token, user: { email: newUser.email, id: newUser._id } });
}
