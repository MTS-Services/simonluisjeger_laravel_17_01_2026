import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useMemo, useRef } from 'react';
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
import type { ElementLink, Frame, FrameElement } from '@/types/frame';
import { Plus, Trash2 } from 'lucide-react';

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

    const minimumLinkRows = 1;

    const emptyLinks = useMemo<ElementLink[]>(
        () =>
            Array.from({ length: minimumLinkRows }, () => ({
                label: '',
                url: '',
            })),
        [],
    );

    const initialLinks = useMemo(() => {
        const existing = element?.links?.length ? element.links.slice(0, 10) : [];
        const rowsNeeded = Math.max(minimumLinkRows - existing.length, 0);
        return [...existing, ...emptyLinks.slice(0, rowsNeeded)];
    }, [element?.links, emptyLinks]);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        title: string;
        description: string;
        overlay_image: File | null;
        media_file: File | null;
        media_type: string;
        z_index: number;
        rotation: number;
        hover_color: string;
        active_color: string;
        links: ElementLink[];
    }>({
        name: element?.name ?? '',
        title: element?.title ?? '',
        description: element?.description ?? '',
        overlay_image: null,
        media_file: null,
        media_type: element?.media_type ?? '',
        z_index: element?.z_index ?? 1,
        rotation: element?.rotation ?? 0,
        hover_color: element?.hover_color ?? '',
        active_color: element?.active_color ?? '',
        links: initialLinks,
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        setData({
            name: element?.name ?? '',
            title: element?.title ?? '',
            description: element?.description ?? '',
            overlay_image: null,
            media_file: null,
            media_type: element?.media_type ?? '',
            z_index: element?.z_index ?? 1,
            rotation: element?.rotation ?? 0,
            hover_color: element?.hover_color ?? '',
            active_color: element?.active_color ?? '',
            links: element?.links?.length
                ? (() => {
                    const existing = element.links!.slice(0, 10);
                    const rowsNeeded = Math.max(minimumLinkRows - existing.length, 0);
                    return [...existing, ...emptyLinks.slice(0, rowsNeeded)];
                })()
                : emptyLinks,
        });

        if (overlayRef.current) {
            overlayRef.current.value = '';
        }
        if (mediaRef.current) {
            mediaRef.current.value = '';
        }
    }, [element, open, setData]);

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

    function handleLinkChange(index: number, field: keyof ElementLink, value: string) {
        const updated = data.links.map((link, i) => (i === index ? { ...link, [field]: value } : link));
        setData('links', updated);
    }

    function addLinkRow() {
        if (data.links.length >= 10) {
            return;
        }
        setData('links', [...data.links, { label: '', url: '' }]);
    }

    function removeLinkRow(index: number) {
        if (data.links.length <= minimumLinkRows) {
            const updated = data.links.map((link, i) => (i === index ? { label: '', url: '' } : link));
            setData('links', updated);
            return;
        }
        setData('links', data.links.filter((_, i) => i !== index));
    }

    const hasLinkFieldErrors = Object.keys(errors).some((key) => key.startsWith('links.'));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Element' : 'Add New Element'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Row 1: Name + Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    {/* Row 2: Description (full width) */}
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

                    {/* Row 3: Overlay Image + Detail Media */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Row 4: Z-Index + Rotation */}
                    <div className="grid grid-cols-2 gap-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="rotation">Rotation (degrees)</Label>
                            <Input
                                id="rotation"
                                type="number"
                                min={-360}
                                max={360}
                                step={1}
                                value={data.rotation}
                                onChange={(e) => setData('rotation', parseFloat(e.target.value) || 0)}
                            />
                            {errors.rotation && <p className="text-sm text-destructive">{errors.rotation}</p>}
                        </div>
                    </div>

                    {/* Row 5: Links (full width) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Links</Label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={addLinkRow}
                                disabled={data.links.length >= 10}
                            >
                                <Plus className="h-4 w-4" /> Add Link
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {data.links.map((link, index) => (
                                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                    <Input
                                        placeholder="Label"
                                        value={link.label}
                                        onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                        maxLength={255}
                                    />
                                    <Input
                                        placeholder="https://example.com"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        type="url"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeLinkRow(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        {hasLinkFieldErrors && (
                            <p className="text-sm text-destructive">Please ensure each link has a label and valid URL (max 10).</p>
                        )}
                    </div>

                    {/* Row 6: Hover Color + Active Color */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hover_color">Hover Color</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="hover_color_picker"
                                    type="color"
                                    value={data.hover_color || '#ffffff'}
                                    onChange={(e) => setData('hover_color', e.target.value)}
                                    className="h-9 w-9 shrink-0 cursor-pointer rounded border p-0.5"
                                />
                                <Input
                                    id="hover_color"
                                    value={data.hover_color}
                                    onChange={(e) => setData('hover_color', e.target.value)}
                                    placeholder="#ff0000"
                                    maxLength={9}
                                />
                                {data.hover_color && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0 px-2 text-xs"
                                        onClick={() => setData('hover_color', '')}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            {errors.hover_color && <p className="text-sm text-destructive">{errors.hover_color}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="active_color">Active Color</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="active_color_picker"
                                    type="color"
                                    value={data.active_color || '#ffffff'}
                                    onChange={(e) => setData('active_color', e.target.value)}
                                    className="h-9 w-9 shrink-0 cursor-pointer rounded border p-0.5"
                                />
                                <Input
                                    id="active_color"
                                    value={data.active_color}
                                    onChange={(e) => setData('active_color', e.target.value)}
                                    placeholder="#00ff00"
                                    maxLength={9}
                                />
                                {data.active_color && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="shrink-0 px-2 text-xs"
                                        onClick={() => setData('active_color', '')}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                            {errors.active_color && <p className="text-sm text-destructive">{errors.active_color}</p>}
                        </div>
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