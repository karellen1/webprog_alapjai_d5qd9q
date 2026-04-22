export type AuthMode = "login" | "register";

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  expiresAtUtc: string;
};

export type AuthActionResult = {
  ok: boolean;
  error?: string;
};
