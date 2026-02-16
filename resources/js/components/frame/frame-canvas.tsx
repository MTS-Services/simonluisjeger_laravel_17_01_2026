import { useCallback, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import type { Frame, FrameElement, ElementLayout } from '@/types/frame';
import { cn, toStorageUrl } from '@/lib/utils';

interface FrameCanvasProps {
    frame: Frame;
    editMode: boolean;
    selectedElementId: number | null;
    onSelectElement: (id: number | null) => void;
    onElementClick: (element: FrameElement) => void;
    onLayoutChange: (layouts: ElementLayout[]) => void;
    layouts: ElementLayout[];
}

export function FrameCanvas({
    frame,
    editMode,
    selectedElementId,
    onSelectElement,
    onElementClick,
    onLayoutChange,
    layouts,
}: FrameCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const aspectRatio = frame.design_width / frame.design_height;

    const updateContainerSize = useCallback(() => {
        if (!containerRef.current) return;
        const parentWidth = containerRef.current.parentElement?.clientWidth ?? 0;
        const width = Math.min(parentWidth, frame.design_width);
        const height = width / aspectRatio;
        setContainerSize({ width, height });
    }, [aspectRatio, frame.design_width]);

    useEffect(() => {
        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        return () => window.removeEventListener('resize', updateContainerSize);
    }, [updateContainerSize]);

    const getElementLayout = (element: FrameElement): ElementLayout => {
        return layouts.find((l) => l.id === element.id) ?? {
            id: element.id,
            x_pct: element.x_pct,
            y_pct: element.y_pct,
            w_pct: element.w_pct,
            h_pct: element.h_pct,
            z_index: element.z_index,
        };
    };

    const pctToPx = (pct: number, dimension: number) => (pct / 100) * dimension;
    const pxToPct = (px: number, dimension: number) => (px / dimension) * 100;

    const handleDragStop = (elementId: number, x: number, y: number) => {
        const xPct = pxToPct(x, containerSize.width);
        const yPct = pxToPct(y, containerSize.height);

        const updated = layouts.map((l) =>
            l.id === elementId ? { ...l, x_pct: Math.max(0, xPct), y_pct: Math.max(0, yPct) } : l,
        );
        onLayoutChange(updated);
    };

    const handleResizeStop = (
        elementId: number,
        width: number,
        height: number,
        x: number,
        y: number,
    ) => {
        const wPct = pxToPct(width, containerSize.width);
        const hPct = pxToPct(height, containerSize.height);
        const xPct = pxToPct(x, containerSize.width);
        const yPct = pxToPct(y, containerSize.height);

        const updated = layouts.map((l) =>
            l.id === elementId
                ? {
                    ...l,
                    w_pct: Math.max(0.5, wPct),
                    h_pct: Math.max(0.5, hPct),
                    x_pct: Math.max(0, xPct),
                    y_pct: Math.max(0, yPct),
                }
                : l,
        );
        onLayoutChange(updated);
    };

    if (containerSize.width === 0) {
        return (
            <div ref={containerRef} className="w-full">
                <div className="flex items-center justify-center bg-muted rounded-lg" style={{ aspectRatio: `${frame.design_width}/${frame.design_height}` }}>
                    <p className="text-muted-foreground text-sm">Loading canvas...</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full">
            <div
                className="relative overflow-hidden rounded-lg border bg-muted"
                style={{
                    width: containerSize.width,
                    height: containerSize.height,
                }}
            >
                {/* Background Image - prefer backend URL so it loads from Laravel app */}
                {(frame.bg_image_url ?? toStorageUrl(frame.bg_image)) && (
                    <img
                        key={frame.bg_image ?? 'bg'}
                        src={`${(frame.bg_image_url ?? toStorageUrl(frame.bg_image))!}${frame.updated_at ? `?v=${frame.updated_at}` : ''}`}
                        alt="Frame background"
                        className="absolute inset-0 h-full w-full object-cover"
                        draggable={false}
                    />
                )}

                {/* Base SVG */}
                {(frame.base_svg_url ?? toStorageUrl(frame.base_svg)) && (
                    <img
                        key={frame.base_svg ?? 'base'}
                        src={`${(frame.base_svg_url ?? toStorageUrl(frame.base_svg))!}${frame.updated_at ? `?v=${frame.updated_at}` : ''}`}
                        alt="Base SVG"
                        className="absolute inset-0 h-full w-full object-contain"
                        draggable={false}
                    />
                )}

                {/* Overlay Elements */}
                {frame.elements.map((element) => {
                    const layout = getElementLayout(element);
                    const x = pctToPx(layout.x_pct, containerSize.width);
                    const y = pctToPx(layout.y_pct, containerSize.height);
                    const w = pctToPx(layout.w_pct, containerSize.width);
                    const h = pctToPx(layout.h_pct, containerSize.height);

                    if (editMode) {
                        return (
                            <Rnd
                                key={element.id}
                                position={{ x, y }}
                                size={{ width: w, height: h }}
                                bounds="parent"
                                onDragStop={(_e, d) => handleDragStop(element.id, d.x, d.y)}
                                onResizeStop={(_e, _dir, ref, _delta, position) => {
                                    handleResizeStop(
                                        element.id,
                                        ref.offsetWidth,
                                        ref.offsetHeight,
                                        position.x,
                                        position.y,
                                    );
                                }}
                                style={{ zIndex: layout.z_index }}
                                className={cn(
                                    'group',
                                    selectedElementId === element.id && 'ring-2 ring-blue-500 ring-offset-1',
                                )}
                                onMouseDown={() => onSelectElement(element.id)}
                                enableResizing={{
                                    top: true,
                                    right: true,
                                    bottom: true,
                                    left: true,
                                    topRight: true,
                                    bottomRight: true,
                                    bottomLeft: true,
                                    topLeft: true,
                                }}
                                resizeHandleStyles={{
                                    topLeft: handleStyle,
                                    topRight: handleStyle,
                                    bottomLeft: handleStyle,
                                    bottomRight: handleStyle,
                                    top: barHandleH,
                                    bottom: barHandleH,
                                    left: barHandleV,
                                    right: barHandleV,
                                }}
                            >
                                <img
                                    src={element.overlay_image_url ?? toStorageUrl(element.overlay_image) ?? ''}
                                    alt={element.name}
                                    className="h-full w-full object-contain pointer-events-none select-none"
                                    draggable={false}
                                />
                                <div className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <span className="absolute -top-5 left-0 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {element.name} (z: {layout.z_index})
                                </span>
                            </Rnd>
                        );
                    }

                    // View mode
                    return (
                        <div
                            key={element.id}
                            className="absolute cursor-pointer transition-transform duration-200 hover:scale-110"
                            style={{
                                left: x,
                                top: y,
                                width: w,
                                height: h,
                                zIndex: layout.z_index,
                            }}
                            onClick={() => onElementClick(element)}
                        >
                            <img
                                src={element.overlay_image_url ?? toStorageUrl(element.overlay_image) ?? ''}
                                alt={element.name}
                                className="h-full w-full object-contain"
                                draggable={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const handleStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    background: '#3b82f6',
    borderRadius: 2,
    border: '1px solid #fff',
};

const barHandleH: React.CSSProperties = {
    height: 4,
    background: '#3b82f6',
    borderRadius: 2,
    opacity: 0.5,
};

const barHandleV: React.CSSProperties = {
    width: 4,
    background: '#3b82f6',
    borderRadius: 2,
    opacity: 0.5,
};
