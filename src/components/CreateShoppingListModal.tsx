// path: src/components/CreateShoppingListModal.tsx
/**
 * CreateShoppingListModal Component
 *
 * Modal to create a new shopping list manually.
 * Accepts a title and optional items.
 */

import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (title: string) => void;
}

const CreateShoppingListModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
      setTitle("");
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Create New Shopping List</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">List Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Weekly Groceries"
          />
          <div className="modal-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShoppingListModal;
