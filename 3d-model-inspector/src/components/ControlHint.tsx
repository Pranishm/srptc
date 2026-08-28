import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const ControlHint: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <div id="control-hint-collapsed" className="pointer-events-auto absolute bottom-3 left-3 z-40 select-none">
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#151619]/90 backdrop-blur-md rounded-md border border-white/10 shadow-lg text-label-base hover:text-[#F27D26] hover:border-[#F27D26]/40 transition font-mono text-[11px]"
          title="Show Navigation Controls"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>CONTROLS</span>
        </button>
      </div>
    );
  }

  return (
    <div id="control-hint-root" className="pointer-events-auto absolute bottom-3 left-3 z-40 select-none">
      <div className="flex items-center p-1.5 bg-[#151619]/95 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl transition duration-150">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="p-1 text-label-muted hover:text-[#F27D26] transition cursor-pointer"
          title="Minimize Controls HUD"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#F27D26]" />
        </button>

        <div className="px-2">
          <div className="bg-white/10 h-3.5 w-px"></div>
        </div>

        <div className="flex items-center gap-x-4 pr-2 font-mono text-[11px]">
          {/* Rotate */}
          <div className="flex items-center gap-x-1.5">
            <span className="bg-black/50 px-1 py-0.5 rounded border border-white/10 text-[9px] text-[#F27D26] font-semibold">LMB</span>
            <span className="text-label-base">Rotate</span>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-x-1.5">
            <span className="bg-black/50 px-1 py-0.5 rounded border border-white/10 text-[9px] text-[#F27D26] font-semibold">MMB</span>
            <span className="text-label-base">Zoom</span>
          </div>

          {/* Pan */}
          <div className="flex items-center gap-x-1.5">
            <span className="bg-black/50 px-1 py-0.5 rounded border border-white/10 text-[9px] text-[#F27D26] font-semibold">RMB</span>
            <span className="text-label-base">Pan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

