// Path: src/components/AddMealForm.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";
import type { MealType, MealPlanEntry } from "@/types/mealPlan";

interface AddMealFormProps {
  mealType: MealType;
  onClose: () => void;
}

const AddMealForm: React.FC<AddMealFormProps> = ({ mealType, onClose }) => {
  const { recipes } = useRecipes();
  const { addMeal } = useMealPlan();

  const [search, setSearch] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Filter recipes by search term
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [recipes, search]);

  const selectedRecipe = recipes.find((r) => r._id === selectedRecipeId);

  // ✅ Add to authenticated user meal plan
  const handleAddMeal = () => {
    if (!selectedRecipe) return;

    const mealEntry: MealPlanEntry = {
      date: new Date().toISOString(),
      mealType,
      recipeId: selectedRecipe._id,
      recipeTitle: selectedRecipe.title,
      recipeImage: selectedRecipe.image,
      ingredients: selectedRecipe.ingredients,
    };

    addMeal(mealEntry);
    onClose();
    alert(`${selectedRecipe.title} added to your ${mealType} plan!`);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 24,
          maxWidth: 500,
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
          Add {mealType}
        </h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        {/* Recipe List */}
        <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}>
          {filteredRecipes.length ? (
            filteredRecipes.map((r) => (
              <div
                key={r._id}
                onClick={() => setSelectedRecipeId(r._id)}
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  marginBottom: "6px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedRecipeId === r._id ? "#dbeafe" : "#f9f9f9",
                  border:
                    selectedRecipeId === r._id
                      ? "2px solid #3b82f6"
                      : "1px solid #ddd",
                }}
              >
                <strong>{r.title}</strong>
              </div>
            ))
          ) : (
            <p style={{ fontStyle: "italic", color: "#777" }}>
              No recipes found.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#ccc",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleAddMeal}
            disabled={!selectedRecipeId}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: selectedRecipeId ? "#3b82f6" : "#9ca3af",
              color: "white",
              cursor: selectedRecipeId ? "pointer" : "not-allowed",
            }}
          >
            Add Meal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealForm;
