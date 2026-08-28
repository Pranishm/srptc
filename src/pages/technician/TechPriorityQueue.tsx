import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import TaskCard from '../../components/technician/TaskCard';
import TaskWorkPanel from '../../components/technician/TaskWorkPanel';
import { useTechnicianTasks, useTaskSelection } from '../../hooks/useTechnicianTasks';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

/** Anything under 30 minutes is about to breach — the queue calls it out. */
const BREACH_SECONDS = 1800;

/**
 * Priority Queue — the SLA-critical slice of the technician's open work.
 * Same two-column anatomy as My Tasks, but the queue only carries Critical /
 * High faults and is sorted so the tightest deadline sits on top.
 */
const TechPriorityQueue = () => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const {
    currentUser,
    openTasks,
    timers,
    isTimerRunning,
    setIsTimerRunning,
    advanceStage,
    submitResolution,
  } = useTechnicianTasks();

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const queue = useMemo(() => {
    const urgent = openTasks.filter(task => task.priority === 'Critical' || task.priority === 'High');
    return [...urgent].sort((a, b) => {
      if (a.priority !== b.priority) return a.priority === 'Critical' ? -1 : 1;
      return (timers[a.id] ?? 0) - (timers[b.id] ?? 0);
    });
  }, [openTasks, timers]);

  const { selected, selectedId, setSelectedId } = useTaskSelection(queue);

  const breachingCount = queue.filter(task => (timers[task.id] ?? 0) < BREACH_SECONDS).length;
  const seconds = selected ? timers[selected.id] ?? 0 : 0;

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;

  return (
    <PortalShell title={title} subtitle="Critical faults with the tightest SLA." pages={TECH_PAGES}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

        <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-3">

          {queue.length > 0 ? (
            <div className="bg-[#FDE7EF] rounded-[24px] p-5 border border-[#B23A48]/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-6 h-6 text-[#B23A48]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-[20px] font-bold text-[#B23A48] leading-tight">
                  {queue.length} SLA-critical task{queue.length > 1 ? 's' : ''}
                </h2>
                <p className="text-[13px] font-bold text-[#191919]/45 mt-0.5">
                  {breachingCount > 0
                    ? `${breachingCount} under 30 minutes remaining.`
                    : 'None under 30 minutes — keep the lead.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#E8F5E9] rounded-[24px] p-5 border border-[#3F7A5B]/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-[#3F7A5B]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-[20px] font-bold text-[#3F7A5B] leading-tight">
                  All clear — no critical faults in your queue.
                </h2>
                <p className="text-[13px] font-bold text-[#191919]/45 mt-0.5">
                  {t('priorityQueue', lang)} · {openTasks.length} {t('activeTasks', lang).toLowerCase()}
                </p>
              </div>
            </div>
          )}

          {queue.length > 0 && (
            <div className="space-y-3">
              <AnimatePresence>
                {queue.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    seconds={timers[task.id] ?? 0}
                    active={selectedId === task.id}
                    onSelect={next => setSelectedId(next.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="lg:col-span-7">
          <TaskWorkPanel
            task={selected}
            seconds={seconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={setIsTimerRunning}
            onAdvance={advanceStage}
            onSubmitResolution={submitResolution}
            emptyLabel="No SLA-critical faults right now."
          />
        </motion.div>

      </div>
    </PortalShell>
  );
};

export default TechPriorityQueue;
