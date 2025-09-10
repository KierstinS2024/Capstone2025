// src/context/UserContext.tsx
// React context for managing current user info

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/types/user";
import { fetchCurrentUserAPI } from "@/lib/authHelpers";

// --------------------
// Types
// --------------------
type UserContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

// --------------------
// Context creation
// --------------------
export const UserContext = createContext<UserContextType | undefined>(undefined);

type ProviderProps = { children: ReactNode };

// --------------------
// Provider component
// --------------------
export const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  // --------------------
  // Context actions
  // --------------------

  /** Refresh current user info from API */
  const refreshUser = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentUserAPI();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // Context value
  // --------------------
  const value: UserContextType = {
    user,
    loading,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// --------------------
// Hook for consuming UserContext safely
// --------------------
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
