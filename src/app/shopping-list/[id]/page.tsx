// src/app/shopping-list/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useShoppingList } from "@/context/ShoppingListContext";
import ShoppingListComponent from "@/components/ShoppingListComponent";

export default function ShoppingListDetailPage() {
  const { id } = useParams();
  const { shoppingList } = useShoppingList();

  if (!shoppingList || shoppingList._id !== id) return <p>List not found.</p>;

  return <ShoppingListComponent list={shoppingList} />;
}
