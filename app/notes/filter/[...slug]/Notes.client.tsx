'use client';

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/api";
import NoteList from "@/components/NoteList/NoteList";
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "use-debounce";
import css from './NotesPage.module.css';
import type { NoteTag } from '@/types/note';
import Link from "next/link";

type NotesPageProps = {
    tag?: NoteTag | undefined;
};

export default function NotesPage({ tag }: NotesPageProps) {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", { page, search: debouncedSearch, tag }],
        queryFn: () => fetchNotes({ page, search: debouncedSearch, tag }),
        placeholderData: keepPreviousData,
    });

    if (isLoading) return <p>Loading, please wait...</p>;
    if (isError || !data) return <p>Something went wrong.</p>;

    return (
        <main className={css.app}>
            <div className={css.toolbar}>
                <h1>Notes</h1>

                <Link href="/notes/action/create" className={css.button}>
                    Create note +
                </Link>
            </div>

            <div className={css.controls}>
                <SearchBox value={search} onChange={handleSearchChange} />
                {data.totalPages > 1 && (
                    <Pagination
                        totalPages={data.totalPages}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <NoteList notes={data.notes} />
        </main>
    );
}
