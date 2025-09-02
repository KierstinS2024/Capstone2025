// path: src/app/dashboard/meal-plans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMealPlanContext } from "@/context/MealPlanContext";
import MealPlanCard from "@/components/MealPlanCard";
import styles from "./MealPlansListPage.module.css";

export default function MealPlansListPage() {
  const router = useRouter();
  const { mealPlans, setMealPlans } = useMealPlanContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [router, token]);

  useEffect(() => {
    if (!token) return;

    async function fetchMealPlans() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plans");
        setMealPlans(data.mealPlans || []);
      } catch (err: any) {
        setError(err.message || "Error loading meal plans");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlans();
  }, [token, setMealPlans]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this meal plan?"))
      return;

    try {
      const res = await fetch(`/api/meal-plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete meal plan");
      setMealPlans(mealPlans.filter((plan) => plan._id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting meal plan");
    }
  };

  if (loading) return <p className={styles.message}>Loading meal plans...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Meal Plans</h1>
      <button
        className={styles.createButton}
        onClick={() => router.push("/dashboard/meal-plans/create")}
      >
        + Create New Meal Plan
      </button>

      {mealPlans.length === 0 ? (
        <p className={styles.emptyMessage}>
          You haven't created any meal plans yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              mealPlan={plan}
              onClick={() => router.push(`/dashboard/meal-plans/${plan._id}`)}
              onDelete={() => handleDelete(plan._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
