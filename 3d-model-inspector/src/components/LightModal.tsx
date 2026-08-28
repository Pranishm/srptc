import React from 'react';
import { LightingSettings, LightingPreset } from '../types';
import { Sun, Compass, Grid, Sparkles, X } from 'lucide-react';

interface LightModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LightingSettings;
  onChange: (updated: Partial<LightingSettings>) => void;
  onReset: () => void;
}

const PRESETS: { id: LightingPreset; label: string; desc: string; color: string }[] = [
  { id: 'studio', label: 'Studio Neutral', desc: 'Balanced 3-point soft lighting', color: '#ffffff' },
  { id: 'sunset', label: 'Golden Sunset', desc: 'Warm rim lights with deep amber hues', color: '#f59e0b' },
  { id: 'cyber', label: 'Cyberpunk Neon', desc: 'Cyan & Magenta contrasting lights', color: '#06b6d4' },
  { id: 'dawn', label: 'Soft Daylight', desc: 'Crisp sky dome with subtle blue shadows', color: '#93c5fd' },
  { id: 'interior', label: 'Warm Gallery', desc: 'Tungsten spotlights for museum finish', color: '#fed7aa' },
  { id: 'dark', label: 'Dark Void', desc: 'High contrast key light on pitch canvas', color: '#64748b' },
];

export const LightModal: React.FC<LightModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div id="lighting-adjustment-popover" className="pointer-events-auto absolute top-14 left-4 sm:left-32 z-[200] w-84 rounded-lg bg-[#151619]/98 border border-white/10 p-4 backdrop-blur-2xl shadow-2xl animate-fadeIn text-sm select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white tracking-wide">
          <Sun className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>LIGHTING & ENVIRONMENT RIG</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-label-muted hover:text-[#F27D26] transition uppercase"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-label-muted hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-3.5 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
        {/* Environment Preset Selector */}
        <div className="space-y-1.5 font-mono">
          <span className="text-label-base text-[11px]">PRESET ENVIRONMENT RIG</span>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ preset: p.id })}
                className={`flex flex-col items-start p-2 rounded-md border text-left transition ${
                  settings.preset === p.id
                    ? 'border-[#F27D26] bg-[#F27D26]/10 text-white font-medium shadow-sm'
                    : 'border-white/5 bg-black/40 text-label-base hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[11px] font-medium uppercase">{p.label}</span>
                </div>
                <span className="text-[9px] text-label-muted mt-0.5 line-clamp-1">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Light Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px]">EXPOSURE / INTENSITY</span>
            <span className="text-[#F27D26] font-semibold">{settings.intensity.toFixed(1)}x</span>
          </div>
          <input
            id="light-intensity-slider"
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={settings.intensity}
            onChange={(e) => onChange({ intensity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Sun Azimuth Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#F27D26]" /> SUN AZIMUTH / ROTATION
            </span>
            <span className="text-[#F27D26] font-semibold">{Math.round(settings.sunAzimuth)}°</span>
          </div>
          <input
            id="sun-azimuth-slider"
            type="range"
            min="0"
            max="360"
            step="1"
            value={settings.sunAzimuth}
            onChange={(e) => onChange({ sunAzimuth: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Ground Grid & Shadows */}
        <div className="pt-2 border-t border-white/10 space-y-2.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-label-base flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-label-muted" /> GROUND CALIBRATION GRID
            </span>
            <input
              id="ground-grid-toggle"
              type="checkbox"
              checked={settings.groundGrid}
              onChange={(e) => onChange({ groundGrid: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-black/60 text-[#F27D26] accent-[#F27D26] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-label-base flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" /> DYNAMIC CONTACT SHADOWS
            </span>
            <input
              id="shadows-toggle"
              type="checkbox"
              checked={settings.shadows}
              onChange={(e) => onChange({ shadows: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-black/60 text-[#F27D26] accent-[#F27D26] cursor-pointer"
            />
          </div>

          {/* Background Canvas Mode */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[11px] text-label-muted uppercase">VIEWPORT BACKGROUND CANVAS</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dark', 'studio', 'transparent'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ bgMode: mode })}
                  className={`py-1.5 px-2 text-[11px] rounded-md border uppercase font-mono transition ${
                    settings.bgMode === mode
                      ? 'border-[#F27D26] bg-[#F27D26]/20 text-[#F27D26] font-semibold'
                      : 'border-white/5 bg-black/40 text-label-base hover:border-white/20 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
