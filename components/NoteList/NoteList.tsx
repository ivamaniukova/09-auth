'use client';

import css from './NoteList.module.css';
import type { Note } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';

export interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteNote,
        onMutate: (id) => {
            setDeletingId(id);
        },
        onSettled: () => {
            setDeletingId(null);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
        },
    });

    return (
        <>
            {deleteMutation.isError && (
                <p role="alert" style={{ color: '#dc3545', margin: '8px 0' }}>
                    Failed to delete note. Please try again.
                </p>
            )}

            <ul className={css.list}>
                {notes.map((note) => (
                    <li key={note.id} className={css.listItem}>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>

                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>
                            <Link href={`/notes/${note.id}`} scroll={false} className={css.link}>View details</Link>
                            <button
                                type="button"
                                className={css.button}
                                onClick={() => deleteMutation.mutate(note.id)}
                                disabled={deletingId === note.id}
                            >
                                {deletingId === note.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}