// PATH: src/utils/parseInstructions.tsx
"use client";

import React from "react";

/**
 * Converts recipe instructions (HTML or plain text) into React nodes
 * Handles <ol>/<ul>/<li> or plain line breaks for better readability
 */
export function parseInstructions(input?: string): React.ReactNode {
  if (!input) return <p>No instructions provided.</p>;

  try {
    // Parse input as HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");

    // Handle ordered lists
    const ol = doc.querySelector("ol");
    if (ol) {
      return (
        <ol style={{ paddingLeft: "1.2rem" }}>
          {Array.from(ol.querySelectorAll("li")).map((li, idx) => (
            <li key={idx}>{li.textContent}</li>
          ))}
        </ol>
      );
    }

    // Handle unordered lists
    const ul = doc.querySelector("ul");
    if (ul) {
      return (
        <ul style={{ paddingLeft: "1.2rem" }}>
          {Array.from(ul.querySelectorAll("li")).map((li, idx) => (
            <li key={idx}>{li.textContent}</li>
          ))}
        </ul>
      );
    }

    // Fallback: plain text split by line breaks
    return input.split(/\r?\n/).map((line, idx) => (
      <p key={idx} style={{ marginBottom: "0.5rem" }}>
        {line}
      </p>
    ));
  } catch (err) {
    // If parsing fails, just return plain text
    return <p>{input}</p>;
  }
}
