import React from 'react';
import { MaterialSettings } from '../types';
import { Sliders, Sparkles, Eye, X } from 'lucide-react';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MaterialSettings;
  onChange: (updated: Partial<MaterialSettings>) => void;
  onReset: () => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div id="material-adjustment-popover" className="pointer-events-auto absolute top-14 left-4 sm:left-24 z-[200] w-80 rounded-lg bg-[#151619]/98 border border-white/10 p-4 backdrop-blur-2xl shadow-2xl animate-fadeIn text-sm select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white tracking-wide">
          <Sliders className="w-3.5 h-3.5 text-[#F27D26]" />
          <span>MATERIAL SHADER PARAMS</span>
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
        {/* Roughness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px]">ROUGHNESS</span>
            <span className="text-[#F27D26] font-semibold">{settings.roughness.toFixed(2)}</span>
          </div>
          <input
            id="material-roughness-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.roughness}
            onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Metalness Slider */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px]">METALLIC</span>
            <span className="text-[#F27D26] font-semibold">{settings.metalness.toFixed(2)}</span>
          </div>
          <input
            id="material-metalness-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.metalness}
            onChange={(e) => onChange({ metalness: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Normal Strength */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px]">NORMAL SCALE</span>
            <span className="text-[#F27D26] font-semibold">{settings.normalScale.toFixed(2)}x</span>
          </div>
          <input
            id="material-normal-slider"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={settings.normalScale}
            onChange={(e) => onChange({ normalScale: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Emissive Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-label-base text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F27D26]" /> EMISSIVE GLOW
            </span>
            <span className="text-[#F27D26] font-semibold">{settings.emissiveIntensity.toFixed(1)}x</span>
          </div>
          <input
            id="material-emissive-slider"
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={settings.emissiveIntensity}
            onChange={(e) => onChange({ emissiveIntensity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
          />
        </div>

        {/* Wireframe Overlay */}
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between font-mono">
            <span className="text-[11px] text-label-base flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-label-muted" /> WIREFRAME OVERLAY
            </span>
            <input
              id="material-wireframe-toggle"
              type="checkbox"
              checked={settings.wireframe}
              onChange={(e) => onChange({ wireframe: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-black/60 text-[#F27D26] accent-[#F27D26] cursor-pointer"
            />
          </div>

          {settings.wireframe && (
            <div className="space-y-2 pl-2 border-l border-[#F27D26]/40 font-mono animate-fadeIn">
              <div className="flex justify-between text-[10px]">
                <span className="text-label-muted">LINE OPACITY</span>
                <span className="text-white font-semibold">{settings.wireframeOpacity.toFixed(2)}</span>
              </div>
              <input
                id="material-wireframe-opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={settings.wireframeOpacity}
                onChange={(e) => onChange({ wireframeOpacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-black/60 rounded-sm appearance-none cursor-pointer accent-[#F27D26]"
              />
              <div className="flex items-center gap-2 pt-1 text-[10px]">
                <span className="text-label-muted">COLOR:</span>
                {['#F27D26', '#38bdf8', '#ffffff', '#10b981', '#f43f5e'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange({ wireframeColor: color })}
                    className={`w-3.5 h-3.5 rounded-sm border ${
                      settings.wireframeColor === color ? 'border-white ring-1 ring-[#F27D26]' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

