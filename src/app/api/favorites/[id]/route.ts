// path: src/app/api/favorites/[id]/route.ts
/**
 * DELETE /favorites/:id
 * ----------------------
 * Remove a recipe from user's favorites by recipe ID
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Favorite from "@/models/Favorite";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { message: "Authorization required" },
        { status: 401 }
      );
    const token = authHeader.replace("Bearer ", "");
    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { id: recipeId } = params;
    const deleted = await Favorite.findOneAndDelete({ userId, recipeId });
    if (!deleted)
      return NextResponse.json(
        { message: "Favorite not found" },
        { status: 404 }
      );

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("Deleting favorite error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
