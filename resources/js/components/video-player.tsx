// VideoPlayer.tsx - Nuclear Option
import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
    src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create video element directly in DOM
        const video = document.createElement('video');
        video.src = src;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.controls = true;
        video.className = 'w-full h-full';
        video.style.display = 'block';

        container.appendChild(video);

        video.play().catch(() => { });

        return () => {
            container.removeChild(video);
        };
    }, [src]);

    return <div ref={containerRef} className="w-full h-full" />;
}