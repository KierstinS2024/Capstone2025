// path: src/lib/middleware.ts
/**
 * Middleware to protect API routes using JWT.
 */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const requireAuth = (handler: Function) => {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("Missing Authorization header");

      const token = authHeader.replace("Bearer ", "");
      const secret = process.env.JWT_SECRET || "secret";

      const decoded = jwt.verify(token, secret);
      // @ts-ignore
      req.userId = decoded.userId;

      return handler(req);
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
};
