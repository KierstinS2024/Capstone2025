// src/components/Dropdown.tsx
import React from "react";

interface DropdownProps {
  options: string[];
  onChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange }) => {
  return (
    <select onChange={(e) => onChange?.(e.target.value)}>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
