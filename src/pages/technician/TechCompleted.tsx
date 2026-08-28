import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageSquare, MapPin, Clock, Star } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { TECH_PAGES } from '../../config/navigation';
import { useTechnicianTasks } from '../../hooks/useTechnicianTasks';
import EvidenceGallery from '../../components/EvidenceGallery';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

const TechCompleted = () => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const { currentUser, doneTasks } = useTechnicianTasks();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  const title = `${t('goodMorning', lang)}, ${currentUser.name.split(' ')[0]} 👋`;

  return (
    <PortalShell title={title} subtitle={`${doneTasks.length} resolved issues`} pages={TECH_PAGES}>

      {/* Summary Banner */}
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible"
        className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] rounded-[28px] p-6 flex items-center gap-5 border border-[#3F7A5B]/10">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
          <CheckCircle2 className="w-7 h-7 text-[#3F7A5B]" />
        </div>
        <div>
          <h2 className="font-serif text-[24px] font-bold text-[#191919] leading-tight">
            {doneTasks.length} Issue{doneTasks.length !== 1 ? 's' : ''} Resolved
          </h2>
          <p className="text-[13px] font-bold text-[#191919]/50 mt-0.5">
            These issues have been fixed and submitted. Evidence photos and resolution notes are visible to the admin and the reporter.
          </p>
        </div>
      </motion.div>

      {/* Completed List */}
      <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="space-y-4 mt-4">
        <AnimatePresence>
          {doneTasks.map((task, i) => {
            const isExpanded = expandedId === task.id;
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-[28px] overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : task.id)}
                  className="p-6 cursor-pointer hover:bg-white/80 transition-all flex items-start justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#3F7A5B]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[16px] text-[#191919] truncate">{task.title}</h3>
                      <p className="text-[13px] font-bold text-[#191919]/40 truncate flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {task.location} · {task.room}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={clsx(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold text-white',
                      task.status === 'Verified' ? 'bg-[#3F7A5B]' : 'bg-[#6B4FBB]'
                    )}>
                      {task.status}
                    </span>
                    {task.rating && (
                      <span className="flex items-center gap-1 text-[12px] font-bold text-[#C08A3E]">
                        <Star className="w-3.5 h-3.5 fill-[#C08A3E]" /> {task.rating}/5
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-[#191919]/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.techReplyAt ? new Date(task.techReplyAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-4 border-t border-[#191919]/5 pt-4">
                        {/* Description */}
                        <div className="bg-white/60 rounded-[20px] p-4 border border-white">
                          <p className="font-bold text-[12px] text-[#0B3C73] mb-1">ISSUE DESCRIPTION</p>
                          <p className="text-[14px] font-bold text-[#191919]/70 leading-relaxed">{task.description}</p>
                          <p className="text-[12px] font-bold text-[#191919]/30 mt-2">Reported by {task.reportedBy}</p>
                        </div>

                        {/* Reporter Evidence */}
                        {task.evidence && task.evidence.length > 0 && (
                          <div className="bg-[#FAF8F5] rounded-[20px] p-4 border border-black/[0.05]">
                            <EvidenceGallery images={task.evidence} label="Reporter's Photos" tone="report" />
                          </div>
                        )}

                        {/* Resolution Note */}
                        {task.techNote && (
                          <div className="bg-[#E8F5E9] rounded-[20px] p-4">
                            <p className="font-bold text-[12px] text-[#3F7A5B] flex items-center gap-1.5 mb-1">
                              <MessageSquare className="w-4 h-4" /> RESOLUTION NOTE
                            </p>
                            <p className="font-bold text-[14px] text-[#191919]">{task.techNote}</p>
                          </div>
                        )}

                        {/* Resolution Evidence */}
                        {task.resolutionEvidence && task.resolutionEvidence.length > 0 && (
                          <div className="bg-[#E8F5E9]/60 rounded-[20px] p-4 border border-[#3F7A5B]/10">
                            <EvidenceGallery images={task.resolutionEvidence} label="Repair Proof Photos" tone="resolution" />
                          </div>
                        )}

                        {/* Feedback */}
                        {task.ratingFeedback && (
                          <div className="bg-[#FFF4E6] rounded-[20px] p-4">
                            <p className="font-bold text-[12px] text-[#C08A3E] flex items-center gap-1.5 mb-1">
                              <Star className="w-4 h-4" /> REPORTER FEEDBACK
                            </p>
                            <p className="font-bold text-[14px] text-[#191919]">"{task.ratingFeedback}"</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {doneTasks.length === 0 && (
          <div className="glass-card rounded-[28px] p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#191919]/10 mx-auto mb-3" />
            <p className="font-bold text-[16px] text-[#191919]/40">No resolved issues yet</p>
            <p className="text-[13px] font-bold text-[#191919]/25 mt-1">Completed tasks will appear here with evidence and notes.</p>
          </div>
        )}
      </motion.div>
    </PortalShell>
  );
};

export default TechCompleted;
