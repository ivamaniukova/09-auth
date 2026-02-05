import axios from 'axios';
import type { User } from '@/types/user';
import type { Note } from '@/types/note';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

function createServerApi(cookie?: string) {
    return axios.create({
        baseURL,
        withCredentials: true,
        headers: cookie ? { Cookie: cookie } : undefined,
    });
}

export async function fetchNotes(params: FetchNotesParams, cookie?: string) {
    const serverApi = createServerApi(cookie);

    const { data } = await serverApi.get<FetchNotesResponse>('/notes', {
        params: {
            ...params,
            perPage: 12,
        },
    });

    return data;
}

export async function fetchNoteById(id: string, cookie?: string) {
    const serverApi = createServerApi(cookie);

    const { data } = await serverApi.get<Note>(`/notes/${id}`);
    return data;
}

export async function checkSession(cookie?: string) {
    const serverApi = createServerApi(cookie);

    const { data } = await serverApi.get<User | null>('/auth/session');
    return data;
}

export async function getMe(cookie?: string) {
    const serverApi = createServerApi(cookie);

    const { data } = await serverApi.get<User>('/users/me');
    return data;
}

export async function checkServerSession(cookieHeader: string) {

    return axios.get(`${baseURL}/auth/session`, {
        withCredentials: true,
        headers: {
            Cookie: cookieHeader,
        },
    });
}