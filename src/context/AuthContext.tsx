"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/navigation";

// -----------------------------
// Type Definitions
// -----------------------------
export interface User {
  _id: string;
  email: string;
  preferences?: any;
  avatarUrl?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// -----------------------------
// Context Initialization
// -----------------------------
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

// -----------------------------
// API Endpoints
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

  // Load user & token from localStorage
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
      const res = await fetch(API_PATHS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; message?: string } =
        await res.json();

      if (!res.ok || !data.token || !data.user) {
        throw new Error(data.message || "Login failed");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard/recipes"); // redirect after login
    } catch (err: any) {
      setError(err.message || "Unable to login. Please try again.");
      throw err;
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
      const res = await fetch(API_PATHS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; message?: string } =
        await res.json();

      if (!res.ok || !data.token || !data.user) {
        throw new Error(data.message || "Signup failed");
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/dashboard/recipes"); // redirect after signup
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
    setUser(null);
    setToken(null);
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
// Custom Hook
// -----------------------------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
