// path: src/components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

// -----------------------------
// Props
// -----------------------------
interface ProtectedRouteProps {
  children: ReactNode;
}

// -----------------------------
// Public paths
// -----------------------------
const publicPaths = ["/", "/auth/login", "/auth/signup"];

// -----------------------------
// ProtectedRoute Component
// -----------------------------
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      setCheckingAuth(false);
      return;
    }

    if (!user) {
      router.replace("/auth/login"); // redirect if not authenticated
    } else {
      setCheckingAuth(false);
    }
  }, [user, pathname, router]);

  // Optionally, render a spinner while checking auth
  if (checkingAuth) return null;

  return <>{children}</>;
}
