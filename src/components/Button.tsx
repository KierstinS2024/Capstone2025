// Path: src/components/Button.tsx
"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "outline"; // choose button style
  disabled?: boolean;
  style?: React.CSSProperties; // optional inline overrides
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  style = {},
}) => {
  // Base styles
  const baseStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "0.6rem 1.2rem",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  // Variant styles
  let variantStyle: React.CSSProperties = {};
  switch (variant) {
    case "primary":
      variantStyle = {
        backgroundColor: "var(--color-primary)",
        color: "#fff",
      };
      break;
    case "accent":
      variantStyle = {
        backgroundColor: "var(--color-accent)",
        color: "#fff",
      };
      break;
    case "outline":
      variantStyle = {
        backgroundColor: "transparent",
        color: "var(--color-primary)",
        border: "1px solid var(--color-primary)",
      };
      break;
  }

  // Combine styles
  const combinedStyle = { ...baseStyle, ...variantStyle };

  return (
    <button
      style={combinedStyle}
      onClick={disabled ? undefined : onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
};

export default Button;
