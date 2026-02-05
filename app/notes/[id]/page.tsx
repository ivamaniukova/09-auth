import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api/serverApi";
import { Metadata } from "next";
import { cookies } from "next/headers";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NotePageProps):
  Promise<Metadata> {
  const { id } = await params;
  const cookieHeader = cookies().toString();
  const note = await fetchNoteById(id, cookieHeader);
  const title = `Note: ${note.title}`;
  const description = (note.content ?? "").slice(0, 100);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-nine-orcin.vercel.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  }
}
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const cookieHeader = cookies().toString();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id, cookieHeader),
  });
  return (<HydrationBoundary state={dehydrate(queryClient)}>
    <NoteDetailsClient />
  </HydrationBoundary>);
}