// path: src/app/layout.tsx
/**
 * RootLayout
 * ----------
 * Wraps the app with global providers.
 * - ThemeProvider: light/dark mode
 * - AuthProvider: authentication
 * - Imports CSS variables and global styles
 */

import "../styles/globals.css";
import "../styles/variables.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
