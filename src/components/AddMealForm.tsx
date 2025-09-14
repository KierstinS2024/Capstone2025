// path: src/components/AddMealForm.tsx
"use client";

import React, { useState } from "react";
import { Meal } from "@/types/mealPlan";
import { useShoppingList } from "@/context/ShoppingListContext";

interface AddMealFormProps {
  onAdd: (meal: Meal) => void;
}

export function AddMealForm({ onAdd }: AddMealFormProps) {
  const { addItem } = useShoppingList();

  const [mealName, setMealName] = useState("");
  const [mealDesc, setMealDesc] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", category: "other" },
  ]);
  const [addIngredientsToList, setAddIngredientsToList] = useState(true);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName.trim(),
      description: mealDesc.trim(),
      ingredients: ingredients.filter((ing) => ing.name.trim() !== ""),
    };

    onAdd(newMeal);

    if (addIngredientsToList && newMeal.ingredients) {
      for (const ing of newMeal.ingredients) {
        await addItem(ing.name, ing.category || "other");
      }
    }

    // Reset form
    setMealName("");
    setMealDesc("");
    setIngredients([{ name: "", category: "other" }]);
    setAddIngredientsToList(true);
  };

  const handleIngredientChange = (
    index: number,
    key: "name" | "category",
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing))
    );
  };

  const handleAddIngredientRow = () =>
    setIngredients((prev) => [...prev, { name: "", category: "other" }]);
  const handleRemoveIngredientRow = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  return (
    <form className="add-meal-form" onSubmit={handleAddMeal}>
      <input
        type="text"
        placeholder="Meal name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        className="input"
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={mealDesc}
        onChange={(e) => setMealDesc(e.target.value)}
        className="textarea"
      />
      <fieldset className="ingredients-fieldset">
        <legend>Ingredients (optional)</legend>
        {ingredients.map((ing, i) => (
          <div key={i} className="ingredient-row">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ing.name}
              onChange={(e) =>
                handleIngredientChange(i, "name", e.target.value)
              }
              className="input small"
            />
            <select
              value={ing.category}
              onChange={(e) =>
                handleIngredientChange(i, "category", e.target.value)
              }
              className="select small"
            >
              <option value="produce">Produce</option>
              <option value="meat">Meat</option>
              <option value="dairy">Dairy</option>
              <option value="frozen">Frozen</option>
              <option value="other">Other</option>
            </select>
            <button
              type="button"
              className="remove-button"
              onClick={() => handleRemoveIngredientRow(i)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button small"
          onClick={handleAddIngredientRow}
        >
          + Add Ingredient
        </button>
      </fieldset>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={addIngredientsToList}
          onChange={(e) => setAddIngredientsToList(e.target.checked)}
        />
        Add ingredients to shopping list
      </label>

      <button type="submit" className="button">
        Add Meal
      </button>
    </form>
  );
}
