import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Cpu, ArrowRight, Laptop, Server, Radio } from 'lucide-react';
import { getIssues, getCurrentUser } from '../utils/db';
import type { Issue } from '../utils/db';
import clsx from 'clsx';
import { ThreeCanvas } from '../components/3d/ThreeCanvas';
import { PRESET_MODELS, generateProceduralTextures } from '../components/3d/proceduralAssets';

const pbrCanvases = generateProceduralTextures(PRESET_MODELS[0].generatorKey);

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20, delay: i * 0.08 } }
});

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setIssues(getIssues());
  }, []);

  const staffIssues = issues.filter(i => i.reportedBy.includes(currentUser.name) || i.reportedBy.includes('Staff'));
  const activeIssues = staffIssues.filter(i => i.status !== 'Verified' && i.status !== 'Resolved');
  const resolvedIssues = staffIssues.filter(i => i.status === 'Resolved' || i.status === 'Verified');

  return (
    <div className="bg-[#FAF8F5] min-h-screen p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Row 1: Greeting & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={stagger(0)} initial="hidden" animate="visible" className="md:col-span-2 flex flex-col justify-end p-2 pb-4">
            <h1 className="font-serif text-[40px] md:text-[48px] font-bold text-[#191919] leading-tight tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-[16px] font-bold text-[#191919]/50 mt-2">Manage {currentUser.dept || 'Department'} systems and lab operations.</p>
          </motion.div>

          <motion.div variants={stagger(1)} initial="hidden" animate="visible" className="bg-[#E8F1FC] rounded-[40px] p-8 flex flex-col justify-between h-48 shadow-sm border border-[#0B3C73]/5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans font-bold text-[16px] text-[#0B3C73]">Lab Infrastructure<br/>Health</p>
              <Cpu className="w-6 h-6 text-[#0B3C73]" />
            </div>
            <div className="flex justify-between items-end">
              <p className="font-sans text-[44px] font-bold text-[#0B3C73] leading-none">94.8%</p>
              <span className="text-[13px] font-bold text-[#0B3C73]/50">{activeIssues.length} active faults</span>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Bento cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Active issues */}
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" onClick={() => navigate('/app/my-issues')}
            className="bg-[#FDE7EF] rounded-[40px] p-8 cursor-pointer shadow-sm flex flex-col justify-between transform hover:scale-[1.02] transition-transform h-56">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans font-bold text-[18px] text-[#191919]">Active Department<br/>Faults</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#B23A48]" />
              </div>
            </div>
            <p className="font-sans text-[56px] font-bold text-[#191919] leading-none">{activeIssues.length}</p>
          </motion.div>

          {/* Card 2: Resolved */}
          <motion.div variants={stagger(3)} initial="hidden" animate="visible" onClick={() => navigate('/app/my-issues')}
            className="bg-[#E8F5E9] rounded-[40px] p-8 cursor-pointer shadow-sm flex flex-col justify-between transform hover:scale-[1.02] transition-transform h-56">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans font-bold text-[18px] text-[#191919]">Resolved<br/>This Week</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#3F7A5B]" />
              </div>
            </div>
            <p className="font-sans text-[56px] font-bold text-[#191919] leading-none">{resolvedIssues.length}</p>
          </motion.div>

          {/* Card 3: Department Lab feed */}
          <motion.div variants={stagger(4)} initial="hidden" animate="visible" className="md:col-span-2 bg-[#E8F1FC] rounded-[40px] p-8 shadow-sm flex flex-col h-56 border border-[#0B3C73]/5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans font-bold text-[18px] text-[#0B3C73]">Active Lab Reports</p>
              <div className="bg-white/60 px-4 py-1.5 rounded-full text-[13px] font-bold text-[#0B3C73] border border-[#0B3C73]/5">Engineering Labs</div>
            </div>
            <div className="space-y-3 mt-auto overflow-y-auto max-h-[120px] scrollbar-thin">
              {activeIssues.length > 0 ? (
                activeIssues.map(issue => (
                  <div key={issue.id} className="bg-white/60 rounded-[24px] p-3.5 flex items-center justify-between border border-[#191919]/5">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-[#0B3C73]" />
                      <div>
                        <p className="font-bold text-[14px] text-[#191919]">{issue.title}</p>
                        <p className="text-[12px] text-[#191919]/50 font-bold">{issue.labName || issue.location} · {issue.room}</p>
                      </div>
                    </div>
                    <span className={clsx("px-3 py-1 rounded-full text-[11px] font-bold font-mono", 
                      issue.priority === 'Critical' ? 'bg-[#FDE7EF] text-[#B23A48]' : 'bg-[#FFF4E6] text-[#C08A3E]'
                    )}>{issue.status}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[#191919]/40 font-bold text-[14px]">All lab infrastructure is working fine.</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Row 3: Action & Health Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={stagger(5)} initial="hidden" animate="visible" 
            className="md:col-span-2 bg-[#FFF4E6] rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm gap-8 h-72">
            <div className="space-y-6">
              <h2 className="font-serif text-[36px] md:text-[44px] font-bold text-[#191919] leading-tight">
                Report Lab Fault /<br/>Classroom Issue
              </h2>
              <button onClick={() => navigate('/app/report')}
                className="flex items-center gap-3 px-8 py-4 bg-[#0B3C73] text-white rounded-[24px] font-bold text-[16px] hover:bg-black transition-transform hover:scale-[1.02] shadow-xl cursor-pointer border-none">
                Report Fault <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="w-48 h-48 relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
              <div className="relative w-36 h-36 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
                <Laptop className="w-12 h-12 text-[#C08A3E]" />
              </div>
              <div className="absolute top-2 right-2 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center z-25">
                <Server className="w-6 h-6 text-[#B23A48]" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={stagger(6)} initial="hidden" animate="visible" 
            className="bg-[#E8F1FC] rounded-[40px] p-8 shadow-sm flex flex-col justify-between h-72 border border-[#0B3C73]/5">
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans font-bold text-[18px] text-[#0B3C73]">Lab Telemetry</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <Radio className="w-6 h-6 text-[#0B3C73]" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: 'CSE Lab 1 PC Health', pct: 98 },
                { name: 'CSE Lab 2 PC Health', pct: 92 },
                { name: 'ECE Lab AC Units', pct: 100 }
              ].map((lab, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[13px] font-bold text-[#191919]">
                    <span>{lab.name}</span>
                    <span>{lab.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0B3C73] rounded-full" style={{ width: `${lab.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 4: 3D Campus Diagnostics Card */}
        <motion.div variants={stagger(7)} initial="hidden" animate="visible"
          className="bg-gradient-to-r from-[#0B3C73] via-[#093261] to-[#062447] rounded-[40px] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/10 gap-6">
          <div className="space-y-3 max-w-md">
            <span className="px-3.5 py-1 rounded-full bg-[#00D8F6]/15 text-[#00D8F6] border border-[#00D8F6]/30 font-mono text-[11px] font-bold uppercase tracking-wider">
              3D Infrastructure Engine
            </span>
            <h2 className="font-serif text-[32px] font-bold text-white leading-tight">
              3D Department &amp; Campus Map
            </h2>
            <p className="text-[14px] font-bold text-white/60 leading-relaxed">
              Visualize CSE &amp; ECE lab building heatmaps in 3D. Monitor real-time fault density across all 4 campus blocks.
            </p>
            <button
              onClick={() => navigate('/app/explore')}
              className="mt-2 px-6 py-3.5 bg-white text-[#0B3C73] font-bold text-[14px] rounded-full hover:bg-gray-100 transition-all cursor-pointer border-none shadow-lg flex items-center gap-2"
            >
              Inspect 3D Campus Map →
            </button>
          </div>

          <div className="w-full md:w-[320px] h-[180px] bg-black/60 rounded-[28px] overflow-hidden border border-white/10 relative shadow-inner shrink-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <span className="text-[11px] font-mono text-white/70 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                📍 3D Model Active
              </span>
            </div>
            <div className="w-full h-full opacity-80">
              <ThreeCanvas
                generatorKey={PRESET_MODELS[0].generatorKey}
                pbrCanvases={pbrCanvases}
                shadingMode="shaded"
                cameraPreset="perspective"
                materialSettings={{ metalness: 0.8, roughness: 0.8, normalScale: 2.0, wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7, emissiveColor: '#00f0ff', emissiveIntensity: 2.0, clearcoat: 0, transmission: 0, opacity: 1 }}
                lightingSettings={{ preset: 'cyber', intensity: 1.2, lightColor: '#ffffff', sunElevation: 45, sunAzimuth: 135, shadows: true, groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark' }}
                autoRotate={true}
                isHeatmapActive={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
