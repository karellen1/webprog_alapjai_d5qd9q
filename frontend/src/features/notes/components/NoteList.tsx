import type { Note } from '../types'

type NoteListProps = {
    notes: Note[]
    loading: boolean
    error: string
    deletingId: string | null
    onRefresh: () => void
    onEdit: (note: Note) => void
    onDelete: (id: string) => void
}

export function NoteList({
    notes,
    loading,
    error,
    deletingId,
    onRefresh,
    onEdit,
    onDelete,
}: NoteListProps) {
    return (
        <section className="panel notes">
            <div className="notes-header">
                <h2>Your notes</h2>
                <button type="button" className="btn secondary" onClick={onRefresh} disabled={loading}>
                    Refresh
                </button>
            </div>

            {error ? <p className="feedback error">{error}</p> : null}
            {loading ? <p className="feedback">Loading notes...</p> : null}
            {!loading && notes.length === 0 ? <p className="feedback">No notes yet.</p> : null}

            {notes.length > 0 ? (
                <ul className="note-list">
                    {notes.map((note) => (
                        <li key={note.id} className="note-item">
                            <div>
                                <h3>{note.title}</h3>
                                <p>{note.content || 'No content'}</p>
                                <small>Updated: {new Date(note.updatedAtUtc).toLocaleString()}</small>
                            </div>
                            <div className="actions">
                                <button type="button" className="btn secondary" onClick={() => onEdit(note)}>
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn danger"
                                    onClick={() => onDelete(note.id)}
                                    disabled={deletingId === note.id}
                                >
                                    {deletingId === note.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}
        </section>
    )
}
