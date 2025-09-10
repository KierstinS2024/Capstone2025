import mongoose, { Schema, Document } from "mongoose";

export interface IShoppingItem {
  ingredient: string;
  quantity: string;
  category: "produce" | "meat" | "dairy" | "frozen" | "other";
  checked: boolean;
}

export interface IShoppingList extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  items: IShoppingItem[];
}

const ShoppingListSchema = new Schema<IShoppingList>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  items: [
    {
      ingredient: { type: String, required: true },
      quantity: { type: String },
      category: {
        type: String,
        enum: ["produce", "meat", "dairy", "frozen", "other"],
      },
      checked: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.models.ShoppingList ||
  mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);
