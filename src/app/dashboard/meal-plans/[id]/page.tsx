// src/app/dashboard/meal-plans/[id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMealPlanContext,
  MealPlan,
  MealPlanEntry,
} from "@/context/MealPlanContext";
import styles from "./MealPlanDetailPage.module.css";

// Interface for an entry including full recipe details
interface FullEntry extends MealPlanEntry {
  recipe?: {
    _id: string;
    name: string;
    ingredients: { name: string; quantity: string }[];
  };
}

export default function MealPlanDetailPage() {
  // Global state for meal plans
  const { mealPlans, setMealPlans } = useMealPlanContext();

  const router = useRouter();
  const params = useParams();
  const planId = typeof params?.id === "string" ? params.id : "";

  // Local state
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [entriesWithRecipes, setEntriesWithRecipes] = useState<FullEntry[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<
    { _id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    recipeId: "",
    dayOfWeek: "Monday",
    mealType: "Breakfast",
    servings: 1,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch meal plan & recipes
  useEffect(() => {
    if (!planId || !token) return;

    const fetchMealPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch meal plan
        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch meal plan");
        }
        const data = await res.json();
        setMealPlan(data.mealPlan);

        // Fetch all recipes for dropdown
        const recipesRes = await fetch(`/api/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const recipesData = await recipesRes.json();
        setAvailableRecipes(recipesData.recipes || []);

        // Fetch full entries with recipe details
        const entriesPromises = data.mealPlan.entries.map(
          async (entry: MealPlanEntry) => {
            try {
              const r = await fetch(`/api/recipes/${entry.recipeId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!r.ok) return { ...entry, recipe: undefined };
              const recipeData = await r.json();
              return { ...entry, recipe: recipeData.recipe };
            } catch {
              return { ...entry, recipe: undefined };
            }
          }
        );

        const fullEntries = await Promise.all(entriesPromises);
        setEntriesWithRecipes(fullEntries);
      } catch (err: any) {
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [planId, token]);

  // --- CRUD Handlers ---

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealPlan || !token) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to add entry");
      }

      const data = await res.json();
      setEntriesWithRecipes((prev) => [...prev, data.entry]);
      setNewEntry({
        recipeId: "",
        dayOfWeek: "Monday",
        mealType: "Breakfast",
        servings: 1,
      });

      // Update global context
      setMealPlans((prev) =>
        prev.map((plan) =>
          plan._id === planId
            ? { ...plan, entries: [...plan.entries, data.entry] }
            : plan
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!token || !confirm("Delete this entry?")) return;
    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete entry");
      }

      setEntriesWithRecipes((prev) => prev.filter((e) => e._id !== entryId));
      setMealPlans((prev) =>
        prev.map((plan) =>
          plan._id === planId
            ? {
                ...plan,
                entries: plan.entries.filter((e) => e._id !== entryId),
              }
            : plan
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditEntry = async (
    entryId: string,
    updated: Partial<MealPlanEntry>
  ) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries/${entryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update entry");
      }

      const data = await res.json();
      setEntriesWithRecipes((prev) =>
        prev.map((e) => (e._id === entryId ? data.entry : e))
      );
      setMealPlans((prev) =>
        prev.map((plan) =>
          plan._id === planId
            ? {
                ...plan,
                entries: plan.entries.map((e) =>
                  e._id === entryId ? data.entry : e
                ),
              }
            : plan
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Render ---

  if (loading) return <p className={styles.message}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meal Plan Details</h1>
      <p>
        <strong>Week Start:</strong>{" "}
        {new Date(mealPlan.weekStartDate).toDateString()}
      </p>
      <p>
        <strong>Notes:</strong> {mealPlan.notes || "None"}
      </p>

      {/* Add New Entry Form */}
      <form className={styles.entryForm} onSubmit={handleAddEntry}>
        <h2>Add Entry</h2>

        {/* Recipe dropdown */}
        <select
          value={newEntry.recipeId}
          onChange={(e) =>
            setNewEntry({ ...newEntry, recipeId: e.target.value })
          }
          required
        >
          <option value="">Select a recipe</option>
          {availableRecipes.map((recipe) => (
            <option key={recipe._id} value={recipe._id}>
              {recipe.name}
            </option>
          ))}
        </select>

        {/* Day of week */}
        <select
          value={newEntry.dayOfWeek}
          onChange={(e) =>
            setNewEntry({ ...newEntry, dayOfWeek: e.target.value })
          }
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        {/* Meal type */}
        <select
          value={newEntry.mealType}
          onChange={(e) =>
            setNewEntry({ ...newEntry, mealType: e.target.value })
          }
        >
          {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
            <option key={meal} value={meal}>
              {meal}
            </option>
          ))}
        </select>

        {/* Servings */}
        <input
          type="number"
          min={1}
          value={newEntry.servings}
          onChange={(e) =>
            setNewEntry({ ...newEntry, servings: Number(e.target.value) })
          }
        />

        <button type="submit">Add Entry</button>
      </form>

      {/* List of entries */}
      {entriesWithRecipes.length > 0 && (
        <div className={styles.entries}>
          <h2>Entries</h2>
          <ul>
            {entriesWithRecipes.map((entry) => (
              <li key={entry._id}>
                {entry.dayOfWeek} - {entry.mealType} ({entry.servings} servings)
                {entry.recipe ? (
                  <>
                    {" "}
                    - <strong>{entry.recipe.name}</strong>
                    <ul>
                      {entry.recipe.ingredients.map((ing, i) => (
                        <li key={i}>
                          {ing.quantity} {ing.name}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  " (Recipe details not found)"
                )}
                <div className={styles.entryButtons}>
                  <button onClick={() => handleDeleteEntry(entry._id)}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const newServings = prompt(
                        "Update servings:",
                        String(entry.servings)
                      );
                      if (newServings)
                        handleEditEntry(entry._id, {
                          servings: Number(newServings),
                        });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
