// PATH: src/app/shopping-list/page.tsx
"use client";

import Navbar from "@/components/Navbar";
import ShoppingListPage from "@/components/ShoppingListPage";

export default function ShoppingListRoute() {
  return (
    <>
      <Navbar />
      <ShoppingListPage />
    </>
  );
}
