"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
}

const publicPaths = ["/", "/auth/login", "/auth/signup"];

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (publicPaths.includes(pathname)) {
      setCheckingAuth(false);
      return;
    }

    if (!loading && !user) {
      router.replace("/auth/login");
    } else if (!loading && user) {
      setCheckingAuth(false);
    }
  }, [user, loading, pathname, router]);

  if (checkingAuth) return null; // optional spinner

  return <>{children}</>;
}
