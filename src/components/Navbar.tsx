// PATH: src/components/Navbar.tsx
"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "../context/AuthContext";
import styles from "@/styles/navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>MealMate</div>
      <ul className={styles.links}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/meal-plans">Meal Plans</Link>
        </li>
        <li>
          <Link href="/recipes">Recipes</Link>
        </li>
        <li>
          <Link href="/shopping-list">Shopping List</Link>
        </li>
      </ul>
      <div className={styles.auth}>
        {user ? (
          <>
            <span className={styles.welcome}>Welcome {user.email}</span>
            <button className={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
