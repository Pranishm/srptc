import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock, TrendingUp, Award, Target } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import { useTechnicianTasks } from '../../hooks/useTechnicianTasks';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const TechPerformance = () => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const { currentUser, openTasks, doneTasks } = useTechnicianTasks();

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const totalTasks = openTasks.length + doneTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;
  const avgRating = doneTasks.filter(t => t.rating).length > 0
    ? (doneTasks.filter(t => t.rating).reduce((sum, t) => sum + (t.rating ?? 0), 0) / doneTasks.filter(t => t.rating).length).toFixed(1)
    : '—';

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;

  const METRICS = [
    { label: 'Total Assigned', value: totalTasks, icon: Target, bg: 'bg-[#E8F1FC]', accent: 'text-[#0B3C73]' },
    { label: 'Resolved', value: doneTasks.length, icon: CheckCircle2, bg: 'bg-[#E8F5E9]', accent: 'text-[#3F7A5B]' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, bg: 'bg-[#FFF4E6]', accent: 'text-[#C08A3E]' },
    { label: 'Avg Rating', value: avgRating, icon: Award, bg: 'bg-[#F3E8FF]', accent: 'text-[#6B4FBB]' },
  ];

  return (
    <PortalShell title={title} subtitle="Your performance metrics and analytics" pages={TECH_PAGES}>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            variants={shellStagger(i + 2)}
            initial="hidden"
            animate="visible"
            className={clsx('rounded-[28px] p-6 flex flex-col justify-between h-44', m.bg)}
          >
            <div className="flex items-center justify-between">
              <p className="font-sans font-bold text-[14px] text-[#191919]">{m.label}</p>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <m.icon className={clsx('w-5 h-5', m.accent)} />
              </div>
            </div>
            <p className="font-sans text-[48px] font-bold text-[#191919] leading-none tabular-nums">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Completion Gauge */}
        <motion.div variants={shellStagger(6)} initial="hidden" animate="visible"
          className="glass-card rounded-[28px] p-8 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-[12px] font-bold text-[#191919]/40 uppercase tracking-widest mb-6">Completion Rate</p>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 36 36" className="w-40 h-40 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3F7A5B"
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${completionRate}, 100` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="font-bold text-[36px] text-[#191919] tabular-nums"
              >
                {completionRate}%
              </motion.span>
              <span className="text-[12px] font-bold text-[#191919]/40">resolved</span>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3F7A5B]" />
              <span className="text-[12px] font-bold text-[#191919]/60">Resolved ({doneTasks.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
              <span className="text-[12px] font-bold text-[#191919]/60">Open ({openTasks.length})</span>
            </div>
          </div>
        </motion.div>

        {/* Task Breakdown */}
        <motion.div variants={shellStagger(7)} initial="hidden" animate="visible"
          className="glass-card rounded-[28px] p-8 space-y-5">
          <h3 className="font-sans font-bold text-[18px] text-[#191919] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0B3C73]" /> Task Breakdown
          </h3>
          {[
            { label: 'Critical Priority', count: openTasks.filter(t => t.priority === 'Critical').length + doneTasks.filter(t => t.priority === 'Critical').length, color: 'bg-[#B23A48]' },
            { label: 'High Priority', count: openTasks.filter(t => t.priority === 'High').length + doneTasks.filter(t => t.priority === 'High').length, color: 'bg-[#C08A3E]' },
            { label: 'Medium Priority', count: openTasks.filter(t => t.priority === 'Medium').length + doneTasks.filter(t => t.priority === 'Medium').length, color: 'bg-[#0B3C73]' },
            { label: 'Low Priority', count: openTasks.filter(t => t.priority === 'Low').length + doneTasks.filter(t => t.priority === 'Low').length, color: 'bg-[#3F7A5B]' },
          ].map((row, i) => {
            const pct = totalTasks > 0 ? (row.count / totalTasks) * 100 : 0;
            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px] font-bold text-[#191919]">
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.count}</span>
                </div>
                <div className="h-3 bg-[#191919]/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    className={clsx('h-full rounded-full', row.color)}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Completions */}
      <motion.div variants={shellStagger(8)} initial="hidden" animate="visible" className="mt-6">
        <div className="glass-card rounded-[28px] p-6 space-y-4">
          <h3 className="font-sans font-bold text-[18px] text-[#191919] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0B3C73]" /> Recent Completions
          </h3>
          {doneTasks.slice(0, 5).map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/70 rounded-[20px] p-4 flex items-center justify-between border border-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#3F7A5B]" />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-[#191919]">{task.title}</p>
                  <p className="text-[12px] font-bold text-[#191919]/40">{task.location} · {task.room}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {task.rating && (
                  <span className="flex items-center gap-1 text-[12px] font-bold text-[#C08A3E] bg-[#FFF4E6] px-2.5 py-1 rounded-full">
                    <Award className="w-3.5 h-3.5" /> {task.rating}/5
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          {doneTasks.length === 0 && (
            <div className="text-center py-8 text-[#191919]/40 font-bold text-[14px]">
              No completed tasks yet.
            </div>
          )}
        </div>
      </motion.div>
    </PortalShell>
  );
};

export default TechPerformance;
