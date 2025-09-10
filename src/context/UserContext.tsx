// src/context/UserContext.tsx
// React context for user-specific preferences or data

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/types/user";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode };

export const UserProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const value: UserContextType = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
