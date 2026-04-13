import { useMemo } from 'react';
import Text from '@/components/text';
import { cn } from '@/lib/utils';
import type { FrameElement } from '@/types/frame';

/** Minimal project shape for resolving text links to the same frame element as canvas clicks. */
export interface BackgroundTextLinkProject {
    key: string;
    title: string;
}

interface BackgroundTextRendererProps {
    text: string;
    linkWord?: string | null;
    linkTarget?: string | null;
    /** When set, opens this frame element (same as canvas). Takes precedence over name/key matching. */
    linkFrameElementId?: number | null;
    linkColor?: string | null;
    linkHoverColor?: string | null;
    linkUnderline?: boolean;
    frameElements?: FrameElement[] | null;
    /** When set, internal targets can match project key or title (same as canvas → panel behavior). */
    projects?: BackgroundTextLinkProject[] | null;
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

/**
 * Resolve an internal link string to a frame element, matching how the home page maps
 * canvas clicks to projects: element.name / element.title, then project key / title.
 */
export function resolveFrameElementForTextLink(
    target: string | null | undefined,
    frameElements: FrameElement[] | null | undefined,
    projects: BackgroundTextLinkProject[] | null | undefined,
    linkFrameElementId?: number | null
): FrameElement | null {
    const id = linkFrameElementId != null ? Number(linkFrameElementId) : NaN;
    if (!Number.isNaN(id) && id > 0 && frameElements?.length) {
        const byId = frameElements.find((el) => el.id === id) ?? null;
        if (byId) {
            return byId;
        }
    }

    const trimmed = target?.trim();
    if (!trimmed || !frameElements?.length) {
        return null;
    }

    if (/^\d+$/.test(trimmed)) {
        const byNumericId = frameElements.find((el) => String(el.id) === trimmed) ?? null;
        if (byNumericId) {
            return byNumericId;
        }
    }

    const lower = trimmed.toLowerCase();

    const byElement =
        frameElements.find(
            (el) =>
                el.name.toLowerCase() === lower ||
                (el.title?.trim() && el.title.trim().toLowerCase() === lower)
        ) ?? null;
    if (byElement) {
        return byElement;
    }

    if (!projects?.length) {
        return null;
    }

    const project = projects.find(
        (p) => p.key.toLowerCase() === lower || p.title.trim().toLowerCase() === lower
    );
    if (!project) {
        return null;
    }

    return (
        frameElements.find(
            (el) =>
                el.name === project.key ||
                (el.title?.trim() && el.title.trim() === project.title.trim())
        ) ?? null
    );
}

export default function BackgroundTextRenderer({
    text,
    linkWord,
    linkTarget,
    linkFrameElementId,
    linkColor,
    linkHoverColor,
    linkUnderline = true,
    frameElements,
    projects,
    onElementClick,
    previewMode = false,
    className,
    style,
}: BackgroundTextRendererProps) {
    const normalizedLinkWord = linkWord?.trim() || '';
    const normalizedLinkTarget = linkTarget?.trim() || '';
    const resolvedLinkColor = linkColor?.trim() || undefined;
    const resolvedLinkHoverColor = linkHoverColor?.trim() || undefined;

    const matchedElement = useMemo(
        () =>
            resolveFrameElementForTextLink(
                normalizedLinkTarget,
                frameElements ?? null,
                projects ?? null,
                linkFrameElementId ?? null
            ),
        [normalizedLinkTarget, frameElements, projects, linkFrameElementId]
    );

    const externalLink =
        normalizedLinkTarget && isExternalLink(normalizedLinkTarget) && !(linkFrameElementId != null && linkFrameElementId > 0)
            ? normalizedLinkTarget
            : null;

    const linkClassName = cn(
        'font-bold focus:outline-none focus:ring-2 focus:ring-white/50 rounded',
        // When no hover color is provided, keep the old behavior (slight fade on hover).
        !resolvedLinkHoverColor && 'hover:opacity-80',
        // When hover color is provided, use CSS variables so hover can override base color.
        (resolvedLinkColor || resolvedLinkHoverColor) && 'text-[color:var(--bt-link-color)]',
        resolvedLinkHoverColor && 'hover:text-[color:var(--bt-link-hover-color)]',
        linkUnderline && 'underline decoration-2 underline-offset-2'
    );

    const linkStyle: React.CSSProperties | undefined =
        resolvedLinkColor || resolvedLinkHoverColor
            ? ({
                  ...(resolvedLinkColor ? { ['--bt-link-color' as any]: resolvedLinkColor } : null),
                  ...(resolvedLinkHoverColor
                      ? { ['--bt-link-hover-color' as any]: resolvedLinkHoverColor }
                      : null),
              } satisfies React.CSSProperties)
            : undefined;

    const renderLinkedText = (content: string, key: string | number) => {
        if (externalLink) {
            return (
                <a
                    key={key}
                    href={externalLink}
                    target={externalLink.startsWith('mailto:') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className={linkClassName}
                    style={linkStyle}
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
                    data-background-text-internal-link="true"
                    onClick={() => onElementClick?.(matchedElement)}
                    className={linkClassName}
                    style={linkStyle}
                >
                    {content}
                </button>
            );
        }

        return (
            <span key={key} className={linkClassName} style={linkStyle}>
                {content}
            </span>
        );
    };

    if (!text) {
        return null;
    }

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
