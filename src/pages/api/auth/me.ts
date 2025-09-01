// src/pages/api/auth/me.ts

import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// This route gives me the current user's info if they provide a valid JWT
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("I must define JWT_SECRET in my .env.local file");

  try {
    // Decode the token to get the userId
    const decoded = jwt.verify(token, secret) as { userId: string };

    await connectToDatabase();

    // Find the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
