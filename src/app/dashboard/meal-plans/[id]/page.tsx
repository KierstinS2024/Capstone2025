// path: src/app/dashboard/meal-plans/[id]/page.tsx
"use client";

/**
 * MealPlanDetailPage
 *
 * Responsibilities:
 * - Fetch & display a single meal plan (date + notes)
 * - CRUD entries (add/edit/delete) via MealPlanEntryForm + EditMealPlanEntryModal
 * - Show recipe info for each entry (title fallback to ID if not found)
 * - Generate a shopping list preview by aggregating recipe ingredients
 *
 * Assumptions:
 * - /api/meal-plans/:id returns { mealPlan }
 * - /api/recipes/:id returns { recipe } with { _id, title, ingredients: [{ name, quantity, unit }] }
 * - Ingredient shape is flexible; aggregation is best-effort on (name + unit) keys.
 */

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMealPlanContext,
  MealPlan,
  MealPlanEntry,
} from "@/context/MealPlanContext";
import MealPlanEntryForm from "@/components/MealPlanEntryForm";
import EditMealPlanEntryModal from "@/components/EditMealPlanEntryModal";
import styles from "./MealPlanDetailPage.module.css";

type Recipe = {
  _id: string;
  title: string;
  ingredients?: { name: string; quantity?: number; unit?: string }[];
};

export default function MealPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { mealPlans, setMealPlans } = useMealPlanContext();

  // Ensure planId is always a string (App Router catch-all can be string|string[])
  const planId = typeof params.id === "string" ? params.id : "";

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add-entry form + edit-entry modal
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MealPlanEntry | null>(null);

  // For shopping list preview
  const [shoppingPreview, setShoppingPreview] = useState<
    { key: string; name: string; unit?: string; total: number }[]
  >([]);
  const [buildingPreview, setBuildingPreview] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Redirect to login if no token
  useEffect(() => {
    if (!token) router.push("/auth/login");
  }, [token, router]);

  // Fetch meal plan
  useEffect(() => {
    if (!planId || !token) return;

    async function fetchMealPlan() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/meal-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch meal plan");

        const mp: MealPlan = {
          ...data.mealPlan,
          // normalize entries to [] to avoid optional chaining noise in UI
          entries: Array.isArray(data.mealPlan.entries)
            ? data.mealPlan.entries
            : [],
        };

        setMealPlan(mp);
        setWeekStartDate(new Date(mp.weekStartDate).toISOString().slice(0, 10));
        setNotes(mp.notes || "");
      } catch (err: any) {
        setError(err.message || "Error loading meal plan");
      } finally {
        setLoading(false);
      }
    }

    fetchMealPlan();
  }, [planId, token]);

  // Save plan (date + notes)
  const handleUpdatePlan = async () => {
    if (!mealPlan || !token) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/meal-plans/${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekStartDate, notes }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update meal plan");

      const updated: MealPlan = {
        ...data.mealPlan,
        entries: Array.isArray(data.mealPlan.entries)
          ? data.mealPlan.entries
          : [],
      };

      setMealPlan(updated);
      setMealPlans(mealPlans.map((p) => (p._id === updated._id ? updated : p)));
      alert("Meal plan updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating meal plan");
    } finally {
      setSaving(false);
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!mealPlan || !token) return;
    if (!confirm("Delete this entry?")) return;

    try {
      const res = await fetch(`/api/meal-plans/${planId}/entries/${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete entry");

      setMealPlan({
        ...mealPlan,
        entries: mealPlan.entries.filter((e) => e._id !== entryId),
      });
    } catch (err: any) {
      alert(err.message || "Error deleting entry");
    }
  };

  // Add/Edit entry callback from forms
  const handleEntrySuccess = (entry: MealPlanEntry) => {
    if (!mealPlan) return;
    const exists = mealPlan.entries.some((e) => e._id === entry._id);
    const entries = exists
      ? mealPlan.entries.map((e) => (e._id === entry._id ? entry : e))
      : [...mealPlan.entries, entry];

    setMealPlan({ ...mealPlan, entries });
    setShowAddForm(false);
    setEditingEntry(null);
  };

  // Fetch a single recipe by ID
  const fetchRecipe = async (recipeId: string): Promise<Recipe | null> => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.recipe as Recipe;
    } catch {
      return null;
    }
  };

  // Build shopping list preview by aggregating ingredients across entries
  const buildShoppingPreview = async () => {
    if (!mealPlan) return;
    setBuildingPreview(true);

    try {
      const ingredientMap = new Map<
        string,
        { name: string; unit?: string; total: number }
      >();

      // Fetch each entry's recipe and accumulate ingredients
      for (const entry of mealPlan.entries) {
        const recipe = await fetchRecipe(entry.recipeId);
        const ings = recipe?.ingredients || [];
        for (const ing of ings) {
          const key = `${(ing.name || "").trim().toLowerCase()}::${(
            ing.unit || ""
          )
            .trim()
            .toLowerCase()}`;
          const current = ingredientMap.get(key) || {
            name: ing.name || "Unknown ingredient",
            unit: ing.unit,
            total: 0,
          };
          const qty = typeof ing.quantity === "number" ? ing.quantity : 0;
          // Multiply by servings if desired — simple approach: qty * entry.servings
          current.total += qty * (entry.servings || 1);
          ingredientMap.set(key, current);
        }
      }

      const preview = Array.from(ingredientMap.entries()).map(([key, v]) => ({
        key,
        name: v.name,
        unit: v.unit,
        total: v.total,
      }));

      setShoppingPreview(preview);
      if (preview.length === 0) {
        alert("No ingredients found from recipes to aggregate.");
      }
    } catch (err: any) {
      alert(err.message || "Error building shopping list preview");
    } finally {
      setBuildingPreview(false);
    }
  };

  const hasEntries = useMemo(
    () => (mealPlan?.entries?.length ?? 0) > 0,
    [mealPlan]
  );

  if (loading) return <p className={styles.message}>Loading meal plan...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!mealPlan) return <p className={styles.error}>Meal plan not found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meal Plan Details</h1>

      {/* Editable base info */}
      <div className={styles.formRow}>
        <label className={styles.label}>
          Week Start Date
          <input
            type="date"
            value={weekStartDate}
            onChange={(e) => setWeekStartDate(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes for this week..."
            className={styles.textarea}
          />
        </label>

        <button
          className={styles.updateButton}
          onClick={handleUpdatePlan}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Entries */}
      <h2 className={styles.subtitle}>Entries</h2>

      {showAddForm ? (
        <MealPlanEntryForm
          mealPlanId={mealPlan._id}
          token={token!}
          onSuccess={handleEntrySuccess}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          + Add Entry
        </button>
      )}

      {!hasEntries ? (
        <p className={styles.empty}>No entries yet.</p>
      ) : (
        <ul className={styles.entryList}>
          {mealPlan.entries.map((entry) => (
            <EntryRow
              key={entry._id}
              entry={entry}
              onEdit={() => setEditingEntry(entry)}
              onDelete={() => handleDeleteEntry(entry._id)}
              token={token!}
            />
          ))}
        </ul>
      )}

      {/* Shopping list preview */}
      <div className={styles.previewSection}>
        <div className={styles.previewHeader}>
          <h2 className={styles.subtitle}>Shopping List Preview</h2>
          <button
            className={styles.previewButton}
            onClick={buildShoppingPreview}
            disabled={buildingPreview || !hasEntries}
            title={
              !hasEntries
                ? "Add at least one entry first"
                : "Build from recipe ingredients"
            }
          >
            {buildingPreview ? "Building..." : "Build from Entries"}
          </button>
        </div>

        {shoppingPreview.length > 0 && (
          <div className={styles.previewGrid}>
            {shoppingPreview.map((item) => (
              <div key={item.key} className={styles.previewItem}>
                <div className={styles.previewName}>{item.name}</div>
                <div className={styles.previewQty}>
                  {item.total} {item.unit || ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <EditMealPlanEntryModal
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          entry={editingEntry}
          mealPlanId={mealPlan._id}
          token={token!}
          onUpdate={handleEntrySuccess}
        />
      )}
    </div>
  );
}

/**
 * EntryRow
 * Shows one entry with fetched recipe title for nice UX
 */
function EntryRow({
  entry,
  onEdit,
  onDelete,
  token,
}: {
  entry: MealPlanEntry;
  onEdit: () => void;
  onDelete: () => void;
  token: string;
}) {
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/recipes/${entry.recipeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active) setTitle(data.recipe?.title || "");
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [entry.recipeId, token]);

  return (
    <li className={styles.entryItem}>
      <div className={styles.entryMain}>
        <div className={styles.entryTitle}>
          <strong>
            {entry.dayOfWeek} — {entry.mealType}
          </strong>
          <span className={styles.entryRecipe}>
            {title ? ` • ${title}` : ` • Recipe: ${entry.recipeId}`}
          </span>
        </div>
        <div className={styles.entryMeta}>Servings: {entry.servings}</div>
      </div>

      <div className={styles.entryActions}>
        <button className={styles.editButton} onClick={onEdit}>
          Edit
        </button>
        <button className={styles.deleteButton} onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
