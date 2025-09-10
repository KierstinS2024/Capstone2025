// src/types/user.d.ts
// Type definitions for User model

import type { Types } from "mongoose";

export interface User {
  _id: string;
  email: string;
  name: string;
  favorites: string[]; // Array of Recipe._id as strings
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
