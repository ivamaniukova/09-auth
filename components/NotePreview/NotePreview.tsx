'use client';

import type { Note } from "@/types/note";
import css from './NotePreview.module.css';

export interface NotePreviewProps {
    note: Note;
    onBack?: () => void;
}

export default function NotePreview({ note, onBack }: NotePreviewProps) {
    return (
        <div className={css.container}>
            <article className={css.item}>
                <div className={css.header}>
                    <h2 id="note-title">{note.title}</h2>
                    <span className={css.tag}>{note.tag}</span>
                </div>

                <p className={css.content} id="note-desc">
                    {note.content}
                </p>

                <div className={css.date}>
                    <p>updated at: {new Date(note.updatedAt).toLocaleString()}</p>
                    <p>created at: {new Date(note.createdAt).toLocaleString()}</p>
                </div>

                {onBack && (
                    <button type="button" className={css.backBtn} onClick={onBack}>
                        Back
                    </button>
                )}
            </article>
        </div>
    );
}