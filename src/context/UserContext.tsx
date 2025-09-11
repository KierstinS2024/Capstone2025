// src/context/UserContext.tsx
// React context for managing current user info (smart provider)
// Provides: user, loading, refreshUser, setUser
// Keeps the same external contract components expect (useUser, refreshUser, loading)

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types/user";
import { fetchCurrentUserAPI } from "@/lib/authHelpers";

type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (u: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

/**
 * UserProvider
 * - Fetches current user on mount
 * - Exposes refreshUser to let other code update user info after auth actions
 * - Exposes setUser to allow direct updates (e.g. login/signup flows)
 */
export const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user on mount (keeps session across reloads)
  useEffect(() => {
    void refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Refresh current user from API */
  const refreshUser = async (): Promise<void> => {
    setLoading(true);
    try {
      const u = await fetchCurrentUserAPI();
      setUserState(u);
    } catch (error) {
      // Not authenticated or network error -> clear user
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  /** Exposed setter (keeps same signature as before) */
  const setUser = (u: User | null) => {
    setUserState(u);
  };

  const value: UserContextType = {
    user,
    loading,
    refreshUser,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/** Hook for consuming UserContext safely */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
