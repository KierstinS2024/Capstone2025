/** src/app/layout.tsx
 * RootLayout
 * ----------
 * Wraps the entire app, providing global context providers.
 * - AuthProvider wraps all children
 * - ThemeProvider wraps all children for dark/light mode
 * - Imports global CSS and variables
 */

import "@/styles/variables.css"; // CSS variables for colors and themes
import "@/styles/globals.css"; // optional resets/fonts
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
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
      <body
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
