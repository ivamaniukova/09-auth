import css from './not-found.module.css';
import type { Metadata } from 'next';

const name = "NoteHub";
const description = "Sorry, the page you are looking for does not exist.";

export const metadata: Metadata = {
    title: `404 - Page not found | ${name}`,
    description: description,
    openGraph: {
        title: `404 - Page not found | ${name}`,
        description: description,
        url: "https://09-auth-pi-umber.vercel.app/404",
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

export default function GlobalNotFound() {
    return (
        <>
            <h1 className={css.title}>404 - Page not found</h1>
            <p className={css.description}>
                Sorry, the page you are looking for does not exist.
            </p>
        </>
    );
}
