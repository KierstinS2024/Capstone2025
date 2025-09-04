// path: src/app/dashboard/page.tsx
/**
 * Dashboard Page
 * --------------
 * Home page for logged-in users.
 * Shows personalized greeting and quick links to app modules.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const router = useRouter();

  // Optionally fetch user info if backend provides
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // If you want to fetch actual user name:
    // fetch("/api/me", { headers: { Authorization: `Bearer ${token}` }})
    //   .then(res => res.json())
    //   .then(data => setUserName(data.name || "User"))
    //   .catch(err => console.error(err));
  }, [router]);

  return (
    <ProtectedRoute>
      <NavBar />
      <div style={{ padding: "20px" }}>
        <h1>Welcome, {userName}!</h1>
        <p>Quick links to your app modules:</p>
        <ul>
          <li>
            <a href="/dashboard/recipes">Recipes</a>
          </li>
          <li>
            <a href="/meal-plans">Meal Plans</a>
          </li>
          <li>
            <a href="/shopping-lists">Shopping Lists</a>
          </li>
          <li>
            <a href="/food-intake">Food Intake</a>
          </li>
        </ul>
      </div>
    </ProtectedRoute>
  );
}
