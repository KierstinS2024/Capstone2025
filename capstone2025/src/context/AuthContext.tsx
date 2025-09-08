// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/auth";

// Interface for Auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

// API endpoints
const API_PATHS = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
  me: "/api/auth/me",
  logout: "/api/auth/logout",
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_PATHS.me, {
          method: "GET",
          credentials: "include",
        });

        const data: { user?: User; message?: string } = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_PATHS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data: { user?: User; message?: string } = await res.json();

      if (!res.ok || !data.user) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      router.push("/dashboard/recipes");
    } catch (err: any) {
      setError(err.message || "Unable to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Signup
  // -----------------------------
  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_PATHS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data: { user?: User; message?: string } = await res.json();

      if (!res.ok || !data.user) {
        throw new Error(data.message || "Signup failed");
      }

      setUser(data.user);
      router.push("/dashboard/recipes");
    } catch (err: any) {
      setError(err.message || "Unable to signup");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_PATHS.logout, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Logout failed");
      }

      setUser(null);
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      setUser(null);
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy use in components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
