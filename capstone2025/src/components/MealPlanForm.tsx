// Path: src/components/MealPlanForm.tsx
"use client";

/**
 * MealPlanForm
 * -----------------
 * Reusable form component for creating or editing meal plans.
 * Features:
 * - Uses react-hook-form with Zod for validation
 * - Allows selecting recipes per day & meal type
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

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;

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

  const onSubmitHandler: SubmitHandler<MealPlanFormSchema> = (data) => {
    onSubmit(data);
  };

  const addEntry = () => {
    append({
      dayOfWeek: "Monday",
      mealType: "breakfast",
      recipeId: "",
      servings: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <label>
        Week Start Date *
        <input type="date" {...register("weekStartDate")} />
        {errors.weekStartDate && <span>{errors.weekStartDate.message}</span>}
      </label>

      <label>
        Notes
        <textarea {...register("notes")} />
        {errors.notes && <span>{errors.notes.message}</span>}
      </label>

      <h3>Meal Plan Entries</h3>
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
          <label>
            Day *
            <select {...register(`entries.${idx}.dayOfWeek` as const)}>
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <label>
            Meal Type *
            <select {...register(`entries.${idx}.mealType` as const)}>
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Recipe *
            <select {...register(`entries.${idx}.recipeId` as const)}>
              <option value="">Select recipe</option>
              {recipes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Servings *
            <input
              type="number"
              step={0.1}
              {...register(`entries.${idx}.servings` as const)}
            />
          </label>

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
