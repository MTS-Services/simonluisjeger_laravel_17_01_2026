import { router } from '@inertiajs/react';
import { Edit2, GripVertical, Layers, Plus, RotateCcw, RotateCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, toStorageUrl } from '@/lib/utils';
import type { Frame, FrameElement, ElementLayout } from '@/types/frame';

interface ElementListSidebarProps {
    frame: Frame;
    selectedElementId: number | null;
    onSelectElement: (id: number | null) => void;
    onAddElement: () => void;
    onEditElement: (element: FrameElement) => void;
    editMode: boolean;
    layouts: ElementLayout[];
    onLayoutChange: (layouts: ElementLayout[]) => void;
}

export function ElementListSidebar({
    frame,
    selectedElementId,
    onSelectElement,
    onAddElement,
    onEditElement,
    editMode,
    layouts,
    onLayoutChange,
}: ElementListSidebarProps) {

    function handleDelete(element: FrameElement) {
        if (!confirm(`Delete "${element.name}"? This cannot be undone.`)) return;
        router.delete(`/admin/frame-elements/${element.id}`, {
            preserveScroll: true,
        });
    }

    function handleZIndexChange(elementId: number, delta: number) {
        const updated = layouts.map((l) =>
            l.id === elementId ? { ...l, z_index: Math.max(0, Math.min(9999, l.z_index + delta)) } : l,
        );
        onLayoutChange(updated);
    }

    function handleRotationChange(elementId: number, delta: number) {
        const updated = layouts.map((l) =>
            l.id === elementId
                ? {
                    ...l,
                    rotation: Math.max(-360, Math.min(360, (l.rotation ?? 0) + delta)),
                }
                : l,
        );
        onLayoutChange(updated);
    }

    function getLayout(element: FrameElement): ElementLayout {
        return layouts.find((l) => l.id === element.id) ?? {
            id: element.id,
            x_pct: element.x_pct,
            y_pct: element.y_pct,
            w_pct: element.w_pct,
            h_pct: element.h_pct,
            z_index: element.z_index,
            rotation: element.rotation ?? 0,
        };
    }

    function setRotation(elementId: number, rotation: number) {
        const clamped = Math.max(-360, Math.min(360, rotation));
        const updated = layouts.map((l) => (l.id === elementId ? { ...l, rotation: clamped } : l));
        onLayoutChange(updated);
    }

    return (
        <div className="flex h-full flex-col border-r bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Elements</h3>
                {editMode && (
                    <Button size="sm" variant="outline" onClick={onAddElement}>
                        <Plus className="mr-1 size-3.5" />
                        Add
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                    {frame.elements.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Layers className="mb-2 size-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No elements yet</p>
                            {editMode && (
                                <Button size="sm" variant="link" onClick={onAddElement} className="mt-1">
                                    Add your first element
                                </Button>
                            )}
                        </div>
                    )}

                    {frame.elements.map((element) => {
                        const layout = getLayout(element);
                        const isSelected = selectedElementId === element.id;

                        return (
                            <div key={element.id} className="space-y-1">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors cursor-pointer',
                                                isSelected
                                                    ? 'bg-accent text-accent-foreground'
                                                    : 'hover:bg-accent/50',
                                            )}
                                            onClick={() => onSelectElement(isSelected ? null : element.id)}
                                        >
                                            {editMode && (
                                                <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
                                            )}

                                            <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded border bg-background">
                                                <img
                                                    src={element.overlay_image_url ?? toStorageUrl(element.overlay_image) ?? ''}
                                                    alt={element.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-xs font-medium">
                                                    {element.name}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                        z: {layout.z_index}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                                        r: {(layout.rotation ?? 0).toFixed(1)}°
                                                    </Badge>
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleZIndexChange(element.id, 1);
                                                        }}
                                                        title="Move layer up"
                                                    >
                                                        <Layers className="size-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditElement(element);
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="size-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRotationChange(element.id, -5);
                                                        }}
                                                        title="Rotate -5°"
                                                    >
                                                        <RotateCcw className="size-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRotationChange(element.id, 5);
                                                        }}
                                                        title="Rotate +5°"
                                                    >
                                                        <RotateCw className="size-3" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="size-6 text-destructive hover:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(element);
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="size-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p className="font-medium">{element.title || element.name}</p>
                                        {element.description && (
                                            <p className="text-xs opacity-80 max-w-48 truncate">{element.description}</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>

                                {editMode && isSelected && (
                                    <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
                                        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                                            <span>Rotation</span>
                                            <span>{(layout.rotation ?? 0).toFixed(1)}°</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={-180}
                                            max={180}
                                            step={1}
                                            value={layout.rotation ?? 0}
                                            onChange={(e) => setRotation(element.id, parseFloat(e.target.value))}
                                            className="mt-2 w-full accent-primary"
                                        />
                                        <div className="mt-2 flex items-center gap-2">
                                            <Label htmlFor={`rotation-${element.id}`} className="text-[11px] text-muted-foreground">
                                                Degrees
                                            </Label>
                                            <Input
                                                id={`rotation-${element.id}`}
                                                type="number"
                                                min={-360}
                                                max={360}
                                                step={0.5}
                                                value={layout.rotation ?? 0}
                                                onChange={(e) => setRotation(element.id, parseFloat(e.target.value) || 0)}
                                                className="h-7 text-xs"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-[11px]"
                                                onClick={() => setRotation(element.id, 0)}
                                            >
                                                Reset
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}
