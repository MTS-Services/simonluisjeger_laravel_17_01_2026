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
import type { Frame } from '@/types/frame';

interface FrameSettingsDialogProps {
    frame: Frame;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBackgroundPreviewChange?: (url: string | null) => void;
    onSaved?: () => void;
}

export function FrameSettingsDialog({
    frame,
    open,
    onOpenChange,
    onBackgroundPreviewChange,
    onSaved,
}: FrameSettingsDialogProps) {
    const bgRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        design_width: number;
        design_height: number;
        bg_image: File | null;
    }>({
        name: frame.name,
        design_width: frame.design_width,
        design_height: frame.design_height,
        bg_image: null,
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/frames/${frame.id}/background`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                if (bgRef.current) bgRef.current.value = '';
                onSaved?.();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Frame Settings</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="frame-name">Frame Name</Label>
                        <Input
                            id="frame-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="design-width">Design Width (px)</Label>
                            <Input
                                id="design-width"
                                type="number"
                                min={100}
                                max={5000}
                                value={data.design_width}
                                onChange={(e) => setData('design_width', parseInt(e.target.value) || 1200)}
                            />
                            {errors.design_width && <p className="text-sm text-destructive">{errors.design_width}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="design-height">Design Height (px)</Label>
                            <Input
                                id="design-height"
                                type="number"
                                min={100}
                                max={5000}
                                value={data.design_height}
                                onChange={(e) => setData('design_height', parseInt(e.target.value) || 700)}
                            />
                            {errors.design_height && <p className="text-sm text-destructive">{errors.design_height}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bg-image">Background Image</Label>
                        <Input
                            ref={bgRef}
                            id="bg-image"
                            type="file"
                            accept="image/svg+xml/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setData('bg_image', file);
                                if (onBackgroundPreviewChange) {
                                    onBackgroundPreviewChange(file ? URL.createObjectURL(file) : null);
                                }
                            }}
                        />
                        {errors.bg_image && <p className="text-sm text-destructive">{errors.bg_image}</p>}
                        {frame.bg_image && (
                            <p className="text-xs text-muted-foreground">Current: {frame.bg_image.split('/').pop()}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
