'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './AuthNavigation.module.css';

import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

export default function AuthNavigation() {
    const router = useRouter();
    const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        clearIsAuthenticated();
        router.push('/sign-in');
    };
    // ✅ Користувач не авторизований
    if (!isAuthenticated) {
        return (
            <>
                <li className={css.navigationItem}>
                    <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
                        Login
                    </Link>
                </li>

                <li className={css.navigationItem}>
                    <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
                        Sign up
                    </Link>
                </li>
            </>
        );
    }
    // ✅ Користувач авторизований
    return (
        <>
            <li className={css.navigationItem}>
                <Link href="/profile" prefetch={false} className={css.navigationLink}>
                    Profile
                </Link>
            </li>

            <li className={css.navigationItem}>
                <p className={css.userEmail}>{user?.email}</p>
                <button onClick={handleLogout} className={css.logoutButton}>
                    Logout
                </button>
            </li>
        </>
    );
}