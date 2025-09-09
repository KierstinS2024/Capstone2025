// Path: src/components/Toast.tsx
"use client";

/**
 * Toast
 * -----
 * A temporary notification popup.
 * Supports success, error, info, and warning types.
 * Auto-dismisses after a timeout.
 */

import React, { useEffect } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // in milliseconds
  onClose: () => void;
}

export default function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const backgroundColors: Record<ToastType, string> = {
    success: "var(--success)",
    error: "var(--danger)",
    info: "var(--info)",
    warning: "var(--warning)",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        backgroundColor: backgroundColors[type],
        color: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        zIndex: 9999,
        minWidth: "200px",
        fontWeight: 500,
      }}
    >
      {message}
    </div>
  );
}
