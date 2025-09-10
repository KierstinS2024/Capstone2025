// src/context/UserContext.tsx
// React context for global user-related state

import { createContext, useContext, ReactNode } from "react";
import type { User } from "@/types/user";

type UserContextType = { user: User | null };

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

type ProviderProps = { children: ReactNode; user: User | null };

export const UserProvider = ({ children, user }: ProviderProps) => {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
