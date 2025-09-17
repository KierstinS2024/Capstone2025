// PATH: src/lib/userApi.ts
// Client-side API helpers for User.

import { apiFetch } from "./api";
import { AuthUser } from "./authHelpers";

export async function getUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/api/auth/me");
  } catch {
    return null;
  }
}
