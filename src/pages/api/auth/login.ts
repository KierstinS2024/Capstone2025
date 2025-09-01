// src/pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// This handles logging in an existing user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectToDatabase();

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  // Check the password against the hashed version
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

  // Create a JWT for them
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("I must define JWT_SECRET in my .env.local file");

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "7d" });

  return res.status(200).json({ token, user: { email: user.email, id: user._id } });
}
