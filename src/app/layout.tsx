// src/app/layout.tsx
// Root layout wrapping the app with context providers

import "@/global.css"; // global styles
import type { ReactNode } from "react";
import { AppProviders } from "@/context/AppProviders";

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the entire app with all context providers */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
