// path: src/app/layout.tsx
/**
 * RootLayout
 * ----------
 * Wraps the entire app, providing global context providers.
 *
 * Notes:
 *  - Metadata is exported (server component)
 *  - AuthProvider wraps all children
 *  - No "use client" at the top; this allows exporting metadata
 */

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
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
