import { useState, useMemo, useEffect, useRef } from "react";
import MainSvg, { ProjectID } from "@/components/main-svg";
import { Head } from "@inertiajs/react";
import { useAppearance } from "@/hooks/use-appearance";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectUrl {
  label: string;
  url: string;
  type?: 'email';
}

interface ProjectRecord {
  key: string;
  title: string;
  description: string;
  video: string;
  video_url: string;
  urls: ProjectUrl[];
  date: string | null;
}

interface Props {
  projectData: ProjectRecord[];
}

export default function Home({ projectData }: Props) {
  const [selectedId, setSelectedId] = useState<ProjectID | null>(null);
  const { appearance, updateAppearance } = useAppearance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    if (appearance !== 'light') {
      updateAppearance('light');
    }
  }, [appearance, updateAppearance]);

  const activeProject = useMemo(() => {
    return projectData.find(p => p.key === selectedId);
  }, [selectedId, projectData]);

  // Reset video when project changes
  useEffect(() => {
    if (videoRef.current && activeProject) {
      setIsVideoLoading(true);
      videoRef.current.load();
    }
  }, [activeProject?.key]);

  // Video event handlers
  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
  };

  const handleVideoCanPlay = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Video error:', e);
    setIsVideoLoading(false);
  };

  return (
    <main className="min-h-screen bg-white w-full">
      {/* <Head title="Simon Jeger" /> */}

      <div className="flex flex-col lg:flex-row w-full h-auto lg:h-screen ">
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden pt-8 lg:py-0 lg:h-full">
          <div className="w-full h-full flex items-center justify-center">
            <MainSvg activeId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>

        <div className="w-full flex-1 flex items-start lg:items-center justify-center p-6 md:p-8 bg-white">
          {activeProject ? (
            <div className="w-full bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="aspect-video bg-zinc-900 border-b border-zinc-800 relative">
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-sm text-white/70">Loading video...</span>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  key={activeProject.video_url}
                  className="w-full h-full aspect-video bg-zinc-900"
                  controls
                  playsInline
                  preload="metadata"
                  onLoadStart={handleVideoLoadStart}
                  onCanPlay={handleVideoCanPlay}
                  onError={handleVideoError}
                >
                  <source src={activeProject.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="bg-[#FF0000] p-6 lg:p-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-base lg:text-lg font-bold capitalize">
                    {activeProject.title}
                  </h2>
                  {activeProject.date && (
                    <span className="text-sm font-bold opacity-80 mt-1">{activeProject.date}</span>
                  )}
                </div>

                <p className="text-sm lg:text-base mb-6 font-normal">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap items-center border-t border-white/30 pt-6 gap-x-6 gap-y-2">
                  {activeProject.urls && activeProject.urls.map((link, index) => (
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

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-black ml-auto"
                    onClick={() => setSelectedId(null)}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 text-lg font-medium italic uppercase tracking-widest border-2 border-dashed border-gray-100 p-12 rounded-lg text-center w-full min-h-96 flex items-center justify-center">
              Select an element <br className="hidden md:block" /> to see details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}