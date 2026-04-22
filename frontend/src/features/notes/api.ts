import { httpClient } from "../../shared/api/httpClient";
import type { Note, NoteRequest } from "./types";

function authHeader(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function fetchNotes(token: string): Promise<Note[]> {
  const response = await httpClient.get<Note[]>(
    "/api/notes",
    authHeader(token),
  );
  return response.data;
}

export async function createNote(
  token: string,
  payload: NoteRequest,
): Promise<Note> {
  const response = await httpClient.post<Note>(
    "/api/notes",
    payload,
    authHeader(token),
  );
  return response.data;
}

export async function updateNote(
  token: string,
  id: string,
  payload: NoteRequest,
): Promise<Note> {
  const response = await httpClient.put<Note>(
    `/api/notes/${id}`,
    payload,
    authHeader(token),
  );
  return response.data;
}

export async function removeNote(token: string, id: string): Promise<void> {
  await httpClient.delete(`/api/notes/${id}`, authHeader(token));
}
