// Path: src/app/dashboard/shopping-lists/[id]/edit/page.tsx
"use client";

/**
 * EditShoppingListPage
 * -------------------
 * Page to edit an existing shopping list.
 * Uses ShoppingListForm + Zod schema for type safety.
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import ShoppingListForm from "@/components/ShoppingListForm";
import type { ShoppingListFormSchema } from "@/schemas/shoppingListForm"; // ✅ get type from schema
