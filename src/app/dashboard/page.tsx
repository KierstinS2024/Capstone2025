// ===========================================
// PATH: src/app/dashboard/page.tsx
// Dashboard page: shows Navbar + Dashboard component
// ===========================================

"use client";

import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  );
}
