import { api } from './api';
import type { User } from '@/types/user';
import type { Note, NoteTag } from '@/types/note';

export type AuthCredentials = {
    email: string;
    password: string;
};

export type UpdateMeBody = {
    username: string;
};

export type FetchNotesParams = {
    page?: number;
    perPage?: number;
    search?: string;
    tag?: NoteTag | 'all';
};

export type FetchNotesResponse = {
    notes: Note[];
    totalPages: number;
};

export type CreateNoteBody = {
    title: string;
    content: string;
    tag: NoteTag;
};

export async function fetchNotes(params: FetchNotesParams) {
    const { data } = await api.get<FetchNotesResponse>('/notes', {
        params: {
            ...params,
            perPage: 12,
        },
    });

    return data;
}

export async function fetchNoteById(id: string) {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
}

export async function createNote(body: CreateNoteBody) {
    const { data } = await api.post<Note>('/notes', body);
    return data;
}

export async function deleteNote(id: string) {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
}

export async function register(body: AuthCredentials) {
    const { data } = await api.post<User>('/auth/register', body);
    return data;
}

export async function login(body: AuthCredentials) {
    const { data } = await api.post<User>('/auth/login', body);
    return data;
}

export async function logout() {
    await api.post('/auth/logout');
}

export async function checkSession() {
    const { data } = await api.get<User | null>('/auth/session');
    return data;
}

export async function getMe() {
    const { data } = await api.get<User>('/users/me');
    return data;
}

export async function updateMe(body: UpdateMeBody) {
    const { data } = await api.patch<User>('/users/me', body);
    return data;
}