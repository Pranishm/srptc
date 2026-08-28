import React, { useState } from 'react';
import { TextureMapType } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Download, X, Layers } from 'lucide-react';

interface TextureViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMap: TextureMapType;
  onSelectMap: (type: TextureMapType) => void;
  textureUrls: Record<TextureMapType, string>;
  modelTitle: string;
}

const MAP_TABS: { type: TextureMapType; label: string; desc: string; channelDesc: string }[] = [
  { type: 'baseColor', label: 'Base Color', desc: 'Diffuse Albedo (sRGB Color Array)', channelDesc: 'RGB 24-BIT sRGB' },
  { type: 'roughness', label: 'Roughness', desc: 'Micro-surface smoothness (Linear Grayscale)', channelDesc: 'GRAYSCALE 8-BIT' },
  { type: 'metallic', label: 'Metallic', desc: 'Conductivity mask (Linear Grayscale)', channelDesc: 'GRAYSCALE 8-BIT' },
  { type: 'normal', label: 'Normal Map', desc: 'Tangent-space normal vectors (OpenGL / DirectX)', channelDesc: 'RGB NORMAL VECTORS' },
  { type: 'emissive', label: 'Emissive', desc: 'Self-illumination luminescence mask', channelDesc: 'RGB 24-BIT HDR' },
];

export const TextureViewerModal: React.FC<TextureViewerModalProps> = ({
  isOpen,
  onClose,
  activeMap,
  onSelectMap,
  textureUrls,
  modelTitle,
}) => {
  const [zoom, setZoom] = useState(1);

  if (!isOpen) return null;

  const currentUrl = textureUrls[activeMap] || '';
  const currentTab = MAP_TABS.find((t) => t.type === activeMap) || MAP_TABS[0];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${modelTitle.toLowerCase().replace(/\s+/g, '-')}_${activeMap}_2k.png`;
    link.href = currentUrl;
    link.click();
  };

  return (
    <div id="texture-viewer-modal-backdrop" className="pointer-events-auto fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn select-none">
      <div 
        id="texture-viewer-modal"
        className="flex flex-col w-full max-w-4xl max-h-[90vh] bg-[#151619] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-mono font-bold tracking-wide text-white uppercase">2D UV TEXTURE INSPECTOR</h2>
              <p className="text-[11px] font-mono text-label-muted">{modelTitle} • 2048 × 2048 PNG (PBR METALLIC/ROUGHNESS)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="texture-download-btn"
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium bg-[#F27D26] hover:bg-[#d96818] text-white transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD MAP
            </button>
            <button
              id="texture-close-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded text-label-muted hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Map Type Tab Selector */}
        <div className="flex items-center gap-1.5 px-5 py-2 border-b border-white/10 bg-black/40 overflow-x-auto">
          {MAP_TABS.map((tab) => {
            const isSelected = tab.type === activeMap;
            return (
              <button
                key={tab.type}
                type="button"
                onClick={() => onSelectMap(tab.type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#F27D26]/20 border-[#F27D26] text-[#F27D26] font-semibold shadow-sm'
                    : 'bg-black/20 border-white/5 text-label-muted hover:border-white/20 hover:text-white'
                }`}
              >
                <img
                  src={textureUrls[tab.type]}
                  alt={tab.label}
                  className="w-3.5 h-3.5 rounded-sm object-cover border border-white/10"
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Texture Preview Canvas Stage */}
        <div className="relative flex-1 bg-[#0F0F11] overflow-hidden flex items-center justify-center min-h-[380px] p-6">
          {/* Subtle UV Grid background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#383b42 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div 
            className="relative transition-transform duration-100 ease-out max-w-full max-h-full flex items-center justify-center"
            style={{ transform: `scale(${zoom})` }}
          >
            {currentUrl ? (
              <img
                id="texture-map-preview-image"
                src={currentUrl}
                alt={currentTab.label}
                className="max-h-[380px] max-w-[380px] w-auto h-auto rounded shadow-2xl border border-white/10 object-contain bg-black"
              />
            ) : (
              <div className="text-label-muted text-xs font-mono">Generating texture preview...</div>
            )}
          </div>

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#151619]/95 backdrop-blur-md p-1.5 rounded-md border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-1 rounded text-label-muted hover:text-white hover:bg-white/10 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-white px-1">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="p-1 rounded text-label-muted hover:text-white hover:bg-white/10 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1 rounded text-label-muted hover:text-white hover:bg-white/10 transition"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Details */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/40 border-t border-white/10 font-mono text-[11px]">
          <div className="flex items-center gap-4 text-label-muted">
            <span>ENCODING: <strong className="text-white font-mono">{currentTab.channelDesc}</strong></span>
            <span>UV COVERAGE: <strong className="text-[#F27D26] font-mono">88.4%</strong></span>
            <span>MIP LEVELS: <strong className="text-white font-mono">11</strong></span>
          </div>
          <div className="text-label-muted text-[10px] uppercase">
            {currentTab.desc}
          </div>
        </div>
      </div>
    </div>
  );
};

