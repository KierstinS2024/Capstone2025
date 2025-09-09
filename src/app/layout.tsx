// src/app/layout.tsx
import "../styles/variables.css";
import "./globals.css";
import { ReactNode } from "react";

// Root layout component wraps all pages
interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        {/* This is where all page content will be rendered */}
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
