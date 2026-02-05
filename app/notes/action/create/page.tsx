import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

const name = "NoteHub";
const description = "Create a new note in NoteHub.";

export const metadata: Metadata = {
    title: `Create note | ${name}`,
    description,
    openGraph: {
        title: `Create note | ${name}`,
        description,
        url: "https://08-zustand-nine-orcin.vercel.app/notes/action/create",
        images: [
            {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
                alt: name,
            },
        ],
        type: "website",
    },
};

export default function CreateNotePage() {
    return (
        <main className={css.main}>
            <div className={css.container}>
                <h1 className={css.title}>Create note</h1>
                <NoteForm />
            </div>
        </main>
    );
}