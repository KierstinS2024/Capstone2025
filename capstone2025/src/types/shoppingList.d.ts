export interface ShoppingListItem {
  _id?: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

export interface ShoppingList {
  _id: string;
  title: string;
  userId: string;
  mealPlanId?: string;
  items: ShoppingListItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
