export interface User {
  _id: string;
  email: string;
  preferences?: Record<string, any>;
  avatarUrl?: string;
  [key: string]: any;
}

export interface AuthToken {
  token: string;
  user: User;
}
