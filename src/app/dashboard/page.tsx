// Path: src/app/dashboard/page.tsx

/**
 * DashboardPage
 * --------------------
 * Main dashboard landing page for logged-in users.
 * - Provides quick links to Recipes, Profile, and other sections.
 * - Uses cards for a clean, organized layout.
 * - Consistent theme with Recipe pages.
 */

"use client";

import Link from "next/link";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Welcome to Your Dashboard</h1>

      <section className={styles.cards}>
        <Link href="/dashboard/ingredients" className={styles.card}>
          <h2>🧂 Ingredients</h2>
          <p>Manage your ingredients list</p>
        </Link>

        <Link href="/dashboard/recipes" className={styles.card}>
          <h2>🍲 Recipes</h2>
          <p>Create, edit, and view recipes</p>
        </Link>

        <Link href="/dashboard/meal-plans" className={styles.card}>
          <h2>📅 Meal Plans</h2>
          <p>Plan your weekly meals</p>
        </Link>
      </section>
    </main>
  );
}
