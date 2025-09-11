// src/context/AuthContext.tsx
// Provides authentication state and methods to the app

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types/user";
import {
  fetchCurrentUserAPI,
  loginAPI,
  signupAPI,
  logoutAPI,
} from "@/lib/authHelpers";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = { children: ReactNode };

/**
 * AuthProvider wraps the app and provides authentication state and methods.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await fetchCurrentUserAPI();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    const u = await loginAPI(email, password);
    setUser(u);
  };

  // Signup method
  const signup = async (name: string, email: string, password: string) => {
    const u = await signupAPI(name, email, password);
    setUser(u);
  };

  // Logout method
  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access AuthContext.
 * Throws error if used outside AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
