// path: src/types/user.d.ts
// Type definitions for User and authentication payloads

/**
 * Represents a registered user.
 */
export interface User {
  _id: string; // MongoDB ObjectId as string
  email: string; // User's email
}

/**
 * Payload required for user signup.
 */
export interface SignupPayload {
  email: string; // Email address
  password: string; // Plaintext password (will be hashed server-side)
}

/**
 * Payload required for user login.
 */
export interface LoginPayload {
  email: string;
  password: string;
}
