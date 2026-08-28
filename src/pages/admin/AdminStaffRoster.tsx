import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import { getIssues, getTechnicians } from '../../utils/db';
import type { Technician } from '../../utils/db';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const AdminStaffRoster = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [openCounts, setOpenCounts] = useState<Record<string, number>>({});
  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  useEffect(() => {
    setTechnicians(getTechnicians());

    // Live open-ticket load per technician (anything not yet Resolved / Verified).
    const counts: Record<string, number> = {};
    getIssues().forEach(issue => {
      if (issue.status === 'Resolved' || issue.status === 'Verified') return;
      counts[issue.staff] = (counts[issue.staff] || 0) + 1;
    });
    setOpenCounts(counts);
  }, []);

  return (
    <PortalShell
      title="Admin Console"
      subtitle="Availability and workload across the maintenance crew."
      pages={ADMIN_PAGES}
    >
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="font-sans font-bold text-[20px] text-[#191919] px-2">{t('activeStaffRoster', currentLang)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {technicians.map((staff, i) => (
            <div key={i} className="glass-card rounded-[32px] p-6 flex flex-col justify-between h-64 hover:scale-[1.01] transition-transform duration-300">
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
              <div className="space-y-3">
                <div className="h-2 rounded-full bg-[#191919]/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${staff.workload}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-2 rounded-full bg-[#0B3C73]"
                  />
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-black/5">
                  <span className="text-[12px] font-bold text-[#191919]/50">{t('workload', currentLang)}: {staff.workload}%</span>
                  <span className="text-[12px] font-bold text-[#191919]/50">{openCounts[staff.name] || 0} {t('activeTasks', currentLang).toLowerCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </PortalShell>
  );
};

export default AdminStaffRoster;
