// Path: src/app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * ProfilePage
 * Allows the user to view/update profile info and settings.
 */
const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string>(user?.name || "");

  if (!user) {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  /** Update display name locally (would connect to API) */
  const handleSave = () => {
    alert(`Saved new display name: ${displayName}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Profile</h1>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            backgroundColor: "#22c55e",
            color: "white",
            borderRadius: 4,
          }}
        >
          Save
        </button>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            borderRadius: 4,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
