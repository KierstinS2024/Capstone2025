/** src/app/layout.tsx
 * RootLayout
 * ----------
 * Wraps the app with global providers and global UI.
 * - ThemeProvider: dark/light toggle
 * - AuthProvider: authentication
 * - ProtectedRoute: restricts access to protected pages
 * - NavBar: always visible on protected pages
 */

import "../styles/globals.css";
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
