// ===========================================
// PATH: src/app/dashboard/page.tsx
// ===========================================
"use client";

import Navbar from "@/components/Navbar";
import MealPlanCard from "@/components/MealPlanCard";
import ShoppingListPanel from "@/components/ShoppingListPanel";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useMealPlans } from "@/context/MealPlanContext";
import { useShoppingList } from "@/context/ShoppingListContext";

export default function DashboardPage() {
  // -----------------------------
  // Auth & data loading
  // -----------------------------
  const { user, loading: authLoading } = useRequireAuth();
  const { mealPlans, loading: mealLoading } = useMealPlans();
  const { list, loading: listLoading } = useShoppingList();

  // Show loading while fetching data
  if (authLoading || mealLoading || listLoading) {
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Loading dashboard...
      </p>
    );
  }

  // Redirect handled by useRequireAuth, so null check is safe
  if (!user) return null;

  const currentPlan = mealPlans[0]; // Get the active/current meal plan

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <main style={{ padding: "2rem" }}>
        {/* Greeting */}
        <h1>Welcome {user.email}</h1>

        {/* Dashboard layout: Meal Plan + Shopping List */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginTop: "1rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left: Current Meal Plan */}
          <div style={{ flex: 1 }}>
            {currentPlan ? (
              <MealPlanCard plan={currentPlan} />
            ) : (
              <p>No active plan</p>
            )}
          </div>

          {/* Right: Shopping List Panel */}
          <div style={{ flex: 1 }}>
            <ShoppingListPanel />
          </div>
        </div>
      </main>
    </>
  );
}
