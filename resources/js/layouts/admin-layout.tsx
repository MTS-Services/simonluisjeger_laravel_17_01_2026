import * as React from 'react';
import { AdminSidebar } from '@/layouts/partials/admin/sidebar';
import { AdminHeader } from '@/layouts/partials/admin/header';
import { AdminFooter } from './partials/admin/footer';
import { useAppearance } from '@/hooks/use-appearance';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeSlug?: string | null;
}

export default function AdminLayout({ children, activeSlug }: AdminLayoutProps) {

    const { appearance, updateAppearance } = useAppearance();
    React.useEffect(() => {
        if (appearance !== 'light') {
            updateAppearance('light');
        }
    }, [appearance, updateAppearance]);
    return (
        <div className="relative flex h-full max-h-screen min-h-screen bg-background flex-col">
            <AdminHeader activeSlug={activeSlug} />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
                {children}
            </main>
            <AdminFooter />
        </div>
    );
}
