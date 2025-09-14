export interface ShoppingListItem {
  id: string;
  name: string;
  category: "produce" | "dairy" | "meat" | "bakery" | "other";
  purchased: boolean;
}
