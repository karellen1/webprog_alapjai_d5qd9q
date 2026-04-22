import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../features/auth/useAuth.ts'
import { NoteEditor } from '../features/notes/components/NoteEditor.tsx'
import { NoteList } from '../features/notes/components/NoteList.tsx'
import { useNotes } from '../features/notes/useNotes.ts'
import type { Note } from '../features/notes/types.ts'

export function NotesPage() {
    const { token, logout } = useAuth()
    const { notes, loading, error, refresh, save, deleteById } = useNotes(token)

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    function clearEditor() {
        setSelectedId(null)
        setTitle('')
        setContent('')
        setSaveError('')
    }

    function editNote(note: Note) {
        setSelectedId(note.id)
        setTitle(note.title)
        setContent(note.content ?? '')
        setSaveError('')
    }

    async function submitNote(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaving(true)

        const result = await save(selectedId, {
            title,
            content: content.trim() ? content : null,
        })

        if (!result.ok) {
            setSaveError(result.error ?? 'Could not save note.')
            setSaving(false)
            return
        }

        clearEditor()
        setSaving(false)
    }

    async function remove(id: string) {
        setDeletingId(id)
        const result = await deleteById(id)

        if (!result.ok) {
            setSaveError(result.error ?? 'Could not delete note.')
        }

        if (selectedId === id) {
            clearEditor()
        }

        setDeletingId(null)
    }

    return (
        <main className="screen">
            <header className="topbar panel">
                <div>
                    <h1>Notes Console</h1>
                    <p className="subtitle">Separate login page and dedicated notes workspace.</p>
                </div>
                <button type="button" className="btn secondary" onClick={logout}>
                    Log out
                </button>
            </header>

            <section className="grid">
                <NoteEditor
                    modeLabel={selectedId ? 'Update note' : 'Create note'}
                    title={title}
                    content={content}
                    saving={saving}
                    error={saveError}
                    onTitleChange={setTitle}
                    onContentChange={setContent}
                    onSubmit={submitNote}
                    onClear={clearEditor}
                />

                <NoteList
                    notes={notes}
                    loading={loading}
                    error={error}
                    deletingId={deletingId}
                    onRefresh={() => void refresh()}
                    onEdit={editNote}
                    onDelete={(id) => void remove(id)}
                />
            </section>
        </main>
    )
}
