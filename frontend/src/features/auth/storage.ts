const tokenStorageKey = "notesapp.accessToken";

export function readToken(): string {
  return localStorage.getItem(tokenStorageKey) ?? "";
}

export function writeToken(token: string): void {
  localStorage.setItem(tokenStorageKey, token);
}

export function clearToken(): void {
  localStorage.removeItem(tokenStorageKey);
}
