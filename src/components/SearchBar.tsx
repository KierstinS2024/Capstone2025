// src/components/SearchBar.tsx
"use client";

import React, { useState } from "react";
import styles from "./SearchBar.module.css";

// Props type
interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  /**
   * Handle form submission
   * Prevent default reload and call onSearch with trimmed query
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search for recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />
      {/* Search button */}
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
