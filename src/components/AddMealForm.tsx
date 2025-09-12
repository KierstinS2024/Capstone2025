// Path: src/components/AddMealForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useMealPlan } from "@/context/MealPlanContext";
import { useGuest } from "@/context/GuestContext";
import type { MealType, MealPlanEntry } from "@/types/mealPlan";

interface AddMealFormProps {
  mealType: MealType;
  onClose: () => void;
}

/**
 * Modal form to search for recipes and add meals
 * Can add meals to user's plan or guest plan
 */
const AddMealForm: React.FC<AddMealFormProps> = ({ mealType, onClose }) => {
  const { addMeal } = useMealPlan();
  const { addMealToGuestPlan } = useGuest();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);

  /**
   * Fetch recipes from Spoonacular API
   */
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!searchQuery || searchQuery.length < 2) return;
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
            searchQuery
          )}&number=10&addRecipeInformation=true&apiKey=${
            process.env.NEXT_PUBLIC_SPOONACULAR_KEY
          }`
        );
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch (error) {
        console.error("Spoonacular fetch error:", error);
      }
    };

    const debounce = setTimeout(fetchRecipes, 300); // 300ms debounce
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  /**
   * Add selected recipe to user's meal plan
   */
  const handleAddMeal = () => {
    if (!selectedRecipe) return;

    const newMeal: MealPlanEntry = {
      date: new Date().toISOString(),
      mealType,
      recipeId: selectedRecipe.id.toString(),
      recipeTitle: selectedRecipe.title,
      recipeImage: selectedRecipe.image,
      ingredients: [],
    };

    addMeal(newMeal);
    onClose();
    alert(`${selectedRecipe.title} added to your ${mealType} plan!`);
  };

  /**
   * Add selected recipe to guest meal plan
   */
  const handleAddGuestMeal = () => {
    if (!selectedRecipe) return;

    addMealToGuestPlan(mealType, selectedRecipe.id.toString());
    onClose();
    alert(`${selectedRecipe.title} added to guest plan!`);
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
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 24,
          width: "90%",
          maxWidth: 500,
          maxHeight: "80vh",
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
            borderRadius: 4,
            border: "1px solid #ccc",
            marginBottom: 12,
          }}
        />

        {/* Recipe results */}
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 16 }}>
          {searchResults.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 4,
                cursor: "pointer",
                backgroundColor:
                  selectedRecipe?.id === recipe.id ? "#f4f1ed" : "transparent",
              }}
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                />
              )}
              <span>{recipe.title}</span>
            </li>
          ))}
        </ul>

        {/* Action buttons */}
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
            disabled={!selectedRecipe}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#3b82f6",
              color: "#fff",
              cursor: selectedRecipe ? "pointer" : "not-allowed",
            }}
          >
            Add to My Plan
          </button>
          <button
            onClick={handleAddGuestMeal}
            disabled={!selectedRecipe}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#22c55e",
              color: "#fff",
              cursor: selectedRecipe ? "pointer" : "not-allowed",
            }}
          >
            Add to Guest Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealForm;
