// src/components/MealPlanEntryForm.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./MealPlanEntryForm.module.css";
import { MealPlanEntry } from "@/context/MealPlanContext";

export interface RecipeLite {
  _id: string;
  title: string;
  image?: string;
  source: "user" | "spoonacular";
}

export interface MealPlanEntryFormProps {
  mealPlanId?: string; // optional for parent-managed mode
  token?: string; // optional for parent-managed mode
  initialData?: MealPlanEntry;
  onSuccess?: (entry: MealPlanEntry) => void; // optional for parent-managed
  onCancel?: () => void;
  onChange?: (entry: MealPlanEntry) => void; // new prop for parent-managed
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

export default function MealPlanEntryForm({
  mealPlanId,
  token,
  initialData,
  onSuccess,
  onCancel,
  onChange,
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
  const [externalRecipes, setExternalRecipes] = useState<RecipeLite[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(initialData?._id && !onChange); // only API mode if no onChange

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch recipes live
  useEffect(() => {
    if (!searchQuery.trim() || !token) {
      setUserRecipes([]);
      setExternalRecipes([]);
      return;
    }

    let active = true;
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          `/api/recipes/search?q=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;

        const mappedUser: RecipeLite[] = (data.userRecipes || []).map(
          (r: any) => ({
            _id: r._id,
            title: r.name,
            image: r.image,
            source: "user",
          })
        );

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
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  const handleSelectRecipe = (id: string) => {
    setRecipeId(id);
    setShowDropdown(false);
    setSearchQuery("");
    // notify parent if in parent-managed mode
    if (onChange) onChange({ dayOfWeek, mealType, recipeId: id, servings });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeId) {
      setError("Please select a recipe.");
      return;
    }

    if (onChange) {
      // parent-managed mode: just notify parent
      onChange({ dayOfWeek, mealType, recipeId, servings });
      return;
    }

    // standalone mode: POST/PATCH API
    if (!mealPlanId || !token) return;
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

      onSuccess?.(data.entry as MealPlanEntry);
    } catch (err: any) {
      setError(err.message || "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.error}>{error}</p>}

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

      <label className={styles.label}>
        Day of Week
        <select
          value={dayOfWeek}
          onChange={(e) => {
            setDayOfWeek(e.target.value);
            onChange?.({
              dayOfWeek: e.target.value,
              mealType,
              recipeId,
              servings,
            });
          }}
          className={styles.select}
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
          value={mealType}
          onChange={(e) => {
            setMealType(e.target.value);
            onChange?.({
              dayOfWeek,
              mealType: e.target.value,
              recipeId,
              servings,
            });
          }}
          className={styles.select}
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
          value={servings}
          onChange={(e) => {
            const val = Number(e.target.value);
            setServings(val);
            onChange?.({ dayOfWeek, mealType, recipeId, servings: val });
          }}
          className={styles.input}
        />
      </label>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Remove
        </button>
      )}

      {isEditing && (
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Updating..." : "Update Entry"}
        </button>
      )}
    </form>
  );
}
