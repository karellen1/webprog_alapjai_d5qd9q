import axios from "axios";

type ApiErrorPayload = {
  message?: string;
  errors?: string[];
};

export function extractApiError(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const payload = error.response?.data as ApiErrorPayload | undefined;
  if (payload?.message) {
    return payload.message;
  }

  if (payload?.errors?.length) {
    return payload.errors.join(" ");
  }

  return fallback;
}
