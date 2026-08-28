import React, { useState } from 'react';
import { ModelStats } from '../types';
import { formatNumberWithCommas } from '../utils/proceduralAssets';
import { ChevronDown, ChevronUp, Layers, Box, Cpu, Activity } from 'lucide-react';

interface TopologyCardProps {
  stats: ModelStats;
  currentModelName: string;
}

export const TopologyCard: React.FC<TopologyCardProps> = ({ stats, currentModelName }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="topology-card-container" className="pointer-events-auto absolute top-3 z-40 left-3 select-none">
      <div className="space-y-2">
        <div 
          id="topology-card" 
          className="bg-[#151619]/95 min-w-52 rounded-lg px-3.5 py-2.5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span className="text-[11px] font-mono font-semibold tracking-wide text-white truncate max-w-[130px] uppercase">
                {currentModelName}
              </span>
            </div>
            <button
              id="topology-expand-toggle"
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-label-muted hover:text-[#F27D26] transition-colors p-0.5"
              title={expanded ? "Collapse details" : "Expand mesh details"}
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Core Topology HUD metrics */}
          <div className="pt-1.5 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-label-muted text-[10px] uppercase">TOPOLOGY</span>
              <span className="text-white font-medium bg-black/40 px-1.5 py-0.5 rounded border border-white/5 text-[10px]">
                {stats.topology}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-muted text-[10px] uppercase">FACES (TRIS)</span>
              <span className="text-[#F27D26] font-medium font-mono">
                {formatNumberWithCommas(stats.faces)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-label-muted text-[10px] uppercase">VERTICES</span>
              <span className="text-white font-mono font-medium">
                {formatNumberWithCommas(stats.vertices)}
              </span>
            </div>
          </div>

          {expanded && (
            <div className="pt-2 border-t border-white/10 space-y-1.5 font-mono text-[10px] animate-fadeIn">
              <div className="flex justify-between items-center text-label-muted">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#F27D26]" /> SUBMESHES
                </span>
                <span className="text-white">{stats.submeshes}</span>
              </div>
              <div className="flex justify-between items-center text-label-muted">
                <span className="flex items-center gap-1.5">
                  <Box className="w-3 h-3 text-cyan-400" /> TEXTURE RES
                </span>
                <span className="text-white">{stats.textureRes}</span>
              </div>
              <div className="flex justify-between items-center text-label-muted">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-emerald-400" /> RENDER PASS
                </span>
                <span className="text-emerald-400 font-medium">60.0 FPS / 16ms</span>
              </div>
              <div className="flex justify-between items-center text-label-muted">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-amber-400" /> MEMORY
                </span>
                <span className="text-white">{stats.fileSize}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

