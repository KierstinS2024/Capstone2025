// src/lib/auth.ts
import jwt from "jsonwebtoken";

// I read the JWT secret key from my environment variables
const secretEnv = process.env.JWT_SECRET;

// I stop the app if the secret is not defined
if (!secretEnv) {
  throw new Error("I must define JWT_SECRET in my .env.local file");
}

// I tell TypeScript that secret definitely exists here
const secret: string = secretEnv;

/**
 * I create a JWT token for a given user ID
 * This is used when a user logs in or registers
 */
export function createToken(userId: string) {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

/**
 * I verify a JWT token from the Authorization header
 * Returns the userId if valid, otherwise null
 */
export function verifyToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    // I cast the decoded result to the expected shape
    const decoded = jwt.verify(token, secret) as unknown as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}
