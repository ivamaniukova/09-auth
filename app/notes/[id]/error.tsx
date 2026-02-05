'use client';

import css from './NoteDetails.module.css';

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ reset }: Props) {
    return (
        <div>
            <p className={css.error}>Something went wrong. Please try again.</p>
            <button className={css.backBtn} type="button" onClick={() => reset()}>
                Try again
            </button>
        </div>
    );
}
