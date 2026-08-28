import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Sliders, MapPin, Activity } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import { ThreeCanvas } from '../../components/3d/ThreeCanvas';
import { PRESET_MODELS, generateProceduralTextures } from '../../components/3d/proceduralAssets';
import { MaterialModal } from '../../components/3d/MaterialModal';
import { LightModal } from '../../components/3d/LightModal';
import type { MaterialSettings, LightingSettings } from '../../components/3d/types';

const MAP_PINS = [
  { id: 'block-c', name: 'Block C', count: 18, status: 'Critical', color: 'bg-[#FDE7EF]', text: 'text-[#B23A48]', desc: 'Wi-Fi network down & projector power tripped.' },
  { id: 'block-a', name: 'Block A', count: 12, status: 'Critical', color: 'bg-[#FDE7EF]', text: 'text-[#B23A48]', desc: 'Corridor lighting & elevator maintenance.' },
  { id: 'block-b', name: 'Block B', count: 5, status: 'Medium', color: 'bg-[#FFF4E6]', text: 'text-[#C08A3E]', desc: 'Classroom door latch & lab fan noise.' },
  { id: 'block-d', name: 'Block D', count: 1, status: 'Normal', color: 'bg-[#E8F5E9]', text: 'text-[#3F7A5B]', desc: 'Minor window glass crack reported.' },
];

const AdminLiveCampus = () => {
  const navigate = useNavigate();
  const [selectedPinId, setSelectedPinId] = useState<string | null>('block-c');
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.85, roughness: 0.90, normalScale: 2.5,
    wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7,
    emissiveColor: '#ff0033', emissiveIntensity: 3.0,
    clearcoat: 0.2, transmission: 0, opacity: 1,
  });

  const [isLightModalOpen, setIsLightModalOpen] = useState(false);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    preset: 'dawn', intensity: 1.3, lightColor: '#ffffff',
    sunElevation: 45, sunAzimuth: 135, shadows: true,
    groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark',
  });

  const pbrCanvases = useMemo(() => generateProceduralTextures(PRESET_MODELS[0].generatorKey), []);
  const selectedPin = MAP_PINS.find(pin => pin.id === selectedPinId) ?? null;

  return (
    <PortalShell title="Admin Live 3D Campus Console" subtitle="Real-time 3D WebGL spatial model, heatmap density analysis, & location pin inspection" pages={ADMIN_PAGES}>
      
      {/* Controls Header Bar */}
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#00D8F6]/15 text-[#00D8F6] border border-[#00D8F6]/30 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Live WebGL Engine
          </span>
          <span className="text-[13px] font-bold text-[#191919]/50 hidden sm:inline-block">
            Orbit 3D canvas, toggle Heatmap recoloring, and select building pins.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHeatmap(!isHeatmap)}
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-sm',
              isHeatmap ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            )}
          >
            <Flame className="w-3.5 h-3.5" /> Heatmap {isHeatmap ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setIsMaterialModalOpen(!isMaterialModalOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:border-gray-300 cursor-pointer shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" /> Shader
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border shadow-sm',
              autoRotate ? 'bg-[#0B3C73] text-white border-[#0B3C73]' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            )}
          >
            Rotate {autoRotate ? 'ON' : 'OFF'}
          </button>
        </div>
      </motion.div>

      {/* Main 3D Canvas + Side Drawer */}
      <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">

        {/* 3D WebGL Canvas */}
        <div className="lg:col-span-8 glass-card rounded-[32px] h-[520px] relative overflow-hidden border border-white/10 bg-[#0F0F11] shadow-2xl">
          
          <div className="absolute inset-0">
            <ThreeCanvas
              generatorKey={PRESET_MODELS[0].generatorKey}
              pbrCanvases={pbrCanvases}
              shadingMode="shaded"
              cameraPreset="perspective"
              materialSettings={materialSettings}
              lightingSettings={lightingSettings}
              autoRotate={autoRotate}
              onBuildingPositionsUpdate={setScreenPositions}
              isHeatmapActive={isHeatmap}
            />
          </div>

          {/* Floating 3D Building Pins */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {MAP_PINS.map(pin => {
              const pos = screenPositions[pin.id];
              const isSelected = selectedPinId === pin.id;

              const fallbackPos: Record<string, { xPct: number; yPct: number }> = {
                'block-a': { xPct: 25, yPct: 30 },
                'block-b': { xPct: 25, yPct: 70 },
                'block-c': { xPct: 75, yPct: 30 },
                'block-d': { xPct: 75, yPct: 70 },
              };
              const fallback = fallbackPos[pin.id] || { xPct: 50, yPct: 50 };

              const styleProps = pos && pos.visible
                ? { left: `${pos.x}px`, top: `${pos.y}px` }
                : { left: `${fallback.xPct}%`, top: `${fallback.yPct}%` };

              return (
                <div
                  key={pin.id}
                  style={styleProps}
                  className="absolute pointer-events-auto cursor-pointer transition-transform duration-75 -translate-x-1/2 -translate-y-full flex flex-col items-center group z-20"
                  onClick={() => setSelectedPinId(isSelected ? null : pin.id)}
                >
                  <div className={clsx(
                    'w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[13px] shadow-xl border-2 border-white transition-all',
                    pin.id === 'block-c' && isHeatmap ? 'bg-rose-600 ring-4 ring-rose-500/50' : 'bg-[#0B3C73]'
                  )}>
                    {pin.count}
                  </div>

                  <div className={clsx(
                    'mt-1.5 px-3 py-1 rounded-full text-[12px] font-black tracking-wide shadow-xl border backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all',
                    isSelected ? 'bg-white text-[#191919] border-white scale-110' : 'bg-black/85 text-white border-white/15'
                  )}>
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{pin.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modals */}
          <MaterialModal
            isOpen={isMaterialModalOpen}
            onClose={() => setIsMaterialModalOpen(false)}
            settings={materialSettings}
            onChange={(updated) => setMaterialSettings((prev) => ({ ...prev, ...updated }))}
            onReset={() => setMaterialSettings({ metalness: 0.85, roughness: 0.9, normalScale: 2.5, wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7, emissiveColor: '#ff0033', emissiveIntensity: 3.0, clearcoat: 0.2, transmission: 0, opacity: 1 })}
          />

          <LightModal
            isOpen={isLightModalOpen}
            onClose={() => setIsLightModalOpen(false)}
            settings={lightingSettings}
            onChange={(updated) => setLightingSettings((prev) => ({ ...prev, ...updated }))}
            onReset={() => setLightingSettings({ preset: 'cyber', intensity: 1.3, lightColor: '#ffffff', sunElevation: 45, sunAzimuth: 135, shadows: true, groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark' })}
          />

          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-2 border border-white/10 z-20">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Interactive 3D WebGL Campus Control Engine</span>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 glass-card rounded-[32px] p-6 flex flex-col justify-between h-[520px]">
          {selectedPin ? (
            <div className="space-y-5">
              <div>
                <span className={clsx("inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider", selectedPin.color, selectedPin.text)}>
                  {selectedPin.status} Hotspot
                </span>
                <h3 className="font-serif text-[28px] font-bold text-[#191919] mt-2 leading-tight">{selectedPin.name}</h3>
                <p className="text-[13px] font-bold text-[#191919]/50 mt-1">{selectedPin.desc}</p>
              </div>

              <div className="bg-[#FAF8F5] rounded-[24px] p-5 border border-black/5 space-y-2">
                <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest">Active Faults Logged</p>
                <p className="font-serif text-[52px] font-bold text-[#191919] leading-none tabular-nums">{selectedPin.count}</p>
              </div>

              <div className="space-y-2 text-[13px] font-bold text-[#191919]/70">
                <p className="flex items-center justify-between bg-white p-3 rounded-2xl border border-black/5">
                  <span>Inspection Priority</span>
                  <span className="text-[#B23A48] font-extrabold">High Priority</span>
                </p>
                <p className="flex items-center justify-between bg-white p-3 rounded-2xl border border-black/5">
                  <span>Assigned Crew</span>
                  <span className="text-[#0B3C73] font-extrabold">IT &amp; Electrical</span>
                </p>
              </div>

              <button
                onClick={() => navigate('/app/admin/issues')}
                className="w-full bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] py-4 rounded-[20px] shadow-md cursor-pointer border-none flex items-center justify-center gap-2 transition-all"
              >
                Inspect Issues in Dispatch →
              </button>
            </div>
          ) : (
            <div className="space-y-4 my-auto text-center p-6">
              <MapPin className="w-12 h-12 text-[#0B3C73] mx-auto animate-bounce" />
              <h3 className="font-serif text-[24px] font-bold text-[#191919]">Select a 3D Building</h3>
              <p className="text-[14px] font-bold text-[#191919]/50 leading-relaxed">
                Click on Block A, B, C, or D floating tags in the 3D WebGL canvas to inspect building reports.
              </p>
            </div>
          )}
        </div>

      </motion.div>
    </PortalShell>
  );
};

export default AdminLiveCampus;
