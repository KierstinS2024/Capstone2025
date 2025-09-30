// ===========================================
// PATH: src/components/ShoppingListComponent.tsx
// ===========================================

"use client";

import { useShoppingList } from "@/context/ShoppingListContext";
import { useAuth } from "@/context/AuthContext";
import styles from "@/styles/shoppinglist-detail.module.css";

// -----------------------------
// ShoppingListComponent
// -----------------------------
// - Uses AuthContext to ensure a user is logged in
// - Uses ShoppingListContext to access the user's shopping list
// - Displays the list items (name + quantity)
// -----------------------------
export default function ShoppingListComponent() {
  const { user } = useAuth();
  const { list, loading } = useShoppingList();

  // Guard: must be logged in
  if (!user) return <p>Please log in to view your shopping list.</p>;

  // Guard: still loading
  if (loading) return <p>Loading shopping list...</p>;

  // Guard: no list found for this user
  if (!list || list.ownerEmail !== user.email)
    return <p>No shopping list found.</p>;

  return (
    <div className={styles.component}>
      <h3 className={styles.heading}>Shopping List</h3>

      <ul className={styles.items}>
        {list.items.length ? (
          list.items.map((item, i) => (
            <li key={i} className={styles.item}>
              <span>{item.name}</span>
              <span className={styles.quantity}>{item.quantity}</span>
            </li>
          ))
        ) : (
          <p className={styles.empty}>No items in your shopping list.</p>
        )}
      </ul>
    </div>
  );
}
