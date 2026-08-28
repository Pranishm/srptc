import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIssues, type Issue } from '../../utils/db';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import clsx from 'clsx';
import { AlertCircle, Clock, MapPin, Image as ImageIcon } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Open', 'In Progress', 'Resolved'];

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  useEffect(() => {
    setIssues(getIssues());
  }, []);

  const filteredIssues = issues.filter(issue => {
    if (filter === 'All') return true;
    if (filter === 'Open') return issue.status === 'Unassigned';
    if (filter === 'In Progress') return issue.status === 'Assigned' || issue.status === 'In Progress' || issue.status === 'Uploaded';
    if (filter === 'Resolved') return issue.status === 'Resolved' || issue.status === 'Verified';
    return true;
  });

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  return (
    <PortalShell title="Issue Dispatch" subtitle="Monitor and manage reported faults across campus." pages={ADMIN_PAGES}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Issue List */}
        <motion.div variants={shellStagger(2)} initial="hidden" animate="visible" className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-full border border-white w-fit">
            {STATUS_FILTERS.map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border-none cursor-pointer',
                  filter === status ? 'bg-[#0B3C73] text-white shadow-sm' : 'text-[#191919]/60 hover:bg-black/5 bg-transparent'
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3 pr-2 overflow-y-auto max-h-[650px] scrollbar-thin">
            <AnimatePresence>
              {filteredIssues.map(issue => (
                <motion.div
                  key={issue.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={clsx(
                    'p-5 rounded-[24px] cursor-pointer transition-all border',
                    selectedIssueId === issue.id 
                      ? 'bg-white border-[#0B3C73]/20 shadow-md ring-2 ring-[#0B3C73]/5' 
                      : 'bg-white/60 border-white hover:bg-white hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-[#191919]/40">{issue.id}</span>
                    <span className={clsx(
                      'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide',
                      issue.priority === 'Critical' ? 'bg-[#FDE7EF] text-[#B23A48]' : 'bg-[#FFF4E6] text-[#C08A3E]'
                    )}>
                      {issue.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-[15px] text-[#191919] leading-tight mb-3">{issue.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[12px] font-bold text-[#191919]/50">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {issue.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {issue.evidence && issue.evidence.length > 0 && (
                      <span className="flex items-center gap-1 text-[#0B3C73]"><ImageIcon className="w-3.5 h-3.5" /> {issue.evidence.length}</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {filteredIssues.length === 0 && (
                <div className="text-center py-12 text-[#191919]/40 font-bold text-[14px] glass-card rounded-[28px]">
                  No issues found for this filter.
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column: Issue Details & Evidence */}
        <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="lg:col-span-7">
          {selectedIssue ? (
            <div className="glass-card rounded-[32px] p-8 flex flex-col h-full min-h-[500px]">
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-[#191919]/5">
                <div>
                  <h2 className="font-serif text-[28px] font-bold text-[#191919] leading-tight">{selectedIssue.title}</h2>
                  <p className="text-[14px] font-bold text-[#191919]/50 mt-1">Reported by {selectedIssue.reportedBy}</p>
                </div>
                <div className="text-right">
                  <span className={clsx(
                    'inline-block px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-2',
                    selectedIssue.priority === 'Critical' ? 'bg-[#FDE7EF] text-[#B23A48]' : 'bg-[#FFF4E6] text-[#C08A3E]'
                  )}>
                    {selectedIssue.priority} Priority
                  </span>
                  <p className="text-[12px] font-mono font-bold text-[#191919]/40">{selectedIssue.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest mb-1">Location</p>
                  <p className="font-bold text-[14px] text-[#191919]">{selectedIssue.location}, {selectedIssue.room}</p>
                  {selectedIssue.isLabFault && <p className="text-[13px] text-[#191919]/60 font-bold mt-0.5">{selectedIssue.labName} (PC: {selectedIssue.pcNumber})</p>}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest mb-1">Category</p>
                  <p className="font-bold text-[14px] text-[#191919] capitalize">{selectedIssue.category}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest mb-2">Description</p>
                <div className="bg-white/60 p-5 rounded-[24px] border border-white">
                  <p className="text-[14px] font-bold text-[#191919]/80 leading-relaxed">{selectedIssue.description}</p>
                </div>
              </div>

              {/* Evidence Section - Visible to Admin */}
              <div>
                <p className="text-[11px] font-bold text-[#191919]/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Evidence Photos
                </p>
                {selectedIssue.evidence && selectedIssue.evidence.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedIssue.evidence.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-[20px] overflow-hidden bg-black/5 border border-black/5 relative group">
                        <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#FAF8F5] border border-black/[0.04] rounded-[24px] p-6 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-6 h-6 text-[#191919]/20 mb-2" />
                    <p className="text-[13px] font-bold text-[#191919]/40">No photos were attached to this report.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[32px] h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
              <FileTextIcon className="w-12 h-12 text-[#191919]/10 mb-4" />
              <h3 className="font-serif text-[24px] font-bold text-[#191919]">No Issue Selected</h3>
              <p className="text-[14px] font-bold text-[#191919]/40 max-w-sm mt-2">
                Select an issue from the queue to view its details, tracking history, and photographic evidence.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </PortalShell>
  );
}

// Simple icon for empty state
const FileTextIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);
