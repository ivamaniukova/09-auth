import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import css from './ProfilePage.module.css';
import { getMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
    title: 'Profile | NoteHub',
    description: 'User profile page',
};

export default async function ProfilePage() {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : '',
        refreshToken ? `refreshToken=${refreshToken}` : '',
    ]
        .filter(Boolean)
        .join('; ');

    try {
        const user = await getMe(cookieHeader);

        return (
            <main className={css.mainContent}>
                <div className={css.profileCard}>
                    <div className={css.header}>
                        <h1 className={css.formTitle}>Profile Page</h1>

                        <Link href="/profile/edit" className={css.editProfileButton}>
                            Edit Profile
                        </Link>
                    </div>

                    <div className={css.avatarWrapper}>
                        <Image
                            src={user.avatar}
                            alt="User Avatar"
                            width={120}
                            height={120}
                            className={css.avatar}
                            priority
                        />
                    </div>

                    <div className={css.profileInfo}>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                    </div>
                </div>
            </main>
        );
    } catch {
        redirect('/sign-in');
    }
}