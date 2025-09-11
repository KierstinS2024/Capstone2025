import React, { useState } from "react";
import type { MealType } from "@/types/mealPlan";
import { useMealPlan } from "@/context/MealPlanContext";

interface AddMealFormProps {
  mealType: MealType;
  onClose: () => void;
}

export const AddMealForm: React.FC<AddMealFormProps> = ({
  mealType,
  onClose,
}) => {
  const { todayMeals, setTodayMeals } = useMealPlan();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");

  const handleSubmit = () => {
    setTodayMeals([
      ...todayMeals,
      {
        date: new Date().toISOString().slice(0, 10),
        mealType,
        recipeId: selectedRecipeId,
        recipeTitle: "Sample Recipe",
        recipeImage: "/placeholder-recipe.jpg",
        ingredients: [],
      },
    ]);
    onClose();
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <h3>Add {mealType}</h3>
      <input
        placeholder="Recipe ID"
        value={selectedRecipeId}
        onChange={(e) => setSelectedRecipeId(e.target.value)}
        style={{ width: "100%", marginBottom: "12px", padding: "6px" }}
      />
      <button onClick={handleSubmit}>Add Meal</button>
      <button onClick={onClose} style={{ marginLeft: "12px" }}>
        Cancel
      </button>
    </div>
  );
};
