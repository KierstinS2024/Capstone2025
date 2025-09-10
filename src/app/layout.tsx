// src/app/layout.tsx
// Root layout updated to include AppProviders

import "./global.css";
import type { Metadata } from "next";
import { AppProviders } from "../context/AppProviders";

export const metadata: Metadata = {
  title: "Capstone Project",
  description: "Meal planning, recipes, and shopping lists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
