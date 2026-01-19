import * as React from 'react';
import { cn } from '@/lib/utils';
import { type NavItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavItem } from '@/components/ui/nav-item';
// Navigation configuration
const adminNavItems: NavItemType[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
        slug: 'dashboard',
    },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    activeSlug?: string | null;
}

export const AdminSidebar = React.memo<AdminSidebarProps>(({ isCollapsed, activeSlug }) => {
    const { url } = usePage();
    const currentRoute = url;

    return (
        <aside
            className={cn(
                'relative hidden h-screen border-r bg-background',
                'transition-all duration-300 ease-in-out',
                'md:flex flex-col',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Logo Section */}
            <div className={cn(
                "flex h-16 items-center border-b",
                isCollapsed ? "justify-center px-2" : "px-6"
            )}>
                <Link
                    href="/"
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                >
                    {isCollapsed ? (
                        <LayoutGrid className="h-6 w-6 text-primary" />
                    ) : (
                        <AppLogo />
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                <nav className="space-y-1">
                    {adminNavItems.map((item, index) => (
                        <NavItem
                            key={`${item.title}-${index}`}
                            item={item}
                            isCollapsed={isCollapsed}
                            currentRoute={currentRoute}
                            isActive={activeSlug === item.slug}
                        />
                    ))}
                </nav>
            </div>

            {/* Footer Section (Optional) */}
            {!isCollapsed && (
                <div className="border-t p-4">
                    <div className="text-xs text-muted-foreground text-center">
                        v1.0.0
                    </div>
                </div>
            )}
        </aside>
    );
});

AdminSidebar.displayName = 'AdminSidebar';