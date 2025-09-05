// src/app/page.tsx
import styles from "./LandingPage.module.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <main className={styles.container}>
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      {/* ------------------- Hero Section ------------------- */}
      <section className={styles.hero}>
        <div className={styles.text}>
          <h1>Eat Better, Live Better</h1>
          <p>
            Plan meals, track nutrition, and build healthy habits with ease.
          </p>
          <div className={styles.actions}>
            <Link href="/auth/signup" className={styles.btnPrimary}>
              Get Started
            </Link>
            <Link href="/auth/login" className={styles.btnSecondary}>
              Log In
            </Link>
          </div>
        </div>
        <div className={styles.illustration} />
      </section>

      {/* ------------------- Features Section ------------------- */}
      <section className={styles.features}>
        <div className={styles.card}>
          <h3>📅 Plan Meals</h3>
          <p>Create weekly meal plans effortlessly.</p>
        </div>
        <div className={styles.card}>
          <h3>🥗 Track Nutrition</h3>
          <p>See calories, macros, and balance at a glance.</p>
        </div>
        <div className={styles.card}>
          <h3>💾 Save Recipes</h3>
          <p>Keep your favorites in one place.</p>
        </div>
      </section>

      {/* ------------------- CTA Section ------------------- */}
      <section className={styles.cta}>
        <h2>Start your journey today</h2>
        <Link href="/auth/signup" className={styles.btnPrimary}>
          Sign Up Free
        </Link>
      </section>
    </main>
  );
}
