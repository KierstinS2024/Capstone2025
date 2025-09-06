// lib/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Define a type that extends NextRequest with userId
export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export const requireAuth = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) => {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("Missing Authorization header");

      const token = authHeader.replace("Bearer ", "");
      const secret = process.env.JWT_SECRET || "secret";

      const decoded = jwt.verify(token, secret) as { userId: string };

      // Cast req to AuthenticatedRequest so TypeScript is happy
      const authReq = req as AuthenticatedRequest;
      authReq.userId = decoded.userId;

      return handler(authReq);
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
};
