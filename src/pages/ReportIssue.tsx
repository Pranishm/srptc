import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createIssue, getCurrentUser } from '../utils/db';
import clsx from 'clsx';
import { analyzeIssueAI } from '../utils/ai';
import EvidencePicker from '../components/EvidencePicker';
import { ThreeCanvas } from '../components/3d/ThreeCanvas';
import { PRESET_MODELS, generateProceduralTextures } from '../components/3d/proceduralAssets';
import { MapPin } from 'lucide-react';

const CATEGORIES = [
  { id: 'electrical',     label: 'Electrical',     emoji: '⚡' },
  { id: 'network',        label: 'Network/IT',     emoji: '📶' },
  { id: 'plumbing',       label: 'Plumbing',        emoji: '🔧' },
  { id: 'ac',             label: 'AC / Fan',        emoji: '🌡' },
  { id: 'equipment',      label: 'Lab Equipment',   emoji: '📷' },
];

const BUILDINGS = [
  { id: 'block-a',   name: 'Block A' },
  { id: 'block-b',   name: 'Block B' },
  { id: 'block-c',   name: 'Block C' },
  { id: 'block-d',   name: 'Block D' },
  { id: 'library',   name: 'Library' },
  { id: 'hostel-b',  name: 'Hostel B' },
  { id: 'cse',       name: 'CSE Block' },
  { id: 'parking',   name: 'Main Parking' },
  { id: 'cafeteria', name: 'Cafeteria' },
];

const AI_STEPS = [
  'Image analysed',
  'Location confirmed',
  'Fault signature matching',
  'Priority triage recommendation',
];

const Stepper = ({ step, steps }: { step: number; steps: string[] }) => (
  <div className="flex items-center gap-0 w-full mb-4">
    {steps.map((s, i) => {
      const done    = step > i + 1;
      const current = step === i + 1;
      return (
        <div key={i} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: done ? '#191919' : current ? '#191919' : '#DEDAD1',
                scale: current ? 1.1 : 1,
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-[12px] text-white"
            >
              {done ? '✓' : i + 1}
            </motion.div>
            <span className={`text-[11px] font-bold hidden sm:block whitespace-nowrap ${current ? 'text-[#191919]' : 'text-[#191919]/40'}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-1 bg-[#DEDAD1] mx-4 mb-6 rounded-full relative overflow-hidden">
              <motion.div className="absolute inset-y-0 left-0 bg-[#191919]" animate={{ width: step > i + 1 ? '100%' : '0%' }} />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const ReportIssue = () => {
  const navigate  = useNavigate();
  const currentUser = getCurrentUser();

  const [step, setStep] = useState(1);
  /** Compressed base64 JPEGs — persisted with the ticket so the technician and admin see them. */
  const [evidence, setEvidence] = useState<string[]>([]);

  // Location
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [issueType, setIssueType] = useState<'general' | 'classroom' | 'lab'>('general');
  const [labName, setLabName] = useState('');
  const [pcNumber, setPcNumber] = useState('');

  const [screenPositions, setScreenPositions] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
  const pbrCanvases = useMemo(() => generateProceduralTextures(PRESET_MODELS[0].generatorKey), []);

  // Details
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // AI analysis states
  const [analyzing, setAnalyzing] = useState(false);
  const [aiStepsDone, setAiStepsDone] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  
  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState('');

  const STEPS = ['Evidence', 'Location', 'Details', 'Triage'];
  const buildingName = BUILDINGS.find(b => b.id === selectedBuilding)?.name ?? 'Not selected';
  const roleLabel = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiStepsDone([]);
    
    // Call NVIDIA NIM API to detect category
    if (description) {
      const res = await analyzeIssueAI(description);
      if (res.category) {
        const foundCat = CATEGORIES.find(c => c.label.toLowerCase().includes(res.category.toLowerCase()) || res.category.toLowerCase().includes(c.id));
        if (foundCat) setSelectedCategory(foundCat.id);
      }
    }

    AI_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setAiStepsDone(prev => [...prev, i]);
        if (i === AI_STEPS.length - 1) {
          setAnalyzing(false);
          setShowResult(true);
        }
      }, 400 + i * 300);
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      // Save report in db.ts
      const created = createIssue({
        title: selectedCategory ? `${selectedCategory.toUpperCase()} issue` : 'Reported Fault',
        category: selectedCategory || 'General',
        location: buildingName,
        room: roomNumber || 'General Area',
        priority: selectedCategory === 'electrical' || selectedCategory === 'network' ? 'Critical' : 'High',
        reportedBy: `${currentUser.name} (${roleLabel})`,
        description: description || 'No description provided.',
        isLabFault: issueType === 'lab',
        labName: labName || undefined,
        pcNumber: pcNumber || undefined,
        evidence
      });
      
      setNewlyCreatedId(created.id);
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#F4F4F3]">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-lg border border-[#191919]/5 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-[#3F7A5B]" />
        </div>
        <div>
          <p className="font-mono text-[12px] font-bold text-[#191919]/40">{newlyCreatedId} created successfully</p>
          <h2 className="font-serif text-[28px] font-bold text-[#191919] mt-2">Report Submitted</h2>
          <p className="text-[14px] font-bold text-[#191919]/50 mt-2 leading-relaxed">
            The dispatcher is routing this ECE/CSE fault to the available technicians.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/app/my-issues')}
            className="flex-1 py-4 bg-[#191919] text-white font-bold text-[14px] rounded-[20px] cursor-pointer hover:bg-black transition-all">
            Track Issue
          </button>
          <button onClick={() => navigate('/app/student')}
            className="flex-1 py-4 bg-[#F4F4F3] text-[#191919] font-bold text-[14px] rounded-[20px] cursor-pointer hover:bg-[#eaeaea] transition-all">
            Back Home
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (submitting) return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#F4F4F3]">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-lg text-center space-y-6 border border-[#191919]/5">
        <h2 className="font-serif text-[22px] font-bold text-[#191919]">Saving to persistent database...</h2>
        <div className="w-8 h-8 border-4 border-[#191919]/20 border-t-[#191919] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-10 bg-[#F4F4F3] min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-bold text-[12px] text-[#191919]/40 uppercase tracking-widest mb-2">CIVX360 / REPORT</p>
          <h1 className="font-serif text-[36px] font-bold text-[#191919] leading-tight">Report lab fault or classroom issue</h1>
          <p className="text-[15px] font-bold text-[#191919]/50 mt-2">
            Describe ECE/CSE lab PC faults, AC unit fiascos, or classroom light outages.
          </p>
        </motion.div>

        <Stepper step={step} steps={STEPS} />

        {/* ── STEP 1: Photo Evidence ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="bg-white rounded-[40px] p-8 border border-[#191919]/5 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-mono text-[12px] font-bold text-[#191919]/40 uppercase tracking-wider">Step 01 · Fault Evidence</h2>
                  <p className="text-[14px] font-bold text-[#191919]/50 mt-1.5">
                    Take a live photo of the fault, or upload one from your gallery.
                  </p>
                </div>
                <span className="shrink-0 flex items-center gap-1.5 bg-[#E7F1FD] text-[#0B3C73] text-[11px] font-bold px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> Shared with technician &amp; admin
                </span>
              </div>

              <EvidencePicker
                images={evidence}
                onChange={setEvidence}
                label="Fault Evidence"
                tone="report"
              />

              <div className="flex gap-4 pt-4 border-t border-[#F4F4F3]">
                <button onClick={() => setStep(2)}
                  className={clsx(
                    'flex-1 py-4 font-bold text-[14px] rounded-[20px] cursor-pointer transition-all border-none',
                    evidence.length > 0 ? 'bg-[#191919] text-white hover:bg-black' : 'bg-[#F4F4F3] text-[#191919]/60'
                  )}>
                  {evidence.length > 0 ? 'Continue' : 'Continue without a photo'}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Location ───────────────────────────────────────── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="bg-white rounded-[40px] p-8 border border-[#191919]/5 shadow-sm space-y-6">
              <h2 className="font-mono text-[12px] font-bold text-[#191919]/40 uppercase tracking-wider">Step 02 · Location Details</h2>

              {/* Location Type */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#191919]">Fault Location Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'general', label: 'General Campus' },
                    { id: 'classroom', label: 'Classroom' },
                    { id: 'lab', label: 'Engineering Lab' }
                  ].map(opt => (
                    <button key={opt.id} type="button" onClick={() => setIssueType(opt.id as any)}
                      className={clsx("px-4 py-3.5 rounded-[20px] border text-[13px] font-bold transition-all", 
                        issueType === opt.id ? "bg-[#191919] text-white border-none" : "border-[#191919]/10 text-[#191919]/60 hover:bg-[#F4F4F3]"
                      )}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Building Select */}
              <div className="space-y-4">
                <label className="text-[14px] font-bold text-[#191919]">Select Building</label>
                
                {/* 3D Model Picker */}
                <div className="relative h-[250px] w-full rounded-[24px] overflow-hidden border border-[#191919]/10 bg-[#121215] shadow-inner mb-4">
                  <div className="absolute inset-0">
                    <ThreeCanvas
                      generatorKey={PRESET_MODELS[0].generatorKey}
                      pbrCanvases={pbrCanvases}
                      shadingMode="shaded"
                      cameraPreset="perspective"
                      materialSettings={{ metalness: 0.85, roughness: 0.9, normalScale: 2.5, wireframe: false, wireframeColor: '#38bdf8', wireframeOpacity: 0.7, emissiveColor: '#ff0033', emissiveIntensity: 3.0, clearcoat: 0.2, transmission: 0, opacity: 1 }}
                      lightingSettings={{ preset: 'dawn', intensity: 1.3, lightColor: '#ffffff', sunElevation: 45, sunAzimuth: 135, shadows: true, groundGrid: true, gridColor: '#272738', bgColor: '#121215', bgMode: 'dark' }}
                      autoRotate={false}
                      onBuildingPositionsUpdate={setScreenPositions}
                    />
                  </div>
                  
                  {/* Floating Pins */}
                  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                    {['block-a', 'block-b', 'block-c', 'block-d'].map(pinId => {
                      const pos = screenPositions[pinId];
                      const isSelected = selectedBuilding === pinId;
                      const building = BUILDINGS.find(b => b.id === pinId);
                      
                      const fallbackPos: Record<string, { xPct: number; yPct: number }> = {
                        'block-a': { xPct: 25, yPct: 30 },
                        'block-b': { xPct: 25, yPct: 70 },
                        'block-c': { xPct: 75, yPct: 30 },
                        'block-d': { xPct: 75, yPct: 70 },
                      };
                      const fallback = fallbackPos[pinId] || { xPct: 50, yPct: 50 };

                      const styleProps = pos && pos.visible
                        ? { left: `${pos.x}px`, top: `${pos.y}px` }
                        : { left: `${fallback.xPct}%`, top: `${fallback.yPct}%` };

                      return (
                        <div
                          key={pinId}
                          style={styleProps}
                          className="absolute pointer-events-auto cursor-pointer transition-transform duration-75 -translate-x-1/2 -translate-y-full flex flex-col items-center group z-20"
                          onClick={() => setSelectedBuilding(isSelected ? null : pinId)}
                        >
                          <div className={clsx(
                            'mt-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-wide shadow-xl border backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap transition-all',
                            isSelected ? 'bg-white text-[#191919] border-white scale-110' : 'bg-black/85 text-white border-white/15 hover:scale-105'
                          )}>
                            <MapPin className={clsx("w-3.5 h-3.5", isSelected ? "text-rose-500" : "text-white/70")} />
                            <span>{building?.name}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-2 z-20 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    Interactive 3D Select
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {BUILDINGS.map(b => (
                    <button key={b.id} type="button" onClick={() => setSelectedBuilding(b.id)}
                      className={clsx("px-4 py-3.5 rounded-[20px] border text-[13px] font-bold transition-all", 
                        selectedBuilding === b.id ? "bg-[#191919] text-white border-none" : "border-[#191919]/10 text-[#191919]/60 hover:bg-[#F4F4F3]"
                      )}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-fields depending on issueType */}
              {issueType === 'classroom' && (
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-[#191919]">Room / Hall Number</label>
                  <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="e.g. Room 204" required
                    className="w-full px-5 py-4 rounded-[20px] bg-[#F4F4F3] text-[14px] font-bold text-[#191919] focus:outline-none focus:ring-4 focus:ring-[#191919]/10 border-none"
                  />
                </div>
              )}

              {issueType === 'lab' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#191919]">Lab Name</label>
                    <input type="text" value={labName} onChange={e => setLabName(e.target.value)} placeholder="e.g. CSE Lab 2" required
                      className="w-full px-5 py-4 rounded-[20px] bg-[#F4F4F3] text-[14px] font-bold text-[#191919] focus:outline-none border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-[#191919]">System / PC Number</label>
                    <input type="text" value={pcNumber} onChange={e => setPcNumber(e.target.value)} placeholder="e.g. PC-14"
                      className="w-full px-5 py-4 rounded-[20px] bg-[#F4F4F3] text-[14px] font-bold text-[#191919] focus:outline-none border-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-[#F4F4F3]">
                <button onClick={() => setStep(1)} className="px-6 py-4 bg-[#F4F4F3] text-[#191919]/60 font-bold text-[14px] rounded-[20px] cursor-pointer">Back</button>
                <button onClick={() => setStep(3)} disabled={!selectedBuilding}
                  className={clsx("flex-1 py-4 font-bold text-[14px] rounded-[20px] cursor-pointer transition-all", 
                    selectedBuilding ? "bg-[#191919] text-white hover:bg-black" : "bg-[#F4F4F3] text-[#191919]/30 cursor-not-allowed"
                  )}>
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Details ────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="bg-white rounded-[40px] p-8 border border-[#191919]/5 shadow-sm space-y-6">
              <h2 className="font-mono text-[12px] font-bold text-[#191919]/40 uppercase tracking-wider">Step 03 · Details & Category</h2>

              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} type="button" onClick={() => setSelectedCategory(cat.id)}
                    className={clsx("p-3 rounded-[20px] border text-center transition-all cursor-pointer", 
                      selectedCategory === cat.id ? "bg-[#191919]/5 border-[#191919]" : "border-[#191919]/10 bg-white"
                    )}>
                    <div className="text-lg">{cat.emoji}</div>
                    <p className="text-[11px] font-bold text-[#191919] mt-1">{cat.label}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-bold text-[#191919]">Explain the issue</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                  placeholder="e.g. The PC screen turns black after loading ECE software tools..."
                  className="w-full px-5 py-4 bg-[#F4F4F3] rounded-[24px] text-[14px] font-bold text-[#191919] placeholder:text-[#191919]/30 focus:outline-none resize-none border-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#F4F4F3]">
                <button onClick={() => setStep(2)} className="px-6 py-4 bg-[#F4F4F3] text-[#191919]/60 font-bold text-[14px] rounded-[20px] cursor-pointer">Back</button>
                <button onClick={() => { setStep(4); handleAnalyze(); }} disabled={!selectedCategory}
                  className={clsx("flex-1 py-4 font-bold text-[14px] rounded-[20px] cursor-pointer transition-all", 
                    selectedCategory ? "bg-[#191919] text-white hover:bg-black" : "bg-[#F4F4F3] text-[#191919]/30 cursor-not-allowed"
                  )}>
                  Run AI Triage →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Triage / AI Analysis ───────────────────────────── */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              
              <div className="bg-white rounded-[40px] p-8 border border-[#191919]/5 shadow-sm space-y-4">
                <h3 className="font-mono text-[12px] font-bold text-[#191919]/40 uppercase tracking-wider">AI Diagnostic Engine</h3>
                {AI_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-[14px] font-bold">
                    <span className="text-[#191919]">{s}</span>
                    {aiStepsDone.includes(i) ? (
                      <span className="text-[#3F7A5B] flex items-center gap-1 text-[12px]">Done</span>
                    ) : analyzing && i === aiStepsDone.length ? (
                      <div className="w-4 h-4 border-2 border-[#191919]/20 border-t-[#191919] rounded-full animate-spin" />
                    ) : <span className="text-[#191919]/25">—</span>}
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-[#191919] text-white rounded-[40px] p-8 space-y-6">
                      <div>
                        <span className="inline-block px-3 py-1 bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest rounded-full">AI Recommendation</span>
                        <h3 className="font-serif text-[26px] font-bold text-white mt-3">Priority: Critical Severity</h3>
                        <p className="text-[14px] text-white/70 mt-1">Routing to the active maintenance crew.</p>
                      </div>
                      <div className="bg-white/10 p-5 rounded-[24px] border border-white/15">
                        <p className="font-bold text-[14px] text-white">Suggested Technician: Arun Kumar</p>
                        <p className="text-[12px] text-white/60 mt-1">Available ECE technician currently located 120m away from building.</p>
                      </div>
                    </div>

                    <button onClick={handleSubmit} className="w-full py-5 bg-[#191919] hover:bg-black text-white font-bold text-[16px] rounded-[24px] transition-transform hover:scale-[1.02] shadow-xl cursor-pointer">
                      Submit Resolution Report →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ReportIssue;
