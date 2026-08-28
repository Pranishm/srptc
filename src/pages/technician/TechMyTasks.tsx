import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import { useTechnicianTasks, useTaskSelection } from '../../hooks/useTechnicianTasks';
import TaskCard from '../../components/technician/TaskCard';
import TaskWorkPanel from '../../components/technician/TaskWorkPanel';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const QUEUE_FILTERS = ['All', 'Assigned', 'In Progress', 'Uploaded'] as const;
type QueueFilter = (typeof QUEUE_FILTERS)[number];

/**
 * The technician's main work surface. Formerly the `?filter=In Progress` slice
 * of the single-page staff console — now its own route, with the queue on the
 * left and the shared work panel on the right.
 */
const TechMyTasks = () => {
  const {
    currentUser,
    openTasks,
    timers,
    isTimerRunning,
    setIsTimerRunning,
    advanceStage,
    submitResolution,
  } = useTechnicianTasks();

  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const [filter, setFilter] = useState<QueueFilter>('All');

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const filteredList = useMemo(
    () => (filter === 'All' ? openTasks : openTasks.filter(task => task.status === filter)),
    [openTasks, filter]
  );

  const { selected, selectedId, setSelectedId } = useTaskSelection(filteredList);

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;
  const subtitle = `${openTasks.length} open · work through the assigned queue.`;

  return (
    <PortalShell title={title} subtitle={subtitle} pages={TECH_PAGES}>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

        <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <h2 className="font-sans font-bold text-[20px] text-[#191919]">{t('myQueue', lang)}</h2>
            <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-white">
              {QUEUE_FILTERS.map(option => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={clsx(
                    'px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-all border-none',
                    filter === option ? 'bg-[#0B3C73] text-white shadow-sm' : 'text-[#191919]/60 hover:bg-black/5'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredList.length > 0 ? (
                filteredList.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    seconds={timers[task.id] ?? 0}
                    active={selectedId === task.id}
                    onSelect={picked => setSelectedId(picked.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-[#191919]/40 font-bold text-[14px] glass-card rounded-[28px]">
                  No active tasks assigned to you.
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="lg:col-span-7">
          <TaskWorkPanel
            task={selected}
            seconds={selected ? (timers[selected.id] ?? 0) : 0}
            isTimerRunning={isTimerRunning}
            onToggleTimer={setIsTimerRunning}
            onAdvance={advanceStage}
            onSubmitResolution={submitResolution}
          />
        </motion.div>

      </div>

    </PortalShell>
  );
};

export default TechMyTasks;
