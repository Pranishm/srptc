import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle2, Wrench, ShieldAlert, ArrowRight, Activity, Flame, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import { getIssues, getTechnicians, assignIssue, type Issue, type Technician } from '../../utils/db';
import { ThreeCanvas } from '../../components/3d/ThreeCanvas';
import { PRESET_MODELS, generateProceduralTextures } from '../../components/3d/proceduralAssets';
import { useNavigate } from 'react-router-dom';

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [isHeatmap, setIsHeatmap] = useState(false);

  useEffect(() => {
    setIssues(getIssues());
    setTechnicians(getTechnicians());
  }, []);

  const pbrCanvases = generateProceduralTextures(PRESET_MODELS[0].generatorKey);

  const unassigned = issues.filter(i => i.status === 'Unassigned');
  const critical = issues.filter(i => i.priority === 'Critical');
  const resolved = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified');

  const handleDispatch = (issueId: string) => {
    if (!selectedTech) return;
    assignIssue(issueId, selectedTech);
    setIssues(getIssues());
    setTechnicians(getTechnicians());
    setSelectedIssue(null);
    setSelectedTech('');
  };

  return (
    <PortalShell title="Admin Command Center" subtitle="High-level campus operations & real-time dispatch console" pages={ADMIN_PAGES}>
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {[
          { label: 'Total Reported', value: issues.length, icon: Target, bg: 'bg-[#E8F1FC]', accent: 'text-[#0B3C73]', path: '/app/admin/issues' },
          { label: 'Unassigned', value: unassigned.length, icon: AlertTriangle, bg: 'bg-[#FFF4E6]', accent: 'text-[#C08A3E]', path: '/app/admin/issues' },
          { label: 'Critical SLA', value: critical.length, icon: ShieldAlert, bg: 'bg-[#FDE7EF]', accent: 'text-[#B23A48]', path: '/app/admin/alerts' },
          { label: 'Resolved & Verified', value: resolved.length, icon: CheckCircle2, bg: 'bg-[#E8F5E9]', accent: 'text-[#3F7A5B]', path: '/app/admin/analytics' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={shellStagger(i + 1)}
            initial="hidden"
            animate="visible"
            onClick={() => navigate(stat.path)}
            className={clsx(
              'rounded-[28px] p-6 flex flex-col justify-between h-44 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg',
              stat.bg
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-sans font-bold text-[14px] text-[#191919]">{stat.label}</p>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <stat.icon className={clsx('w-5 h-5', stat.accent)} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-sans text-[46px] font-bold text-[#191919] leading-none tabular-nums">{stat.value}</p>
              <ArrowRight className="w-5 h-5 text-[#191919]/30" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: 3D Campus Heatmap Viewport */}
        <motion.div variants={shellStagger(5)} initial="hidden" animate="visible" className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-[22px] font-bold text-[#191919] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#0B3C73]" /> Live 3D Campus Heatmap
                </h2>
                <p className="text-[13px] font-bold text-[#191919]/40 mt-0.5">Real-time fault density across Block A, B, C, D</p>
              </div>

              <button
                onClick={() => setIsHeatmap(!isHeatmap)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer border transition-all',
                  isHeatmap ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                )}
              >
                <Flame className="w-3.5 h-3.5" /> Heatmap {isHeatmap ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Embedded 3D Canvas */}
            <div className="w-full h-[340px] bg-[#0F0F11] rounded-2xl overflow-hidden relative border border-white/10 shadow-inner">
              <ThreeCanvas
                generatorKey={PRESET_MODELS[0].generatorKey}
                pbrCanvases={pbrCanvases}
                shadingMode="shaded"
                cameraPreset="perspective"
                materialSettings={{ metalness: 0.8, roughness: 0.8, normalScale: 2.0, wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7, emissiveColor: '#ff0033', emissiveIntensity: 2.0, clearcoat: 0, transmission: 0, opacity: 1 }}
                lightingSettings={{ preset: isHeatmap ? 'cyber' : 'dawn', intensity: 1.2, lightColor: '#ffffff', sunElevation: 45, sunAzimuth: 135, shadows: true, groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark' }}
                autoRotate={false}
                isHeatmapActive={isHeatmap}
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Block C: Hotspot (#1 Reported Faults)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] font-bold text-[#191919]/50">3D Diagnostics Engine Active</span>
              <button onClick={() => navigate('/app/admin/campus')} className="text-[12px] font-bold text-[#0B3C73] hover:underline cursor-pointer">
                Full 3D Campus Console →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Dispatch Console */}
        <motion.div variants={shellStagger(6)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-4">
          
          {/* Quick Dispatch Box */}
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3 className="font-serif text-[20px] font-bold text-[#191919] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#C08A3E]" /> Rapid Technician Dispatch
            </h3>

            {unassigned.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[13px] font-bold text-[#191919]/60">Select an unassigned ticket to dispatch:</p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {unassigned.map(issue => (
                    <div
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={clsx(
                        'p-3.5 rounded-[18px] border cursor-pointer transition-all flex items-center justify-between',
                        selectedIssue?.id === issue.id ? 'bg-[#0B3C73] text-white border-transparent shadow-md' : 'bg-white/70 hover:bg-white border-black/5 text-[#191919]'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[13px] truncate">{issue.title}</p>
                        <p className={clsx('text-[11px] font-bold mt-0.5 truncate', selectedIssue?.id === issue.id ? 'text-white/70' : 'text-[#191919]/40')}>
                          {issue.location} · {issue.room}
                        </p>
                      </div>
                      <span className={clsx('text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0', issue.priority === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white')}>
                        {issue.priority}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedIssue && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2 border-t border-black/5">
                    <p className="text-[12px] font-bold text-[#191919]/60">Assign technician for {selectedIssue.id}:</p>
                    <select
                      value={selectedTech}
                      onChange={e => setSelectedTech(e.target.value)}
                      className="w-full px-4 py-3 rounded-[16px] bg-white border border-black/10 text-[13px] font-bold text-[#191919] focus:outline-none"
                    >
                      <option value="">Select Technician...</option>
                      {technicians.map(t => (
                        <option key={t.name} value={t.name}>
                          {t.name} ({t.dept}) — {t.available ? 'Available' : 'Busy'}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDispatch(selectedIssue.id)}
                      disabled={!selectedTech}
                      className="w-full py-3.5 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-[18px] transition-all disabled:opacity-40 cursor-pointer border-none shadow-md"
                    >
                      Dispatch Technician →
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-[#E8F5E9] rounded-[20px] p-6 text-center text-[#3F7A5B] font-bold text-[14px] space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto" />
                <p>All reported issues are currently assigned to technicians!</p>
              </div>
            )}
          </div>

          {/* AI Predictive Insight Card */}
          <div className="bg-gradient-to-br from-[#0B3C73] via-[#093261] to-[#062447] text-white rounded-[32px] p-6 space-y-3 relative overflow-hidden shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00D8F6] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#00D8F6] font-bold">AI Predictive Engine</span>
            </div>
            <h4 className="font-serif text-[20px] font-bold text-white">Block C Wi-Fi Bandwidth Breach</h4>
            <p className="text-[13px] text-white/70 leading-relaxed font-bold">
              AI model predicts 92% risk of router thermal throttle in Block C within 3h due to peak exam traffic.
            </p>
            <button
              onClick={() => navigate('/app/admin/ai')}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-[13px] rounded-[16px] border border-white/20 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              Open AI Predictions →
            </button>
          </div>

        </motion.div>
      </div>

    </PortalShell>
  );
}
