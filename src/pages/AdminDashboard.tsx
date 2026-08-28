import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, MapPin, Sparkles, User, FileText, CheckCircle2, Cpu, Activity } from 'lucide-react';
import clsx from 'clsx';
import { getIssues, getTechnicians, assignIssue } from '../utils/db';
import type { Issue } from '../utils/db';
import { queryCivxAI, analyzeStudentFeedbackAI } from '../utils/ai';
import { t, getCurrentLanguage, type Language } from '../utils/i18n';

const MAP_PINS = [
  { id: '1', name: 'Block A', count: 12, status: 'Critical', color: 'bg-[#FDE7EF]', text: 'text-[#B23A48]', top: '25%', left: '30%' },
  { id: '2', name: 'Block B', count: 2, status: 'Normal', color: 'bg-[#E8F5E9]', text: 'text-[#3F7A5B]', top: '55%', left: '20%' },
  { id: '3', name: 'Block C', count: 18, status: 'Critical', color: 'bg-[#FDE7EF]', text: 'text-[#B23A48]', top: '50%', left: '75%' },
  { id: '4', name: 'Library', count: 7, status: 'Medium', color: 'bg-[#FFF4E6]', text: 'text-[#C08A3E]', top: '75%', left: '45%' },
];

const ANALYTICS_DATA = [
  { day: 'S', height: 64, active: false },
  { day: 'M', height: 112, active: true },
  { day: 'T', height: 96, active: true },
  { day: 'W', height: 144, active: true },
  { day: 'T', height: 80, active: false },
  { day: 'F', height: 96, active: false },
  { day: 'S', height: 64, active: false },
];

const TABS = [
  { id: 'command', labelKey: 'overview', icon: Target },
  { id: 'campus', labelKey: 'liveCampus', icon: MapPin },
  { id: 'issues', labelKey: 'myIssues', icon: FileText },
  { id: 'ai', labelKey: 'aiPrediction', icon: Sparkles },
  { id: 'feedback', labelKey: 'feedbackAnalytics', icon: Activity },
  { id: 'staff', labelKey: 'staffRoster', icon: User },
];

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.04 } }
});

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'command';
  const navigate = useNavigate();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<ReturnType<typeof getTechnicians>>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const [isScanningAi, setIsScanningAi] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<string | null>(null);

  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  const handleRunAiScan = async () => {
    setIsScanningAi(true);
    const report = await queryCivxAI('Analyze campus telemetry and predict potential hardware or facility failure risks for the coming week.');
    setAiReport(report);
    setIsScanningAi(false);
  };

  const handleAnalyzeFeedback = async () => {
    setIsAnalyzingFeedback(true);
    const allIssues = getIssues();
    const feedbacks = allIssues.filter(i => i.rating).map(i => ({ rating: i.rating!, feedback: i.ratingFeedback }));
    const analysis = await analyzeStudentFeedbackAI(feedbacks);
    setFeedbackAnalysis(analysis);
    setIsAnalyzingFeedback(false);
  };

  const [timeStr, setTimeStr] = useState('01:24:08');

  useEffect(() => {
    setIssues(getIssues());
    setTechnicians(getTechnicians());
  }, [assignedSuccess]);

  useEffect(() => {
    const iv = setInterval(() => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleAssign = () => {
    if (!selectedIssue || !selectedTech) return;
    assignIssue(selectedIssue.id, selectedTech);
    setAssignedSuccess(true);
    setTimeout(() => { 
      setSelectedIssue(null); 
      setSelectedTech('');
      setAssignedSuccess(false); 
    }, 1200);
  };

  const criticalSLAs = issues.filter(i => i.priority === 'Critical' && i.status !== 'Resolved' && i.status !== 'Verified').length;
  const unassigned = issues.filter(i => i.status === 'Unassigned').length;
  const resolved = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified').length;
  
  const totalIssuesCount = issues.length || 1;
  const resolutionPercentage = Math.round((resolved / totalIssuesCount) * 100);

  return (
    <div className="p-4 md:p-8 bg-transparent min-h-screen relative z-10">
      <div className="max-w-[1240px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <motion.div variants={stagger(0)} initial="hidden" animate="visible">
            <h1 className="font-serif text-[36px] md:text-[42px] font-bold text-[#191919] leading-tight">Admin Console</h1>
            <p className="text-[15px] font-sans font-bold text-[#191919]/40 mt-1">Real-time campus maintenance telemetry.</p>
          </motion.div>
          
          {/* Pill Tab Selector */}
          <motion.div variants={stagger(1)} initial="hidden" animate="visible" className="flex items-center gap-1.5 overflow-x-auto bg-white/80 p-1.5 rounded-full shadow-sm border border-white">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx("px-4 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border-none", activeTab === tab.id ? "bg-[#0B3C73] text-white shadow-sm" : "text-[#191919]/60 hover:bg-black/5")}>
                  <Icon className="w-4 h-4" />{t(tab.labelKey, currentLang)}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* ══ Overview / Command Center ══ */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            
            {/* Stat Bento Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: t('totalTasks', currentLang), value: totalIssuesCount, text: 'text-[#0B3C73]' },
                { label: t('criticalAlerts', currentLang), value: criticalSLAs, text: 'text-[#B23A48]' },
                { label: t('unassigned', currentLang), value: unassigned, text: 'text-[#C08A3E]' },
                { label: t('resolvedToday', currentLang), value: resolved, text: 'text-[#3F7A5B]' },
              ].map((k, i) => (
                <motion.div key={k.label} variants={stagger(i + 2)} initial="hidden" animate="visible" className="glass-card rounded-[32px] p-6 flex flex-col justify-between h-44 hover:scale-[1.02] hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-pointer">
                  <p className="font-sans font-bold text-[14px] text-[#191919]/60 leading-tight">{k.label}</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className={clsx("font-sans text-[48px] font-bold leading-none", k.text)}>{k.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Middle Bento Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Circular Gauge Card */}
              <motion.div variants={stagger(6)} initial="hidden" animate="visible" className="lg:col-span-4 glass-card rounded-[32px] p-8 flex flex-col justify-between h-[360px] hover:scale-[1.01] transition-transform duration-300">
                <div>
                  <h3 className="font-sans font-bold text-[18px] text-[#191919]">{t('resolutionProgress', currentLang)}</h3>
                  <p className="text-[12px] font-bold text-[#191919]/40 mt-1">Resolution effectiveness rate</p>
                </div>
                
                <div className="flex justify-center items-center py-4">
                  <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                    <svg width="150" height="150" viewBox="0 0 100 100" className="transform -rotate-90">
                      <circle cx="50" cy="50" r="42" stroke="rgba(11, 60, 115, 0.06)" strokeWidth="8" fill="transparent" />
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        stroke="#0B3C73" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - resolutionPercentage / 100) }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-[28px] font-bold text-[#191919]">{resolutionPercentage}%</span>
                      <p className="text-[10px] font-bold text-[#3F7A5B] mt-0.5">SLA Pass</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Weekly Analytics Bar Chart */}
              <motion.div variants={stagger(7)} initial="hidden" animate="visible" className="lg:col-span-5 glass-card rounded-[32px] p-8 flex flex-col justify-between h-[360px] hover:scale-[1.01] transition-transform duration-300">
                <div>
                  <h3 className="font-sans font-bold text-[18px] text-[#191919]">Weekly Incident Volume</h3>
                  <p className="text-[12px] font-bold text-[#191919]/40 mt-1">Total reporting activity</p>
                </div>
                <div className="flex items-end justify-between px-2 pt-8 h-40">
                  {ANALYTICS_DATA.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 flex-1">
                      <div className="w-6 bg-[#191919]/5 rounded-full h-32 flex items-end">
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: d.height }} 
                          transition={{ duration: 0.8, delay: i * 0.05 }}
                          className={clsx("w-full rounded-full transition-all duration-300 hover:opacity-80 cursor-pointer", d.active ? "bg-[#0B3C73]" : "bg-[#191919]/20")} 
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#191919]/40">{d.day}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Watch Clock Card (Bento Card 3) */}
              <motion.div variants={stagger(8)} initial="hidden" animate="visible" className="lg:col-span-3 glass-card rounded-[32px] p-8 flex flex-col justify-between h-[360px] hover:scale-[1.01] transition-transform duration-300">
                <div>
                  <h3 className="font-sans font-bold text-[18px] text-[#191919]">System SLA Clock</h3>
                  <p className="text-[12px] font-bold text-[#191919]/40 mt-1">Operational response window</p>
                </div>

                {/* Simulated mechanical watch dial widget */}
                <div className="flex justify-center items-center py-2 relative">
                  <div className="w-28 h-28 rounded-full border-4 border-[#0B3C73] flex items-center justify-center relative shadow-md bg-white">
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-black/10 animate-[spin_60s_linear_infinite]" />
                    <span className="w-2 h-2 rounded-full bg-[#0B3C73] z-20" />
                    
                    {/* Watch Tick markers */}
                    <div className="absolute top-1 text-[9px] font-bold text-[#191919]/40">12</div>
                    <div className="absolute bottom-1 text-[9px] font-bold text-[#191919]/40">6</div>
                    <div className="absolute left-1.5 text-[9px] font-bold text-[#191919]/40">9</div>
                    <div className="absolute right-1.5 text-[9px] font-bold text-[#191919]/40">3</div>

                    {/* Clock hands */}
                    <div className="absolute w-0.5 h-10 bg-[#B23A48] origin-bottom -mt-10 rounded-full animate-[spin_45s_linear_infinite] z-10" />
                    <div className="absolute w-1 h-7 bg-[#0B3C73] origin-bottom -mt-7 rounded-full animate-[spin_360s_linear_infinite] z-10" />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[12px] font-bold text-[#191919]/40 uppercase tracking-widest">SLA Active</p>
                  <p className="font-mono text-[20px] font-bold text-[#191919] mt-0.5">{timeStr}</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ══ Live Campus Map Tab ══ */}
        {activeTab === 'campus' && (
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vector schematic of campus layout */}
            <div className="lg:col-span-2 glass-card rounded-[32px] p-6 h-[460px] relative overflow-hidden border border-black/5 bg-[#FAF8F5]/80">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60" />
              
              {/* Campus outlines */}
              <div className="absolute inset-8 border-2 border-dashed border-[#0B3C73]/10 rounded-full animate-[spin_120s_linear_infinite]" />
              <div className="absolute inset-20 border border-dashed border-[#0B3C73]/5 rounded-full" />
              
              {/* Block representations */}
              <div className="absolute top-[20%] left-[25%] w-[80px] h-[60px] bg-white border border-[#191919]/5 rounded-[16px] shadow-sm flex items-center justify-center font-bold text-xs">Block A</div>
              <div className="absolute bottom-[20%] left-[15%] w-[90px] h-[60px] bg-white border border-[#191919]/5 rounded-[16px] shadow-sm flex items-center justify-center font-bold text-xs">Block B</div>
              <div className="absolute top-[40%] right-[15%] w-[100px] h-[70px] bg-white border border-[#191919]/5 rounded-[16px] shadow-sm flex items-center justify-center font-bold text-xs">Block C</div>
              <div className="absolute bottom-[15%] left-[45%] w-[80px] h-[60px] bg-white border border-[#191919]/5 rounded-[16px] shadow-sm flex items-center justify-center font-bold text-xs">Library</div>

              {/* Status Pins overlay */}
              {MAP_PINS.map(pin => (
                <div key={pin.id} className="absolute flex flex-col items-center cursor-pointer transition-transform hover:scale-110" style={{ top: pin.top, left: pin.left }}>
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-bounce font-bold text-xs border border-white", pin.color, pin.text)}>
                    {pin.count}
                  </div>
                  <span className="px-2 py-0.5 bg-[#191919] text-white text-[9px] font-bold rounded-full mt-1.5 shadow-sm">{pin.name}</span>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-[32px] p-8 flex flex-col justify-between h-[460px]">
              <div className="space-y-4">
                <h3 className="font-serif text-[24px] font-bold text-[#191919] leading-tight">Interactive Map</h3>
                <p className="text-[14px] font-bold text-[#191919]/50 leading-relaxed">
                  Real-time overlay of reported issues. Click on any location pin to inspect details.
                </p>
                <div className="space-y-2.5 pt-2">
                  {MAP_PINS.map(pin => (
                    <div key={pin.id} className="flex justify-between items-center bg-[#FAF8F5] p-3 rounded-[18px] border border-black/[0.04]">
                      <span className="font-bold text-xs text-[#191919]">{pin.name}</span>
                      <span className={clsx("px-2.5 py-0.5 rounded-full text-[10px] font-bold", pin.color, pin.text)}>{pin.count} open reports</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ Issue Inbox / Assignment Tab ══ */}
        {activeTab === 'issues' && (
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Issues Inbox list (left side) */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="font-sans font-bold text-[20px] text-[#191919] px-2">{t('myIssues', currentLang)}</h3>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <motion.div key={issue.id} onClick={() => setSelectedIssue(issue)}
                    className={clsx('glass-card rounded-[28px] p-5 cursor-pointer flex items-center justify-between shadow-sm transition-all duration-300', selectedIssue?.id === issue.id ? 'ring-2 ring-[#0B3C73] scale-[1.01]' : 'hover:scale-[1.005] hover:pl-7')}
                  >
                    <div>
                      <h4 className="font-sans font-bold text-[16px] text-[#191919]">{issue.title}</h4>
                      <p className="text-[13px] text-[#191919]/50 font-bold mt-1">
                        {issue.location} {issue.room && `· ${issue.room}`}
                      </p>
                      <p className="text-[11px] font-mono text-gray-400 mt-1 font-bold">Assigned to: {issue.staff}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className={clsx("px-2.5 py-1 rounded-full text-[11px] font-bold text-white", 
                        issue.status === 'Unassigned' ? 'bg-[#C08A3E]' : issue.status === 'Resolved' ? 'bg-[#3F7A5B]' : 'bg-[#0B3C73]'
                      )}>{issue.status}</span>
                      <span className="text-[11px] font-bold text-[#191919]/45 mt-0.5">{issue.priority} Priority</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Assignment panel (right side) */}
            <div className="lg:col-span-5">
              {selectedIssue ? (
                <div className="glass-card rounded-[32px] p-8 space-y-6 sticky top-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#0B3C73] text-white font-bold text-[11px] rounded-full mb-3">{selectedIssue.id}</span>
                    <h3 className="font-serif text-[26px] font-bold text-[#191919] leading-tight">{selectedIssue.title}</h3>
                    <p className="text-[13px] text-gray-500 font-bold mt-1.5">{selectedIssue.location} · {selectedIssue.room}</p>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-[20px] space-y-1.5 border border-black/[0.04]">
                    <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest">{t('description', currentLang)}</p>
                    <p className="text-[13px] font-bold text-[#191919] leading-relaxed">{selectedIssue.description}</p>
                  </div>

                  {assignedSuccess ? (
                    <div className="p-6 bg-[#E8F5E9] rounded-[24px] text-center space-y-2 border border-[#E8F5E9]/30">
                      <CheckCircle2 className="w-10 h-10 text-[#3F7A5B] mx-auto" />
                      <p className="font-bold text-[#3F7A5B] text-[15px]">Technician Assigned Successfully</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedIssue.status === 'Unassigned' ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[13px] font-bold text-[#191919] px-1">Select Technician</label>
                            <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)}
                              className="w-full px-4 py-3 bg-[#FAF8F5] text-[13px] font-bold text-[#191919] rounded-[18px] focus:outline-none border border-black/5"
                            >
                              <option value="">Choose technician...</option>
                              {technicians.filter(t => t.available).map(t => (
                                <option key={t.name} value={t.name}>{t.name} ({t.dept}) — Workload {t.workload}%</option>
                              ))}
                            </select>
                          </div>
                          <button onClick={handleAssign} disabled={!selectedTech}
                            className={clsx("w-full py-4 rounded-full text-white font-bold text-[14px] shadow-sm transition-transform hover:scale-[1.01] cursor-pointer border-none", selectedTech ? "bg-[#0B3C73]" : "bg-[#0B3C73]/40 cursor-not-allowed")}
                          >
                            Assign Technician
                          </button>
                        </>
                      ) : (
                        <div className="p-4 bg-[#E8F1FC] rounded-[20px] text-center border border-black/5">
                          <p className="text-[13px] font-bold text-[#0B3C73]">Technician {selectedIssue.staff} is already working on this task.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card rounded-[32px] p-8 text-center text-[#191919]/40 font-bold h-[300px] flex items-center justify-center sticky top-6">
                  Select a report from the inbox queue
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ══ AI Prediction Tab ══ */}
        {activeTab === 'ai' && (
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-[32px] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[18px] text-[#191919]">{t('predictiveDiagnostics', currentLang)}</h3>
                  <Cpu className="w-5 h-5 text-[#0B3C73]" />
                </div>
                <p className="text-[14px] font-bold text-[#191919]/50 leading-relaxed">
                  Generate predictions on campus utility and hardware failures based on weekly SLA logs and thermal/usage metrics.
                </p>
                <div className="bg-[#FAF8F5] p-5 rounded-[22px] border border-black/[0.06] min-h-[140px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Activity className={`w-8 h-8 mx-auto text-[#0B3C73] ${isScanningAi ? 'animate-pulse' : ''}`} />
                    <p className="text-[12px] font-bold text-[#191919]/60">SLA Telemetry Node: ACTIVE</p>
                  </div>
                </div>
              </div>
              
              <button onClick={handleRunAiScan} disabled={isScanningAi}
                className="w-full py-4 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-full flex items-center justify-center gap-2 cursor-pointer border-none shadow-md mt-6"
              >
                <Sparkles className={`w-4 h-4 ${isScanningAi ? 'animate-spin' : ''}`} />
                {isScanningAi ? t('telemetryScanning', currentLang) : '✨ ' + t('runTelemetry', currentLang)}
              </button>
            </div>

            <div className="glass-card rounded-[32px] p-8 flex flex-col justify-between">
              <div>
                <h3 className="font-sans font-bold text-[20px] text-[#191919] mb-3">{t('aiPredictionReport', currentLang)}</h3>
                <p className="font-bold text-[14px] text-[#191919]/70 leading-relaxed bg-[#FAF8F5] p-4 rounded-[20px] border border-black/[0.06]">
                  {aiReport || 'Dispatch Electrical Maintenance to prevent breaker trip. Risk score: 94% based on transformer thermal variance.'}
                </p>
              </div>
              <button onClick={() => navigate('/app/admin?tab=issues')}
                className="w-full py-4 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-full transition-transform hover:scale-[1.01] shadow-md mt-6 cursor-pointer border-none"
              >
                {t('createDispatch', currentLang)} →
              </button>
            </div>
          </motion.div>
        )}

        {/* ══ AI Feedback Analytics Tab ══ */}
        {activeTab === 'feedback' && (
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" className="space-y-6">
            <h2 className="font-sans font-bold text-[20px] text-[#191919] px-2">{t('feedbackAnalytics', currentLang)}</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: 'Total Ratings', value: issues.filter(i => i.rating).length, color: 'text-[#0B3C73]' },
                { label: 'Avg Rating', value: issues.filter(i => i.rating).length > 0 ? (issues.filter(i => i.rating).reduce((a, b) => a + (b.rating || 0), 0) / issues.filter(i => i.rating).length).toFixed(1) : 'N/A', color: 'text-[#F59E0B]' },
                { label: '5-Star Reviews', value: issues.filter(i => i.rating === 5).length, color: 'text-[#3F7A5B]' },
                { label: 'Low Ratings (1-2)', value: issues.filter(i => i.rating && i.rating <= 2).length, color: 'text-[#B23A48]' },
              ].map((k, i) => (
                <motion.div key={k.label} variants={stagger(i + 3)} initial="hidden" animate="visible"
                  className="glass-card rounded-[28px] p-6 flex flex-col justify-between h-36 hover:scale-[1.02] hover:shadow-md transition-all duration-350 cursor-pointer">
                  <p className="font-bold text-[13px] text-[#191919]/50">{k.label}</p>
                  <p className={`font-bold text-[40px] leading-none ${k.color}`}>{k.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Feedback List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-[32px] p-8 space-y-4 hover:scale-[1.005] transition-transform duration-350">
                <h3 className="font-bold text-[18px] text-[#191919]">{t('recentRatings', currentLang)}</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {issues.filter(i => i.rating).length > 0 ? (
                    issues.filter(i => i.rating).map((issue, idx) => (
                      <div key={idx} className="bg-[#FAF8F5] rounded-[18px] p-4 border border-black/[0.05] flex justify-between items-start hover:pl-6 transition-all duration-200">
                        <div>
                          <p className="font-bold text-[14px] text-[#191919]">{issue.title}</p>
                          <p className="text-[12px] font-bold text-[#191919]/50 mt-0.5">{issue.reportedBy} · {issue.staff}</p>
                          {issue.ratingFeedback && <p className="text-[12px] text-[#191919]/60 font-bold mt-1 italic">"{issue.ratingFeedback}"</p>}
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {Array.from({ length: issue.rating! }).map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center font-bold text-[#191919]/30">{t('noRatingsYet', currentLang)}</div>
                  )}
                </div>
              </div>

              {/* AI Sentiment Analysis */}
              <div className="glass-card rounded-[32px] p-8 flex flex-col justify-between hover:scale-[1.005] transition-transform duration-350">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[18px] text-[#191919]">{t('aiSentiment', currentLang)}</h3>
                    <Cpu className="w-5 h-5 text-[#0B3C73]" />
                  </div>
                  <p className="font-bold text-[14px] text-[#191919]/60">Powered by OpenAI + NVIDIA NIM</p>

                  <div className="bg-[#FAF8F5] p-5 rounded-[22px] border border-black/[0.06] min-h-[120px]">
                    <p className="font-bold text-[14px] text-[#191919] leading-relaxed">
                      {feedbackAnalysis || 'Click "Run AI Analysis" to get an executive summary of student satisfaction trends.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAnalyzeFeedback}
                  disabled={isAnalyzingFeedback}
                  className="w-full py-4 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-full flex items-center justify-center gap-2 cursor-pointer border-none shadow-md mt-6"
                >
                  <Sparkles className={`w-4 h-4 ${isAnalyzingFeedback ? 'animate-spin' : ''}`} />
                  {isAnalyzingFeedback ? 'Analyzing Feedback...' : '✨ ' + t('runAiFeedback', currentLang)}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ Staff Roster Tab ══ */}
        {activeTab === 'staff' && (
          <motion.div variants={stagger(2)} initial="hidden" animate="visible" className="space-y-4">
            <h3 className="font-sans font-bold text-[20px] text-[#191919] px-2">{t('activeStaffRoster', currentLang)}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {technicians.map((staff, i) => (
                <div key={i} className="glass-card rounded-[32px] p-6 flex flex-col justify-between h-56 hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-[#0B3C73] text-white flex items-center justify-center font-bold text-[16px]">
                      {staff.name.slice(0, 2)}
                    </div>
                    <span className={clsx("px-3 py-1 rounded-full font-bold text-[11px] font-mono", staff.available ? "bg-[#E8F5E9] text-[#3F7A5B]" : "bg-[#FDE7EF] text-[#B23A48]")}>
                      {staff.available ? t('onDuty', currentLang) : t('busy', currentLang)}
                    </span>
                  </div>
                  <div>
                    <p className="font-serif font-bold text-[18px] text-[#191919]">{staff.name}</p>
                    <p className="text-[12px] font-bold text-[#191919]/40 mt-0.5">{staff.dept}</p>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-black/5">
                    <span className="text-[12px] font-bold text-[#191919]/50">{t('workload', currentLang)}: {staff.workload}%</span>
                    <span className="text-[12px] font-bold text-[#191919]/50">{staff.tasks} {t('activeTasks', currentLang).toLowerCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
