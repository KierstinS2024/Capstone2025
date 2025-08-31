// src/pages/api/ingredients/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/db';
import Ingredient from '@/models/Ingredient';
import { verifyToken } from '@/lib/auth';

// This API route handles retrieving, updating, and deleting a single ingredient by ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  // GET: retrieve ingredient by ID
  if (req.method === 'GET') {
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    return res.status(200).json({ ingredient });
  }

  // PUT: update ingredient (auth required)
  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    const { name, unit, defaultQuantity, nutritionInfo } = req.body;
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      { name, unit, defaultQuantity, nutritionInfo },
      { new: true }
    );

    if (!updatedIngredient) return res.status(404).json({ message: 'Ingredient not found' });
    return res.status(200).json({ ingredient: updatedIngredient });
  }

  // DELETE: remove ingredient (auth required)
  if (req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });

    const deletedIngredient = await Ingredient.findByIdAndDelete(id);
    if (!deletedIngredient) return res.status(404).json({ message: 'Ingredient not found' });
    return res.status(200).json({ message: 'Ingredient deleted successfully' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
