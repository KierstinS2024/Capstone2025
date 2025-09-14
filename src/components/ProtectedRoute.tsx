// path: src/components/ProtectedRoute.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Protects routes that require authentication.
 * Redirects to /login if the user is not logged in.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is done loading and is not logged in, redirect to login
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // While loading or redirecting, show nothing or a loading indicator
  if (loading || !user) {
    return <p className="center">Loading...</p>;
  }

  // Render the protected content once authenticated
  return <>{children}</>;
}
