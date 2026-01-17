import { useState, useMemo } from "react";
import MainSvg, { ProjectID } from "@/components/main-svg";
import { Head } from "@inertiajs/react";

interface ProjectRecord {
  key: string;
  title: string;
  description: string;
  video: string;
  url_one: string | null;
  url_two: string | null;
}

interface Props {
  projectData: ProjectRecord[];
}

export default function Home({ projectData }: Props) {
  const [selectedId, setSelectedId] = useState<ProjectID | null>(null);

  const activeProject = useMemo(() => {
    return projectData.find(p => p.key === selectedId);
  }, [selectedId, projectData]);

  return (
    <main className="min-h-screen bg-white w-full">
      <Head title="Home" />

      {/* MOBILE: flex-col (Top/Bottom) 
          DESKTOP: lg:flex-row (Left/Right) 
          h-screen is removed from the parent to prevent clipping on mobile
      */}
      <div className="flex flex-col lg:flex-row w-full lg:h-screen">

        {/* TOP/LEFT: The Map Section */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-full flex items-center justify-center bg-zinc-50 overflow-hidden sticky top-0 z-10 lg:relative">
          <div className="w-full h-full flex items-center justify-center">
            <MainSvg activeId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>

        {/* BOTTOM/RIGHT: Information Section */}
        <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center p-4 md:p-8 lg:p-12 bg-white min-h-[50vh] lg:min-h-0">
          {activeProject ? (
            <div className="w-full max-w-xl bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-right-4 duration-300">

              {/* Video Area */}
              <div className="aspect-video bg-zinc-900 border-b border-zinc-800">
                <iframe
                  className="w-full h-full"
                  src={activeProject.video}
                  title={activeProject.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Red Info Area */}
              <div className="bg-[#FF0000] p-6 md:p-10">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                  {activeProject.title}
                </h2>
                <p className="text-sm md:text-lg leading-relaxed mb-6">
                  {activeProject.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  {activeProject.url_one && (
                    <a href={activeProject.url_one} target="_blank" className="underline text-[10px] md:text-xs font-bold uppercase hover:opacity-70">
                      Visit Project Site ↗
                    </a>
                  )}
                  {activeProject.url_two && (
                    <a href={activeProject.url_two} target="_blank" className="underline text-[10px] md:text-xs font-bold uppercase hover:opacity-70">
                      Documentation ↗
                    </a>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-white/30 pt-4 md:pt-6">
                  <span className="font-bold text-[10px] uppercase tracking-widest">Interactive Map</span>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="text-[10px] font-bold bg-white text-black px-4 py-2 hover:bg-black hover:text-white transition-all uppercase"
                  >
                    CLOSE [X]
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-300 text-lg md:text-xl font-medium italic uppercase tracking-widest border-2 border-dashed border-gray-100 p-12 md:p-16 rounded-lg text-center w-full">
              Click an icon on the map <br className="hidden md:block" /> to explore
            </div>
          )}
        </div>
      </div>
    </main>
  );
}