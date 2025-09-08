// Path: src/components/IngredientForm.tsx
"use client";

/**
 * IngredientForm
 * -----------------
 * Reusable form for creating or editing ingredients.
 * Uses react-hook-form for form state and validation.
 */

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for validation
export const ingredientFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  unit: z.string().nonempty("Unit is required"),
  calories: z.number().min(0, "Calories cannot be negative").optional(),
});

export type IngredientFormSchema = z.infer<typeof ingredientFormSchema>;

interface Props {
  initialValues?: IngredientFormSchema;
  onSubmit: (data: IngredientFormSchema) => void;
  loading?: boolean;
}

export default function IngredientForm({
  initialValues,
  onSubmit,
  loading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientFormSchema>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: initialValues || {
      name: "",
      unit: "",
      calories: 0,
    },
  });

  const onSubmitHandler: SubmitHandler<IngredientFormSchema> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {/* Name */}
      <label>
        Name *
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      {/* Unit */}
      <label>
        Unit *
        <input type="text" {...register("unit")} />
        {errors.unit && <span>{errors.unit.message}</span>}
      </label>

      {/* Calories */}
      <label>
        Calories
        <input type="number" step="0.01" {...register("calories")} />
        {errors.calories && <span>{errors.calories.message}</span>}
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
