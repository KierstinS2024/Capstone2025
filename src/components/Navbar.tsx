// src/components/Navbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "@/styles/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        MealMate
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/meal-plans">Meal Plans</Link>
            <Link href="/recipes">Recipes</Link>
            <Link href="/shopping-list">Shopping List</Link>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
