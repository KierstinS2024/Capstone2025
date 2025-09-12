import React from "react";
import "./Button.css"; // Link CSS file (optional if using global styles)

interface ButtonProps {
  children: React.ReactNode; // Label or content inside button
  onClick?: () => void; // Click handler
  type?: "primary" | "outline"; // Choose style
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "primary",
}) => {
  return (
    <button
      className={`btn ${type === "primary" ? "btn-primary" : "btn-outline"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
