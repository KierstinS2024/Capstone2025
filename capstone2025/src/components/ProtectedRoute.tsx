// src/components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is not logged in and loading is complete, redirect to login
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // While loading or if user is not available yet, show a loading state
  if (loading || !user) {
    return <p>Loading...</p>; // could replace with a spinner for better UX
  }

  // Render the protected content once the user is authenticated
  return <>{children}</>;
}
