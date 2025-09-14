// src/app/layout.tsx
import "./global.css";
import Navbar from "@/components/Navbar";
import AppProviders from "@/context/AppProviders";

export const metadata = {
  title: "MealMate",
  description: "Plan meals, discover recipes, and manage shopping lists",
};

// Keep layout as server component to allow metadata export
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* All client-side context providers live inside AppProviders */}
        <AppProviders>
          <Navbar />
          <main className="max-w-5xl mx-auto p-4">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
