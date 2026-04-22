import type { AuthActionResult, AuthRequest } from "./types";

export type AuthContextValue = {
  token: string;
  isAuthenticated: boolean;
  login: (payload: AuthRequest) => Promise<AuthActionResult>;
  register: (payload: AuthRequest) => Promise<AuthActionResult>;
  logout: () => void;
};
