// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard",
  description: "Your meal planning dashboard",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Meal Planner Dashboard</h1>
          <nav className="space-x-4">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Home
            </Link>
            <Link href="/dashboard/recipes" className="text-blue-600 hover:underline">
              Recipes
            </Link>
            <Link href="/dashboard/shopping-lists" className="text-blue-600 hover:underline">
              Shopping Lists
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/auth/login";
              }}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
