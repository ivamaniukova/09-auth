'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import css from './SignInPage.module.css';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type LoginBody = {
    email: string;
    password: string;
};

export default function SignInPage() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    const [error, setError] = useState<string>('');

    const mutation = useMutation({
        mutationFn: (body: LoginBody) => login(body),
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
            <form className={css.form} onSubmit={handleSubmit}>
                <h1 className={css.formTitle}>Sign in</h1>

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
                        Log in
                    </button>
                </div>

                <p className={css.error}>{error}</p>
            </form>
        </main>
    );
}