import FrontendLayout from '@/layouts/frontend-layout';
import { FramePreview } from '@/components/frame/frame-preview';
import type { Frame } from '@/types/frame';

interface Props {
    frame: Frame | null;
}

export default function FrameViewer({ frame }: Props) {
    if (!frame) {
        return (
            <FrontendLayout>
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <p className="text-muted-foreground">No frame available.</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout>
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <FramePreview frame={frame} className="mx-auto" />
            </div>
        </FrontendLayout>
    );
}
