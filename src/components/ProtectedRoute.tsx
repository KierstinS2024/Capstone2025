// src/components/ProtectedRoute.tsx
"use client";

/**
 * ProtectedRoute.tsx
 * -------------------
 * Ensures that children components are only accessible to authenticated users.
 * Redirects to login if not authenticated.
 */

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null; // prevent flicker
  }

  return <>{children}</>;
}
