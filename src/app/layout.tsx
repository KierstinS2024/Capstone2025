// path: src/app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * RootLayout (Server Component)
 *
 * Handles HTML structure, <head> metadata, and global styles.
 * All pages render inside this layout.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Meal Planner App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
