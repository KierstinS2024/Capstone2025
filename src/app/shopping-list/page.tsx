"use client";
import { useShoppingList } from "@/context/ShoppingListContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ShoppingListPage() {
  const { shoppingList, toggleItem, removeItem } = useShoppingList();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-6">Shopping List</h2>
      {shoppingList.length === 0 ? (
        <p className="text-gray-600">Your shopping list is empty.</p>
      ) : (
        <ul className="space-y-3">
          {shoppingList.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 border p-3 rounded"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />
              <span
                className={item.checked ? "line-through text-gray-400" : ""}
              >
                {item.name}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="ml-auto text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
