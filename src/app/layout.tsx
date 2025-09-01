// src/app/layout.tsx
import "./globals.css";
import { AppProviders } from "@/context";

export const metadata = {
  title: "Capstone 2025",
  description: "Meal planning and recipe management app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
