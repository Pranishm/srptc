import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, AlertTriangle, CheckCircle2, ArrowRight, Activity, Zap, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import { useTechnicianTasks, formatSla, slaTone } from '../../hooks/useTechnicianTasks';
import { useNavigate } from 'react-router-dom';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const TechCommandCenter = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const {
    currentUser, openTasks, doneTasks, criticalTasks, timers,
  } = useTechnicianTasks();

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const assignedTasks = openTasks.filter(t => t.status === 'Assigned');
  const inProgressTasks = openTasks.filter(t => t.status === 'In Progress');
  const uploadedTasks = openTasks.filter(t => t.status === 'Uploaded');
  const urgentTasks = openTasks.filter(t => (timers[t.id] ?? Infinity) < 1800);

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;

  return (
    <PortalShell title={title} subtitle={`${openTasks.length} open tasks · ${criticalTasks.length} critical`} pages={TECH_PAGES}>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {[
          { label: 'Assigned to You', value: assignedTasks.length, icon: Wrench, bg: 'bg-[#FFF4E6]', accent: 'text-[#C08A3E]', click: '/app/technician/tasks' },
          { label: 'In Progress', value: inProgressTasks.length, icon: Activity, bg: 'bg-[#E8F1FC]', accent: 'text-[#0B3C73]', click: '/app/technician/tasks' },
          { label: 'Critical SLA', value: criticalTasks.length, icon: AlertTriangle, bg: 'bg-[#FDE7EF]', accent: 'text-[#B23A48]', click: '/app/technician/priority' },
          { label: 'Resolved', value: doneTasks.length, icon: CheckCircle2, bg: 'bg-[#E8F5E9]', accent: 'text-[#3F7A5B]', click: '/app/technician/completed' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={shellStagger(i + 2)}
            initial="hidden"
            animate="visible"
            onClick={() => navigate(stat.click)}
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
              <p className="font-sans text-[48px] font-bold text-[#191919] leading-none tabular-nums">{stat.value}</p>
              <ArrowRight className="w-5 h-5 text-[#191919]/30" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">

        {/* Upcoming tasks */}
        <motion.div variants={shellStagger(6)} initial="hidden" animate="visible" className="lg:col-span-7">
          <div className="glass-card rounded-[28px] p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-sans font-bold text-[18px] text-[#191919] flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C08A3E]" /> Next Up
              </h2>
              <button onClick={() => navigate('/app/technician/tasks')}
                className="text-[12px] font-bold text-[#0B3C73] bg-[#E8F1FC] px-3 py-1.5 rounded-full cursor-pointer border-none hover:bg-[#0B3C73] hover:text-white transition-all">
                View All →
              </button>
            </div>
            {openTasks.slice(0, 5).map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate('/app/technician/tasks')}
                className="bg-white/70 rounded-[20px] p-4 flex items-center justify-between border border-white hover:bg-white hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                    task.priority === 'Critical' ? 'bg-[#FDE7EF]' : 'bg-[#E8F1FC]'
                  )}>
                    <Wrench className={clsx('w-5 h-5', task.priority === 'Critical' ? 'text-[#B23A48]' : 'text-[#0B3C73]')} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[14px] text-[#191919] truncate">{task.title}</p>
                    <p className="text-[12px] font-bold text-[#191919]/40 truncate">{task.location} · {task.room}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={clsx('font-mono text-[11px] font-bold px-2.5 py-1 rounded-full', slaTone(timers[task.id] ?? 0))}>
                    {formatSla(timers[task.id] ?? 0)}
                  </span>
                  <span className={clsx(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                    task.status === 'Assigned' ? 'bg-[#C08A3E]' : task.status === 'In Progress' ? 'bg-[#0B3C73]' : 'bg-[#6B4FBB]'
                  )}>
                    {task.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {openTasks.length === 0 && (
              <div className="text-center py-12 text-[#191919]/40 font-bold text-[14px]">
                All clear! No tasks in your queue.
              </div>
            )}
          </div>
        </motion.div>

        {/* Right side: Quick action + SLA warnings */}
        <motion.div variants={shellStagger(7)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-4">

          {/* SLA Warning */}
          {urgentTasks.length > 0 && (
            <div className="bg-gradient-to-br from-[#B23A48] to-[#8B1A2B] rounded-[28px] p-6 text-white space-y-3 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <p className="font-bold text-[14px] uppercase tracking-wide">SLA Breach Warning</p>
                </div>
                <p className="text-[44px] font-bold leading-none tabular-nums">{urgentTasks.length}</p>
                <p className="text-[13px] text-white/70 font-bold mt-1">
                  task{urgentTasks.length > 1 ? 's' : ''} under 30 minutes remaining
                </p>
                <button
                  onClick={() => navigate('/app/technician/priority')}
                  className="mt-4 w-full py-3 bg-white text-[#B23A48] font-bold text-[14px] rounded-full cursor-pointer border-none hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  Open Priority Queue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="glass-card rounded-[28px] p-6 space-y-4">
            <h3 className="font-sans font-bold text-[16px] text-[#191919] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0B3C73]" /> Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Awaiting Evidence', value: uploadedTasks.length, tone: 'text-[#6B4FBB]' },
                { label: 'Avg SLA Remaining', value: openTasks.length > 0 ? formatSla(Math.floor(Object.values(timers).reduce((a, b) => a + b, 0) / Math.max(openTasks.length, 1))) : '--:--:--', tone: 'text-[#0B3C73]' },
                { label: 'Resolved This Session', value: doneTasks.length, tone: 'text-[#3F7A5B]' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between bg-white/60 rounded-[18px] p-3.5 border border-white">
                  <span className="font-bold text-[13px] text-[#191919]/60">{row.label}</span>
                  <span className={clsx('font-mono font-bold text-[15px]', row.tone)}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PortalShell>
  );
};

export default TechCommandCenter;
