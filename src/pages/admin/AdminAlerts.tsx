import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';

const ALERTS_DATA = [
  { id: 'ALT-101', type: 'critical', title: 'SLA Breach Warning: Block C Main Router', time: '10 mins ago', location: 'Block C · Server Room', desc: 'SLA countdown under 20 minutes remaining. No technician dispatch confirmed.' },
  { id: 'ALT-102', type: 'warning', title: 'Unassigned Critical Fault: ECE Lab 2 AC Unit', time: '25 mins ago', location: 'ECE Building · Room 204', desc: 'Faculty reported temperature rise exceeding 32°C. Awaiting admin assignment.' },
  { id: 'ALT-103', type: 'info', title: 'Preventive Dispatch Executed: Block A Elevator', time: '1 hour ago', location: 'Block A · Ground Floor', desc: 'AI predictive maintenance auto-triggered inspection ticket.' },
  { id: 'ALT-104', type: 'resolved', title: 'Resolved & Verified: Hostel B Plumbing Leak', time: '2 hours ago', location: 'Hostel B · 2nd Floor', desc: 'Technician Mahesh Joshi submitted repair proof photos. Verified by student.' },
];

export default function AdminAlerts() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'resolved'>('all');
  const [alerts] = useState(ALERTS_DATA);

  const filtered = alerts.filter(a => filter === 'all' || a.type === filter);

  return (
    <PortalShell title="Alerts & SLA Notifications" subtitle="Real-time incident response feed, critical breach warnings, & system dispatch logs" pages={ADMIN_PAGES}>
      
      {/* Header Ticker */}
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible"
        className="bg-gradient-to-r from-[#B23A48] via-[#8B1A2B] to-[#B23A48] text-white rounded-[28px] p-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif text-[22px] font-bold text-white leading-tight">2 SLA Breach Alerts Active</h2>
            <p className="text-[13px] font-bold text-white/70 mt-0.5">Critical faults requiring immediate administrative dispatch action.</p>
          </div>
        </div>
        <span className="px-4 py-2 bg-white text-[#B23A48] font-bold text-[12px] rounded-full uppercase tracking-wider hidden sm:inline-block shadow-sm">
          High Priority
        </span>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'critical', label: 'Critical Breaches' },
          { id: 'warning', label: 'Warnings' },
          { id: 'info', label: 'System Info' },
          { id: 'resolved', label: 'Resolved' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={clsx(
              'px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border-none shadow-sm whitespace-nowrap',
              filter === tab.id ? 'bg-[#0B3C73] text-white' : 'bg-white text-[#191919]/60 hover:bg-white/80'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="space-y-4 mt-4">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-[24px] p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className={clsx(
                  'w-11 h-11 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                  item.type === 'critical' ? 'bg-[#FDE7EF] text-[#B23A48]' : item.type === 'warning' ? 'bg-[#FFF4E6] text-[#C08A3E]' : item.type === 'info' ? 'bg-[#E8F1FC] text-[#0B3C73]' : 'bg-[#E8F5E9] text-[#3F7A5B]'
                )}>
                  {item.type === 'critical' ? <ShieldAlert className="w-5 h-5" /> : item.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : item.type === 'info' ? <Bell className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#191919]/40">{item.id}</span>
                    <span className="text-[11px] font-bold text-[#191919]/30">· {item.time}</span>
                  </div>
                  <h3 className="font-bold text-[16px] text-[#191919] mt-0.5">{item.title}</h3>
                  <p className="text-[13px] font-bold text-[#191919]/50 mt-1 leading-relaxed">{item.desc}</p>
                  <p className="text-[12px] font-bold text-[#0B3C73] mt-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {item.location}
                  </p>
                </div>
              </div>

              <button className="px-4 py-2 bg-[#0B3C73] hover:bg-black text-white text-xs font-bold rounded-full transition-all cursor-pointer shrink-0 border-none">
                Take Action →
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </PortalShell>
  );
}
