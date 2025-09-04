// path: src/app/dashboard/page.tsx
/**
 * Dashboard Page
 * ----------------
 * Landing page after login for authenticated users.
 * Displays a personalized greeting and navigation to modules.
 */

"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Ideally fetch from auth context or API
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Welcome, {userName}!</h1>
        <ul>
          <li>
            <Link href="/dashboard/recipes">Recipes</Link>
          </li>
          <li>
            <Link href="/meal-plans">Meal Plans</Link>
          </li>
          <li>
            <Link href="/shopping-lists">Shopping Lists</Link>
          </li>
          <li>
            <Link href="/food-intake">Food Intake</Link>
          </li>
        </ul>
      </div>
    </ProtectedRoute>
  );
}
