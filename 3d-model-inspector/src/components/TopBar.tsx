import React, { useState } from 'react';
import { 
  Maximize2, 
  Minimize2
} from 'lucide-react';

interface TopBarProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  autoRotate,
  onToggleAutoRotate,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div id="topbar-container" className="pointer-events-auto flex min-h-12 w-full shrink-0 flex-wrap items-center justify-between px-3 bg-[#151619] border-b border-white/10 z-50 select-none">
      {/* Left controls */}
      <div className="flex min-h-12 items-center gap-x-2">
        {/* Hardware Status Indicator Dot & College Title */}
        <div className="flex items-center gap-2 pr-1">
          <div className="size-2.5 rounded-full bg-[#F27D26] shadow-[0_0_8px_#F27D26]" title="Campus 3D Engine Active" />
          <span className="font-mono text-[11px] tracking-wider uppercase text-white/90 font-medium hidden sm:inline">
            SRI RAMAKRISHNA POLYTECHNIC COLLEGE
          </span>
        </div>

        <div className="bg-white/10 h-4 w-px shrink-0 rounded-full" role="separator" aria-hidden="true"></div>

        {/* Global Turntable / Auto-Rotate button */}
        <div className="inline-flex">
          <button
            id="autorotate-toggle-btn"
            type="button"
            onClick={onToggleAutoRotate}
            className={`group/button inline-flex items-center justify-center font-medium whitespace-nowrap transition duration-100 ease-out select-none px-2 h-7 rounded-md text-xs active:opacity-70 border cursor-pointer gap-1.5 ${
              autoRotate 
                ? 'text-[#F27D26] bg-[#F27D26]/15 border-[#F27D26]/50 shadow-[0_0_8px_rgba(242,125,38,0.3)]' 
                : 'text-label-base bg-black/30 border-white/5 hover:bg-white/5 hover:text-white'
            }`}
            title="Auto-Rotate Turntable"
          >
            <span className="flex flex-none items-center size-3.5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 21.96c5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96-5.5 0-9.96 4.46-9.96 9.96 0 5.5 4.46 9.96 9.96 9.96Zm0 1.44c6.296 0 11.4-5.104 11.4-11.4S18.296.6 12 .6.6 5.704.6 12 5.704 23.4 12 23.4Z" fill="currentColor"></path>
                <g opacity="0.4" fill="currentColor">
                  <path d="M2 8h20v1.5H2V8ZM2 14.5h20V16H2v-1.5Z"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.874 4.697C9.19 6.529 8.75 9.11 8.75 12c0 2.889.439 5.47 1.124 7.303.344.92.735 1.611 1.131 2.06.397.449.735.587.995.587V23c-.845 0-1.559-.01-2.119-.644-.56-.635-1.032-1.51-1.412-2.527C7.706 17.789 7.25 15.02 7.25 12c0-3.02.456-5.789 1.22-7.829.38-1.017.85-1.892 1.411-2.527C10.441 1.011 11.155 1 12 1v1.05c-.26 0-.598.138-.995.588-.396.448-.787 1.14-1.13 2.059Z"></path>
                </g>
              </svg>
            </span>
            <span className="font-mono text-[10px] uppercase hidden md:inline">Rotate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

