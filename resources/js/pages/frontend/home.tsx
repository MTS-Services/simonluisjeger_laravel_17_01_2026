import { useState, useMemo, useEffect, useRef } from "react";
import MainSvg, { ProjectID } from "@/components/main-svg";
import { Head } from "@inertiajs/react";
import { useAppearance } from "@/hooks/use-appearance";
import Text from "@/components/text";

interface ProjectUrl {
  label: string;
  url: string;
  type?: 'email';
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
  backgroundText: BackgroundRecord[];
}



export default function Home({ projectData, backgroundText }: Props) {
  const [selectedId, setSelectedId] = useState<ProjectID | null>(null);
  const { appearance, updateAppearance } = useAppearance();
  const videoRef = useRef<HTMLVideoElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appearance !== 'light') {
      updateAppearance('light');
    }
  }, [appearance, updateAppearance]);

  const activeProject = useMemo(() => {
    return projectData.find(p => p.key === selectedId);
  }, [selectedId, projectData]);

  useEffect(() => {
    if (videoRef.current && activeProject && activeProject.mime_type.startsWith('video/')) {
      videoRef.current.load();
    }
  }, [activeProject?.key]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (detailsRef.current && !detailsRef.current.contains(target)) {
        setSelectedId(null);
      }
    };

    if (selectedId) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedId]);

  return (
    <main className="min-h-screen bg-[#d9d9d9] h-auto w-full">
      <Head title="Simon Jeger" />

      <div className="flex flex-col lg:flex-row w-full h-auto items-center">
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden pb-0 pt-6 lg:py-0 lg:h-full">
          <div className="w-full h-full flex items-center justify-center">
            <MainSvg activeId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>

        <div className="w-full flex-1 flex items-start lg:items-center justify-center pt-0 p-6 md:p-8">
          {activeProject ? (
            <div ref={detailsRef} className="w-full bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="aspect-video bg-zinc-900 border-b border-zinc-800 relative">
                {activeProject.mime_type.startsWith('image/') && (
                  <img
                    src={activeProject.file_url}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {activeProject.mime_type.startsWith('video/') && (
                  <video
                    ref={videoRef}
                    key={activeProject.file_url}
                    className="w-full h-full aspect-video bg-zinc-900"
                    controls
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                  >
                    <source src={activeProject.file_url} type={activeProject.mime_type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="bg-[#010000] p-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-base lg:text-lg font-bold capitalize">
                    {activeProject.title}
                  </h2>
                  {activeProject.date && (
                    <span className="text-sm font-bold opacity-80 mt-1">{activeProject.date}</span>
                  )}
                </div>

                <p className="text-sm lg:text-base mb-2 font-normal">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                </div>
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

              <Text>{backgroundText.text2.split(/<br\s*\/?>/gi).map((line: string, index:number) => (
                <Text className="text-[#e6e6e6]" key={index}>
                  {line}
                  {'\n'}
                </Text>
              ))}</Text>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
  