import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';

import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

async function withServerCookies() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : '',
        refreshToken ? `refreshToken=${refreshToken}` : '',
    ]
        .filter(Boolean)
        .join('; ');

    return cookieHeader ? { Cookie: cookieHeader } : {};
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
    const headers = await withServerCookies();

    const res = await api.get<FetchNotesResponse>('/notes', {
        params: {
            ...params,
            perPage: 12,
        },
        headers,
    });

    return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
    const headers = await withServerCookies();

    const res = await api.get<Note>(`/notes/${id}`, { headers });
    return res.data;
}

export async function getMe(): Promise<User> {
    const headers = await withServerCookies();

    const res = await api.get<User>('/users/me', { headers });
    return res.data;
}

export async function checkSession(): Promise<AxiosResponse<User | null>> {
    const headers = await withServerCookies();

    return api.get<User | null>('/auth/session', { headers });
}
