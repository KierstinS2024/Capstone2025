// src/types/user.d.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  favorites: string[]; // Array of Recipe IDs
}
