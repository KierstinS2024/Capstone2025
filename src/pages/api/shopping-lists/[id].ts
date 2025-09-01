// src/pages/api/shopping-lists/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList from "@/models/ShoppingList";

// Handles operations on a single shopping list
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  // Authenticate the user
  let userId: string;
  try {
    const verified = verifyToken(req.headers.authorization || "");
    if (!verified) return res.status(401).json({ message: "Invalid or missing token" });
    userId = verified;
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  // Find the shopping list by ID
  const list = await ShoppingList.findById(id);
  if (!list) return res.status(404).json({ message: "Shopping list not found" });
  if (list.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

  // GET: return the shopping list
  if (req.method === "GET") {
    return res.status(200).json({ list });
  }

  // POST: add a new item to the list
  if (req.method === "POST") {
    try {
      const { ingredientId, quantity, unit } = req.body;
      list.items.push({ ingredientId, quantity, unit, purchased: false });
      await list.save();
      return res.status(201).json({ list });
    } catch {
      return res.status(500).json({ message: "Error adding item" });
    }
  }

  // PATCH: update an item (quantity or purchased)
  if (req.method === "PATCH") {
    try {
      const { itemId, quantity, purchased } = req.body;
      const item = list.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });

      if (quantity !== undefined) item.quantity = quantity;
      if (purchased !== undefined) item.purchased = purchased;

      await list.save();
      return res.status(200).json({ list });
    } catch {
      return res.status(500).json({ message: "Error updating item" });
    }
  }

  // DELETE: remove an item from the list
  if (req.method === "DELETE") {
    try {
      const { itemId } = req.body;
      const item = list.items.id(itemId);
      if (!item) return res.status(404).json({ message: "Item not found" });

      item.remove();
      await list.save();
      return res.status(200).json({ list });
    } catch {
      return res.status(500).json({ message: "Error deleting item" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
