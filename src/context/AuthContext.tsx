// src/context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { get, post, setTokenGetter } from "@/lib/api";

type User = {
  _id: string;
  email: string;
  name?: string;
  // add any other fields your /api/auth/me returns
};

type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "auth_v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    loading: true,
  });

  // Keep a ref in sync so api.ts can always read the latest token.
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = state.token;

  useEffect(() => {
    // Allow api.ts to pull the token when needed
    setTokenGetter(() => tokenRef.current);
  }, []);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { token: string; user: User | null };
        setState({
          token: parsed.token ?? null,
          user: parsed.user ?? null,
          loading: false,
        });
      } else {
        setState((s) => ({ ...s, loading: false }));
      }
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  // Persist to localStorage whenever token/user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (state.token) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: state.token, user: state.user })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.token, state.user]);

  const refreshMe = useCallback(async () => {
    if (!state.token) return;
    try {
      const me = await get<User>("/api/auth/me", true);
      setState((s) => ({ ...s, user: me }));
    } catch {
      // If /me fails (expired token), log out silently
      setState({ token: null, user: null, loading: false });
    }
  }, [state.token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await post<{ token: string; user: User }>(
      "/api/auth/login",
      { email, password },
      false
    );
    setState({ token: res.token, user: res.user, loading: false });
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await post<{ token: string; user: User }>(
      "/api/auth/register",
      { email, password },
      false
    );
    setState({ token: res.token, user: res.user, loading: false });
  }, []);

  const logout = useCallback(() => {
    setState({ token: null, user: null, loading: false });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      token: state.token,
      user: state.user,
      loading: state.loading,
      isAuthed: Boolean(state.token),
      login,
      signup,
      logout,
      refreshMe,
    };
  }, [
    state.token,
    state.user,
    state.loading,
    login,
    signup,
    logout,
    refreshMe,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
