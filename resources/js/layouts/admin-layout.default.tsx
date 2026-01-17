import AdminSidebarLayout from '@/layouts/app/admin-template';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface FrontendLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: FrontendLayoutProps) => (
    <AdminSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AdminSidebarLayout>
);
