import FrontedLayoutTemplate from '@/layouts/app/frontend-template';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface FrontendLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: FrontendLayoutProps) => (
    <FrontedLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </FrontedLayoutTemplate>
);
