import React, { useState } from 'react';
import { GenerationMetadata, ModelStats } from '../types';
import { 
  Sparkles, 
  Download, 
  Layers, 
  Clock, 
  Hash, 
  Copy, 
  Check, 
  X, 
  Box, 
  ShieldCheck
} from 'lucide-react';
import { formatNumberWithCommas } from '../utils/proceduralAssets';

interface GenerationInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: GenerationMetadata;
  stats: ModelStats;
  onExportGLB: () => void;
  onExportOBJ: () => void;
  onTakeScreenshot: () => void;
}

export const GenerationInfoDrawer: React.FC<GenerationInfoDrawerProps> = ({
  isOpen,
  onClose,
  metadata,
  stats,
  onExportGLB,
  onExportOBJ,
  onTakeScreenshot,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'export' | 'retopo'>('info');

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(metadata.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div id="generation-info-drawer-backdrop" className="pointer-events-auto fixed inset-0 z-[250] flex justify-end bg-black/70 backdrop-blur-xs animate-fadeIn select-none">
      <div 
        id="generation-info-drawer"
        className="flex flex-col w-full max-w-md h-full bg-[#151619] border-l border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wide text-white uppercase">GENERATION SPECS & ASSETS</h2>
              <p className="text-[11px] font-mono text-label-muted">{metadata.id}</p>
            </div>
          </div>
          <button
            id="drawer-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-label-muted hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-4 pt-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3 py-2 text-xs font-medium uppercase border-b-2 transition ${
              activeTab === 'info'
                ? 'border-[#F27D26] text-[#F27D26]'
                : 'border-transparent text-label-muted hover:text-white'
            }`}
          >
            MODEL SPECS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-3 py-2 text-xs font-medium uppercase border-b-2 transition ${
              activeTab === 'export'
                ? 'border-[#F27D26] text-[#F27D26]'
                : 'border-transparent text-label-muted hover:text-white'
            }`}
          >
            EXPORT ASSETS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('retopo')}
            className={`px-3 py-2 text-xs font-medium uppercase border-b-2 transition ${
              activeTab === 'retopo'
                ? 'border-[#F27D26] text-[#F27D26]'
                : 'border-transparent text-label-muted hover:text-white'
            }`}
          >
            RETOPOLOGY
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'info' && (
            <>
              {/* Prompt Card */}
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-label-muted">
                  <span className="font-semibold text-white flex items-center gap-1.5 uppercase text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" /> SYNTHESIS PROMPT
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-[11px] text-[#F27D26] hover:underline"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedPrompt ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <p className="text-xs text-label-title leading-relaxed font-sans bg-black/50 p-2.5 rounded border border-white/5">
                  "{metadata.prompt}"
                </p>
                {metadata.negativePrompt && (
                  <div className="text-[10px] font-mono text-label-muted pt-1">
                    <span className="text-rose-400">NEGATIVE:</span> {metadata.negativePrompt}
                  </div>
                )}
              </div>

              {/* Specifications Grid */}
              <div className="space-y-2 font-mono">
                <span className="text-[11px] font-semibold text-label-muted uppercase tracking-wide">MODEL PARAMETERS</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">AI ENGINE</span>
                    <span className="text-white font-medium text-[11px]">{metadata.aiEngine}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">POLY BUDGET</span>
                    <span className="text-[#F27D26] font-medium text-[11px]">{metadata.polyBudget}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">SYMMETRY MODE</span>
                    <span className="text-white font-medium text-[11px]">{metadata.symmetry}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">STYLE PRESET</span>
                    <span className="text-white font-medium text-[11px]">{metadata.style}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">GEN TIME</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {metadata.generationTime}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-[10px] text-label-muted block mb-0.5 uppercase">SEED</span>
                    <span className="text-white font-mono flex items-center gap-1 text-[11px]">
                      <Hash className="w-3 h-3 text-label-muted" /> {metadata.seed}
                    </span>
                  </div>
                </div>
              </div>

              {/* Topology Summary */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2 text-xs font-mono">
                <span className="font-semibold text-white text-[11px] uppercase block">ACTIVE MESH TOPOLOGY</span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <div className="text-[9px] text-label-muted uppercase">TRIANGLES</div>
                    <div className="text-[#F27D26] font-mono font-medium">{formatNumberWithCommas(stats.faces)}</div>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <div className="text-[9px] text-label-muted uppercase">VERTICES</div>
                    <div className="text-white font-mono font-medium">{formatNumberWithCommas(stats.vertices)}</div>
                  </div>
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <div className="text-[9px] text-label-muted uppercase">TEXTURES</div>
                    <div className="text-white font-mono font-medium">{stats.textureRes}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1.5 font-mono">
                <span className="text-[10px] text-label-muted uppercase">CLASSIFICATION TAGS</span>
                <div className="flex flex-wrap gap-1.5">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] text-label-base"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'export' && (
            <div className="space-y-3 font-mono animate-fadeIn">
              <p className="text-[11px] text-label-muted">
                Download ready-to-use 3D assets with embedded PBR textures or standalone mesh formats.
              </p>

              <button
                type="button"
                onClick={onExportGLB}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#F27D26] hover:bg-[#d96818] text-white transition shadow-lg group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-black/20">
                    <Box className="w-5 h-5" />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-xs font-bold uppercase">GLTF / GLB BINARY PACKAGE</div>
                    <div className="text-[10px] text-white/80">Standard web & game engine format with PBR maps</div>
                  </div>
                </div>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
              </button>

              <button
                type="button"
                onClick={onExportOBJ}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-white/5 border border-white/10 text-white transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-black/40">
                    <Layers className="w-5 h-5 text-[#F27D26]" />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-xs font-bold uppercase">WAVEFRONT .OBJ + .MTL</div>
                    <div className="text-[10px] text-label-muted">Universal DCC format for Blender, Maya, 3ds Max</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-label-muted group-hover:text-white transition" />
              </button>

              <button
                type="button"
                onClick={onTakeScreenshot}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-black/40 hover:bg-white/5 border border-white/10 text-white transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-black/40">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-xs font-bold uppercase">RENDER 4K SNAPSHOT</div>
                    <div className="text-[10px] text-label-muted">High-res PNG capture with alpha channel</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-label-muted group-hover:text-white transition" />
              </button>
            </div>
          )}

          {activeTab === 'retopo' && (
            <div className="space-y-3 font-mono animate-fadeIn">
              <p className="text-[11px] text-label-muted">
                AI Automatic Quad/Tri Retopology presets to optimize geometry for real-time engines and VR.
              </p>

              <div className="space-y-2">
                {[
                  { title: 'MOBILE / XR REALTIME', count: '15,000 Faces', desc: 'Ultra-low poly with baked normal maps for mobile VR & WebGL' },
                  { title: 'GAME READY (MID-POLY)', count: '50,000 Faces', desc: 'Ideal for Unreal Engine 5 & Unity character / prop assets' },
                  { title: 'CINEMATIC / FILM (SUBD)', count: '250,000 Faces', desc: 'High fidelity with quad flow for clean displacement subdivision' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase">{item.title}</span>
                      <span className="text-[10px] font-mono text-[#F27D26]">{item.count}</span>
                    </div>
                    <p className="text-[10px] text-label-muted">{item.desc}</p>
                    <button
                      type="button"
                      onClick={() => alert(`Retopology queued for ${item.title}. Normal maps will be rebaked.`)}
                      className="w-full py-1.5 text-xs rounded bg-black/60 hover:bg-[#F27D26]/20 border border-white/10 hover:border-[#F27D26]/50 text-white transition font-mono uppercase"
                    >
                      Bake Retopology Mesh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-white/10 bg-black/40 flex items-center justify-between font-mono text-[11px] text-label-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PRODUCTION ASSET VERIFIED
          </span>
          <span>{metadata.author}</span>
        </div>
      </div>
    </div>
  );
};

