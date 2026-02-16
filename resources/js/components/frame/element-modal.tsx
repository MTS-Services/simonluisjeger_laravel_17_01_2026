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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{element.title || element.name}</DialogTitle>
                    {element.description && (
                        <DialogDescription>{element.description}</DialogDescription>
                    )}
                </DialogHeader>
                <div className="mt-2">
                    {element.media_type === 'video' && (element.media_file_url ?? toStorageUrl(element.media_url)) && (
                        <video
                            src={element.media_file_url ?? toStorageUrl(element.media_url)!}
                            controls
                            className="w-full rounded-lg"
                            autoPlay={false}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {element.media_type === 'image' && (element.media_file_url ?? toStorageUrl(element.media_url)) && (
                        <img
                            src={element.media_file_url ?? toStorageUrl(element.media_url)!}
                            alt={element.title || element.name}
                            className="w-full rounded-lg object-contain"
                        />
                    )}
                    {!element.media_type && !element.media_url && (
                        <div className="flex items-center justify-center rounded-lg bg-muted py-16">
                            <p className="text-muted-foreground text-sm">No media available</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
