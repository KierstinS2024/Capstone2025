// Path: src/components/Navbar.tsx
// Navigation bar: links for Home, Recipes, Dashboard, Guest Mode, Login/Signup, Logout

"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth(); // Get authentication state

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        backgroundColor: "#faf7f2",
        borderBottom: "1px solid #d8cfc4",
      }}
    >
      {/* Left section: Logo / Home */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Link
          href="/"
          style={{ fontWeight: "bold", fontSize: "18px", color: "#6b4c3b" }}
        >
          Springboard
        </Link>
        <Link href="/recipes" style={{ color: "#6b4c3b" }}>
          Recipes
        </Link>
      </div>

      {/* Right section: User actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <>
            <Link href="/dashboard" style={{ color: "#6b4c3b" }}>
              Dashboard
            </Link>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #6b4c3b",
                backgroundColor: "white",
                color: "#6b4c3b",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#6b4c3b" }}>
              Login
            </Link>
            <Link href="/signup" style={{ color: "#6b4c3b" }}>
              Signup
            </Link>
            <Link href="/guest-dashboard" style={{ color: "#6b4c3b" }}>
              Guest Mode
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
