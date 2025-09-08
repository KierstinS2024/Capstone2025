// Path: src/components/FoodIntakeForm.tsx
"use client";

/**
 * FoodIntakeForm
 * -----------------
 * Reusable form component for creating or editing food intake entries.
 * Props:
 * - initialValues?: FoodIntakeFormType - pre-populated data for editing
 * - recipes: Recipe[] - available recipes for dropdown
 * - ingredients: IngredientBody[] - available ingredients for dropdown
 * - onSubmit: function called with form data on submit
 * - loading?: boolean - disables form while submitting
 */

import { useForm, SubmitHandler } from "react-hook-form"; // <--- import added
import { IngredientBody } from "@/types/ingredient";
import { Recipe } from "@/types/recipe";
import { FoodIntakeForm as FoodIntakeFormType } from "@/types/foodIntakeForm";

interface Props {
  initialValues?: FoodIntakeFormType;
  recipes: Recipe[];
  ingredients: IngredientBody[]; // IngredientBody._id can be undefined
  onSubmit: (data: FoodIntakeFormType) => void;
  loading?: boolean;
}

export default function FoodIntakeForm({
  initialValues,
  recipes,
  ingredients,
  onSubmit,
  loading = false,
}: Props) {
  // Filter out ingredients without _id
  const validIngredients = ingredients.filter((i) => i._id);

  // useForm setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodIntakeFormType>({
    defaultValues: initialValues || {
      date: new Date().toISOString().slice(0, 10),
      mealType: "breakfast",
      quantity: 1,
      unit: "",
    },
  });

  const onSubmitHandler: SubmitHandler<FoodIntakeFormType> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {/* Date */}
      <label>
        Date *
        <input type="date" {...register("date", { required: true })} />
        {errors.date && <span>Date is required</span>}
      </label>

      {/* Meal Type */}
      <label>
        Meal Type *
        <select {...register("mealType", { required: true })}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </label>

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
        <input
          type="number"
          step="0.01"
          {...register("quantity", { required: true, min: 0.01 })}
        />
        {errors.quantity && <span>Quantity required</span>}
      </label>

      {/* Unit */}
      <label>
        Unit *
        <input type="text" {...register("unit", { required: true })} />
        {errors.unit && <span>Unit required</span>}
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
