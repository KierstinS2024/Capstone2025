// src/pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// I handle the POST request to log in a user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // I only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // I connect to my MongoDB database
  await connectToDatabase();

  // I get email and password from the request body
  const { email, password } = req.body;

  // I make sure both email and password exist
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // I find the user in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // I compare the password with the hashed password stored
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // I create a JWT so the user can stay logged in
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("I must define JWT_SECRET in my .env.local file");
  }

  const token = jwt.sign({ userId: user._id }, secret, {
    expiresIn: '7d'
  });

  // I return the token and basic user info
  return res.status(200).json({ 
    token, 
    user: { email: user.email, id: user._id } 
  });
}
