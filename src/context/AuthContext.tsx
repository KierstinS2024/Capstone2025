// src/context/AuthContext.tsx
// React context for authentication (signup, login, logout, current user)

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types/user";
import { apiFetch } from "@/lib/api";

// Type for context state
type AuthContextType = {
  user: User | null; // currently logged-in user
  loading: boolean; // loading state while fetching user
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider props type
type AuthProviderProps = { children: ReactNode };

// AuthContext provider component
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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  /** Login user via API */
  const login = async (email: string, password: string) => {
    await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // refresh current user after login
    const data = await apiFetch<User>("/auth/me");
    setUser(data);
  };

  /** Signup new user via API */
  const signup = async (name: string, email: string, password: string) => {
    await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    // refresh current user after signup
    const data = await apiFetch<User>("/auth/me");
    setUser(data);
  };

  /** Logout user via API */
  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  };

  // Context value
  const value: AuthContextType = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
