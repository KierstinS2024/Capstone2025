// path: src/components/Navbar.tsx
"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link href="/" className="link" aria-label="Home">
          🍽️ Meal Planner
        </Link>
        {user && (
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
        )}
      </div>

      <div>
        {user ? (
          <>
            <span className="small muted" style={{ marginRight: 12 }}>
              {user.email}
            </span>
            <button className="button" onClick={() => logout()}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="link">
              Login
            </Link>
            <Link href="/signup" className="link" style={{ marginLeft: 8 }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
