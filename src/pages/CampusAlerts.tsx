import { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const ALERTS = [
  { id: 1, type: 'critical', label: 'CRITICAL', emoji: '🚨', title: 'Water Outage', body: 'Hostel Block B water supply temporarily unavailable. Plumbing team has been dispatched.', time: '10 min ago', action: 'View Issue →' },
  { id: 2, type: 'warning', label: 'MAINTENANCE', emoji: '🟡', title: 'Network Maintenance', body: 'Library Wi-Fi maintenance scheduled for 4:00 PM today. Expected downtime: 45 minutes.', time: 'Starts in 2 hours', action: 'View Schedule →' },
  { id: 3, type: 'info', label: 'INFO', emoji: '🔵', title: 'Power Restoration', body: 'Main Block power has been fully restored after the earlier 2-hour outage.', time: '1 hour ago', action: null },
  { id: 4, type: 'resolved', label: 'RESOLVED', emoji: '✅', title: 'CSE Block Projector Fixed', body: 'The projector issue in Room 302 has been resolved by AV Support. Classes can resume.', time: '30 min ago', action: 'View Resolution →' },
  { id: 5, type: 'ai', label: 'AI PATTERN', emoji: '🤖', title: 'Electrical Complaint Surge Detected', body: 'AI has flagged an unusual increase in electrical complaints in Block C. Administrative team has been notified.', time: '45 min ago', action: 'View Insights →' },
  { id: 6, type: 'info', label: 'INFO', emoji: '🔵', title: 'Cafeteria Hours Extended', body: 'Cafeteria will remain open until 10:30 PM during exam week (Aug 27 – Sep 2).', time: '2 hours ago', action: null },
];

const FILTERS = ['All', 'Critical', 'Maintenance', 'Resolved', 'AI Alerts'];

const TYPE_CONFIG: Record<string, { border: string; bg: string; badge: string; }> = {
  critical: { border: 'border-rose-400', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700' },
  warning: { border: 'border-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700' },
  info: { border: 'border-blue-400', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
  resolved: { border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
  ai: { border: 'border-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700' },
};

const CampusAlerts = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ALERTS.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Critical') return a.type === 'critical';
    if (activeFilter === 'Maintenance') return a.type === 'warning';
    if (activeFilter === 'Resolved') return a.type === 'resolved';
    if (activeFilter === 'AI Alerts') return a.type === 'ai';
    return true;
  });

  return (
    <div className="p-6 sm:p-10 bg-[#F7F8FC] min-h-full">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-[#191919]">Campus Alerts</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Stay informed about operational updates and campus events.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={clsx('px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all', activeFilter === f ? 'bg-[#191919] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300')}>
              {f}
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        <div className="space-y-3">
          {filtered.map((alert, idx) => {
            const cfg = TYPE_CONFIG[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={clsx('bg-white rounded-2xl border-l-4 p-5 shadow-sm flex items-start justify-between gap-4', cfg.border)}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{alert.emoji}</span>
                    <span className={clsx('text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider', cfg.badge)}>{alert.label}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">{alert.time}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#191919]">{alert.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{alert.body}</p>
                  {alert.action && (
                    <button className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 cursor-pointer mt-1">
                      {alert.action}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 font-semibold">No alerts in this category.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CampusAlerts;
