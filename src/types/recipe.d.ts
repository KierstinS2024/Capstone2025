//src/types/recipe.d.ts
export interface Recipe {
  id: string; // mapped from Mongo _id
  author: string; // email of user who created it
  title: string;
  image?: string;
  ingredients: string[];
  instructions: string;
  source: "user" | "spoonacular";
  createdAt?: string;
  updatedAt?: string;
}
