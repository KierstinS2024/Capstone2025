// Path: src/components/Dropdown.tsx
"use client";

/**
 * Dropdown
 * --------
 * Reusable select/dropdown component with label and error handling.
 * Supports string and number values.
 */

import React from "react";

interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: DropdownOption[];
  error?: string;
}

export default function Dropdown({
  label,
  options,
  error,
  id,
  ...props
}: DropdownProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        {...props}
        style={{
          width: "100%",
          padding: "var(--input-padding-y) var(--input-padding-x)",
          borderRadius: "var(--input-border-radius)",
          border: `1px solid ${
            error ? "var(--danger)" : "var(--input-border-color)"
          }`,
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p
          style={{
            color: "var(--danger)",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
