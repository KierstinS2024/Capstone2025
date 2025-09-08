// Path: src/components/FoodIntakeForm.tsx
"use client";

/**
 * FoodIntakeForm
 * -----------------
 * Reusable form for logging or editing food intake entries.
 * - Uses react-hook-form + Zod schema for validation.
 * - Ensures mutual exclusivity between recipe and ingredient selection.
 * - Provides user-friendly inline hints and error messages.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe } from "@/types/recipe";
import { IngredientBody } from "@/types/ingredient";
import {
  foodIntakeFormSchema,
  type FoodIntakeFormType,
} from "@/schemas/food-intake/foodIntakeForm";

interface Props {
  initialValues?: FoodIntakeFormType; // pre-fill form if editing
  recipes: Recipe[]; // recipes for dropdown
  ingredients: IngredientBody[]; // ingredients for dropdown
  onSubmit: (data: FoodIntakeFormType) => void; // submit handler
  loading?: boolean; // disable submit button while saving
}

export default function FoodIntakeForm({
  initialValues,
  recipes,
  ingredients,
  onSubmit,
  loading = false,
}: Props) {
  // Filter out any ingredients without valid IDs
  const validIngredients = ingredients.filter((i) => i._id);

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FoodIntakeFormType>({
    resolver: zodResolver(foodIntakeFormSchema),
    defaultValues: initialValues || {
      date: new Date().toISOString().slice(0, 10),
      mealType: "breakfast",
      quantity: 1,
      unit: "",
      recipeId: "",
      ingredientId: "",
    },
  });

  // Watch both fields to enforce mutual exclusivity
  const recipeId = watch("recipeId");
  const ingredientId = watch("ingredientId");

  // If both are selected, clear the other
  if (recipeId && ingredientId) setValue("ingredientId", "");
  if (ingredientId && recipeId) setValue("recipeId", "");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Date */}
      <label>
        Date *
        <input type="date" {...register("date")} />
        {errors.date && <span>{errors.date.message}</span>}
      </label>

      {/* Meal Type */}
      <label>
        Meal Type *
        <select {...register("mealType")}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        {errors.mealType && <span>{errors.mealType.message}</span>}
      </label>

      {/* User hint */}
      <p style={{ fontStyle: "italic", color: "#555" }}>
        Choose either a recipe or an ingredient, not both.
      </p>

      {/* Recipe */}
      <label>
        Recipe
        <select {...register("recipeId")}>
          <option value="">Select recipe</option>
          {recipes.map((r) => (
            <option key={r._id} value={r._id}>
              {r.title}
            </option>
          ))}
        </select>
      </label>

      {/* Ingredient */}
      <label>
        Ingredient
        <select {...register("ingredientId")}>
          <option value="">Select ingredient</option>
          {validIngredients.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name}
            </option>
          ))}
        </select>
      </label>

      {/* Quantity */}
      <label>
        Quantity *
        <input type="number" step="0.01" {...register("quantity")} />
        {errors.quantity && <span>{errors.quantity.message}</span>}
      </label>

      {/* Unit */}
      <label>
        Unit *
        <input type="text" {...register("unit")} />
        {errors.unit && <span>{errors.unit.message}</span>}
      </label>

      {/* Submit button */}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
