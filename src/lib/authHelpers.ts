// src/lib/authHelpers.ts
// Helpers for authentication API calls

import type { User } from "@/types/user";
import { apiFetch } from "./api";

/** Fetch the current logged-in user */
export const fetchCurrentUserAPI = async (): Promise<User | null> => {
  try {
    return await apiFetch<User>("/auth/me");
  } catch {
    return null; // not logged in or error
  }
};
