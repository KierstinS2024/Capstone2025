// ===========================================
// PATH: src/context/AuthContext.tsx
//
// Global authentication context for the app.
//
// Key responsibilities:
// - Keep a single source of truth for the logged-in user
// - Provide login / signup / logout methods that call server helpers
// - Expose `refreshUser` so other contexts/pages can re-check the session
// - Be defensive about edge cases (API returns null but cookie was set)
// ===========================================

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

// Import the client-side auth helpers and the AuthUser shape
// (these helpers already include `credentials: "include"` so httpOnly cookies are sent)
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  getCurrentUser,
  AuthUser as AuthUserFromHelpers,
} from "@/lib/authHelpers";

// -------------------------------
// Types
// -------------------------------

// Re-use the AuthUser interface exported by authHelpers so types align
export type AuthUser = AuthUserFromHelpers;

// Shape of the context value exposed to consumers
interface AuthContextType {
  user: AuthUser | null; // current user or null
  loading: boolean; // true while the initial check / refresh is running
  refreshUser: () => Promise<void>; // force a server check of /api/auth/me
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// -------------------------------
// Context creation
// -------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------------------------------
// Provider component
// Wrap your application with <AuthProvider> in app/layout.tsx
// -------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Local state for user + loading indicator
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  // -------------------------------------------
  // refreshUser
  // - Calls getCurrentUser() (which calls /api/auth/me)
  // - Always sets local user state to the normalized result or null
  // - Exposed so other contexts can re-check the session after auth changes
  // -------------------------------------------
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const u = await getCurrentUser(); // returns AuthUser | null (normalized by authHelpers)
      setUser(u);
    } catch (err) {
      // Defensive: if anything goes wrong, clear the user
      console.error("refreshUser failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------
  // On mount: check session (this reads httpOnly cookie on server via /api/auth/me)
  // Components should respect `loading` until this initial check finishes.
  // -------------------------------------------
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // -------------------------------------------
  // login
  // - Calls loginApi which posts to /api/auth/login
  // - Some APIs return the user object immediately; others just set the cookie.
  // - We handle both: if loginApi returns a user we use it; otherwise we call getCurrentUser again.
  // - Returns true on success, false on failure.
  // -------------------------------------------
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // normalize email to lowercase before sending
      const apiResult = await loginApi(email.toLowerCase(), password);

      // If the API returned the user object, use it
      if (apiResult?.id) {
        setUser(apiResult);
        return true;
      }

      // Fallback: maybe the server set a cookie but didn't return a body.
      // Re-check /api/auth/me to get the current user.
      const fresh = await getCurrentUser();
      if (fresh?.id) {
        setUser(fresh);
        return true;
      }

      // Login failed
      setUser(null);
      return false;
    } catch (err) {
      console.error("login error:", err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // signup
  // - Very similar to login: create account, then ensure we have the current user
  // - Returns true on success, false on failure.
  // -------------------------------------------
  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const apiResult = await signupApi(email.toLowerCase(), password);

      if (apiResult?.id) {
        setUser(apiResult);
        return true;
      }

      // Fallback check for cookie + session
      const fresh = await getCurrentUser();
      if (fresh?.id) {
        setUser(fresh);
        return true;
      }

      setUser(null);
      return false;
    } catch (err) {
      console.error("signup error:", err);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // logout
  // - Calls server to clear cookie/session, clears local state, navigates to /login
  // -------------------------------------------
  const logout = async () => {
    try {
      await logoutApi(); // server clears cookie
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
      // Redirect to login so protected UIs don't flash
      // Use replace so back button doesn't go back to a protected page
      router.replace("/login");
    }
  };

  // -------------------------------------------
  // Provide context value
  // -------------------------------------------
  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUser, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -------------------------------
// Hook for consuming AuthContext
// - Throws if used outside of provider (explicit failure)
// -------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
