// src/lib/api.ts
/**
 * api.ts
 * ----------------
 * Axios API helper for simplified authenticated requests.
 * Automatically attaches JWT token if provided.
 * Supports request/response interceptors and typed responses.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Create a typed Axios instance
 * @param token Optional JWT token for Authorization header
 * @param config Optional AxiosRequestConfig overrides
 * @returns Configured AxiosInstance
 */
export const getApiClient = (
  token?: string,
  config?: AxiosRequestConfig
): AxiosInstance => {
  const instance = axios.create({
    baseURL: "/api",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config?.headers || {}),
    },
    ...config,
  });

  // Optional: global response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(
        "API request error:",
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Helper for typed GET requests
 * @param url Endpoint URL
 * @param token Optional JWT token
 */
export const apiGet = async <T>(url: string, token?: string) => {
  const client = getApiClient(token);
  const res = await client.get<T>(url);
  return res.data;
};

/**
 * Helper for typed POST requests
 * @param url Endpoint URL
 * @param data Payload
 * @param token Optional JWT token
 */
export const apiPost = async <T>(url: string, data: any, token?: string) => {
  const client = getApiClient(token);
  const res = await client.post<T>(url, data);
  return res.data;
};
