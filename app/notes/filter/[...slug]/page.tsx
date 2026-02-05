import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { NoteTag } from '@/types/note';

import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type Props = {
    params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    if (!slug || slug.length !== 1) {
        return {
            title: 'Notes filter | NoteHub',
            description: 'Notes filter page.',
            openGraph: {
                title: 'Notes filter | NoteHub',
                description: 'Notes filter page.',
                url: 'https://09-auth-pi-umber.vercel.app/notes/filter/all',
                images: [
                    {
                        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
                        width: 1200,
                        height: 630,
                        alt: 'NoteHub',
                    },
                ],
            },
        };
    }

    const current = slug[0];

    const name = 'NoteHub';
    const title = `Notes - ${current} | ${name}`;
    const description = `Browse your notes filtered by: ${current}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://09-auth-pi-umber.vercel.app/notes/filter/${encodeURIComponent(
                current
            )}`,
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : '',
        refreshToken ? `refreshToken=${refreshToken}` : '',
    ]
        .filter(Boolean)
        .join('; ');

    const queryClient = new QueryClient();

    const page = 1;
    const search = '';

    await queryClient.prefetchQuery({
        queryKey: ['notes', { page, search, tag: tagForApi }],
        queryFn: () => fetchNotes({ page, search, tag: tagForApi }, cookieHeader),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient tag={tagForApi} />
        </HydrationBoundary>
    );
}

