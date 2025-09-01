/* src/components/RecipeCard.tsx */
import React from "react";
import styles from "./RecipeCard.module.css";

interface Recipe {
  _id?: string;
  id?: number;
  name: string;
  description?: string;
  cuisine?: string;
  userSubmitted?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // Determine the URL based on whether it's user-submitted or external
  const href =
    recipe.userSubmitted === false
      ? `/dashboard/recipes/external/${recipe.id}`
      : `/dashboard/recipes/${recipe._id}`;

  return (
    <a href={href} className={styles.card}>
      {/* Recipe name */}
      <h3 className={styles.title}>{recipe.name}</h3>

      {/* Optional cuisine */}
      {recipe.cuisine && <p className={styles.cuisine}>{recipe.cuisine}</p>}

      {/* Optional description */}
      {recipe.description && (
        <p className={styles.description}>{recipe.description}</p>
      )}

      {/* Badge showing if it's user-submitted or external */}
      <span
        className={`${styles.badge} ${
          recipe.userSubmitted ? styles.userBadge : styles.externalBadge
        }`}
      >
        {recipe.userSubmitted ? "Your Recipe" : "External"}
      </span>
    </a>
  );
};

export default RecipeCard;
