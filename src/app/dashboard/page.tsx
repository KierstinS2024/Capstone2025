// path: src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.cards}>
        <Link href="/dashboard/meal-plans" className={styles.card}>
          Meal Plans
        </Link>

        <Link href="/dashboard/recipes" className={styles.card}>
          Recipes
        </Link>

        <Link href="/dashboard/shopping-lists" className={styles.card}>
          Shopping List
        </Link>
      </div>
    </div>
  );
}
