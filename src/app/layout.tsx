// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MealPlanProvider } from "@/context/MealPlanContext";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

export const metadata = {
  title: "MealMate",
  description: "Plan meals, discover recipes, and manage shopping lists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages that do not require authentication
  const publicPaths = ["/login", "/signup", "/"];
  const isPublic = publicPaths.includes(pathname || "/");

  const content = isPublic ? (
    // Render public pages without protection
    children
  ) : (
    // Wrap protected pages
    <ProtectedRoute>{children}</ProtectedRoute>
  );

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MealPlanProvider>
            <ShoppingListProvider>
              {/* Navbar is shown only for authenticated users */}
              {!isPublic && <Navbar />}
              <main className="max-w-5xl mx-auto p-4">{content}</main>
            </ShoppingListProvider>
          </MealPlanProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
