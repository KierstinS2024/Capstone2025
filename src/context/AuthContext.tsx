// src/context/AuthContext.tsx
// React context for authentication (signup, login, logout, current user)
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types/user";
import { apiFetch } from "@/lib/api";

// --------------------
// Types
// --------------------
type AuthContextType = {
  user: User | null; // currently logged-in user
  loading: boolean; // true while fetching user
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// --------------------
// Context creation
// --------------------
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await apiFetch<User>("/auth/me");
        setUser(data);
      } catch {
        setUser(null); // no user logged in
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // --------------------
  // Authentication actions
  // --------------------

  /** Login user via API */
  const login = async (email: string, password: string) => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // Refresh current user after login
    const data = await apiFetch<User>("/auth/me");
    setUser(data);
  };

  /** Signup new user via API */
  const signup = async (name: string, email: string, password: string) => {
    await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    // Refresh current user after signup
    const data = await apiFetch<User>("/auth/me");
    setUser(data);
  };

  /** Logout user via API */
  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  };

  // --------------------
  // Context value
  // --------------------
  const value: AuthContextType = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --------------------
// Hook for consuming AuthContext
// --------------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
