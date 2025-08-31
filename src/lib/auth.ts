// src/lib/auth.ts
import jwt from "jsonwebtoken";

// I read the secret key from my environment variables
const secret = process.env.JWT_SECRET as string;

// I make sure the secret exists, otherwise I stop the app
if (!secret) {
  throw new Error("I must define JWT_SECRET in my .env.local file");
}

// I create a token when a user logs in or registers
export function createToken(userId: string) {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

// I check the token from the Authorization header
export function verifyToken(authHeader?: string) {
  // I make sure the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token is missing or invalid");
  }

  // I grab the actual token part
  const token = authHeader.split(" ")[1];

  try {
    // I verify the token and return the userId inside
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
