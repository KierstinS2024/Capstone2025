// src/lib/serverAuth.ts
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User"; // ✅ import the correct exported model
import type { User as UserType } from "@/types/user";

// Simulate server-side session retrieval (replace with your session/auth library)
async function getSessionUserId(): Promise<string | null> {
  // Example: fetch from request headers or cookies
  // Placeholder: replace with real session logic
  return null;
}

/**
 * Fetch the current user from DB (server-only)
 */
export async function getCurrentUserFromDB(): Promise<UserType | null> {
  await connectToDB();

  const userId = await getSessionUserId();
  if (!userId) return null;

  const userDoc = await User.findById(userId).lean();
  if (!userDoc) return null;

  return {
    _id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    favorites: userDoc.favorites.map((f: any) => f.toString()),
  };
}
