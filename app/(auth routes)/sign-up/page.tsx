'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import css from './SignUpPage.module.css';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type RegisterBody = {
    email: string;
    password: string;
};

export default function SignUpPage() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    const [error, setError] = useState<string>('');

    const mutation = useMutation({
        mutationFn: (body: RegisterBody) => register(body),
        onSuccess: (user) => {
            setUser(user);
            router.push('/profile');
        },
        onError: () => {
            setError('Error');
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get('email') ?? '');
        const password = String(formData.get('password') ?? '');

        mutation.mutate({ email, password });
    };

    return (
        <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>

            <form className={css.form} onSubmit={handleSubmit}>
                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className={css.input} required />
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className={css.input}
                        required
                    />
                </div>

                <div className={css.actions}>
                    <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
                        Register
                    </button>
                </div>

                {(error || mutation.isError) && <p className={css.error}>Error</p>}
            </form>
        </main>
    );
}