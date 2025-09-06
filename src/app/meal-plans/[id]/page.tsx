// path: src/app/dashboard/meal-plans/[id]/MealPlanDetailPage.tsx
"use client";

/**
 * MealPlanDetailPage
 * -----------------
 * - Fetches a meal plan and recipes
 * - Displays entries in a kanban-style board
 * - Supports adding, editing, deleting entries
 * - Fully type-safe with MealPlanEntryWithId
 */

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMealPlanContext,
  MealPlan,
  MealPlanEntry,
} from "@/context/MealPlanContext";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import DayColumn from "@/components/DayColumn";
import AddEntryForm from "@/components/AddEntryForm";
import SortableEntry from "@/components/SortableEntry";

// --- Types ---
interface ObjectId {
  $oid: string;
}

export interface MealPlanEntryWithId extends MealPlanEntry {
  _id: string;
  recipeId: ObjectId;
}

// --- Component ---
export default function MealPlanDetailPage() {
  const { mealPlans, setMealPlans } = useMealPlanContext();
  const router = useRouter();
  const params = useParams();
  const planId = typeof params?.id === "string" ? params.id : "";

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [entriesWithRecipes, setEntriesWithRecipes] = useState<
    MealPlanEntryWithId[]
  >([]);
  const [availableRecipes, setAvailableRecipes] = useState<
    { _id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // --- Fetch meal plan & recipes ---
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
        if (!res.ok) throw new Error("Failed to fetch meal plan");
        const data = await res.json();

        setMealPlan(data.mealPlan);

        // Map entries to MealPlanEntryWithId
        const mappedEntries: MealPlanEntryWithId[] = (
          data.mealPlan.entries || []
        ).map((entry: any) => ({
          ...entry,
          _id: entry._id,
          recipeId:
            typeof entry.recipeId === "string"
              ? { $oid: entry.recipeId }
              : entry.recipeId,
        }));

        setEntriesWithRecipes(mappedEntries);

        // Fetch recipes for dropdown
        const recipesRes = await fetch("/api/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const recipesData = await recipesRes.json();
        setAvailableRecipes(recipesData.recipes || []);
      } catch (err: any) {
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [planId, token]);

  // --- Drag and Drop handler ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = entriesWithRecipes.findIndex((e) => e._id === active.id);
    const newIndex = entriesWithRecipes.findIndex((e) => e._id === over.id);
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      setEntriesWithRecipes((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mealPlan) return <p>Meal plan not found.</p>;

  // --- Split entries by day ---
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const entriesByDay: Record<string, MealPlanEntryWithId[]> = {};
  daysOfWeek.forEach((day) => {
    entriesByDay[day] = entriesWithRecipes.filter((e) => e.dayOfWeek === day);
  });

  return (
    <div>
      <h1>
        Meal Plan - Week of {new Date(mealPlan.weekStartDate).toDateString()}
      </h1>
      <p>Notes: {mealPlan.notes || "None"}</p>

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: "1rem" }}>
          {daysOfWeek.map((day) => (
            <DayColumn
              key={day}
              day={day}
              entries={entriesByDay[day]}
              availableRecipes={availableRecipes}
            >
              <SortableContext
                items={entriesByDay[day].map((e) => e._id)}
                strategy={verticalListSortingStrategy}
              >
                {entriesByDay[day].map((entry) => (
                  <SortableEntry key={entry._id} entry={entry} />
                ))}
              </SortableContext>
              <AddEntryForm day={day} availableRecipes={availableRecipes} />
            </DayColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
