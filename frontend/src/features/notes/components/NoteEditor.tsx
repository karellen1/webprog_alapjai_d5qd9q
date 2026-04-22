import type { FormEvent } from 'react'

type NoteEditorProps = {
    modeLabel: string
    title: string
    content: string
    saving: boolean
    error: string
    onTitleChange: (value: string) => void
    onContentChange: (value: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onClear: () => void
}

export function NoteEditor({
    modeLabel,
    title,
    content,
    saving,
    error,
    onTitleChange,
    onContentChange,
    onSubmit,
    onClear,
}: NoteEditorProps) {
    return (
        <article className="panel">
            <h2>{modeLabel}</h2>

            <form className="stack" onSubmit={onSubmit}>
                <label className="field">
                    Title
                    <input
                        type="text"
                        value={title}
                        onChange={(event) => onTitleChange(event.target.value)}
                        required
                        maxLength={200}
                        disabled={saving}
                    />
                </label>

                <label className="field">
                    Content
                    <textarea
                        rows={8}
                        value={content}
                        onChange={(event) => onContentChange(event.target.value)}
                        maxLength={10000}
                        disabled={saving}
                    />
                </label>

                {error ? <p className="feedback error">{error}</p> : null}

                <div className="actions">
                    <button type="submit" className="btn" disabled={saving}>
                        {saving ? 'Saving...' : modeLabel}
                    </button>
                    <button type="button" className="btn secondary" onClick={onClear} disabled={saving}>
                        Clear
                    </button>
                </div>
            </form>
        </article>
    )
}
