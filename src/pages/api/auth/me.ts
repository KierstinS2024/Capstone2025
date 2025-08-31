// src/pages/api/auth/me.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// This route returns my current user if my JWT is valid
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // I only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // I get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  // I make sure JWT_SECRET exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("I must define JWT_SECRET in my .env.local file");
  }

  try {
    // I decode the token
    const decoded = jwt.verify(token, secret) as { userId: string };

    // I connect to MongoDB
    await connectToDatabase();

    // I find the user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // I return user info
    return res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
