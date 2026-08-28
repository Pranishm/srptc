import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Wrench } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import { getTechnicians, getCurrentUser } from '../../utils/db';
import type { Technician } from '../../utils/db';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const TechTeam = () => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const currentUser = getCurrentUser();
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    setTechnicians(getTechnicians());
  }, []);

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;

  return (
    <PortalShell title={title} subtitle={`${technicians.length} team members`} pages={TECH_PAGES}>

      {/* Team Header */}
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible"
        className="bg-[#E8F1FC] rounded-[28px] p-6 flex items-center gap-5 border border-[#0B3C73]/10">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Users className="w-7 h-7 text-[#0B3C73]" />
        </div>
        <div>
          <h2 className="font-serif text-[24px] font-bold text-[#191919] leading-tight">Maintenance Crew</h2>
          <p className="text-[13px] font-bold text-[#191919]/50 mt-0.5">
            {technicians.filter(t => t.available).length} available · {technicians.reduce((a, t) => a + t.tasks, 0)} total active tasks
          </p>
        </div>
      </motion.div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {technicians.map((tech, i) => (
          <motion.div
            key={tech.name}
            variants={shellStagger(i + 3)}
            initial="hidden"
            animate="visible"
            className={clsx(
              'glass-card rounded-[28px] p-6 flex flex-col justify-between h-56 relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-lg',
              tech.name === currentUser.name && 'ring-2 ring-[#0B3C73]/30'
            )}
          >
            {/* Background accent */}
            <div className={clsx('absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8 opacity-20', tech.bg || 'bg-[#0B3C73]')} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-[16px] shadow-sm',
                  tech.bg || 'bg-[#0B3C73]'
                )}>
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-[#191919] flex items-center gap-1.5">
                    {tech.name}
                    {tech.name === currentUser.name && (
                      <span className="text-[10px] bg-[#0B3C73] text-white px-2 py-0.5 rounded-full">YOU</span>
                    )}
                  </h3>
                  <p className="text-[12px] font-bold text-[#191919]/40">{tech.dept}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={clsx(
                  'w-2 h-2 rounded-full',
                  tech.available ? 'bg-[#3F7A5B] animate-pulse' : 'bg-[#B23A48]'
                )} />
                <span className="text-[12px] font-bold text-[#191919]/50">
                  {tech.available ? 'Available' : 'Busy'}
                </span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[12px] font-bold text-[#191919]/50">
                  <Wrench className="w-3.5 h-3.5" /> {tech.tasks} tasks
                </span>
              </div>
              <div className="h-2 w-24 bg-[#191919]/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tech.workload}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={clsx(
                    'h-full rounded-full',
                    tech.workload > 80 ? 'bg-[#B23A48]' : tech.workload > 50 ? 'bg-[#C08A3E]' : 'bg-[#3F7A5B]'
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {technicians.length === 0 && (
        <div className="glass-card rounded-[28px] p-12 text-center mt-4">
          <Users className="w-12 h-12 text-[#191919]/10 mx-auto mb-3" />
          <p className="font-bold text-[16px] text-[#191919]/40">No team data available</p>
        </div>
      )}
    </PortalShell>
  );
};

export default TechTeam;
