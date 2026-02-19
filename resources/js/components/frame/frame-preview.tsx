import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn, toStorageUrl } from '@/lib/utils';
import type { Frame, FrameElement, ElementLayout } from '@/types/frame';
import { ElementModal } from '@/components/frame/element-modal';

type ElementMediaOverride = Partial<Pick<FrameElement, 'media_type' | 'media_url' | 'media_file_url' | 'title' | 'description'>>;

interface FramePreviewProps {
    frame: Frame;
    layouts?: ElementLayout[];
    className?: string;
    style?: CSSProperties;
    activeElementId?: number | null;
    onElementClick?: (element: FrameElement) => void;
    bgPreviewUrl?: string | null;
    basePreviewUrl?: string | null;
    showElementModal?: boolean;
    resolveElementMedia?: (element: FrameElement) => ElementMediaOverride | null;
}

export function FramePreview({
    frame,
    layouts,
    className,
    style,
    activeElementId,
    onElementClick,
    bgPreviewUrl,
    basePreviewUrl,
    showElementModal = true,
    resolveElementMedia,
}: FramePreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [hoveredElementId, setHoveredElementId] = useState<number | null>(null);
    const [modalElement, setModalElement] = useState<FrameElement | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

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

    const getLayout = (element: FrameElement): ElementLayout => {
        if (!layouts) {
            return {
                id: element.id,
                x_pct: element.x_pct,
                y_pct: element.y_pct,
                w_pct: element.w_pct,
                h_pct: element.h_pct,
                z_index: element.z_index,
                rotation: element.rotation ?? 0,
            };
        }

        return (
            layouts.find((layout) => layout.id === element.id) ?? {
                id: element.id,
                x_pct: element.x_pct,
                y_pct: element.y_pct,
                w_pct: element.w_pct,
                h_pct: element.h_pct,
                z_index: element.z_index,
                rotation: element.rotation ?? 0,
            }
        );
    };

    return (
        <div ref={containerRef} className={cn('w-full', className)} style={{ maxWidth: frame.design_width, ...style }}>
            {containerSize.width > 0 ? (
                <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ width: containerSize.width, height: containerSize.height }}
                >
                    {(bgPreviewUrl ?? frame.bg_image_url ?? toStorageUrl(frame.bg_image)) && (
                        <img
                            key={bgPreviewUrl ?? frame.bg_image ?? 'bg'}
                            src={`${(bgPreviewUrl ?? frame.bg_image_url ?? toStorageUrl(frame.bg_image))!}${!bgPreviewUrl && frame.updated_at ? `?v=${frame.updated_at}` : ''}`}
                            alt="Frame backgrounddd"
                            className="absolute inset-0 h-full w-full object-cover"
                            draggable={false}
                        />
                    )}

                    {(basePreviewUrl ?? frame.base_svg_url ?? toStorageUrl(frame.base_svg)) && (
                        <img
                            key={basePreviewUrl ?? frame.base_svg ?? 'base'}
                            src={`${(basePreviewUrl ?? frame.base_svg_url ?? toStorageUrl(frame.base_svg))!}${!basePreviewUrl && frame.updated_at ? `?v=${frame.updated_at}` : ''}`}
                            alt="Base SVG"
                            className="absolute inset-0 h-full w-full object-contain"
                            draggable={false}
                        />
                    )}

                    {frame.elements.map((element, index) => {
                        const layout = getLayout(element);
                        const x = (layout.x_pct / 100) * containerSize.width;
                        const y = (layout.y_pct / 100) * containerSize.height;
                        const w = (layout.w_pct / 100) * containerSize.width;
                        const h = (layout.h_pct / 100) * containerSize.height;

                        const isActive = activeElementId === element.id;
                        const isHovered = hoveredElementId === element.id;

                        let highlightColor: string | null = null;
                        if (isActive && element.active_color) {
                            highlightColor = element.active_color;
                        } else if (isHovered && element.hover_color) {
                            highlightColor = element.hover_color;
                        }

                        return (
                            <div
                                key={element.id}
                                className="frame-element-clickable absolute cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105"
                                style={{
                                    left: x,
                                    top: y,
                                    width: w,
                                    height: h,
                                    zIndex: layout.z_index,
                                    rotate: layout.rotation ? `${layout.rotation}deg` : undefined,
                                    animationDelay: `${index * 0.4}s`,
                                    filter: highlightColor
                                        ? `brightness(1.15) drop-shadow(0 0 1px ${highlightColor}) drop-shadow(0 0 3px ${highlightColor})`
                                        : undefined,
                                }}
                                onMouseEnter={() => setHoveredElementId(element.id)}
                                onMouseLeave={() => setHoveredElementId(null)}
                                onClick={() => {
                                    onElementClick?.(element);
                                    if (showElementModal) {
                                        let modalData: FrameElement = element;
                                        if (resolveElementMedia) {
                                            const override = resolveElementMedia(element);
                                            if (override) {
                                                modalData = { ...element, ...override };
                                            }
                                        }
                                        setModalElement(modalData);
                                        setModalOpen(true);
                                    }
                                }}
                                title={element.title || element.name}
                            >
                                {(() => {
                                    const src = element.overlay_image_url ?? toStorageUrl(element.overlay_image);
                                    if (!src) return null;
                                    return (
                                        <img
                                            key={element.id}
                                            src={src}
                                            alt={element.name}
                                            className="h-full w-full object-contain"
                                            draggable={false}
                                        />
                                    );
                                })()}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div
                    className="flex items-center justify-center rounded-lg bg-muted"
                    style={{ aspectRatio: `${frame.design_width}/${frame.design_height}` }}
                >
                    <p className="text-muted-foreground text-sm">Loading preview...</p>
                </div>
            )}
            {showElementModal && (
                <ElementModal
                    element={modalElement}
                    open={modalOpen}
                    onOpenChange={(open) => {
                        setModalOpen(open);
                        if (!open) {
                            setModalElement(null);
                        }
                    }}
                />
            )}
        </div>
    );
}
