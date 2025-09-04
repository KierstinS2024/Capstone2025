// path: src/app/dashboard/page.tsx
/**
 * DashboardPage.tsx
 * -----------------
 * Main landing page after login.
 * Displays personalized greeting and links to all modules:
 * - Recipes
 * - Meal Plans
 * - Shopping Lists
 * - Food Intake
 * All protected by JWT and NavBar.
 */

"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Welcome, {userName}!</h1>
        <p>Select a module to get started:</p>
        <ul style={{ listStyle: "none", padding: 0 }}>
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
