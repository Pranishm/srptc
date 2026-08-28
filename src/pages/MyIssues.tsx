import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Image, MapPin, X, Star, Bell } from 'lucide-react';
import clsx from 'clsx';
import { getIssues, advanceIssueStatus, submitStudentRating, getCurrentUser } from '../utils/db';
import type { Issue } from '../utils/db';
import EvidenceGallery from '../components/EvidenceGallery';

const FILTER_TABS = ['All', 'Active', 'Resolved', 'Verified'];

const stagger = (i: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: i * 0.05 } }
});

// ── 5-Star Rating Component ──────────────────────────────────────────────────
const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n)} className="cursor-pointer transition-transform hover:scale-110">
        <Star className={clsx("w-8 h-8", n <= value ? "text-[#F59E0B] fill-[#F59E0B]" : "text-[#191919]/20")} />
      </button>
    ))}
  </div>
);

const MyIssues = () => {
  const currentUser = getCurrentUser();
  const [activeFilter, setActiveFilter] = useState('All');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [verification, setVerification] = useState<Record<string, 'resolved' | 'still'>>({});

  // Rating state
  const [ratingModal, setRatingModal] = useState<Issue | null>(null);
  const [starValue, setStarValue] = useState(0);
  const [ratingText, setRatingText] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const loadIssues = () => {
    const all = getIssues();
    setIssues(all);
    if (selectedIssue) {
      const updated = all.find(i => i.id === selectedIssue.id);
      if (updated) setSelectedIssue(updated);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [verification]);

  const handleVerifyAction = (id: string, action: 'resolved' | 'still') => {
    setVerification(v => ({ ...v, [id]: action }));
    if (action === 'resolved') {
      advanceIssueStatus(id, 'Verified');
    } else {
      advanceIssueStatus(id, 'Assigned');
    }
    loadIssues();
  };

  const handleRatingSubmit = () => {
    if (!ratingModal || starValue === 0) return;
    submitStudentRating(ratingModal.id, starValue, ratingText);
    setRatingSubmitted(true);
    setTimeout(() => {
      setRatingModal(null);
      setStarValue(0);
      setRatingText('');
      setRatingSubmitted(false);
      loadIssues();
    }, 1500);
  };

  const filtered = issues.filter(i => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return i.status !== 'Resolved' && i.status !== 'Verified';
    return i.status === activeFilter;
  });

  // Issues resolved but not yet rated by this reporter.
  // reportedBy is stored as "Name (Role)", so match on the name rather than equality.
  const pendingRatings = issues.filter(i =>
    (i.status === 'Resolved' || i.status === 'Verified') &&
    i.notified &&
    !i.rating &&
    i.reportedBy.includes(currentUser.name)
  );

  const getPriorityColor = (p: string) => {
    if (p === 'Critical') return 'bg-[#FDE7EF] text-[#B23A48]';
    if (p === 'High') return 'bg-[#FFF4E6] text-[#C08A3E]';
    return 'bg-[#E7F1FD] text-[#3E6FA6]';
  };

  const getStatusColor = (s: string) => {
    if (s === 'Unassigned') return 'bg-[#FFF4E6] text-[#C08A3E]';
    if (s === 'Assigned' || s === 'In Progress' || s === 'Uploaded') return 'bg-[#E7F1FD] text-[#3E6FA6]';
    return 'bg-[#E8F5E9] text-[#3F7A5B]';
  };

  return (
    <div className="p-4 md:p-8 bg-transparent min-h-screen">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="font-serif text-[40px] font-bold text-[#191919]">My Reports</h1>
          <p className="text-[16px] font-bold text-[#191919]/50 mt-1">Track and manage all your reported campus problems.</p>
        </div>

        {/* ── Resolution Notification Banner ── */}
        {pendingRatings.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#0B3C73] to-[#0A4595] rounded-[24px] p-5 flex items-center justify-between gap-4 shadow-lg border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-white text-[15px]">
                  {pendingRatings.length} issue{pendingRatings.length > 1 ? 's have' : ' has'} been resolved!
                </p>
                <p className="text-white/70 font-bold text-[12px] mt-0.5">Please rate the technician's work so we can keep improving.</p>
              </div>
            </div>
            <button
              onClick={() => setRatingModal(pendingRatings[0])}
              className="px-5 py-2.5 bg-white text-[#0B3C73] font-bold text-[13px] rounded-full hover:bg-white/90 transition-all cursor-pointer shrink-0"
            >
              Rate Now ★
            </button>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={clsx(
                'px-5 py-2.5 rounded-[20px] text-[13px] font-bold whitespace-nowrap cursor-pointer transition-all border-none',
                activeFilter === tab ? 'bg-[#0B3C73] text-white' : 'bg-white hover:bg-[#eaeaea] text-[#191919]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Issue List */}
        <div className="glass-card rounded-[28px] overflow-hidden p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="text-[#191919]/45 text-[11px] font-bold uppercase tracking-wider border-b border-black/[0.06]">
                <tr>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Technician</th>
                  <th className="px-6 py-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {filtered.map((issue, idx) => (
                  <motion.tr key={issue.id} variants={stagger(idx)} initial="hidden" animate="visible"
                    whileHover={{ backgroundColor: '#F9FAFB' }} className="cursor-pointer" onClick={() => setSelectedIssue(issue)}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4F4F3] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          {issue.evidence && issue.evidence.length > 0 ? (
                            <img src={issue.evidence[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Image className="w-5 h-5 text-[#191919]/30" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#191919] text-sm">{issue.title}</p>
                          <p className="text-[11px] text-[#191919]/40 font-mono mt-0.5">{issue.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{issue.location} {issue.room && `· ${issue.room}`}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={clsx('text-xs font-bold px-3 py-1 rounded-full', getPriorityColor(issue.priority))}>{issue.priority}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={clsx('text-xs font-bold px-3 py-1 rounded-full', getStatusColor(issue.status))}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{issue.staff}</td>
                    <td className="px-6 py-5">
                      {issue.rating ? (
                        <span className="flex gap-0.5 items-center">
                          {Array.from({ length: issue.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                          ))}
                          <span className="text-[11px] font-bold text-[#191919]/50 ml-1">{issue.rating}/5</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#191919]/30">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-[#191919]/40 font-bold">No issues in this category.</div>
            )}
          </div>
        </div>

      </div>

      {/* SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {selectedIssue && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedIssue(null)} className="fixed inset-0 bg-black/20 z-40 backdrop-blur-xs" />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col overflow-y-auto rounded-l-[40px]"
            >
              {/* Drawer Header */}
              <div className="p-8 border-b border-[#F4F4F3] flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#191919]/40 font-mono">{selectedIssue.id}</p>
                  <h2 className="text-2xl font-serif font-bold text-[#191919] mt-1">{selectedIssue.title}</h2>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={clsx('text-xs font-bold px-3 py-1 rounded-full', getPriorityColor(selectedIssue.priority))}>{selectedIssue.priority} Priority</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-bold"><MapPin className="w-3.5 h-3.5" />{selectedIssue.location}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="bg-[#F4F4F3] rounded-[24px] p-5">
                  <p className="text-xs font-bold text-[#191919]/40 uppercase mb-2">Description</p>
                  <p className="text-sm font-bold text-[#191919] leading-relaxed">{selectedIssue.description}</p>
                </div>

                {/* Photos submitted with the report */}
                <div className="bg-[#F4F4F3] rounded-[24px] p-5">
                  <EvidenceGallery
                    images={selectedIssue.evidence}
                    label="Photo Evidence You Submitted"
                    tone="report"
                    columns={3}
                    emptyText="You did not attach a photo to this report."
                  />
                </div>

                {/* Technician proof of work */}
                {selectedIssue.resolutionEvidence && selectedIssue.resolutionEvidence.length > 0 && (
                  <div className="bg-[#E8F5E9] rounded-[24px] p-5">
                    <EvidenceGallery
                      images={selectedIssue.resolutionEvidence}
                      label="Repair Proof from Technician"
                      tone="resolution"
                      columns={3}
                      hideWhenEmpty
                    />
                  </div>
                )}

                {/* Technician resolution note */}
                {selectedIssue.techNote && (
                  <div className="bg-[#E8F5E9] rounded-[24px] p-5">
                    <p className="text-xs font-bold text-[#3F7A5B] uppercase mb-2">Technician Resolution Note</p>
                    <p className="text-sm font-bold text-[#191919] leading-relaxed">{selectedIssue.techNote}</p>
                  </div>
                )}

                <div className="bg-[#E7F1FD] rounded-[24px] p-5 border border-[#191919]/5">
                  <p className="text-xs font-bold text-[#3E6FA6] mb-3">AI Diagnostic Summary</p>
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                    <div><p className="text-gray-500 font-semibold">Category</p><p className="text-[14px]">{selectedIssue.category}</p></div>
                    <div><p className="text-gray-500 font-semibold">Confidence</p><p className="text-[14px] text-emerald-600">94% match</p></div>
                  </div>
                </div>

                {/* Rating Prompt */}
                {(selectedIssue.status === 'Resolved' || selectedIssue.status === 'Verified') && selectedIssue.notified && !selectedIssue.rating && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#0B3C73]/10 to-[#0B3C73]/5 border border-[#0B3C73]/20 rounded-[28px] p-6 space-y-4"
                  >
                    <p className="font-bold text-[#0B3C73] text-sm flex items-center gap-2"><Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" /> Rate this resolution</p>
                    <button
                      onClick={() => setRatingModal(selectedIssue)}
                      className="w-full py-3 bg-[#0B3C73] text-white font-bold text-[13px] rounded-full cursor-pointer"
                    >
                      Open Rating ★
                    </button>
                  </motion.div>
                )}

                {/* Already rated */}
                {selectedIssue.rating && (
                  <div className="bg-[#E8F5E9] rounded-[28px] p-6 text-center">
                    <p className="font-bold text-[#3F7A5B] text-[15px] mb-2">You rated this {selectedIssue.rating}/5 ⭐</p>
                    <div className="flex justify-center gap-1">
                      {Array.from({ length: selectedIssue.rating }).map((_, i) => <Star key={i} className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />)}
                    </div>
                  </div>
                )}

                {/* Verification prompt */}
                {selectedIssue.status === 'Resolved' && !verification[selectedIssue.id] && !selectedIssue.notified && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FFF4E6] border border-[#FFF4E6]/30 rounded-[28px] p-6 space-y-4">
                    <p className="font-bold text-sm text-[#C08A3E]">Was this issue properly resolved?</p>
                    <div className="flex gap-3">
                      <button onClick={() => handleVerifyAction(selectedIssue.id, 'resolved')} className="flex-1 py-3 bg-[#3F7A5B] text-white text-xs font-bold rounded-xl cursor-pointer">
                        👍 Yes, it's fixed
                      </button>
                      <button onClick={() => handleVerifyAction(selectedIssue.id, 'still')} className="flex-1 py-3 bg-white border border-[#191919]/10 text-rose-800 text-xs font-bold rounded-xl cursor-pointer">
                        👎 Still broken
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedIssue.status === 'Verified' && !selectedIssue.rating && (
                  <div className="bg-[#E8F5E9] border border-[#E8F5E9]/20 rounded-[28px] p-6 text-center">
                    <CheckCircle2 className="w-10 h-10 text-[#3F7A5B] mx-auto mb-2" />
                    <p className="font-bold text-[#3F7A5B] text-[15px]">Issue marked as resolved and verified. Thank you!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── 5-STAR RATING MODAL ── */}
      <AnimatePresence>
        {ratingModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !ratingSubmitted && setRatingModal(null)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="fixed inset-0 flex items-center justify-center z-[60] p-4"
            >
              <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl space-y-6">
                {ratingSubmitted ? (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle2 className="w-14 h-14 text-[#3F7A5B] mx-auto" />
                    <p className="font-bold text-[20px] text-[#191919]">Thank you for your feedback!</p>
                    <p className="text-[14px] text-[#191919]/50 font-bold">Your rating helps us improve campus services.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-bold text-[12px] text-[#0B3C73] uppercase tracking-wider">Rate Technician Work</p>
                      <h3 className="font-serif text-[24px] font-bold text-[#191919] mt-1 leading-tight">{ratingModal.title}</h3>
                      <p className="text-[13px] text-[#191919]/50 font-bold mt-1">Technician: {ratingModal.staff}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-[14px] text-[#191919]">How well was your issue resolved?</p>
                      <StarRating value={starValue} onChange={setStarValue} />
                      {starValue > 0 && (
                        <p className="text-[13px] font-bold text-[#191919]/60">
                          {starValue === 5 ? '⭐ Excellent!' : starValue === 4 ? '👍 Good work!' : starValue === 3 ? '😐 Acceptable' : starValue === 2 ? '👎 Needs improvement' : '⚠️ Poor service'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-[13px] text-[#191919]">Additional comments (optional)</p>
                      <textarea
                        value={ratingText}
                        onChange={e => setRatingText(e.target.value)}
                        rows={3}
                        placeholder="Tell us more about the experience..."
                        className="w-full px-4 py-3 bg-[#F4F4F3] rounded-[20px] text-[13px] font-bold focus:outline-none resize-none border-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setRatingModal(null)} className="flex-1 py-3 bg-[#F4F4F3] text-[#191919]/70 font-bold text-[14px] rounded-full cursor-pointer border-none">
                        Cancel
                      </button>
                      <button
                        onClick={handleRatingSubmit}
                        disabled={starValue === 0}
                        className={clsx("flex-1 py-3 text-white font-bold text-[14px] rounded-full cursor-pointer border-none transition-all", starValue > 0 ? "bg-[#0B3C73] hover:bg-black" : "bg-[#0B3C73]/40 cursor-not-allowed")}
                      >
                        Submit Rating
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyIssues;
