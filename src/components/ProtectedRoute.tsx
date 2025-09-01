// path: src/components/ProtectedRoute.tsx
"use client";

/**
 * ProtectedRoute
 *
 * Wraps pages/components that require authentication.
 * Redirects unauthenticated users to /auth/login.
 */

import { ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [user, token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
