export type Note = {
  id: string;
  title: string;
  content: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
};

export type NoteRequest = {
  title: string;
  content: string | null;
};
