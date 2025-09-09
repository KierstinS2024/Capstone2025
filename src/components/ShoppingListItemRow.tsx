// path: src/components/ShoppingListItemRow.tsx
/**
 * ShoppingListItemRow Component
 *
 * Displays a single ingredient/item in a shopping list.
 * Allows updating quantity/unit, marking as purchased, and deleting.
 */

import React, { useState } from "react";

interface ShoppingListItemRowProps {
  item: {
    _id: string;
    ingredientId: string;
    name: string; // For display
    quantity: number;
    unit: string;
    purchased: boolean;
  };
  onUpdate: (
    id: string,
    quantity: number,
    unit: string,
    purchased: boolean
  ) => void;
  onDelete: (id: string) => void;
}

const ShoppingListItemRow: React.FC<ShoppingListItemRowProps> = ({
  item,
  onUpdate,
  onDelete,
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit);
  const [purchased, setPurchased] = useState(item.purchased);

  const handleTogglePurchased = () => {
    setPurchased(!purchased);
    onUpdate(item._id, quantity, unit, !purchased);
  };

  const handleUpdate = () => {
    onUpdate(item._id, quantity, unit, purchased);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "0.5rem",
      }}
    >
      <input
        type="checkbox"
        checked={purchased}
        onChange={handleTogglePurchased}
        title="Mark as purchased"
      />
      <span style={{ flex: 1 }}>{item.name}</span>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: "4rem" }}
        onBlur={handleUpdate}
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        style={{ width: "5rem" }}
        onBlur={handleUpdate}
      />
      <button onClick={() => onDelete(item._id)}>Delete</button>
    </div>
  );
};

export default ShoppingListItemRow;
