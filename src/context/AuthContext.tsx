// Path: src/context/AuthContext.tsx
/**
 * AuthContext
 * -----------
 * Provides authentication state and methods across the app.
 * - Handles login, signup, logout
 * - Stores token and user in localStorage
 * - Tracks loading and error state for UI feedback
 * - Redirects users to the dashboard on login/signup
 * - Fully typed for safety
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// -----------------------------
// Type Definitions
// -----------------------------
export interface User {
  _id: string;
  email: string;
  [key: string]: any; // additional user fields
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean; // true when login/signup is in progress
  error: string | null; // last error message
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// -----------------------------
// Context Initialization
// -----------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// -----------------------------
// API Paths
// -----------------------------
const API_PATHS = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
};

// -----------------------------
// Auth Provider Component
// -----------------------------
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user and token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_PATHS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; message?: string } =
        await response.json();

      if (!response.ok || !data.token || !data.user) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard"); // redirect on success
    } catch (err: any) {
      setError(err.message || "Unable to login. Please try again.");
      throw err; // re-throw so pages/components can handle too
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Signup
  // -----------------------------
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_PATHS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; message?: string } =
        await response.json();

      if (!response.ok || !data.token || !data.user) {
        throw new Error(data.message || "Signup failed");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard"); // redirect on success
    } catch (err: any) {
      setError(err.message || "Unable to signup. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login"); // redirect to login
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------
// Custom Hook for AuthContext
// -----------------------------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
