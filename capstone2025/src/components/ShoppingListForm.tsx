// Path: src/components/ShoppingListForm.tsx
"use client";

/**
 * ShoppingListForm
 * -----------------
 * Reusable form component for creating or editing shopping lists.
 * Uses react-hook-form with Zod validation.
 */

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shoppingListFormSchema,
  type ShoppingListFormSchema,
} from "@/schemas/shoppingListForm";

interface Props {
  initialValues?: ShoppingListFormSchema;
  onSubmit: (data: ShoppingListFormSchema) => void;
  loading?: boolean;
}

export default function ShoppingListForm({
  initialValues,
  onSubmit,
  loading = false,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShoppingListFormSchema>({
    resolver: zodResolver(shoppingListFormSchema),
    defaultValues: initialValues || {
      name: "",
      items: [{ name: "", quantity: 1, unit: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmitHandler: SubmitHandler<ShoppingListFormSchema> = (data) =>
    onSubmit(data);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      {/* List Name */}
      <label>
        Name *
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      {/* Items */}
      <div>
        {fields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: "1rem" }}>
            <input
              placeholder="Item name"
              {...register(`items.${index}.name` as const)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Quantity"
              {...register(`items.${index}.quantity` as const, {
                valueAsNumber: true,
              })}
            />
            <input
              placeholder="Unit"
              {...register(`items.${index}.unit` as const)}
            />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
            {errors.items?.[index] && (
              <div>
                {errors.items[index]?.name && (
                  <span>{errors.items[index]?.name?.message}</span>
                )}
                {errors.items[index]?.quantity && (
                  <span>{errors.items[index]?.quantity?.message}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => append({ name: "", quantity: 1, unit: "" })}
      >
        Add Item
      </button>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}
