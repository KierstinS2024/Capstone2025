// src/app/page.tsx
"use client";

/**
 * Landing / Home Page
 * Independent of AuthProvider nav
 */

import Link from "next/link";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>Eat Better, Live Better</h1>
        <p>Plan meals, track nutrition, and build healthy habits with ease.</p>
        <div className={styles.actions}>
          <Link href="/auth/signup" className={styles.btnPrimary}>
            Get Started
          </Link>
          <Link href="/auth/login" className={styles.btnSecondary}>
            Log In
          </Link>
        </div>
      </section>
    </main>
  );
}
