import { useCallback, useEffect, useState } from "react";
import { createNote, fetchNotes, removeNote, updateNote } from "./api";
import { extractApiError } from "../../shared/utils/extractApiError";
import type { Note, NoteRequest } from "./types";

export function useNotes(token: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await fetchNotes(token);
      setNotes(data);
    } catch (loadError) {
      setError(extractApiError(loadError, "Could not load notes."));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (
      selectedId: string | null,
      payload: NoteRequest,
    ): Promise<{ ok: boolean; error?: string }> => {
      if (!token) {
        return { ok: false, error: "You must be logged in." };
      }

      try {
        if (selectedId) {
          await updateNote(token, selectedId, payload);
        } else {
          await createNote(token, payload);
        }

        await refresh();
        return { ok: true };
      } catch (saveError) {
        return {
          ok: false,
          error: extractApiError(saveError, "Could not save note."),
        };
      }
    },
    [refresh, token],
  );

  const deleteById = useCallback(
    async (id: string): Promise<{ ok: boolean; error?: string }> => {
      if (!token) {
        return { ok: false, error: "You must be logged in." };
      }

      try {
        await removeNote(token, id);
        await refresh();
        return { ok: true };
      } catch (deleteError) {
        return {
          ok: false,
          error: extractApiError(deleteError, "Could not delete note."),
        };
      }
    },
    [refresh, token],
  );

  return {
    notes,
    loading,
    error,
    refresh,
    save,
    deleteById,
  };
}
