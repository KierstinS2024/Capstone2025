//src/components/Navbar.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">MealMate</div>

      {/* Hamburger menu for mobile */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
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
