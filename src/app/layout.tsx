// src/app/layout.tsx
"use client"; // Client component required for AuthProvider

/**
 * RootLayout.tsx
 * -------------------
 * Wraps the entire app with AuthProvider for global authentication state.
 */

import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capstone2025",
  description: "Nutrition & meal planning app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
