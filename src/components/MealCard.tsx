// src/components/MealCard.tsx
import React from "react";

interface MealCardProps {
  name: string;
}

const MealCard: React.FC<MealCardProps> = ({ name }) => {
  return (
    <div>
      {/* Display meal name */}
      {name}
    </div>
  );
};

export default MealCard;
