import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft = {
    title: "",
    content: "",
    tag: "Todo" as NoteTag,
};

type Draft = {
    title: string;
    content: string;
    tag: NoteTag;
};

type NoteStore = {
    draft: Draft;
    setDraft: (note: Draft) => void;
    clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note) => set({ draft: note }),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        {
            name: "notehub-draft",
            partialize: (state) => ({ draft: state.draft }),
        }
    )
);
