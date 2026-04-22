import { httpClient } from "../../shared/api/httpClient";
import type { AuthRequest, AuthResponse } from "./types";

export async function loginRequest(
  payload: AuthRequest,
): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>(
    "/api/auth/login",
    payload,
  );
  return response.data;
}

export async function registerRequest(
  payload: AuthRequest,
): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>(
    "/api/auth/register",
    payload,
  );
  return response.data;
}
