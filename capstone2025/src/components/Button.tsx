// src/components/Button.tsx
"use client";

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  /** Button label/content */
  children: React.ReactNode;
  /** onClick handler */
  onClick?: () => void;
  /** Optional button type, defaults to 'button' */
  type?: "button" | "submit" | "reset";
  /** Optional variant for styling */
  variant?: ButtonVariant;
  /** Disable button */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button
 * Reusable button component with variants, disabled state, and accessibility support.
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}: ButtonProps) {
  // Base classes for all buttons
  const baseClasses =
    "px-4 py-2 rounded font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  // Disabled state classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClassName}
    >
      {children}
    </button>
  );
}
