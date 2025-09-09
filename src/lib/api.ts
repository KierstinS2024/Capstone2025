// src/lib/api.ts
/**
 * api.ts
 * ----------------
 * Axios API helper to simplify authenticated requests.
 * Automatically attaches JWT token if provided.
 */

import axios, { AxiosInstance } from "axios";

/**
 * Returns a configured Axios instance
 * @param token Optional JWT token
 */
export const getApiClient = (token?: string): AxiosInstance =>
  axios.create({
    baseURL: "/api",
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });
