'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import css from './EditProfilePage.module.css';
import { getMe, updateMe } from '@/lib/api/clientApi';

export default function EditProfilePage() {
    const router = useRouter();
    const [username, setUsername] = useState('');

    // 1️⃣ Отримуємо дані користувача
    const { data: user } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
    });

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user]);

    // 2️⃣ Оновлюємо дані користувача
    const mutation = useMutation({
        mutationFn: updateMe,
        onSuccess: () => {
            router.push('/profile');
        },
    });

    // submit форми
    const handleSubmit = (e: any) => {
        e.preventDefault();
        mutation.mutate({ username });
    };
    // скасування редагування
    const handleCancel = () => {
        router.back();
    };

    if (!user) return null;

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className={css.avatar}
                />

                <form className={css.profileInfo} onSubmit={handleSubmit}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            className={css.input}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <p>Email: {user.email}</p>

                    <div className={css.actions}>
                        <button type="submit" className={css.saveButton} disabled={mutation.isPending}>
                            Save
                        </button>

                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}