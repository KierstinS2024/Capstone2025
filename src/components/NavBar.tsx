// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const { logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/dashboard/recipes">Recipes</Link>
      <Link href="/meal-plans">Meal Plans</Link>
      <Link href="/shopping-lists">Shopping Lists</Link>
      <Link href="/food-intake">Food Intake</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
