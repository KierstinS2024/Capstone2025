// Path: src/components/MealPlanForm.tsx
"use client";

/**
 * MealPlanForm
 * -----------------
 * Reusable form component for creating or editing meal plans.
 * Features:
 * - Uses react-hook-form with Zod validation
 * - Allows selecting recipes per day & meal type
 * - Dynamic entries table (add/remove entries)
 * - Can be used for both creating and editing meal plans
 */

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe } from "@/types/recipe";
import {
  mealPlanFormSchema,
  type MealPlanFormSchema,
} from "@/schemas/mealPlanForm";

interface Props {
  initialValues?: MealPlanFormSchema;
  recipes: Recipe[];
  onSubmit: (data: MealPlanFormSchema) => void;
  loading?: boolean;
}

// Days and meal types constants
const DAYS_OF_WEEK = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
const MEAL_TYPES = ["breakfast","lunch","dinner","snack"] as const;

export default function MealPlanForm({
  initialValues,
  recipes,
  onSubmit,
  loading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MealPlanFormSchema>({
    resolver: zodResolver(mealPlanFormSchema),
    defaultValues: initialValues || {
      weekStartDate: new Date().toISOString().slice(0, 10),
      notes: "",
      entries: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entries",
  });

  // Add new entry template
  const addEntry = () =>
    append({
      dayOfWeek: "Monday",
      mealType: "breakfast",
      recipeId: "",
      servings: 1,
    });

  const onSubmitHandler: SubmitHandler<MealPlanFormSchema> = (data) =>
    onSubmit(data);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {/* Week Start Date */}
      <label>
        Week Start Date *
        <input type="date" {...register("weekStartDate")} />
        {errors.weekStartDate && <span>{errors.weekStartDate.message}</span>}
      </label>

      {/* Notes */}
      <label>
        Notes
        <textarea {...register("notes")} />
        {errors.notes && <span>{errors.notes.message}</span>}
      </label>

      {/* Entries Section */}
      <h3>Entries</h3>
      <button type="button" onClick={addEntry}>
        Add Entry
      </button>

      {fields.map((field, idx) => (
        <div
          key={field.id}
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {/* Day selection */}
          <label>
            Day *
            <select {...register(`entries.${idx}.dayOfWeek` as const)}>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            {errors.entries?.[idx]?.dayOfWeek && (
              <span>{errors.entries[idx].dayOfWeek?.message}</span>
            )}
          </label>

          {/* Meal type selection */}
          <label>
            Meal Type *
            <select {...register(`entries.${idx}.mealType` as const)}>
              {MEAL_TYPES.map((meal) => (
                <option key={meal} value={meal}>
                  {meal}
                </option>
              ))}
            </select>
            {errors.entries?.[idx]?.mealType && (
              <span>{errors.entries[idx].mealType?.message}</span>
            )}
          </label>

          {/* Recipe selection */}
          <label>
            Recipe *
            <select {...register(`entries.${idx}.recipeId` as const)}>
              <option value="">Select Recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            {errors.entries?.[idx]?.recipeId && (
              <span>{errors.entries[idx].recipeId?.message}</span>
            )}
          </label>

          {/* Servings */}
          <label>
            Servings *
            <input
              type="number"
              min={1}
              {...register(`entries.${idx}.servings` as const)}
            />
            {errors.entries?.[idx]?.servings && (
              <span>{errors.entries[idx].servings?.message}</span>
            )}
          </label>

          {/* Remove entry button */}
          <button type="button" onClick={() => remove(idx)}>
            Remove Entry
          </button>
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Meal Plan"}
      </button>
    </form>
  );
}
