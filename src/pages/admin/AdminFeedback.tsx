import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu } from 'lucide-react';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import { getIssues } from '../../utils/db';
import type { Issue } from '../../utils/db';
import { analyzeStudentFeedbackAI } from '../../utils/ai';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';

/**
 * `/app/admin/feedback` — student satisfaction analytics, lifted verbatim out of
 * the old AdminDashboard `activeTab === 'feedback'` block.
 */
const AdminFeedback = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  const [isAnalyzingFeedback, setIsAnalyzingFeedback] = useState(false);
  const [feedbackAnalysis, setFeedbackAnalysis] = useState<string | null>(null);

  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  useEffect(() => {
    setIssues(getIssues());
  }, []);

  const handleAnalyzeFeedback = async () => {
    setIsAnalyzingFeedback(true);
    const allIssues = getIssues();
    const feedbacks = allIssues.filter(i => i.rating).map(i => ({ rating: i.rating!, feedback: i.ratingFeedback }));
    const analysis = await analyzeStudentFeedbackAI(feedbacks);
    setFeedbackAnalysis(analysis);
    setIsAnalyzingFeedback(false);
  };

  return (
    <PortalShell
      title="Admin Console"
      subtitle="Student satisfaction signal across resolved tickets."
      pages={ADMIN_PAGES}
    >
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="font-sans font-bold text-[20px] text-[#191919] px-2">{t('feedbackAnalytics', currentLang)}</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Total Ratings', value: issues.filter(i => i.rating).length, color: 'text-[#0B3C73]' },
            { label: 'Avg Rating', value: issues.filter(i => i.rating).length > 0 ? (issues.filter(i => i.rating).reduce((a, b) => a + (b.rating || 0), 0) / issues.filter(i => i.rating).length).toFixed(1) : 'N/A', color: 'text-[#F59E0B]' },
            { label: '5-Star Reviews', value: issues.filter(i => i.rating === 5).length, color: 'text-[#3F7A5B]' },
            { label: 'Low Ratings (1-2)', value: issues.filter(i => i.rating && i.rating <= 2).length, color: 'text-[#B23A48]' },
          ].map((k, i) => (
            <motion.div key={k.label} variants={shellStagger(i + 3)} initial="hidden" animate="visible"
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
    </PortalShell>
  );
};

export default AdminFeedback;
