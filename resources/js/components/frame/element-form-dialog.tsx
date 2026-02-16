import { useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Frame, FrameElement } from '@/types/frame';

interface ElementFormDialogProps {
    frame: Frame;
    element?: FrameElement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ElementFormDialog({ frame, element, open, onOpenChange }: ElementFormDialogProps) {
    const isEditing = !!element;
    const overlayRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        title: string;
        description: string;
        overlay_image: File | null;
        media_file: File | null;
        media_type: string;
        z_index: number;
    }>({
        name: element?.name ?? '',
        title: element?.title ?? '',
        description: element?.description ?? '',
        overlay_image: null,
        media_file: null,
        media_type: element?.media_type ?? '',
        z_index: element?.z_index ?? 1,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const url = isEditing
            ? `/admin/frame-elements/${element!.id}`
            : `/admin/frames/${frame.id}/elements`;

        post(url, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onOpenChange(false);
                if (overlayRef.current) overlayRef.current.value = '';
                if (mediaRef.current) mediaRef.current.value = '';
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Element' : 'Add New Element'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Element name"
                            required={!isEditing}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Display title"
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Element description"
                            rows={3}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="overlay_image">
                            Overlay Image {!isEditing && '*'}
                        </Label>
                        <Input
                            ref={overlayRef}
                            id="overlay_image"
                            type="file"
                            accept="image/*"
                            required={!isEditing}
                            onChange={(e) => setData('overlay_image', e.target.files?.[0] ?? null)}
                        />
                        {errors.overlay_image && <p className="text-sm text-destructive">{errors.overlay_image}</p>}
                        {isEditing && element?.overlay_image && (
                            <p className="text-xs text-muted-foreground">Current: {element.overlay_image.split('/').pop()}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="media_file">Detail Media (Image or Video)</Label>
                        <Input
                            ref={mediaRef}
                            id="media_file"
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => setData('media_file', e.target.files?.[0] ?? null)}
                        />
                        {errors.media_file && <p className="text-sm text-destructive">{errors.media_file}</p>}
                        {isEditing && element?.media_url && (
                            <p className="text-xs text-muted-foreground">
                                Current: {element.media_type} - {element.media_url.split('/').pop()}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="z_index">Z-Index (Layer Order)</Label>
                        <Input
                            id="z_index"
                            type="number"
                            min={0}
                            max={9999}
                            value={data.z_index}
                            onChange={(e) => setData('z_index', parseInt(e.target.value) || 0)}
                        />
                        {errors.z_index && <p className="text-sm text-destructive">{errors.z_index}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEditing ? 'Update Element' : 'Add Element'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
