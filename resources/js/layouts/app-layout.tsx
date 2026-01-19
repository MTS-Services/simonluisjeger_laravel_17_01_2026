import { UserSidebar } from '@/layouts/partials/user/sidebar';
import { UserHeader } from '@/layouts/partials/user/header';
import { UserFooter } from '@/layouts/partials/user/footer';
import * as React from 'react';
import { Link } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <div className="flex min-h-screen">
            <header className='flex items-center justify-between gap-5'>
                <Link href={'/'}>Home</Link>
            </header>
            <main className="flex-1">{children}</main>
            <footer>
                <p>@2023 All rights reserved.</p>
            </footer>
        </div>
    );
}