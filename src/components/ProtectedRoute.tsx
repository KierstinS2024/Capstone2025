// src/components/ProtectedRoute.tsx
"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait until AuthProvider hydration is done
    if (user === null && token === null) {
      // no session → redirect
      router.push("/auth/login");
    } else {
      // session found → allow access
      setCheckingAuth(false);
    }
  }, [user, token, router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
