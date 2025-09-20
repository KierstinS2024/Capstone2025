// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="logo">MealMate</div>

      {/* Main links */}
      <div className="nav-links">
        <Link href="/dashboard" className="link">
          Dashboard
        </Link>
        <Link href="/meal-plans" className="link">
          Meal Plans
        </Link>
        <Link href="/recipes" className="link">
          Recipes
        </Link>
        <Link href="/shopping-list" className="link">
          Shopping List
        </Link>
      </div>

      {/* Auth action */}
      <div className="nav-links">
        {user ? (
          <button className="button-muted" onClick={logout}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
