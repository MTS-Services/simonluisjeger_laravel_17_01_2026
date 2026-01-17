import { useState } from "react";
import MainSvg, { ProjectID } from "@/components/main-svg";

export default function Home() {
  const [selectedId, setSelectedId] = useState<ProjectID | null>(null);

  return (
    <main className="min-h-screen bg-white w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full h-screen">

        {/* LEFT: The Map - Now set to occupy and center fully */}
        <div className="w-full lg:w-[60%] h-[50vh] lg:h-full flex items-center justify-center overflow-hidden">
          {/* This wrapper ensures the SVG has a defined area to fill */}
          <div className="w-full h-full flex items-center justify-center">
            <MainSvg activeId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>

        {/* RIGHT: The UI Content Box */}
        <div className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-12 bg-white">
          {selectedId ? (
            <div className="w-full max-w-xl bg-black text-white shadow-2xl rounded-sm overflow-hidden">
              {/* Video Area */}
              <div className="aspect-video bg-zinc-900 flex items-center justify-center border-b border-zinc-800">
                <span className="text-8xl font-black opacity-10 italic select-none uppercase">video</span>
              </div>

              {/* Red Info Area */}
              <div className="bg-[#FF0000] p-8 lg:p-10">
                <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-4">
                  {selectedId.replace('_', ' ')}
                </h2>
                <p className="text-base lg:text-lg leading-relaxed mb-8">
                  Short description about this project. This layout now ensures
                  the map is centered and fills the left panel completely.
                </p>
                <div className="flex justify-between items-center border-t border-white/30 pt-6">
                  <span className="font-bold text-xs tracking-widest uppercase">Publication Video</span>
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
            <div className="text-gray-300 text-xl font-medium italic uppercase tracking-widest border-2 border-dashed border-gray-100 p-16 rounded-lg text-center">
              Click an icon <br /> to explore
            </div>
          )}
        </div>
      </div>
    </main>
  );
}