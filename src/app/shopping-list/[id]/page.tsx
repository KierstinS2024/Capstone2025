//src/app/shopping-list/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useShoppingList } from "@/context/ShoppingListContext";
import ShoppingListComponent from "@/components/ShoppingListComponent";

export default function ShoppingListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { list, loading, toggle, remove, clear } = useShoppingList(); // ✅ renamed

  if (loading) return <p>Loading shopping list...</p>;
  if (!list || list.id !== id) return <p>List not found.</p>;

  return (
    <ShoppingListComponent
      list={list}
      onToggle={toggle}
      onRemove={remove}
      onClear={clear}
    />
  );
}
