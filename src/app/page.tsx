// src/app/page.tsx

import styles from "./page.module.css";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Your Personal Meal Planner</h1>
        <p className={styles.subtitle}>
          Discover new recipes, create meal plans, and organize your shopping
          lists — all in one place!
        </p>
        <div className={styles.actions}>
          <Link href="/auth/signup" className={styles.primaryButton}>
            Get Started
          </Link>
          <Link href="/auth/login" className={styles.secondaryButton}>
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
