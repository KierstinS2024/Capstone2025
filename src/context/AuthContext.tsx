// ===========================================
// PATH: src/context/AuthContext.tsx
// ===========================================
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  getCurrentUser,
} from "@/lib/authHelpers";

// ----- Types -----
export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// ----- Context -----
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----- Provider -----
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load current user on mount
  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      setLoading(false);
    })();
  }, []);

  // ----- Methods -----
  const login = async (email: string, password: string) => {
    // normalize email to lowercase to prevent case-sensitive login issues
    const u = await loginApi(email.toLowerCase(), password);
    if (u?.id) {
      setUser(u);
      return true;
    }
    setUser(null);
    return false;
  };

  const signup = async (email: string, password: string) => {
    // normalize email to lowercase to avoid duplicates and case issues
    const u = await signupApi(email.toLowerCase(), password);
    if (u?.id) {
      setUser(u);
      return true;
    }
    setUser(null);
    return false;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
    router.replace("/login"); // redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ----- Hook -----
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
