import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Sparkles, Upload, Droplet, Zap, Wifi, Wrench, MessageSquare, Play, Pause } from 'lucide-react';
import clsx from 'clsx';
import { getIssues, advanceIssueStatus, submitResolutionWithNote, getCurrentUser } from '../utils/db';
import type { Issue } from '../utils/db';
import { generateTechResolutionAI } from '../utils/ai';
import { t, getCurrentLanguage, type Language } from '../utils/i18n';

const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }
});

const getTaskIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('plumb')) return Droplet;
  if (cat.includes('elect')) return Zap;
  if (cat.includes('wifi') || cat.includes('netw')) return Wifi;
  return Wrench;
};

const StaffDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterPriority = searchParams.get('filter') || 'All';
  const setFilterPriority = (filter: string) => {
    setSearchParams({ filter });
  };

  const currentUser = getCurrentUser();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedTask, setSelectedTask] = useState<Issue | null>(null);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  const [techNote, setTechNote] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  const handleAiDraftResolution = async () => {
    if (!selectedTask) return;
    setIsGeneratingAi(true);
    const aiNote = await generateTechResolutionAI(selectedTask.title, selectedTask.description);
    setTechNote(aiNote);
    setIsGeneratingAi(false);
  };

  const loadTasks = () => {
    const all = getIssues();
    const activeTechTasks = all.filter(i => i.staff === currentUser.name);
    setIssues(activeTechTasks);
    
    const newTimers: Record<string, number> = {};
    activeTechTasks.forEach(t => {
      newTimers[t.id] = timers[t.id] ?? (t.priority === 'Critical' ? 3600 : 7200);
    });
    setTimers(newTimers);

    if (selectedTask) {
      const updated = activeTechTasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    } else if (activeTechTasks.length > 0) {
      setSelectedTask(activeTechTasks[0]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser.name]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const iv = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        for (const id in next) { if (next[id] > 0) next[id] -= 1; }
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isTimerRunning]);

  const advanceStage = (taskId: string, currentStatus: Issue['status']) => {
    let nextStatus: Issue['status'] = 'Assigned';
    if (currentStatus === 'Assigned') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Uploaded';
    
    advanceIssueStatus(taskId, nextStatus);
    loadTasks();
  };

  const handleSubmitResolution = () => {
    if (!selectedTask) return;
    submitResolutionWithNote(selectedTask.id, techNote || 'Work completed successfully.');
    setTechNote('');
    loadTasks();
  };

  const filtered = issues.filter(t => 
    filterPriority === 'All' || 
    t.priority === filterPriority || 
    (filterPriority === 'In Progress' && (t.status === 'In Progress' || t.status === 'Assigned')) ||
    (filterPriority === 'Completed' && (t.status === 'Resolved' || t.status === 'Verified'))
  );

  const secs = selectedTask ? timers[selectedTask.id] ?? 0 : 0;
  const getSlaBg = (s: number) => s < 1800 ? 'bg-[#FDE7EF] text-[#B23A48]' : s < 7200 ? 'bg-[#FFF4E6] text-[#C08A3E]' : 'bg-[#E8F1FC] text-[#0B3C73]';

  const resolvedCount = issues.filter(t => t.status === 'Resolved' || t.status === 'Verified').length;
  const totalCount = issues.length || 1;
  const completedPercentage = Math.round((resolvedCount / totalCount) * 100);

  return (
    <div className="p-4 sm:p-8 bg-transparent min-h-screen relative z-10">
      <div className="max-w-[1240px] mx-auto space-y-6">
        
        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <motion.div variants={stagger(0)} initial="hidden" animate="visible" className="p-1">
            <h1 className="font-serif text-[36px] md:text-[42px] font-bold text-[#191919] leading-tight">
              {t('goodMorning', currentLang)}, {currentUser.name.split(' ')[0]} 👋
            </h1>
            <p className="text-[15px] text-[#191919]/50 font-sans font-bold mt-1">
              You have {issues.filter(t => t.status !== 'Resolved' && t.status !== 'Verified').length} {t('activeTasksToday', currentLang)}.
            </p>
          </motion.div>
        </div>

        {/* Row 2: Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={stagger(2)} initial="hidden" animate="visible"
            className="glass-card rounded-[32px] p-6 shadow-sm flex flex-col justify-between h-44 text-[#191919] hover:scale-[1.02] hover:shadow-md transition-all duration-350 cursor-pointer">
            <p className="font-sans font-bold text-[14px] text-[#191919]/50 leading-tight">{t('myActiveTasks', currentLang)}</p>
            <p className="font-sans text-[48px] font-bold leading-none text-[#0B3C73]">
              {issues.filter(t => t.status !== 'Resolved' && t.status !== 'Verified').length}
            </p>
          </motion.div>

          <motion.div variants={stagger(3)} initial="hidden" animate="visible"
            className="glass-card rounded-[32px] p-6 shadow-sm flex flex-col justify-between h-44 text-[#191919] hover:scale-[1.02] hover:shadow-md transition-all duration-350 cursor-pointer">
            <p className="font-sans font-bold text-[14px] text-[#191919]/50 leading-tight">{t('criticalAlerts', currentLang)}</p>
            <p className="font-sans text-[48px] font-bold leading-none text-[#B23A48]">
              {issues.filter(t => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Verified').length}
            </p>
          </motion.div>

          {/* Project Progress Gauge */}
          <motion.div variants={stagger(4)} initial="hidden" animate="visible"
            className="glass-card rounded-[32px] p-6 shadow-sm flex items-center justify-between h-44 hover:scale-[1.02] hover:shadow-md transition-all duration-350 cursor-pointer">
            <div className="space-y-1">
              <p className="font-sans font-bold text-[15px] text-[#191919]">{t('resolutionProgress', currentLang)}</p>
              <p className="text-[12px] font-bold text-[#191919]/40">{resolvedCount} {t('resolvedTasks', currentLang)}</p>
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg width="80" height="80" viewBox="0 0 80 80" className="transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="rgba(11, 60, 115, 0.08)" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  stroke="#0B3C73" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 32}
                  initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - completedPercentage / 100) }}
                  transition={{ duration: 1 }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[16px] font-bold text-[#191919]">{completedPercentage}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <motion.div variants={stagger(6)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-2 mb-1">
              <h2 className="font-sans font-bold text-[20px] text-[#191919]">{t('myQueue', currentLang)}</h2>
              <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-white">
                {['All', 'Critical', 'In Progress'].map(f => (
                  <button key={f} onClick={() => setFilterPriority(f)} className={clsx('px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-all border-none', filterPriority === f ? 'bg-[#0B3C73] text-white shadow-sm' : 'text-[#191919]/60 hover:bg-black/5')}>
                    {f === 'In Progress' ? t('myTasks', currentLang) : f === 'Critical' ? t('criticalAlerts', currentLang) : t('overview', currentLang)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.length > 0 ? (
                  filtered.map((task) => {
                    const s = timers[task.id] ?? 0;
                    const active = selectedTask?.id === task.id;
                    const Icon = getTaskIcon(task.category);
                    
                    return (
                      <motion.div key={task.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setSelectedTask(task)}
                        className={clsx('glass-card rounded-[28px] p-5 cursor-pointer flex flex-col gap-3 shadow-sm transition-all duration-300', active ? 'ring-2 ring-[#0B3C73] scale-[1.01]' : 'hover:scale-[1.005] hover:pl-7')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold", task.priority === 'Critical' ? 'bg-[#FDE7EF]' : 'bg-[#E7F1FD]')}>
                              <Icon className={clsx("w-6 h-6", task.priority === 'Critical' ? 'text-[#B23A48]' : 'text-[#0B3C73]')} />
                            </div>
                            <div>
                              <h3 className="font-sans font-bold text-[16px] text-[#191919]">{task.title}</h3>
                              <p className="text-[13px] text-[#191919]/50 font-bold mt-0.5">{task.location} · {task.room}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end justify-center gap-1.5">
                            <span className={clsx('font-mono font-bold text-[12px] px-3 py-1 rounded-full', getSlaBg(s))}>{fmtTime(s)}</span>
                            <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold text-white", 
                              task.status === 'Assigned' ? 'bg-[#C08A3E]' : task.status === 'In Progress' ? 'bg-[#0B3C73]' : 'bg-[#3F7A5B]'
                            )}>{task.status}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-[#191919]/40 font-bold text-[14px] glass-card rounded-[28px]">
                    No active tasks assigned to you.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={stagger(7)} initial="hidden" animate="visible" className="lg:col-span-7">
            {selectedTask ? (
              <div className="glass-card rounded-[32px] p-8 space-y-6 sticky top-6">
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#0B3C73] text-white font-bold text-[11px] rounded-full tracking-wide mb-3">{selectedTask.id}</span>
                    <h2 className="font-serif text-[30px] font-bold text-[#191919] leading-tight">{selectedTask.title}</h2>
                    <p className="text-[14px] font-bold text-[#191919]/50 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {selectedTask.location} · {selectedTask.room}
                    </p>
                  </div>
                </div>

                {/* Animated Watch Task Timer */}
                {selectedTask.status === 'In Progress' && (
                  <div className="bg-gradient-to-r from-[#0B3C73] via-[#0A4595] to-[#0B3C73] rounded-[24px] p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-white/20 relative overflow-hidden">
                    <div className="flex items-center gap-4 z-10">
                      {/* Animated Watch Face Ring */}
                      <div className="relative w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/30 shrink-0">
                        <div className="absolute inset-1 rounded-full border border-dashed border-white/40 animate-[spin_10s_linear_infinite]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00D8F6] animate-ping" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00D8F6]" /> {t('activeSla', currentLang)}
                        </p>
                        <h4 className="font-mono text-[34px] font-bold tracking-wider mt-0.5 drop-shadow-[0_0_12px_rgba(0,216,246,0.5)]">{fmtTime(secs)}</h4>
                      </div>
                    </div>
                    <div className="flex gap-2 z-10">
                      <button onClick={() => setIsTimerRunning(!isTimerRunning)} 
                        className="p-3 bg-white/20 hover:bg-white text-white hover:text-[#0B3C73] rounded-full font-bold text-[13px] transition-all cursor-pointer flex items-center justify-center gap-1.5 px-5 shadow-sm border border-white/30"
                      >
                        {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isTimerRunning ? t('pause', currentLang) : t('resume', currentLang)}
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white/60 rounded-[20px] p-5 space-y-2 border border-white">
                  <p className="font-bold text-[12px] text-[#0B3C73] flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> {t('description', currentLang).toUpperCase()}</p>
                  <p className="font-bold text-[#191919] text-[15px] leading-relaxed">{selectedTask.description}</p>
                </div>

                {/* Resolution note history */}
                {selectedTask.techNote && (
                  <div className="bg-[#E8F5E9] rounded-[20px] p-5 space-y-1.5">
                    <p className="font-bold text-[12px] text-[#3F7A5B] flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {t('resolutionNote', currentLang).toUpperCase()}</p>
                    <p className="font-bold text-[#191919] text-[14px]">{selectedTask.techNote}</p>
                  </div>
                )}

                <div className="pt-2">
                  {selectedTask.status === 'Assigned' && (
                    <button onClick={() => advanceStage(selectedTask.id, 'Assigned')} className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full hover:bg-black transition-transform hover:scale-[1.01] shadow-md cursor-pointer border-none">
                      {t('startTask', currentLang)} →
                    </button>
                  )}
                  {selectedTask.status === 'In Progress' && (
                    <button onClick={() => advanceStage(selectedTask.id, 'In Progress')} className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full flex items-center justify-center gap-2 hover:bg-black transition-transform hover:scale-[1.01] cursor-pointer border-none shadow-md">
                      <Upload className="w-5 h-5" /> {t('uploadResolution', currentLang)}
                    </button>
                  )}
                  {selectedTask.status === 'Uploaded' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-2">
                          <label className="text-[13px] font-bold text-[#191919]">{t('resolutionNote', currentLang)}</label>
                          <button
                            type="button"
                            onClick={handleAiDraftResolution}
                            disabled={isGeneratingAi}
                            className="text-[11px] font-bold text-[#0B3C73] bg-[#E8F1FC] hover:bg-[#0B3C73] hover:text-white px-3 py-1 rounded-full border border-[#0B3C73]/20 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                            <span>{isGeneratingAi ? t('drafting', currentLang) : '✨ ' + t('aiAutoDraft', currentLang)}</span>
                          </button>
                        </div>
                        <textarea value={techNote} onChange={e => setTechNote(e.target.value)} rows={3} placeholder="Provide details about the resolution..."
                          className="w-full px-4 py-3 bg-white rounded-[20px] text-[13px] font-bold focus:outline-none resize-none border border-black/5"
                        />
                      </div>

                      <button onClick={handleSubmitResolution} className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full hover:bg-black transition-transform hover:scale-[1.01] shadow-md cursor-pointer border-none">
                        {t('submitResolution', currentLang)} →
                      </button>
                    </div>
                  )}
                  {(selectedTask.status === 'Resolved' || selectedTask.status === 'Verified') && !selectedTask.techNote && (
                    <div className="bg-[#E8F5E9] rounded-[24px] p-6 text-center">
                      <CheckCircle2 className="w-10 h-10 text-[#3F7A5B] mx-auto mb-2" />
                      <p className="font-bold text-[18px] text-[#3F7A5B]">{t('verifiedClosed', currentLang)}</p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="glass-card rounded-[32px] p-8 text-center text-[#191919]/40 font-bold h-[300px] flex items-center justify-center sticky top-6">
                Select a task from the priority queue
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
