import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { toStorageUrl } from '@/lib/utils';
import type { FrameElement } from '@/types/frame';

interface ElementModalProps {
    element: FrameElement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ElementModal({ element, open, onOpenChange }: ElementModalProps) {
    if (!element) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{element.title || element.name}</DialogTitle>
                    {element.description && (
                        <DialogDescription>{element.description}</DialogDescription>
                    )}
                </DialogHeader>
                <div className="mt-4">
                    {element.media_type === 'video' && (element.media_file_url ?? toStorageUrl(element.media_url)) && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/70">
                            <video
                                src={element.media_file_url ?? toStorageUrl(element.media_url)!}
                                controls
                                className="h-full w-full object-cover"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                    {element.media_type === 'image' && (element.media_file_url ?? toStorageUrl(element.media_url)) && (
                        <div className="flex max-h-130 w-full items-center justify-center overflow-hidden rounded-xl bg-muted">
                            <img
                                src={element.media_file_url ?? toStorageUrl(element.media_url)!}
                                alt={element.title || element.name}
                                className="max-h-130 w-full object-contain"
                            />
                        </div>
                    )}
                    {!element.media_type && !element.media_url && (
                        <div className="flex items-center justify-center rounded-xl bg-muted py-16">
                            <p className="text-muted-foreground text-sm">No media available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
