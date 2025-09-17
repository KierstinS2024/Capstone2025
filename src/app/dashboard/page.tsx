// ===========================================
// PATH: src/app/dashboard/page.tsx
// ===========================================
"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";
import Navbar from "@/components/Navbar";
import MealPlanCard from "@/components/MealPlanCard";
import ShoppingListPanel from "@/components/ShoppingListPanel";

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { mealPlans, loading: mealLoading } = useMealPlans();
  const { list, loading: listLoading } = useShoppingList();

  if (authLoading || mealLoading || listLoading) {
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Loading dashboard...
      </p>
    );
  }

  if (!user) return null; // useRequireAuth will redirect if null

  const currentPlan = mealPlans[0];

  return (
    <>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <h1>Welcome {user.email}</h1>
        <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
          <div style={{ flex: 1 }}>
            {currentPlan ? (
              <MealPlanCard plan={currentPlan} />
            ) : (
              <p>No active plan</p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <ShoppingListPanel />
          </div>
        </div>
      </main>
    </>
  );
}
