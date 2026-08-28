import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { PortalPage } from '../config/navigation';
import { t, getCurrentLanguage, type Language } from '../utils/i18n';

interface PortalShellProps {
  title: string;
  subtitle: string;
  pages: PortalPage[];
  children: ReactNode;
  /** Optional slot rendered under the header (e.g. a legacy-link notice). */
  banner?: ReactNode;
}

export const shellStagger = (i: number) => ({
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.04 } },
});

/**
 * Shared chrome for every admin / technician page: the serif page title and the
 * pill navigator. Splitting the old single-page consoles into routes keeps this
 * identical from page to page — only the body below it changes.
 */
export const PortalShell = ({ title, subtitle, pages, children, banner }: PortalShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  return (
    <div className="p-4 md:p-8 bg-transparent min-h-screen relative z-10">
      <div className="max-w-[1240px] mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          <motion.div variants={shellStagger(0)} initial="hidden" animate="visible">
            <h1 className="font-serif text-[36px] md:text-[42px] font-bold text-[#191919] leading-tight">{title}</h1>
            <p className="text-[15px] font-sans font-bold text-[#191919]/40 mt-1">{subtitle}</p>
          </motion.div>

          <motion.nav
            variants={shellStagger(1)} initial="hidden" animate="visible"
            className="flex items-center gap-1.5 overflow-x-auto bg-white/80 p-1.5 rounded-full shadow-sm border border-white"
          >
            {pages.map(page => {
              const Icon = page.icon;
              const active = location.pathname === page.path;
              return (
                <button
                  key={page.id}
                  onClick={() => navigate(page.path)}
                  aria-current={active ? 'page' : undefined}
                  className={clsx(
                    'px-4 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border-none',
                    active ? 'bg-[#0B3C73] text-white shadow-sm' : 'text-[#191919]/60 hover:bg-black/5'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {t(page.labelKey, lang) === page.labelKey ? page.label : t(page.labelKey, lang)}
                </button>
              );
            })}
          </motion.nav>
        </div>

        {banner}
        {children}

      </div>
    </div>
  );
};

export default PortalShell;
