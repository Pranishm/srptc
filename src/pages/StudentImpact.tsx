import { motion } from 'framer-motion';
import clsx from 'clsx';

const STATS = [
  { label: 'Issues Reported', value: 12, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Resolved', value: 8, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Students Helped', value: 42, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Problems Prevented', value: 3, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const BADGES = [
  { emoji: '🏅', name: 'First Reporter', desc: 'Reported your first campus issue', earned: true },
  { emoji: '🔎', name: 'Campus Watcher', desc: 'Followed 3+ active issues', earned: true },
  { emoji: '⚡', name: 'Problem Solver', desc: '5 issues resolved after your report', earned: true },
  { emoji: '🌱', name: 'Community Contributor', desc: 'Helped 25+ students', earned: true, progress: 100 },
  { emoji: '🏆', name: 'Campus Champion', desc: '50 students helped · 8 more to go', earned: false, progress: 84 },
  { emoji: '⭐', name: 'Streak Keeper', desc: 'Report 7 days in a row', earned: false, progress: 43 },
];

const TIMELINE = [
  { date: 'Aug 27', title: 'Broken Streetlight — Main Parking', status: 'In Progress', color: 'bg-amber-500' },
  { date: 'Aug 25', title: 'Wi-Fi Down — Block C', status: 'Resolved', color: 'bg-emerald-500' },
  { date: 'Aug 22', title: 'Water Leakage — Hostel B', status: 'Resolved', color: 'bg-emerald-500' },
  { date: 'Aug 19', title: 'Fan Noise — Main Block Hall 1', status: 'Assigned', color: 'bg-blue-500' },
  { date: 'Aug 14', title: 'Projector Broken — Block A R302', status: 'Resolved', color: 'bg-emerald-500' },
];

const StudentImpact = () => {
  return (
    <div className="p-6 sm:p-10 bg-[#F7F8FC] min-h-full">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-[#191919]">My Campus Impact 🏆</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Every report you make helps your fellow students.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
            >
              <p className={clsx('text-3xl font-black', s.color)}>{s.value}</p>
              <p className="text-[11px] text-gray-400 font-bold mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="space-y-4">
          <h2 className="font-black text-lg text-[#191919]">Your Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={clsx('bg-white rounded-2xl p-4 border shadow-sm flex items-start gap-4', badge.earned ? 'border-gray-100' : 'border-gray-100 opacity-60')}
              >
                <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0', badge.earned ? 'bg-amber-50' : 'bg-gray-100 grayscale')}>
                  {badge.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-[#191919]">{badge.name}</h3>
                    {badge.earned ? (
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">Earned</span>
                    ) : (
                      <span className="text-[10px] font-extrabold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">Locked</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{badge.desc}</p>
                  {!badge.earned && badge.progress && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${badge.progress}%` }}></div>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold">{badge.progress}% complete</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contribution History */}
        <div className="space-y-4">
          <h2 className="font-black text-lg text-[#191919]">Contribution History</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {TIMELINE.map((item, i) => (
              <div key={i} className={clsx('flex items-center gap-4 p-4', i < TIMELINE.length - 1 && 'border-b border-gray-50')}>
                <div className="text-[11px] font-extrabold text-gray-400 w-14 shrink-0">{item.date}</div>
                <div className={clsx('w-2 h-2 rounded-full shrink-0', item.color)}></div>
                <p className="font-bold text-sm text-[#191919] flex-1">{item.title}</p>
                <span className={clsx('text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0', item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700')}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation card */}
        <div className="bg-gradient-to-br from-[#191919] to-indigo-900 text-white rounded-2xl p-5">
          <p className="font-extrabold">Keep going! 🎯</p>
          <p className="text-sm text-white/70 mt-1">8 more reports and you unlock <span className="font-black text-amber-400">Campus Champion 🏆</span></p>
        </div>

      </div>
    </div>
  );
};

export default StudentImpact;
