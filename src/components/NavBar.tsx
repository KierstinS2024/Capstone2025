// path: src/components/NavBar.tsx
/**
 * NavBar.tsx
 * ----------
 * Navigation bar for authenticated users.
 * Shows links to main modules and logout button.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/auth/login");
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.menu}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/dashboard/recipes">Recipes</Link>
        </li>
        <li>
          <Link href="/meal-plans">Meal Plans</Link>
        </li>
        <li>
          <Link href="/shopping-lists">Shopping Lists</Link>
        </li>
        <li>
          <Link href="/food-intake">Food Intake</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}
