// Path: src/components/AddMealForm.tsx
"use client";

import React from "react";
import { useGuest } from "@/context/GuestContext";
import type { MealType } from "@/types/mealPlan";

interface AddMealFormProps {
  mealType: MealType; // the meal type being edited (Breakfast/Lunch/Dinner)
  onClose: () => void; // callback to close the modal
}

export const AddMealForm: React.FC<AddMealFormProps> = ({
  mealType,
  onClose,
}) => {
  const { guestRecipes, addMealToGuestPlan } = useGuest();

  // Handle selecting a recipe for the meal
  const handleSelectRecipe = (recipeId: string) => {
    addMealToGuestPlan(mealType, recipeId);
    onClose();
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
          padding: "24px",
          borderRadius: "10px",
          minWidth: "350px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Select a recipe for {mealType}
        </h2>

        {/* Guest recipe selection */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "12px",
          }}
        >
          {guestRecipes.map((recipe) => (
            <div
              key={recipe._id}
              onClick={() => handleSelectRecipe(recipe._id)}
              style={{
                padding: "12px",
                border: "1px solid #d8cfc4",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                backgroundColor: "#f9f6f2",
              }}
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "6px",
                    objectFit: "cover",
                  }}
                />
              )}
              <span>{recipe.title}</span>
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: "#ccc",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
