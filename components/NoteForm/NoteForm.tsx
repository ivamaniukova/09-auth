'use client';

import css from './NoteForm.module.css';
import type { NoteTag } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";

type Draft = {
    title: string;
    content: string;
    tag: NoteTag;
};

export default function NoteForm() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const draft = useNoteStore((s) => s.draft);
    const setDraft = useNoteStore((s) => s.setDraft);
    const clearDraft = useNoteStore((s) => s.clearDraft);

    const [form, setForm] = useState<Draft>(initialDraft);

    useEffect(() => {
        setForm(draft ?? initialDraft);
    }, [draft]);

    const createMutation = useMutation({
        mutationFn: createNote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["notes"] });
            clearDraft();
            router.back();
        },
    });

    const handleChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > = (e) => {
        const { name, value } = e.target;

        const next = {
            ...form,
            [name]: name === "tag" ? (value as NoteTag) : value,
        };

        setForm(next);
        setDraft(next);
    };

    async function handleCreate() {
        await createMutation.mutateAsync({
            title: form.title,
            content: form.content,
            tag: form.tag,
        });
    }

    return (
        <form className={css.form}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    className={css.input}
                    value={form.title}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={50}
                    required
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    name="content"
                    className={css.textarea}
                    rows={8}
                    maxLength={500}
                    value={form.content}
                    onChange={handleChange}
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <select
                    id="tag"
                    name="tag"
                    className={css.select}
                    value={form.tag}
                    onChange={handleChange}
                    required
                >
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </select>
            </div>

            {createMutation.isError && (
                <p role="alert" className={css.error}>
                    Failed to create note. Please try again.
                </p>
            )}

            <div className={css.actions}>
                <button
                    type="button"
                    className={css.cancelButton}
                    onClick={() => router.back()}
                    disabled={createMutation.isPending}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className={css.submitButton}
                    formAction={handleCreate}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? "Creating..." : "Create note"}
                </button>
            </div>
        </form>
    );
}