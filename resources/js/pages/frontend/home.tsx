import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Head } from "@inertiajs/react";
import { useAppearance } from "@/hooks/use-appearance";
import Text from "@/components/text";
import { FramePreview } from "@/components/frame/frame-preview";
import type { Frame, FrameElement } from "@/types/frame";
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

  useEffect(() => {
    if (videoRef.current && panelMedia?.kind === 'video') {
      videoRef.current.load();
    }
  }, [panelMedia?.src]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDetails = detailsRef.current?.contains(target);
      const clickedInsidePreview = previewRef.current?.contains(target);
      if (clickedInsideDetails || clickedInsidePreview) {
        return;
      }
      setSelectedId(null);
      setSelectedElement(null);
    };

    if (selectedId || selectedElement) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedId, selectedElement]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] p-20 py-24 h-auto w-full">
      <Head title="Simon Jeger" />
      <h2 className="text-4xl font-bold text-left mb-15">Simon Jeger</h2>

      <div className="flex flex-col lg:flex-row w-full h-auto items-center lg:items-start">
        <div ref={previewRef} className="w-full flex-1 flex items-center justify-center overflow-hidden pb-0 pt-6 lg:py-0 lg:h-full">
          <div className="w-full h-full flex items-center justify-center">
            {frame ? (
              <FramePreview
                frame={frame}
                className="mx-auto"
                showElementModal={false}
                onElementClick={handleFrameElementClick}
              />
            ) : (
              <div className="text-center text-gray-500">Frame preview unavailable.</div>
            )}
          </div>
        </div>

        <div className="w-full flex-1 flex items-start lg:items-center justify-center pt-0 p-6 md:p-8">
          {(activeProject || panelMedia) ? (
            <div ref={detailsRef} className="w-full bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="aspect-video bg-zinc-900 border-b border-zinc-800 relative">
                {panelMedia?.kind === 'image' && (
                  <img
                    src={panelMedia.src}
                    alt={panelMedia.title ?? 'Selected media'}
                    className="w-full h-full object-cover"
                  />
                )}
                {panelMedia?.kind === 'video' && (
                  <video
                    ref={videoRef}
                    key={panelMedia.src}
                    className="w-full h-full aspect-video bg-zinc-900"
                    controls
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                  >
                    <source src={panelMedia.src} />
                    Your browser does not support the video tag.
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

                {activeProject?.urls?.length ? (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {activeProject.urls.map((link, index) => (
                      <a
                        key={index}
                        href={link.type === 'email' ? `mailto:${link.url}` : link.url}
                        target={link.type === 'email' ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="text-sm lg:text-base font-bold capitalize hover:underline transition-all"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
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
                <Text>{backgroundText.text2.split(/<br\s*\/?>/gi).map((line: string, index: number) => (
                  <Text className="text-[#e6e6e6]" key={index}>
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
