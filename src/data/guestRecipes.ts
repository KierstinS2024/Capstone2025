// Path: src/data/guestRecipes.ts
// Sample recipes for Guest Mode dashboard

import type { Recipe } from "@/types/recipe";

export const guestRecipes: Recipe[] = [
  {
    _id: "guest1",
    userId: "guest",
    title: "Avocado Toast",
    ingredients: [
      { name: "Bread", quantity: "2 slices", unit: "" },
      { name: "Avocado", quantity: "1", unit: "" },
      { name: "Salt", quantity: "pinch", unit: "" },
    ],
    instructions: "Toast bread. Mash avocado. Spread and season.",
    source: "local",
    favorite: true,
    image: "/guest/avocado-toast.jpg",
  },
  {
    _id: "guest2",
    userId: "guest",
    title: "Greek Salad",
    ingredients: [
      { name: "Tomato", quantity: "1 cup", unit: "" },
      { name: "Cucumber", quantity: "1 cup", unit: "" },
      { name: "Feta Cheese", quantity: "1/2 cup", unit: "" },
    ],
    instructions: "Mix ingredients and serve fresh.",
    source: "local",
    favorite: false,
    image: "/guest/greek-salad.jpg",
  },
  {
    _id: "guest3",
    userId: "guest",
    title: "Oatmeal with Berries",
    ingredients: [
      { name: "Oats", quantity: "1 cup", unit: "" },
      { name: "Milk", quantity: "1 cup", unit: "" },
      { name: "Berries", quantity: "1/2 cup", unit: "" },
    ],
    instructions: "Cook oats with milk, top with berries.",
    source: "local",
    favorite: true,
    image: "/guest/oatmeal-berries.jpg",
  },
];
