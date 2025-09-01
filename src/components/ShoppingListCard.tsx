// path: src/components/ShoppingListCard.tsx
/**
 * ShoppingListCard Component
 *
 * Displays a preview of a shopping list with title, creation date, and total items.
 * Clicking the card navigates to the shopping list detail page.
 */

import React from "react";
import { useRouter } from "next/navigation";

interface ShoppingListCardProps {
  list: {
    _id: string;
    title: string;
    createdAt: string;
    itemsCount: number;
  };
}

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ list }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/shopping-lists/${list._id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "0.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{list.title}</h3>
      <p>
        Created: {new Date(list.createdAt).toLocaleDateString()} | Items:{" "}
        {list.itemsCount}
      </p>
    </div>
  );
};

export default ShoppingListCard;
