// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const router = useRouter();
  const { logout } = useAuth(); // log out function from context

  const handleLogout = () => {
    logout();
    router.push("/auth/login"); // redirect after logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <ul className={styles.links}>
        <li>
          <Link href="/dashboard/recipes">Recipes</Link>
        </li>
        <li>
          <Link href="/dashboard/ingredients">Ingredients</Link>
        </li>
        <li>
          <Link href="/dashboard/meal-plans">Meal Plans</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
}
