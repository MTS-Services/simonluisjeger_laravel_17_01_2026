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

      {/* - On Mobile: Stacked (flex-col). Height is auto to allow scrolling.
          - On Desktop: Side-by-side (lg:flex-row). Height is fixed (lg:h-screen).
      */}
      <div className="flex flex-col lg:flex-row w-full h-auto lg:h-screen">

        {/* TOP/LEFT: The Map Section */}
        <div className="w-full lg:w-[60%] flex items-center justify-center bg-zinc-50 overflow-hidden py-8 lg:py-0 lg:h-full">
          <div className="w-full h-full flex items-center justify-center">
            {/* We use a wrapper with a defined aspect ratio on mobile to keep the SVG large */}
            <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-full">
              <MainSvg activeId={selectedId} onSelect={setSelectedId} />
            </div>
          </div>
        </div>

        {/* BOTTOM/RIGHT: Information Section */}
        <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center p-6 md:p-8 lg:p-12 bg-white">
          {activeProject ? (
            <div className="w-full max-w-xl bg-black text-white shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">

              {/* Video Area */}
              <div className="aspect-video bg-zinc-900 border-b border-zinc-800">
                <iframe
                  className="w-full h-full"
                  src={activeProject.video}
                  title={activeProject.title}
                  allowFullScreen
                />
              </div>

              {/* Red Info Area */}
              <div className="bg-[#FF0000] p-6 lg:p-10">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4">
                  {activeProject.title}
                </h2>
                <p className="text-base lg:text-lg leading-relaxed mb-8">
                  {activeProject.description}
                </p>

                <div className="flex gap-4 mb-8">
                  {activeProject.url_one && (
                    <a href={activeProject.url_one} target="_blank" className="underline text-xs font-bold uppercase hover:opacity-70">
                      Visit Site ↗
                    </a>
                  )}
                  {activeProject.url_two && (
                    <a href={activeProject.url_two} target="_blank" className="underline text-xs font-bold uppercase hover:opacity-70">
                      More Info ↗
                    </a>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-white/30 pt-6">
                  <span className="font-bold text-xs tracking-widest uppercase">Publication</span>
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
            <div className="text-gray-300 text-lg font-medium italic uppercase tracking-widest border-2 border-dashed border-gray-100 p-12 rounded-lg text-center w-full">
              Select an element <br className="hidden md:block" /> to see details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}