'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import { useParams } from "next/navigation";
import css from './NoteDetails.module.css';


const NoteDetailsClient = () => {
    const params = useParams();
    const id = params.id as string;

    const { data: note, isLoading, error } = useQuery({
        enabled: Boolean(id),
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    if (isLoading) {
        return <p>Loading, please wait...</p>;
    }

    if (error || !note) {
        return <p>Something went wrong.</p>;
    }

    return (<div className={css.container}>
        <div className={css.item}>
            <div className={css.header}>
                <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
        </div>
    </div>);
}
export default NoteDetailsClient;