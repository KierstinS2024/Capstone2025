// src/components/Button.tsx
"use client";

import React, { ButtonHTMLAttributes, FC } from "react";

// --------------------
// Button Props
// --------------------
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text or elements inside the button */
  children: React.ReactNode;
  /** Optional variant for styling: primary (default) or secondary */
  variant?: "primary" | "secondary";
  /** Optional loading state */
  isLoading?: boolean;
}

/**
 * Reusable Button component.
 * Supports primary/secondary variants and loading state.
 */
const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  ...rest
}) => {
  // Combine disabled prop with loading state
  const isDisabled = disabled || isLoading;

  // Base class names for styling
  const baseClasses =
    "px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant-specific classes
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100";

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
