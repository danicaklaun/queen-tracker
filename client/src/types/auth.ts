export type UserRole = "beekeeper" | "admin";

export type AuthUser = {
  user_id: number;
  username: string;
  role: UserRole;
  exp?: number;
  iat?: number;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token?: string;
};