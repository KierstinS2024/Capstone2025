// ===========================================
// PATH: src/hooks/useRequireAuth.tsx
// ===========================================
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Hook to protect pages (dashboard, meal plans, etc.)
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); // redirect if not authenticated
    }
  }, [user, loading, router]);

  return { user, loading };
}
