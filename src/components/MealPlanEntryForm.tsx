// src/components/MealPlanEntryForm.tsx
"use client";

import { useEffect, useState, useRef } from "react";

// --- Types ---
export interface MealPlanEntry {
  _id: string;
  dayOfWeek: string;
  mealType: string;
  recipeId: string;
  servings: number;
}

export interface RecipeLite {
  _id: string;
  title: string;
  image?: string;
  source: "user" | "spoonacular";
}

export interface MealPlanEntryFormProps {
  mealPlanId: string;
  token: string;
  initialData?: Partial<MealPlanEntry>;
  onSuccess: (entry: MealPlanEntry) => void;
  onCancel?: () => void;
}

// --- Constants ---
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

// --- Component ---
export default function MealPlanEntryForm({
  mealPlanId,
  token,
  initialData,
  onSuccess,
  onCancel,
}: MealPlanEntryFormProps) {
  const [entry, setEntry] = useState<MealPlanEntry>({
    _id: initialData?._id || Date.now().toString(),
    dayOfWeek: initialData?.dayOfWeek || "Monday",
    mealType: initialData?.mealType || "Breakfast",
    recipeId: initialData?.recipeId || "",
    servings: initialData?.servings || 1,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [userRecipes, setUserRecipes] = useState<RecipeLite[]>([]);
  const [externalRecipes, setExternalRecipes] = useState<RecipeLite[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isEditing = Boolean(initialData?._id);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recipe search
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

        setUserRecipes(
          (data.userRecipes || []).map((r: any) => ({
            _id: r._id,
            title: r.name,
            image: r.image,
            source: "user",
          }))
        );
        setExternalRecipes(
          (data.spoonacularRecipes || []).map((r: any) => ({
            _id: r._id,
            title: r.title,
            image: r.image,
            source: "spoonacular",
          }))
        );
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const debounce = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, token]);

  const handleSelectRecipe = (id: string) => {
    setEntry((prev) => ({ ...prev, recipeId: id }));
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleChange = (field: keyof MealPlanEntry, value: string | number) => {
    setEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.recipeId) {
      setError("Please select a recipe.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API call can be added here for real persistence
      onSuccess(entry);
    } catch (err: any) {
      setError(err.message || "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Recipe search */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search or paste recipe ID"
          value={searchQuery || entry.recipeId}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(!!searchQuery)}
          style={{ padding: "6px" }}
        />
        {showDropdown && (userRecipes.length || externalRecipes.length) > 0 && (
          <div
            style={{
              position: "absolute",
              top: "36px",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 10,
            }}
          >
            {userRecipes.length > 0 && (
              <>
                <div style={{ fontWeight: "bold", padding: "4px" }}>
                  Your Recipes
                </div>
                {userRecipes.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectRecipe(r._id)}
                  >
                    {r.image && (
                      <img
                        src={r.image}
                        alt=""
                        style={{ width: 30, height: 30, marginRight: 4 }}
                      />
                    )}
                    <div>{r.title}</div>
                  </div>
                ))}
              </>
            )}
            {externalRecipes.length > 0 && (
              <>
                <div style={{ fontWeight: "bold", padding: "4px" }}>
                  Spoonacular
                </div>
                {externalRecipes.map((r) => (
                  <div
                    key={r._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectRecipe(r._id)}
                  >
                    {r.image && (
                      <img
                        src={r.image}
                        alt=""
                        style={{ width: 30, height: 30, marginRight: 4 }}
                      />
                    )}
                    <div>{r.title}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Day of Week */}
      <select
        value={entry.dayOfWeek}
        onChange={(e) => handleChange("dayOfWeek", e.target.value)}
      >
        {DAYS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Meal Type */}
      <select
        value={entry.mealType}
        onChange={(e) => handleChange("mealType", e.target.value)}
      >
        {MEAL_TYPES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Servings */}
      <input
        type="number"
        min={1}
        value={entry.servings}
        onChange={(e) => handleChange("servings", Number(e.target.value))}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "4px" }}>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEditing ? "Update Entry" : "Add Entry"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
