// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@lib/db';
import User from '@models/User';

// I handle the POST request to register a new user
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

  // I check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // I hash the password so I never store plain text
  const hashedPassword = await bcrypt.hash(password, 10);

  // I create the user in the database
  const newUser = await User.create({ email, passwordHash: hashedPassword });

  // I create a JWT so the user can stay logged in
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("I must define JWT_SECRET in my .env.local file");
  }

  const token = jwt.sign({ userId: newUser._id }, secret, {
    expiresIn: '7d'
  });

  // I return the token and basic user info
  return res.status(201).json({ 
    token, 
    user: { email: newUser.email, id: newUser._id } 
  });
}
