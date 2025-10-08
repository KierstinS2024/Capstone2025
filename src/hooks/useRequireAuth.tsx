// ===========================================
// PATH: src/hooks/useRequireAuth.tsx
// ===========================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// -----------------------------
// Hook to protect pages
// -----------------------------
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return { user, loading }; // Now any page/component can safely access user
}
