// Path: src/schemas/shoppingListForm.ts
// Purpose: Zod schema for validating ShoppingList form inputs

import { z } from "zod";

/**
 * ShoppingList form validation schema
 * - name: required string
 * - items: array of items with name, quantity, unit
 */
export const shoppingListFormSchema = z.object({
  name: z.string().nonempty("Shopping list name is required"),
  items: z
    .array(
      z.object({
        name: z.string().nonempty("Item name is required"),
        quantity: z.number().min(0.01, "Quantity must be greater than 0"),
        unit: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

/**
 * TypeScript type inferred from schema
 */
export type ShoppingListFormSchema = z.infer<typeof shoppingListFormSchema>;
