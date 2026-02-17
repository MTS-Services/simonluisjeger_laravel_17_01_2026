import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Frame } from '@/types/frame';
import { FramePreview as FramePreviewCanvas } from '@/components/frame/frame-preview';

interface Props {
    frame: Frame | null;
}

export default function FramePreview({ frame }: Props) {
    return (
        <AdminLayout activeSlug="frame-editor">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">SVG Preview</h1>
                    <p className="text-sm text-muted-foreground">Exactly how the SVG appears on the public site.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={route('admin.frame.editor')}>
                        <ArrowLeft className="mr-1 size-3.5" /> Back to Editor
                    </Link>
                </Button>
            </div>

            <div className="rounded-lg border bg-card p-6">
                {frame ? (
                    <FramePreviewCanvas frame={frame} className="mx-auto" />
                ) : (
                    <p className="text-muted-foreground text-sm">No frame configured yet.</p>
                )}
            </div>
        </AdminLayout>
    );
}
