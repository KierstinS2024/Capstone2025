// Path: src/components/Input.tsx
"use client";

/**
 * Input
 * -----
 * Reusable text input component with label, error handling, and optional type.
 * Supports text, number, password, email, etc.
 */

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
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
      />
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
