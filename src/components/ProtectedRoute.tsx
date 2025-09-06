// components/ProtectedRoute.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

const publicPaths = ["/", "/auth/login", "/auth/signup"];

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
      router.replace("/auth/login"); // use replace to avoid back-navigation issues
    } else {
      setCheckingAuth(false);
    }
  }, [user, pathname, router]);

  if (checkingAuth) return null; // could render a spinner instead

  return <>{children}</>;
}
