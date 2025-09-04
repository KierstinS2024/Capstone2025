// path: src/app/dashboard/page.tsx
/**
 * Dashboard Home Page
 * -------------------
 * Shows a personalized welcome message.
 * Provides quick links to main app sections:
 *  - Recipes
 *  - Meal Plans
 *  - Shopping Lists
 *  - Food Intake / Nutrition Tracking
 * 
 * This page ensures a smooth user flow from login to main functionality.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  // Store user's name for personalized greeting
  const [userName, setUserName] = useState("User");

  // Example: fetch user info on mount if needed
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || "User");
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    fetchUserName();
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: "20px" }}>
        <h1>Welcome, {userName}!</h1>
        <p>Quick links to manage your nutrition and meal planning:</p>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/dashboard/recipes">
              <button>Recipes</button>
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/meal-plans">
              <button>Meal Plans</button>
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/shopping-lists">
              <button>Shopping Lists</button>
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/food-intake">
              <button>Nutrition / Food Intake</button>
            </Link>
          </li>
        </ul>
      </div>
    </ProtectedRoute>
  );
}
