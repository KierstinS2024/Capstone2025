// src/components/ShoppingListCard.tsx
import React from "react";
import { ShoppingList } from "../models/ShoppingList";

interface ShoppingListCardProps {
  list: ShoppingList;
}

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ list }) => {
  return (
    <div>
      {/* Shopping list items */}
      <ul>
        {list.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListCard;
