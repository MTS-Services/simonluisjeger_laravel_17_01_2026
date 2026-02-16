import { useCallback, useEffect, useRef, useState } from 'react';
import FrontendLayout from '@/layouts/frontend-layout';
import { ElementModal } from '@/components/frame/element-modal';
import { toStorageUrl } from '@/lib/utils';
import type { Frame, FrameElement } from '@/types/frame';

interface Props {
    frame: Frame | null;
}

export default function FrameViewer({ frame }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [modalElement, setModalElement] = useState<FrameElement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const aspectRatio = frame ? frame.design_width / frame.design_height : 16 / 9;

    const updateContainerSize = useCallback(() => {
        if (!containerRef.current) return;
        const parentWidth = containerRef.current.parentElement?.clientWidth ?? 0;
        const maxWidth = frame?.design_width ?? 1200;
        const width = Math.min(parentWidth, maxWidth);
        const height = width / aspectRatio;
        setContainerSize({ width, height });
    }, [aspectRatio, frame?.design_width]);

    useEffect(() => {
        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        return () => window.removeEventListener('resize', updateContainerSize);
    }, [updateContainerSize]);

    function handleElementClick(element: FrameElement) {
        setModalElement(element);
        setShowModal(true);
    }

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
                <div ref={containerRef} className="w-full" style={{ maxWidth: frame.design_width }}>
                    {containerSize.width > 0 && (
                        <div
                            className="relative overflow-hidden rounded-lg"
                            style={{
                                width: containerSize.width,
                                height: containerSize.height,
                                margin: '0 auto',
                            }}
                        >
                            {/* Background Image */}
                            {toStorageUrl(frame.bg_image) && (
                                <img
                                    src={toStorageUrl(frame.bg_image)!}
                                    alt="Frame background"
                                    className="absolute inset-0 h-full w-full object-cover"
                                    draggable={false}
                                />
                            )}

                            {/* Base SVG */}
                            {toStorageUrl(frame.base_svg) && (
                                <img
                                    src={toStorageUrl(frame.base_svg)!}
                                    alt="Base SVG"
                                    className="absolute inset-0 h-full w-full object-contain"
                                    draggable={false}
                                />
                            )}

                            {/* Overlay Elements */}
                            {frame.elements.map((element) => {
                                const x = (element.x_pct / 100) * containerSize.width;
                                const y = (element.y_pct / 100) * containerSize.height;
                                const w = (element.w_pct / 100) * containerSize.width;
                                const h = (element.h_pct / 100) * containerSize.height;

                                return (
                                    <div
                                        key={element.id}
                                        className="absolute cursor-pointer transition-transform duration-200 ease-out hover:scale-110"
                                        style={{
                                            left: x,
                                            top: y,
                                            width: w,
                                            height: h,
                                            zIndex: element.z_index,
                                        }}
                                        onClick={() => handleElementClick(element)}
                                        title={element.title || element.name}
                                    >
                                        <img
                                            src={toStorageUrl(element.overlay_image) ?? ''}
                                            alt={element.name}
                                            className="h-full w-full object-contain drop-shadow-lg"
                                            draggable={false}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <ElementModal
                element={modalElement}
                open={showModal}
                onOpenChange={setShowModal}
            />
        </FrontendLayout>
    );
}
