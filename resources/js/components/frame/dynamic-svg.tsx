import { useEffect, useState, useRef } from 'react';

interface DynamicSvgProps {
    src: string;
    strokeColor?: string | null;
    className?: string;
    alt?: string;
}

export function DynamicSvg({ src, strokeColor, className, alt }: DynamicSvgProps) {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchSvg = async () => {
            try {
                const response = await fetch(src);
                if (!response.ok) {
                    throw new Error('Failed to fetch SVG');
                }
                const text = await response.text();
                if (isMounted) {
                    setSvgContent(text);
                    setError(false);
                }
            } catch (err) {
                console.error('Error loading SVG:', err);
                if (isMounted) {
                    setError(true);
                }
            }
        };

        fetchSvg();

        return () => {
            isMounted = false;
        };
    }, [src]);

    useEffect(() => {
        if (!svgContent || !containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = svgContent;

        const svgElement = container.querySelector('svg');
        if (!svgElement) return;

        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');
        svgElement.style.display = 'block';

        const elementsToStyle = svgElement.querySelectorAll('path, polygon, polyline, rect, circle, ellipse, line');

        elementsToStyle.forEach((element) => {
            if (strokeColor) {
                element.setAttribute('stroke', strokeColor);
                const currentStrokeWidth = element.getAttribute('stroke-width');
                if (!currentStrokeWidth || parseFloat(currentStrokeWidth) < 2) {
                    element.setAttribute('stroke-width', '2');
                }
            } else {
                const originalStroke = element.getAttribute('data-original-stroke');
                const originalStrokeWidth = element.getAttribute('data-original-stroke-width');

                if (!element.hasAttribute('data-original-stroke')) {
                    element.setAttribute('data-original-stroke', element.getAttribute('stroke') || '#000000');
                    element.setAttribute('data-original-stroke-width', element.getAttribute('stroke-width') || '1');
                }

                if (originalStroke) {
                    element.setAttribute('stroke', originalStroke);
                }
                if (originalStrokeWidth) {
                    element.setAttribute('stroke-width', originalStrokeWidth);
                }
            }

            element.setAttribute('style', `transition: stroke 0.2s, stroke-width 0.2s;`);
        });
    }, [svgContent, strokeColor]);

    if (error) {
        return (
            <img
                src={src}
                alt={alt || 'SVG'}
                className={className}
                draggable={false}
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
