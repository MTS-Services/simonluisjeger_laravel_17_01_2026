import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Build a URL for a storage path. Prefer backend-provided url when available.
 * For relative paths (e.g. frames/backgrounds/x.jpg) returns /storage/frames/backgrounds/x.jpg.
 * Normalizes backslashes for Windows paths.
 */
export function toStorageUrl(path: string | null | undefined): string | null {
    if (!path || typeof path !== 'string') return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const normalized = path.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!normalized) return null;
    const withStorage = normalized.toLowerCase().startsWith('storage') ? normalized : `storage/${normalized}`;
    return `/${withStorage.replace(/^\/+/, '')}`;
}
