'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { checkSession, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const PRIVATE_PREFIXES = ['/profile', '/notes'];

type Props = {
    children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();

    const [loading, setLoading] = useState(true);

    const isPrivateRoute = useMemo(
        () => PRIVATE_PREFIXES.some((p) => pathname.startsWith(p)),
        [pathname]
    );

    useEffect(() => {
        let active = true;

        async function run() {
            setLoading(true);

            if (!isPrivateRoute && !isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const user = await checkSession();

                if (!active) return;

                if (user) {
                    setUser(user);
                    setLoading(false);
                    return;
                }

                clearIsAuthenticated();

                if (isPrivateRoute) {
                    try {
                        await logout();
                    } catch {
                        // ignore
                    }
                    router.replace('/sign-in');
                }

                setLoading(false);
            } catch {

                clearIsAuthenticated();

                if (isPrivateRoute) {
                    try {
                        await logout();
                    } catch {
                    }
                    router.replace('/sign-in');
                }

                setLoading(false);
            }
        }

        run();

        return () => {
            active = false;
        };
    }, [pathname, isPrivateRoute, router, setUser, clearIsAuthenticated]);

    if (loading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                Loading...
            </div>
        );
    }

    if (isPrivateRoute && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}