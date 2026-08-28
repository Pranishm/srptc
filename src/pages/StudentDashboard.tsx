import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Camera, Bell, CheckCircle2, Droplet, Wifi, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThreeCanvas } from '../components/3d/ThreeCanvas';
import { PRESET_MODELS, generateProceduralTextures } from '../components/3d/proceduralAssets';

const pbrCanvases = generateProceduralTextures(PRESET_MODELS[0].generatorKey);

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20, delay: i * 0.08 } }
});

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F4F4F3] min-h-screen p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={stagger(0)} initial="hidden" animate="visible" className="md:col-span-2 flex flex-col justify-end p-2 pb-4">
            <h1 className="font-serif text-[40px] md:text-[48px] font-bold text-[#191919] leading-tight tracking-tight">
              Welcome back 👋<br/>
              Good evening, Sujan.
            </h1>
          </motion.div>
          <motion.div variants={stagger(1)} initial="hidden" animate="visible" className="bg-[#EDE7FB] rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-sm">
            <p className="font-serif text-[24px] font-bold text-[#191919] mb-4">Campus Health</p>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="72" cy="72" r="66" fill="none" stroke="rgba(25,25,25,0.1)" strokeWidth="10" />
                <motion.circle cx="72" cy="72" r="66" fill="none" stroke="#191919" strokeWidth="10" strokeLinecap="round"
                  initial={{ strokeDasharray: "414 414", strokeDashoffset: 414 }}
                  animate={{ strokeDashoffset: 414 - (414 * 0.982) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <span className="font-sans text-[32px] font-bold text-[#191919]">98<span className="text-[20px]">.2%</span></span>
            </div>
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" onClick={() => navigate('/app/my-issues')}
            className="bg-[#FDE7EF] rounded-[40px] p-8 cursor-pointer shadow-sm flex flex-col justify-between transform hover:scale-[1.02] transition-transform h-56">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans font-bold text-[18px] text-[#191919]">My Active<br/>Issues</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#B23A48]" />
              </div>
            </div>
            <p className="font-sans text-[56px] font-bold text-[#191919] leading-none">2</p>
          </motion.div>

          <motion.div variants={stagger(3)} initial="hidden" animate="visible" onClick={() => navigate('/app/my-issues')}
            className="bg-[#E8F5E9] rounded-[40px] p-8 cursor-pointer shadow-sm flex flex-col justify-between transform hover:scale-[1.02] transition-transform h-56">
            <div className="flex items-center justify-between mb-6">
              <p className="font-sans font-bold text-[18px] text-[#191919]">Resolved<br/>Today</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#3F7A5B]" />
              </div>
            </div>
            <p className="font-sans text-[56px] font-bold text-[#191919] leading-none">8</p>
          </motion.div>

          <motion.div variants={stagger(4)} initial="hidden" animate="visible" className="md:col-span-2 bg-[#E7F1FD] rounded-[40px] p-8 shadow-sm flex flex-col h-56">
            <div className="flex items-center justify-between mb-4">
              <p className="font-sans font-bold text-[18px] text-[#191919]">Live Campus Feed</p>
              <div className="bg-white/60 px-4 py-1.5 rounded-full text-[13px] font-bold text-[#191919]">Priority Queue</div>
            </div>
            <div className="space-y-3 mt-auto">
              <div className="bg-white/60 rounded-[24px] p-3.5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 text-[#B23A48]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[15px] text-[#191919]">Water Leakage</p>
                  <p className="text-[13px] font-semibold text-[#191919]/50">Hostel Block B</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#B23A48] animate-pulse mr-2" />
              </div>
              <div className="bg-white/60 rounded-[24px] p-3.5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5 text-[#C08A3E]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[15px] text-[#191919]">Wi-Fi Outage</p>
                  <p className="text-[13px] font-semibold text-[#191919]/50">Library 2nd Floor</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-[#C08A3E] mr-2" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={stagger(5)} initial="hidden" animate="visible" 
            className="md:col-span-2 bg-[#FFF4E6] rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between shadow-sm gap-8 h-72">
            <div className="space-y-6">
              <h2 className="font-serif text-[36px] md:text-[44px] font-bold text-[#191919] leading-tight">
                Report an issue<br/>in 30 seconds
              </h2>
              <button onClick={() => navigate('/app/report')}
                className="flex items-center gap-3 px-8 py-4 bg-[#191919] text-white rounded-[24px] font-bold text-[16px] hover:bg-black transition-transform hover:scale-[1.02] shadow-xl cursor-pointer">
                Start Report <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="w-48 h-48 relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" />
              <div className="relative w-36 h-36 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
                <Camera className="w-12 h-12 text-[#C08A3E]" />
              </div>
              <div className="absolute top-2 right-2 w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center z-20">
                <MapPin className="w-6 h-6 text-[#B23A48]" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={stagger(6)} initial="hidden" animate="visible" 
            className="bg-[#EDE7FB] rounded-[40px] p-8 shadow-sm flex flex-col justify-between h-72">
            <div className="flex items-center justify-between mb-8">
              <p className="font-sans font-bold text-[18px] text-[#191919]">Category<br/>Breakdown</p>
              <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center">
                <Bell className="w-6 h-6 text-[#191919]" />
              </div>
            </div>
            <div className="space-y-5 w-full">
              {[{l: 'Plumbing', v: 45}, {l: 'Electrical', v: 30}, {l: 'IT', v: 15}].map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[14px] font-bold text-[#191919]">
                    <span>{c.l}</span><span>{c.v}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-[#191919] rounded-full" initial={{ width: 0 }} animate={{ width: `${c.v}%` }} transition={{ delay: 0.8 + (i * 0.1), duration: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Row 4: 3D Campus Interactive Model Card */}
        <motion.div variants={stagger(7)} initial="hidden" animate="visible"
          className="bg-gradient-to-r from-[#0F0F11] via-[#1A1A24] to-[#0F0F11] rounded-[40px] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/10 gap-6">
          <div className="space-y-3 max-w-md">
            <span className="px-3.5 py-1 rounded-full bg-[#00D8F6]/15 text-[#00D8F6] border border-[#00D8F6]/30 font-mono text-[11px] font-bold uppercase tracking-wider">
              3D Campus Diagnostics
            </span>
            <h2 className="font-serif text-[32px] font-bold text-white leading-tight">
              Interactive 3D Campus Heatmap
            </h2>
            <p className="text-[14px] font-bold text-white/60 leading-relaxed">
              Explore Block A, B, C, D in 3D, inspect real-time fault density, and upvote issues in your building.
            </p>
            <button
              onClick={() => navigate('/app/explore')}
              className="mt-2 px-6 py-3.5 bg-white text-[#191919] font-bold text-[14px] rounded-full hover:bg-gray-100 transition-all cursor-pointer border-none shadow-lg flex items-center gap-2"
            >
              Open 3D Campus Console →
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12">
          {[
            { label: 'Reports', value: 12, bg: 'bg-[#E8F5E9]' },
            { label: 'Resolved', value: 8, bg: 'bg-[#E7F1FD]' },
            { label: 'Following', value: 3, bg: 'bg-[#EDE7FB]' },
            { label: 'People Helped', value: 42, bg: 'bg-[#FFF4E6]' }
          ].map((stat, i) => (
            <motion.div key={i} variants={stagger(7 + i)} initial="hidden" animate="visible"
              className={`${stat.bg} rounded-[32px] py-6 px-8 flex items-center justify-between shadow-sm`}>
              <p className="font-sans font-bold text-[15px] text-[#191919] max-w-[60px] leading-tight">{stat.label}</p>
              <p className="font-sans text-[32px] font-bold text-[#191919]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
export default StudentDashboard;
