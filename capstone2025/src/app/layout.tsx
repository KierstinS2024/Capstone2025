// src/app/layout.tsx
/**
 * RootLayout
 * - Wraps the app with AuthProvider & ThemeProvider
 * - Landing page does not show NavBar
 */

import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
