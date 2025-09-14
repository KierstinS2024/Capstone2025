import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MealMate",
  description: "Plan meals, discover recipes, and manage shopping lists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MealPlanProvider>
            <ShoppingListProvider>
              <Navbar />
              <main className="max-w-5xl mx-auto p-4">{children}</main>
            </ShoppingListProvider>
          </MealPlanProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
