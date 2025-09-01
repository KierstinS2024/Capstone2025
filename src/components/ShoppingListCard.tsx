/* src/components/ShoppingListCard.tsx */
import React from "react";
import styles from "./ShoppingListCard.module.css";

interface ShoppingListCardProps {
  id: string;
  createdAt: string;
  itemsCount?: number;
  purchasedCount?: number;
}

export default function ShoppingListCard({
  createdAt,
  itemsCount,
  purchasedCount,
}: ShoppingListCardProps) {
  return (
    <div className={styles.card}>
      {/* Creation date */}
      <h3 className={styles.createdAt}>
        Created: {new Date(createdAt).toLocaleDateString()}
      </h3>

      {/* Total items */}
      {itemsCount !== undefined && (
        <p className={styles.itemCount}>Total items: {itemsCount}</p>
      )}

      {/* Purchased items */}
      {purchasedCount !== undefined && (
        <p className={styles.purchasedCount}>Purchased: {purchasedCount}</p>
      )}
    </div>
  );
}
