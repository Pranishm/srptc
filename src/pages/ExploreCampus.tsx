import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ThumbsUp, Users, Sliders, Sun, Flame, Activity, Box, Eye } from 'lucide-react';
import clsx from 'clsx';

import type { ShadingMode, CameraPreset, MaterialSettings, LightingSettings } from '../components/3d/types';
import { PRESET_MODELS, generateProceduralTextures } from '../components/3d/proceduralAssets';
import { ThreeCanvas } from '../components/3d/ThreeCanvas';
import { TopBar } from '../components/3d/TopBar';
import { MaterialModal } from '../components/3d/MaterialModal';
import { LightModal } from '../components/3d/LightModal';
import { getIssues, type Issue } from '../utils/db';

interface BuildingInfo {
  id: string;
  name: string;
  count: number;
  status: 'critical' | 'high' | 'medium' | 'normal' | 'resolved';
  color: string;
  issues: { title: string; priority: string; affected: number; dept: string; status: string }[];
  isHotspot?: boolean;
}

const DEFAULT_BUILDINGS: BuildingInfo[] = [
  { 
    id: 'block-c', name: 'Block C', count: 18, status: 'critical', color: 'bg-rose-500', isHotspot: true,
    issues: [
      { title: 'Wi-Fi Network Down', priority: 'Critical', affected: 31, dept: 'IT Support', status: 'In Progress' },
      { title: 'Projector Power Tripped', priority: 'High', affected: 15, dept: 'Electrical', status: 'Unassigned' }
    ] 
  },
  { 
    id: 'block-a', name: 'Block A', count: 12, status: 'critical', color: 'bg-rose-500',
    issues: [
      { title: 'Broken Corridor Lighting', priority: 'High', affected: 20, dept: 'Electrical', status: 'Unassigned' },
      { title: 'Elevator Maintenance Required', priority: 'Critical', affected: 45, dept: 'Facilities', status: 'Assigned' }
    ] 
  },
  { 
    id: 'block-b', name: 'Block B', count: 5, status: 'medium', color: 'bg-amber-500',
    issues: [
      { title: 'Classroom 104 Door Latch', priority: 'Low', affected: 5, dept: 'Facilities', status: 'Open' },
      { title: 'Lab 2 Fan Noise', priority: 'Medium', affected: 8, dept: 'Electrical', status: 'Open' }
    ] 
  },
  { 
    id: 'block-d', name: 'Block D', count: 1, status: 'normal', color: 'bg-emerald-500',
    issues: [
      { title: 'Window Glass Crack', priority: 'Low', affected: 2, dept: 'Facilities', status: 'Open' }
    ] 
  },
];

type ViewMode = 'heatmap' | 'shaded' | 'wireframe';

const ExploreCampus = () => {
  const [allDbIssues, setAllDbIssues] = useState<Issue[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('shaded');
  const [selectedPin, setSelectedPin] = useState<BuildingInfo | null>(null);
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  useEffect(() => {
    setAllDbIssues(getIssues());
  }, []);

  // Compute building list dynamically using live issues from db.ts
  const buildingsList = useMemo(() => {
    const list = DEFAULT_BUILDINGS.map(b => {
      const matchingDb = allDbIssues.filter(i => 
        i.location.toLowerCase().includes(b.name.toLowerCase()) || 
        b.name.toLowerCase().includes(i.location.toLowerCase())
      );
      const combinedIssues = [...b.issues];
      matchingDb.forEach(dbItem => {
        if (!combinedIssues.some(ci => ci.title === dbItem.title)) {
          combinedIssues.unshift({
            title: dbItem.title,
            priority: dbItem.priority,
            affected: 12,
            dept: dbItem.category,
            status: dbItem.status,
          });
        }
      });
      return {
        ...b,
        count: Math.max(b.count, combinedIssues.length),
        issues: combinedIssues,
      };
    });

    const maxCount = Math.max(...list.map(l => l.count));
    return list.map(item => ({
      ...item,
      isHotspot: item.count === maxCount && maxCount > 0,
      color: item.count === maxCount && maxCount > 0
        ? 'bg-rose-600'
        : item.count > 8
        ? 'bg-rose-500'
        : item.count > 4
        ? 'bg-amber-500'
        : 'bg-[#0B3C73]'
    }));
  }, [allDbIssues]);

  const topHotspot = useMemo(() => buildingsList.find(b => b.isHotspot), [buildingsList]);

  // 3D viewer state
  const currentPreset = useMemo(() => PRESET_MODELS[0], []);
  const pbrCanvases = useMemo(() => generateProceduralTextures(currentPreset.generatorKey), [currentPreset.generatorKey]);

  const isHeatmapActive = viewMode === 'heatmap';
  const shadingMode: ShadingMode = viewMode === 'wireframe' ? 'wireframe' : 'shaded';
  const [cameraPreset] = useState<CameraPreset>('perspective');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialSettings, setMaterialSettings] = useState<MaterialSettings>({
    metalness: 0.87, roughness: 1.00, normalScale: 3.0,
    wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7,
    emissiveColor: '#00f0ff', emissiveIntensity: 5.0,
    clearcoat: 0.2, transmission: 0, opacity: 1,
  });

  const [isLightModalOpen, setIsLightModalOpen] = useState(false);
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    preset: viewMode === 'heatmap' ? 'cyber' : 'dawn', intensity: 1.2, lightColor: '#ffffff',
    sunElevation: 45, sunAzimuth: 135, shadows: true,
    groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark',
  });

  const handleUpvote = (pinId: string) => {
    if (upvoted[pinId]) return;
    setUpvoted(u => ({ ...u, [pinId]: true }));
    setUpvoteCounts(c => ({ ...c, [pinId]: (c[pinId] || 0) + 1 }));
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F8FC]">

      {/* Header & Mode Switcher */}
      <div className="px-6 sm:px-10 pt-6 pb-4 space-y-3">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#191919] flex items-center gap-2.5">
              Explore Campus 
              <span className={clsx(
                'text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5',
                viewMode === 'heatmap' ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#0B3C73] text-white'
              )}>
                {viewMode === 'heatmap' ? <Flame className="w-3.5 h-3.5 fill-current" /> : <Box className="w-3.5 h-3.5" />}
                {viewMode === 'heatmap' ? 'AI Heatmap' : viewMode === 'wireframe' ? 'Wireframe Mode' : 'PBR Shader Mode'}
              </span>
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              Interactive 3D campus model — switch between Heatmap &amp; PBR Shader modes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher Pills */}
            <div className="bg-white p-1 rounded-2xl border border-gray-200 flex items-center gap-1 shadow-sm">
              <button
                onClick={() => { setViewMode('heatmap'); setLightingSettings(l => ({ ...l, preset: 'cyber' })); }}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none',
                  viewMode === 'heatmap' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Flame className="w-3.5 h-3.5" /> AI Heatmap
              </button>
              <button
                onClick={() => { setViewMode('shaded'); setLightingSettings(l => ({ ...l, preset: 'dawn' })); }}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none',
                  viewMode === 'shaded' ? 'bg-[#0B3C73] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Box className="w-3.5 h-3.5" /> PBR Shader
              </button>
              <button
                onClick={() => { setViewMode('wireframe'); }}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-none',
                  viewMode === 'wireframe' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Eye className="w-3.5 h-3.5" /> Wireframe
              </button>
            </div>

            <button
              onClick={() => setIsMaterialModalOpen(!isMaterialModalOpen)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border',
                isMaterialModalOpen ? 'bg-[#191919] text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              <Sliders className="w-3.5 h-3.5" /> Controls
            </button>
            <button
              onClick={() => setIsLightModalOpen(!isLightModalOpen)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border',
                isLightModalOpen ? 'bg-[#191919] text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              <Sun className="w-3.5 h-3.5" /> Lighting
            </button>
          </div>
        </div>

        {/* AI Heatmap Banner */}
        {viewMode === 'heatmap' && topHotspot && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-rose-950 via-[#1F0008] to-slate-950 text-white rounded-2xl p-3.5 px-5 flex items-center justify-between border border-rose-500/30 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-white/90">
                <span className="text-rose-400 font-extrabold">AI Heatmap Diagnostic:</span> 3D mesh recoloring active. <span className="font-extrabold text-white">{topHotspot.name}</span> is the <span className="text-rose-400 font-black">Hotspot (#1 Reported)</span> with {topHotspot.count} issues.
              </p>
            </div>
            <button 
              onClick={() => setSelectedPin(topHotspot)}
              className="text-[11px] font-extrabold bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shrink-0 ml-4 border-none"
            >
              Inspect Hotspot →
            </button>
          </motion.div>
        )}
      </div>

      {/* 3D Canvas + Issue Drawer */}
      <div className="flex-1 relative flex px-6 sm:px-10 pb-6 gap-4">

        {/* 3D VIEWPORT */}
        <div className="flex-1 relative bg-[#0F0F11] rounded-3xl border border-white/10 overflow-hidden min-h-[400px] shadow-2xl">

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-30">
            <TopBar
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            />
          </div>

          {/* Three.js Canvas */}
          <div className="absolute inset-0">
            <ThreeCanvas
              generatorKey={currentPreset.generatorKey}
              pbrCanvases={pbrCanvases}
              shadingMode={shadingMode}
              cameraPreset={cameraPreset}
              materialSettings={materialSettings}
              lightingSettings={lightingSettings}
              autoRotate={autoRotate}
              onBuildingPositionsUpdate={setScreenPositions}
              isHeatmapActive={isHeatmapActive}
            />
          </div>

          {/* Material Modal */}
          <MaterialModal
            isOpen={isMaterialModalOpen}
            onClose={() => setIsMaterialModalOpen(false)}
            settings={materialSettings}
            onChange={(updated) => setMaterialSettings((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setMaterialSettings({
                metalness: 0.87, roughness: 1.00, normalScale: 3.0,
                wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7,
                emissiveColor: '#00f0ff', emissiveIntensity: 5.0,
                clearcoat: 0.2, transmission: 0, opacity: 1,
              })
            }
          />

          {/* Light Modal */}
          <LightModal
            isOpen={isLightModalOpen}
            onClose={() => setIsLightModalOpen(false)}
            settings={lightingSettings}
            onChange={(updated) => setLightingSettings((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setLightingSettings({
                preset: viewMode === 'heatmap' ? 'cyber' : 'dawn', intensity: 1.2, lightColor: '#ffffff',
                sunElevation: 45, sunAzimuth: 135, shadows: true,
                groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark',
              })
            }
          />

          {/* UNCONGESTED FLOATING 3D LOCATION TAGS FOR BLOCK A, B, C, D */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {buildingsList.map(b => {
              const pos = screenPositions[b.id];
              const isSelected = selectedPin?.id === b.id;

              const fallbackPos: Record<string, { xPct: number; yPct: number }> = {
                'block-a': { xPct: 22, yPct: 28 },
                'block-b': { xPct: 22, yPct: 68 },
                'block-c': { xPct: 78, yPct: 28 },
                'block-d': { xPct: 78, yPct: 68 },
              };
              const fallback = fallbackPos[b.id] || { xPct: 50, yPct: 50 };

              const styleProps = pos && pos.visible
                ? { left: `${pos.x}px`, top: `${pos.y}px` }
                : { left: `${fallback.xPct}%`, top: `${fallback.yPct}%` };

              return (
                <div
                  key={b.id}
                  style={styleProps}
                  className="absolute pointer-events-auto cursor-pointer transition-transform duration-75 -translate-x-1/2 -translate-y-full flex flex-col items-center group z-20"
                  onClick={() => setSelectedPin(isSelected ? null : b)}
                >
                  {/* Glowing Pin Circle */}
                  <div className="relative flex items-center justify-center">
                    {b.isHotspot && isHeatmapActive && (
                      <div className="absolute w-10 h-10 rounded-full bg-rose-500/50 animate-ping" />
                    )}
                    <div className={clsx(
                      'w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[13px] shadow-xl border-2 border-white transition-all',
                      b.isHotspot && isHeatmapActive ? 'bg-rose-600 ring-4 ring-rose-500/50' : b.color
                    )}>
                      {b.count}
                    </div>
                  </div>

                  {/* Clean Floating Tag Label */}
                  <div className={clsx(
                    'mt-1.5 px-3 py-1 rounded-full text-[12px] font-black tracking-wide shadow-xl border backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all',
                    isSelected
                      ? 'bg-white text-[#191919] border-white ring-2 ring-white/50 scale-110'
                      : b.isHotspot && isHeatmapActive
                      ? 'bg-rose-600/95 text-white border-rose-400 shadow-rose-950/50'
                      : 'bg-black/85 text-white border-white/15 group-hover:bg-black group-hover:border-white/30'
                  )}>
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{b.name}</span>
                    {b.isHotspot && isHeatmapActive && (
                      <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                        HOTSPOT
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Block Selector Bar at bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2 pointer-events-auto">
            {buildingsList.map(pin => (
              <button
                key={pin.id}
                onClick={() => setSelectedPin(selectedPin?.id === pin.id ? null : pin)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold cursor-pointer transition-all border backdrop-blur-md',
                  selectedPin?.id === pin.id
                    ? 'bg-white text-[#191919] border-white shadow-xl scale-105'
                    : pin.isHotspot && isHeatmapActive
                    ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40'
                    : 'bg-black/70 text-white/90 border-white/10 hover:bg-black/90'
                )}
              >
                <div className={clsx('w-2.5 h-2.5 rounded-full', pin.color)} />
                <span>{pin.name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{pin.count} issues</span>
              </button>
            ))}
          </div>

          {/* Controls hint */}
          <div className="absolute top-14 right-3 text-[10px] font-bold text-white/40 z-20">
            Drag to orbit 3D campus · Scroll to zoom
          </div>
        </div>

        {/* ISSUE DRAWER */}
        <AnimatePresence>
          {selectedPin && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[350px] bg-white rounded-3xl border border-gray-100 shadow-sm h-full overflow-y-auto p-5 space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{selectedPin.name}</p>
                    <h3 className="text-lg font-black text-[#191919] flex items-center gap-2">
                      {selectedPin.count} Reported Faults
                      {selectedPin.isHotspot && isHeatmapActive && (
                        <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">HOTSPOT</span>
                      )}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedPin(null)} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {selectedPin.issues.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 font-semibold text-sm">✓ No active issues reported here!</div>
                ) : selectedPin.issues.map((issue, i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#191919]">{issue.title}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{selectedPin.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={clsx('text-[10px] font-extrabold px-2.5 py-1 rounded-full', issue.priority === 'Critical' ? 'bg-rose-50 text-rose-700' : issue.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700')}>
                        {issue.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{issue.status}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                      <Users className="w-3.5 h-3.5" />
                      <span>{issue.affected + (upvoteCounts[selectedPin.id] || 0)} people affected</span>
                    </div>
                    <p className="text-xs text-gray-500">Assigned to: <span className="font-bold text-[#191919]">{issue.dept}</span></p>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleUpvote(selectedPin.id)}
                        className={clsx('w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold rounded-xl cursor-pointer transition-all', upvoted[selectedPin.id] ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100')}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {upvoted[selectedPin.id] ? 'Affected' : "I'm experiencing this too"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom bar */}
      <div className="px-6 sm:px-10 pb-4 flex items-center gap-4 text-xs font-bold text-gray-400">
        <MapPin className="w-3.5 h-3.5" />
        <span>3D Campus Fault Analytics · Switchable Heatmap &amp; PBR Shader Modes · Pinned to 3D Model</span>
      </div>

    </div>
  );
};

export default ExploreCampus;
