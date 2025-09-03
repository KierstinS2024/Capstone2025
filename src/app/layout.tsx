// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Recipes & meal planning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Temporary minimal container; AppShell + Header/Sidebar coming next step */}
          <div className="main-container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
