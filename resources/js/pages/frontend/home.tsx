import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Head } from "@inertiajs/react";
import { useAppearance } from "@/hooks/use-appearance";
import Text from "@/components/text";
import { FramePreview } from "@/components/frame/frame-preview";
import type { ElementLink, Frame, FrameElement } from "@/types/frame";
import { toStorageUrl } from "@/lib/utils";

interface ProjectUrl {
  label: string;
  url: string;
  type?: 'email';
}

function matchProjectForElement(element: FrameElement, projects: ProjectRecord[]): ProjectRecord | undefined {
  return projects.find((project) => project.key === element.name || project.title === element.title);
}

interface ProjectRecord {
  key: string;
  title: string;
  description: string;
  file_path: string;
  mime_type: string;
  file_url: string;
  urls: ProjectUrl[];
  date: string | null;
}
interface BackgroundRecord {
  id: number;
  text1?: string | null;
  text2?: string | null;
  background_color?: string | null;
  text_color?: string | null;
}

interface Props {
  projectData: ProjectRecord[];
  backgroundText: BackgroundRecord | null;
  frame: Frame | null;
}

const VIDEO_EXTENSIONS = ["mp4", "mov", "m4v", "webm", "avi"];
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

function inferElementMediaType(element: FrameElement): 'video' | 'image' | null {
  const rawType = element.media_type?.toLowerCase();
  if (rawType?.startsWith('video')) return 'video';
  if (rawType?.startsWith('image')) return 'image';

  const path = element.media_file_url ?? element.media_url ?? '';
  if (!path) return null;
  const [cleanPath] = path.split('?');
  const extension = cleanPath?.split('.').pop()?.toLowerCase();
  if (!extension) return null;
  if (VIDEO_EXTENSIONS.includes(extension)) return 'video';
  if (IMAGE_EXTENSIONS.includes(extension)) return 'image';
  return null;
}



export default function Home({ projectData, backgroundText, frame }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<FrameElement | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const { appearance, updateAppearance } = useAppearance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appearance !== 'light') {
      updateAppearance('light');
    }
  }, [appearance, updateAppearance]);

  const activeProject = useMemo(() => {
    return projectData.find(p => p.key === selectedId);
  }, [selectedId, projectData]);

  const handleFrameElementClick = (element: FrameElement) => {
    if (!element) return;
    const match = matchProjectForElement(element, projectData);
    setSelectedElement(element);
    setSelectedId(match ? match.key : null);
  };

  const selectedElementMedia = useMemo(() => {
    if (!selectedElement) return null;
    const normalizedType = inferElementMediaType(selectedElement);
    let src = selectedElement.media_file_url ?? toStorageUrl(selectedElement.media_url);

    if (!normalizedType || !src) {
      const fallbackProject = matchProjectForElement(selectedElement, projectData);
      if (!fallbackProject) return null;
      const isVideo = fallbackProject.mime_type.startsWith('video/');
      const isImage = fallbackProject.mime_type.startsWith('image/');
      if (!isVideo && !isImage) {
        return null;
      }
      src = fallbackProject.file_url;
      return {
        type: isVideo ? 'video' : 'image',
        src,
        title: fallbackProject.title,
        description: fallbackProject.description,
      };
    }

    return {
      type: normalizedType,
      src,
      title: selectedElement.title || selectedElement.name,
      description: selectedElement.description,
    };
  }, [selectedElement, projectData]);

  const panelMedia = useMemo(() => {
    if (selectedElementMedia) {
      return {
        kind: selectedElementMedia.type,
        src: selectedElementMedia.src,
        title: selectedElementMedia.title,
        description: selectedElementMedia.description,
      };
    }

    if (activeProject) {
      const isVideo = activeProject.mime_type.startsWith('video/');
      const isImage = activeProject.mime_type.startsWith('image/');
      if (!isVideo && !isImage) {
        return null;
      }
      return {
        kind: isVideo ? 'video' : 'image',
        src: activeProject.file_url,
        title: activeProject.title,
        description: activeProject.description,
      };
    }

    return null;
  }, [selectedElementMedia, activeProject]);

  const selectedElementLinks = useMemo<ProjectUrl[]>(() => {
    if (!selectedElement?.links?.length) {
      return [];
    }

    return selectedElement.links
      .filter((link: ElementLink) => link.label && link.url)
      .map<ProjectUrl>((link) => ({
        label: link.label,
        url: link.url,
        type: link.url.startsWith('mailto:') ? 'email' : undefined,
      }));
  }, [selectedElement]);

  const detailLinks = useMemo<ProjectUrl[]>(() => {
    if (selectedElementLinks.length) {
      return selectedElementLinks;
    }
    if (activeProject?.urls?.length) {
      return activeProject.urls;
    }
    return [];
  }, [selectedElementLinks, activeProject]);

  useEffect(() => {
    if (panelMedia?.src) {
      setMediaLoading(true);
    }
    if (videoRef.current && panelMedia?.kind === 'video') {
      videoRef.current.load();
    }
  }, [panelMedia?.src]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node) &&
        previewRef.current &&
        !previewRef.current.contains(event.target as Node)
      ) {
        setSelectedElement(null);
        setSelectedId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen p-4 items-center  h-auto w-full" style={{ backgroundColor: backgroundText?.background_color || '#d9d9d9' }}>
      <Head title="Simon Jeger" />
      <h2 className="text-4xl font-bold text-left mb-6 sm:mb-15 hover:cursor-pointer">Simon Jeger</h2>

      <div className="flex flex-col gap-4 lg:flex-row w-full h-auto lg:items-stretch items-center">
        <div ref={previewRef} className="w-full flex-1 flex items-center justify-center overflow-hidden pb-0 pt-6 lg:py-0 lg:h-full">
          <div className="w-full h-full flex items-center justify-center mt-20">
            {frame ? (
              <FramePreview
                frame={frame}
                className="mx-auto"
                showElementModal={false}
                activeElementId={selectedElement?.id ?? null}
                onElementClick={handleFrameElementClick}
              />
            ) : (
              <div className="text-center text-gray-500">Frame preview unavailable.</div>
            )}
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-stretch justify-center pt-0 p-6 md:p-8">
          {(activeProject || panelMedia) ? (
            <div ref={detailsRef} className="w-full h-full bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col">

              <div className="bg-zinc-900 border-b border-zinc-800 relative overflow-hidden flex-none ">

                {mediaLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-900">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-600 border-t-white" />
                    <p className="text-xs tracking-widest text-zinc-200">LOADING...</p>
                  </div>
                )}

                {panelMedia?.kind === 'image' && (
                  <img
                    src={panelMedia.src}
                    alt={panelMedia.title ?? 'Selected media'}
                    className="w-full h-auto max-h-[30vh] sm:max-h-[40vh] md:max-h-[45vh] lg:max-h-[55vh] xl:max-h-[60vh] object-cover"
                    style={{ willChange: 'auto' }}
                    onLoad={() => setMediaLoading(false)}
                  />
                )}

                {panelMedia?.kind === 'video' && (
                  <video
                    ref={videoRef}
                    key={panelMedia.src}
                    className="w-full h-auto bg-zinc-900 object-cover max-h-[30vh] sm:max-h-[40vh] md:max-h-[45vh] lg:max-h-[55vh] xl:max-h-[60vh]"
                    style={{ willChange: 'auto' }}
                    playsInline
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                    onCanPlay={() => setMediaLoading(false)}
                    onError={(e) => {
                      console.error('Video error:', e);
                      setMediaLoading(false);
                    }}
                  >
                    <source src={panelMedia.src} />
                  </video>
                )}
              </div>

              <div className="bg-[#010000] p-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-base lg:text-lg font-bold capitalize">
                    {activeProject?.title ?? selectedElementMedia?.title ?? 'Selected Project'}
                  </h2>
                  {activeProject?.date && (
                    <span className="text-sm font-bold opacity-80 mt-1">{activeProject.date}</span>
                  )}
                </div>

                <p className="text-sm lg:text-base mb-2 font-normal">
                  {activeProject?.description ?? selectedElementMedia?.description ?? 'Explore the highlighted element to learn more about this project.'}
                </p>

                {detailLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {detailLinks.map((link, index) => {
                      const isEmailLink = link.type === 'email' || link.url.startsWith('mailto:');
                      const href = isEmailLink && !link.url.startsWith('mailto:') ? `mailto:${link.url}` : link.url;
                      return (
                        <a
                          key={`${link.label}-${index}`}
                          href={href}
                          target={isEmailLink ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className="text-sm lg:text-base font-bold capitalize hover:underline transition-all"
                        >
                          {link.label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // <div className="">
            //   <Text>Salut</Text>
            //   <Text>I'm Simon, a</Text>
            //   <Text>Roboticist and Artist,</Text>
            //   <Text>currently doing my</Text>
            //   <Text>PhD at EPFL.</Text>
            //   <Text className="text-[#e6e6e6]">Click on one of my</Text>
            //   <Text className="text-[#e6e6e6]">projects to learn</Text>
            //   <Text className="text-[#e6e6e6]">more.</Text>
            // </div>

            <div className="">
              {backgroundText?.text1 && (
                <Text>
                  {backgroundText.text1
                    .split(/<br\s*\/?>/gi)
                    .map((line: string, index: number) => (
                      <Text key={index}>
                        {line}
                        {'\n'}
                      </Text>
                    ))}
                </Text>
              )}

              {backgroundText?.text2 && (
                <Text style={{ color: backgroundText?.text_color || '#e6e6e6' }}>{backgroundText.text2.split(/<br\s*\/?>/gi).map((line: string, index: number) => (
                  <Text style={{ color: backgroundText?.text_color || '#e6e6e6' }} key={index}>
                    {line}
                    {'\n'}
                  </Text>
                ))}</Text>
              )}
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
