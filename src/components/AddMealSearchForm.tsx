// Path: src/components/AddMealSearchForm.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { useMealPlan } from "@/context/MealPlanContext";
import { useGuest } from "@/context/GuestContext";
import type { MealType, MealPlanEntry } from "@/types/mealPlan";

interface AddMealSearchFormProps {
  mealType: MealType;
  onClose: () => void;
}

const AddMealSearchForm: React.FC<AddMealSearchFormProps> = ({
  mealType,
  onClose,
}) => {
  const { recipes } = useRecipes();
  const { addMeal } = useMealPlan();
  const { addMealToGuestPlan } = useGuest();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Filter recipes by search query
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, recipes]);

  // Find selected recipe
  const selectedRecipe = selectedRecipeId
    ? recipes.find((r) => r._id === selectedRecipeId) || null
    : null;

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

  const handleAddGuestMeal = () => {
    if (!selectedRecipeId) return;
    addMealToGuestPlan(mealType, selectedRecipeId);
    onClose();
    alert(`${selectedRecipe?.title || "Recipe"} added to guest plan!`);
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
          width: "90%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
          Add {mealType}
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 16,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        {/* Recipe list */}
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}>
          {filteredRecipes.map((r) => (
            <div
              key={r._id}
              onClick={() => setSelectedRecipeId(r._id)}
              style={{
                padding: 8,
                marginBottom: 4,
                borderRadius: 4,
                cursor: "pointer",
                backgroundColor:
                  selectedRecipeId === r._id ? "#f4f1ed" : "transparent",
                border:
                  selectedRecipeId === r._id
                    ? "1px solid #6b4c3b"
                    : "1px solid transparent",
              }}
            >
              {r.title}
            </div>
          ))}
          {filteredRecipes.length === 0 && (
            <p style={{ fontStyle: "italic", color: "#8b7d70" }}>
              No recipes match your search.
            </p>
          )}
        </div>

        {/* Preview of selected recipe */}
        {selectedRecipe && (
          <div
            style={{
              border: "1px solid #d8cfc4",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              backgroundColor: "#fdfbf9",
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
              {selectedRecipe.title}
            </h3>
            {selectedRecipe.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              />
            )}
            <ul style={{ fontSize: 14 }}>
              {selectedRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>
                  {ing.quantity} {ing.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
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
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add to My Plan
          </button>
          <button
            onClick={handleAddGuestMeal}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#22c55e",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add to Guest Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealSearchForm;
