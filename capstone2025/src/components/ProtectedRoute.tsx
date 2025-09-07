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
    if (!loading && !user) {
      router.push("/auth/login"); // redirect if not logged in
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <p>Loading...</p>; // or a fancy spinner
  }

  return <>{children}</>;
}
