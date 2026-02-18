import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';

export function AdminHeader({ activeSlug }: { activeSlug?: string | null }) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const cleanup = useMobileNavigation();
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-md max-w-480">
            <div className='flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
                <Link href={route('admin.frame.editor')}>Simon Jeger</Link>
                <div className="flex items-center gap-4">
                    <Button variant={activeSlug === 'dashboard' ? 'default' : 'ghost'} size="sm" className="capitalize hidden">
                        <Link href={route('admin.dashboard')}>Information</Link>
                    </Button>
                    <Button variant={activeSlug === 'background_text' ? 'default' : 'ghost'} size="sm" className="capitalize ">
                        <Link href={route('admin.background_text')}>Background Text</Link>
                    </Button>
                </div>
                <Button asChild>
                    <Link
                        className="cursor-pointer flex items-center gap-2"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut className="mr-2" />
                        Log out
                    </Link>
                </Button>
            </div>
        </header>
    );
}
