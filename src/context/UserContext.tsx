// src/context/UserContext.tsx
// React Context for user authentication state with API integration

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "../models/User";
import { loginUser, logoutUser, registerUser } from "../lib/authHelpers";

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  async function register(name: string, email: string, password: string) {
    const newUser = await registerUser(name, email, password);
    setUser(newUser);
  }

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
