'use client';

import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import NotePreview from '@/components/NotePreview/NotePreview';

type Props = {
    noteId: string;
};

export default function NotePreviewClient({ noteId }: Props) {
    const router = useRouter();

    const { data: note, isLoading, isError } = useQuery({
        queryKey: ["note", noteId],
        queryFn: () => fetchNoteById(noteId),
        enabled: !!noteId,
        refetchOnMount: false,
    });

    const handleClose = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <Modal
                isOpen
                onClose={handleClose}
                titleId="note-loading-title"
                descriptionId="note-loading-desc"
            >
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading note details...</p>
                </div>
            </Modal>
        );
    }

    if (isError || !note) {
        return (
            <Modal
                isOpen
                onClose={handleClose}
                titleId="note-error-title"
                descriptionId="note-error-desc"
            >
                <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                    <h3>Error loading note</h3>
                    <p>Could not load the note details. Please try again.</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen
            onClose={handleClose}
            titleId="note-title"
            descriptionId="note-desc"
        >
            <NotePreview note={note} />
        </Modal>
    );
}
