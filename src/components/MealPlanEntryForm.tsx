// path: src/components/MealPlanEntryForm.tsx
"use client";

/**
 * MealPlanEntryForm
 * -----------------
 * Handles creating or editing a meal plan entry.
 * Features:
 *  - Search for recipes (user + Spoonacular)
 *  - Select recipe from dropdown
 *  - Specify day, meal type, and servings
 *  - Submit via API (POST for new, PATCH for edit)
 *  - Fully typed with TypeScript
 */

import { useEffect, useState, useRef } from "react";
import styles from "./MealPlanEntryForm.module.css";
import { MealPlanEntry } from "@/context/MealPlanContext";

// Minimal recipe type for search dropdown
export interface RecipeLite {
  _id: string;
  title: string;
  image?: string;
  source: "user" | "spoonacular";
}

// Props for the MealPlanEntryForm component
export interface MealPlanEntryFormProps {
  mealPlanId: string; // ID of the parent meal plan
  token: string; // JWT auth token
  initialData?: MealPlanEntry; // Optional for editing
  onSuccess: (entry: MealPlanEntry) => void; // Callback after successful save
  onCancel?: () => void; // Optional cancel callback
}

// Dropdown options
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack"];

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
  const [externalRecipes, setExternalRecipes] = useState<RecipeLite[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(initialData?._id);

  // ----------------- Close dropdown on outside click -----------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------- Fetch recipes live -----------------
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserRecipes([]);
      setExternalRecipes([]);
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

        // Map external recipes (Spoonacular)
        const mappedExternal: RecipeLite[] = (
          data.spoonacularRecipes || []
        ).map((r: any) => ({
          _id: r._id,
          title: r.title,
          image: r.image,
          source: "spoonacular",
        }));

        setUserRecipes(mappedUser);
        setExternalRecipes(mappedExternal);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  // ----------------- Handle recipe selection -----------------
  const handleSelectRecipe = (id: string) => {
    setRecipeId(id);
    setShowDropdown(false);
    setSearchQuery("");
  };

  // ----------------- Submit form -----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Please select a recipe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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

      onSuccess(data.entry as MealPlanEntry);

      // Reset form if creating new
      if (!isEditing) {
        setRecipeId("");
        setMealType("Breakfast");
        setDayOfWeek("Monday");
        setServings(1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Render -----------------
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      {/* Recipe search input */}
      <label className={styles.label}>
        Recipe
        <input
          type="text"
          value={searchQuery || recipeId}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(!!searchQuery)}
          placeholder="Search or paste recipe ID"
          className={styles.input}
        />
        {showDropdown &&
          (userRecipes.length > 0 || externalRecipes.length > 0) && (
            <div className={styles.dropdown} ref={dropdownRef}>
              {userRecipes.length > 0 && (
                <>
                  <div className={styles.dropdownHeader}>Your Recipes</div>
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
              {externalRecipes.length > 0 && (
                <>
                  <div className={styles.dropdownHeader}>Spoonacular</div>
                  {externalRecipes.map((r) => (
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

      {/* Day of week */}
      <label className={styles.label}>
        Day of Week
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className={styles.select}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      {/* Meal type */}
      <label className={styles.label}>
        Meal Type
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className={styles.select}
        >
          {MEAL_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {/* Servings */}
      <label className={styles.label}>
        Servings
        <input
          type="number"
          min={1}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className={styles.input}
        />
      </label>

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Entry"
            : "Add Entry"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
