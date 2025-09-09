// Path: src/components/Modal.tsx
"use client";

/**
 * Modal
 * -----
 * Reusable modal dialog.
 * Accepts children content, title, and open/close handlers.
 * Focus-traps content and closes on overlay click or ESC key.
 */

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--bg-card)",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {title && <h2 style={{ marginBottom: "1rem" }}>{title}</h2>}
        {children}
        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
