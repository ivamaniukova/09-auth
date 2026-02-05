import type { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

export default function AuthRoutesLayout({ children }: Props) {
    return <>{children}</>;
}