import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';

import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function NoteModalPage({ params }: Props) {
    const { id } = await params;

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

    await queryClient.prefetchQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id, cookieHeader),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotePreviewClient noteId={id} />
        </HydrationBoundary>
    );
}