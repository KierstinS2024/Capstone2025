"use client";
import { useMealPlan } from "@/context/MealPlanContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MealPlansPage() {
  const { mealPlans } = useMealPlan();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Meal Plans</h2>
      {mealPlans.length === 0 ? (
        <p className="text-gray-600">No meals added yet.</p>
      ) : (
        <ul className="space-y-2">
          {mealPlans.map((plan) => (
            <li key={plan.id} className="p-4 border rounded">
              <span className="font-semibold">{plan.meal.name}</span> on{" "}
              {plan.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
