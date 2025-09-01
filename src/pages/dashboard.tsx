// src/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MealPlanCard from "@/components/MealPlanCard";
import ShoppingListCard from "@/components/ShoppingListCard";

// Types
interface User {
  id: string;
  email: string;
}

interface MealPlanEntry {
  _id: string;
  weekStartDate: string;
  notes?: string;
  entriesCount?: number;
}

interface ShoppingList {
  _id: string;
  createdAt: string;
  itemsCount: number;
  purchasedCount: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mealPlans, setMealPlans] = useState<MealPlanEntry[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // get user profile
        const userRes = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        if (!userData.user) return router.push("/login");
        setUser(userData.user);

        // get meal plans
        const plansRes = await fetch("/api/meal-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plans = await plansRes.json();
        setMealPlans(plans);

        // get shopping lists
        const listsRes = await fetch("/api/shopping-lists", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lists = await listsRes.json();
        setShoppingLists(lists);

        setLoading(false);
      } catch (err) {
        setError("Could not load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">Meal Plans</h2>
        {mealPlans.length === 0 && <p>You haven’t created any meal plans yet.</p>}
        <div className="grid gap-4">
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan._id}
              id={plan._id}
              weekStartDate={plan.weekStartDate}
              notes={plan.notes}
              entriesCount={plan.entriesCount}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Shopping Lists</h2>
        {shoppingLists.length === 0 && (
          <p>You haven’t created any shopping lists yet.</p>
        )}
        <div className="grid gap-4">
          {shoppingLists.map((list) => (
            <ShoppingListCard
              key={list._id}
              id={list._id}
              createdAt={list.createdAt}
              itemsCount={list.itemsCount}
              purchasedCount={list.purchasedCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
