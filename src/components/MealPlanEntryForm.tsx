// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Used for both:
 * - Creating a new entry (POST /api/meal-plans/:id/entries)
 * - Editing an existing entry (PATCH /api/meal-plans/:id/entries/:entryId)
 *
 * Features:
 * - Live search for recipes (user + Spoonacular)
 * - Cards with images for intuitive selection
 * - Manual recipe ID input fallback
 */

import React, { useEffect, useMemo, useState, useRef } from "react";
import styles from "./MealPlanEntryForm.module.css";

export interface MealPlanEntryFormProps {
  mealPlanId: string;
  token: string;
  initialData?: {
    _id?: string;
    recipeId: string;
    mealType: string;
    dayOfWeek: string;
    servings: number;
  };
  onSuccess: (entry: any) => void;
  onCancel?: () => void;
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

type RecipeLite = {
  _id: string;
  title: string;
  image?: string;
  source: "user" | "spoonacular";
};

export default function MealPlanEntryForm({
  mealPlanId,
  token,
  initialData,
  onSuccess,
  onCancel,
}: MealPlanEntryFormProps) {
  const [recipeId, setRecipeId] = useState(initialData?.recipeId || "");
  const [mealType, setMealType] = useState(
    initialData?.mealType || "Breakfast"
  );
  const [dayOfWeek, setDayOfWeek] = useState(
    initialData?.dayOfWeek || "Monday"
  );
  const [servings, setServings] = useState(initialData?.servings || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [userRecipes, setUserRecipes] = useState<RecipeLite[]>([]);
  const [spoonacularRecipes, setSpoonacularRecipes] = useState<RecipeLite[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const isEditing = Boolean(initialData?._id);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserRecipes([]);
      setSpoonacularRecipes([]);
      return;
    }

    let active = true;

    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `/api/recipes/search?q=${encodeURIComponent(searchQuery)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;

        const mapUser: RecipeLite[] = (data.userRecipes || []).map(
          (r: any) => ({
            _id: r._id,
            title: r.name,
            image: r.image,
            source: "user",
          })
        );
        const mapSpoon: RecipeLite[] = (data.spoonacularRecipes || []).map(
          (r: any) => ({
            _id: r._id,
            title: r.title,
            image: r.image,
            source: "spoonacular",
          })
        );

        setUserRecipes(mapUser);
        setSpoonacularRecipes(mapSpoon);
        setShowDropdown(true);
      } catch {
        // ignore
      }
    };

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  const handleSelectRecipe = (id: string) => {
    setRecipeId(id);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Please select or enter a recipe.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const endpoint = isEditing
        ? `/api/meal-plans/${mealPlanId}/entries/${initialData!._id}`
        : `/api/meal-plans/${mealPlanId}/entries`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId, mealType, dayOfWeek, servings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save entry");

      onSuccess(data.entry);

      if (!isEditing) {
        setRecipeId("");
        setMealType("Breakfast");
        setDayOfWeek("Monday");
        setServings(1);
      }
    } catch (err: any) {
      setError(err.message || "Error saving entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      {/* Recipe search + card dropdown */}
      <label className={styles.label}>
        Recipe
        <input
          type="text"
          className={styles.input}
          placeholder="Search recipes or paste ID"
          value={searchQuery || recipeId}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(!!searchQuery)}
        />
        {showDropdown &&
          (userRecipes.length > 0 || spoonacularRecipes.length > 0) && (
            <div className={styles.dropdown} ref={dropdownRef}>
              {userRecipes.length > 0 && (
                <>
                  <div style={{ padding: "0.5rem", fontWeight: 600 }}>
                    Your Recipes
                  </div>
                  {userRecipes.map((r) => (
                    <div
                      key={r._id}
                      className={styles.card}
                      onClick={() => handleSelectRecipe(r._id)}
                    >
                      {r.image && (
                        <img src={r.image} className={styles.thumbnail} />
                      )}
                      <div className={styles.cardText}>
                        <div className={styles.cardTitle}>{r.title}</div>
                        <div className={styles.cardSource}>User</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {spoonacularRecipes.length > 0 && (
                <>
                  <div style={{ padding: "0.5rem", fontWeight: 600 }}>
                    Spoonacular
                  </div>
                  {spoonacularRecipes.map((r) => (
                    <div
                      key={r._id}
                      className={styles.card}
                      onClick={() => handleSelectRecipe(r._id)}
                    >
                      {r.image && (
                        <img src={r.image} className={styles.thumbnail} />
                      )}
                      <div className={styles.cardText}>
                        <div className={styles.cardTitle}>{r.title}</div>
                        <div className={styles.cardSource}>Spoonacular</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
      </label>

      <label className={styles.label}>
        Day of Week
        <select
          className={styles.select}
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Meal Type
        <select
          className={styles.select}
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          {MEAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        Servings
        <input
          type="number"
          min={1}
          className={styles.input}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
      </label>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Updating…"
              : "Adding…"
            : isEditing
            ? "Update Entry"
            : "Add Entry"}
        </button>
        {onCancel && (
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
