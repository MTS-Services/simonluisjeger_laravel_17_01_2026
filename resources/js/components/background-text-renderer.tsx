import Text from '@/components/text';
import type { FrameElement } from '@/types/frame';

interface BackgroundTextRendererProps {
    text: string;
    linkWord?: string | null;
    linkTarget?: string | null;
    frameElements?: FrameElement[] | null;
    onElementClick?: (element: FrameElement) => void;
    previewMode?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

function isExternalLink(target: string): boolean {
    return target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:');
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function BackgroundTextRenderer({
    text,
    linkWord,
    linkTarget,
    frameElements,
    onElementClick,
    previewMode = false,
    className,
    style,
}: BackgroundTextRendererProps) {
    const normalizedLinkWord = linkWord?.trim() || '';
    const normalizedLinkTarget = linkTarget?.trim() || '';

    if (!text) {
        return null;
    }

    const matchedElement =
        frameElements?.find(
            (element) => element.name?.toLowerCase() === normalizedLinkTarget.toLowerCase()
        ) ?? null;
    const externalLink = normalizedLinkTarget && isExternalLink(normalizedLinkTarget) ? normalizedLinkTarget : null;

    const renderLinkedText = (content: string, key: string | number) => {
        if (externalLink) {
            return (
                <a
                    key={key}
                    href={externalLink}
                    target={externalLink.startsWith('mailto:') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-2 underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                >
                    {content}
                </a>
            );
        }

        if (matchedElement) {
            return (
                <button
                    key={key}
                    type="button"
                    onClick={() => onElementClick?.(matchedElement)}
                    className="font-bold underline decoration-2 underline-offset-2 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                >
                    {content}
                </button>
            );
        }

        return (
            <span key={key} className="font-bold underline decoration-2 underline-offset-2 rounded">
                {content}
            </span>
        );
    };

    return (
        <>
            {text.split(/<br\s*\/?>/gi).map((line: string, lineIndex: number) => {
                const hasInlineLink = /<a>.*?<\/a>/i.test(line);
                const escapedLinkWord = normalizedLinkWord ? escapeRegExp(normalizedLinkWord) : '';
                const wordMatch = escapedLinkWord ? new RegExp(escapedLinkWord, 'i').test(line) : false;

                if (
                    hasInlineLink ||
                    (normalizedLinkWord &&
                        normalizedLinkTarget &&
                        (externalLink || matchedElement || previewMode) &&
                        wordMatch)
                ) {
                    const inlineParts = line.split(/(<a>.*?<\/a>)/gi);

                    return (
                        <Text key={lineIndex} className={className} style={style}>
                            {inlineParts.map((part, partIndex) => {
                                const inlineMatch = part.match(/^<a>(.*?)<\/a>$/i);
                                if (inlineMatch) {
                                    return renderLinkedText(inlineMatch[1], `${lineIndex}-${partIndex}`);
                                }

                                return part;
                            })}
                            {'\n'}
                        </Text>
                    );
                }

                if (!normalizedLinkWord || !normalizedLinkTarget || (!externalLink && !matchedElement && !previewMode) || !wordMatch) {
                    return (
                        <Text key={lineIndex} className={className} style={style}>
                            {line}
                            {'\n'}
                        </Text>
                    );
                }

                const parts = line.split(new RegExp(`(${escapedLinkWord})`, 'gi'));

                return (
                    <Text key={lineIndex} className={className} style={style}>
                        {parts.map((part, partIndex) =>
                            part.toLowerCase() === normalizedLinkWord.toLowerCase()
                                ? renderLinkedText(part, `${lineIndex}-${partIndex}`)
                                : part
                        )}
                        {'\n'}
                    </Text>
                );
            })}
        </>
    );
}
