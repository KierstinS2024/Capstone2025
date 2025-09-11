import { connectToDB } from "@/lib/db";
import { User, IUser } from "@/models/User";
import type { User as UserType } from "@/types/user";

export async function getCurrentUserFromRequest(
  req: Request
): Promise<UserType | null> {
  await connectToDB();

  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/session=([a-f0-9]+)/); // matches session cookie
  const userId = match?.[1];
  if (!userId) return null;

  // lean() + type assertion to satisfy TS
  const userDoc = await User.findById(userId).lean<IUser & { _id: any }>();
  if (!userDoc) return null;

  return {
    _id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    favorites: (userDoc.favorites || []).map((f) => f.toString()),
  };
}
