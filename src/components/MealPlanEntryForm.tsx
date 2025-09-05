// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 *
 * Handles both creating a new meal plan entry and editing an existing one.
 * Features:
 * - Search recipes (user and Spoonacular)
 * - Select recipe by clicking a card
 * - Specify day, meal type, and servings
 * - Submit to API (POST for new, PATCH for edit)
 */

import React, { useEffect, useState, useRef } from "react";
import styles from "./MealPlanEntryForm.module.css";

// Props for the form
export interface MealPlanEntryFormProps {
  mealPlanId: string; // ID of the meal plan
  token: string; // JWT token
  initialData?: {
    _id?: string; // Optional ID if editing
    recipeId: string;
    mealType: string;
    dayOfWeek: string;
    servings: number;
  };
  onSuccess: (entry: any) => void; // Callback when entry saved
  onCancel?: () => void; // Optional cancel callback
}

// Constants for dropdown options
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

// Minimal recipe type for dropdown display
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
  // ----------------- Form state -----------------
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

  // ----------------- Recipe search state -----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [userRecipes, setUserRecipes] = useState<RecipeLite[]>([]);
  const [spoonacularRecipes, setSpoonacularRecipes] = useState<RecipeLite[]>(
    []
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const isEditing = Boolean(initialData?._id);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ----------------- Close dropdown when clicking outside -----------------
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------- Live search for recipes -----------------
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

        // Map user recipes
        const mappedUser: RecipeLite[] = (data.userRecipes || []).map(
          (r: any) => ({
            _id: r._id,
            title: r.name,
            image: r.image,
            source: "user",
          })
        );

        // Map Spoonacular recipes
        const mappedSpoon: RecipeLite[] = (data.spoonacularRecipes || []).map(
          (r: any) => ({
            _id: r._id,
            title: r.title,
            image: r.image,
            source: "spoonacular",
          })
        );

        setUserRecipes(mappedUser);
        setSpoonacularRecipes(mappedSpoon);
        setShowDropdown(true);
      } catch {
        // ignore errors silently
      }
    };

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  // ----------------- Select recipe -----------------
  const handleSelectRecipe = (id: string) => {
    setRecipeId(id);
    setShowDropdown(false);
    setSearchQuery("");
  };

  // ----------------- Submit form -----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Please select or enter a recipe.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine API endpoint and method
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
        // Reset form for next entry
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

      {/* Recipe search input */}
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
        {/* Dropdown with recipe cards */}
        {showDropdown &&
          (userRecipes.length > 0 || spoonacularRecipes.length > 0) && (
            <div className={styles.dropdown} ref={dropdownRef}>
              {/* User recipes */}
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

              {/* Spoonacular recipes */}
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

      {/* Day of week selector */}
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

      {/* Meal type selector */}
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

      {/* Servings input */}
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

      {/* Action buttons */}
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
