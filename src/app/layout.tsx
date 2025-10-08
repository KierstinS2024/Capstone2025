// src/app/layout.tsx
"use client";

import "./global.css";
import { AppProviders } from "@/context/AppProviders";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <NavbarWrapper />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

function NavbarWrapper() {
  const { user } = useAuth();

  // Show navbar only when user is logged in
  if (!user) return null;
  return <Navbar />;
}
