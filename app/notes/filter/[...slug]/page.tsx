import { notFound } from 'next/navigation';
import type { NoteTag } from '@/types/note';
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import NotesClient from './Notes.client';
import type { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    if (!slug || slug.length !== 1) {
        return {
            title: `Notes filter | NoteHub`,
            description: "Notes filter page.",
            openGraph: {
                title: `Notes filter | NoteHub`,
                description: "Notes filter page.",
                url: "https://08-zustand-nine-orcin.vercel.app/notes/filter/all",
                images: [
                    {
                        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                        width: 1200,
                        height: 630,
                        alt: "NoteHub",
                    },
                ],
            },
        };
    }

    const current = slug[0];

    const name = "NoteHub";
    const title = `Notes - ${current} | ${name}`;
    const description = `Browse your notes filtered by: ${current}.`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `https://08-zustand-nine-orcin.vercel.app/notes/filter/${encodeURIComponent(
                current
            )}`,
            images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: name,
                },
            ],
        },
    };
}

export default async function FilterPage({ params }: Props) {
    const { slug } = await params;

    if (!slug || slug.length !== 1) notFound();

    const current = slug[0];

    const tagForApi = current === 'all' ? undefined : (current as NoteTag);

    const queryClient = new QueryClient();
    const page = 1;
    const search = '';

    await queryClient.prefetchQuery({
        queryKey: ["notes", { page, search, tag: tagForApi }],
        queryFn: () => fetchNotes({ page, search, tag: tagForApi }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tagForApi} />
        </HydrationBoundary>
    );
}
