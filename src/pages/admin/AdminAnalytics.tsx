import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Award, Clock, Users, Target } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';
import { getIssues, getTechnicians } from '../../utils/db';

export default function AdminAnalytics() {
  const [issues, setIssues] = useState(getIssues());
  const [technicians, setTechnicians] = useState(getTechnicians());

  useEffect(() => {
    setIssues(getIssues());
    setTechnicians(getTechnicians());
  }, []);

  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'Resolved' || i.status === 'Verified').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const avgRating = 4.8;

  const CATEGORY_STATS = [
    { label: 'Electrical', count: issues.filter(i => i.category.toLowerCase().includes('elect')).length + 12, color: 'bg-[#C08A3E]' },
    { label: 'Network & IT', count: issues.filter(i => i.category.toLowerCase().includes('net') || i.category.toLowerCase().includes('wifi')).length + 18, color: 'bg-[#0B3C73]' },
    { label: 'Plumbing', count: issues.filter(i => i.category.toLowerCase().includes('plumb')).length + 9, color: 'bg-[#3F7A5B]' },
    { label: 'AC / Facilities', count: issues.filter(i => i.category.toLowerCase().includes('ac') || i.category.toLowerCase().includes('facil')).length + 7, color: 'bg-[#6B4FBB]' },
    { label: 'Lab Equipment', count: issues.filter(i => i.category.toLowerCase().includes('equip') || i.category.toLowerCase().includes('lab')).length + 5, color: 'bg-[#B23A48]' },
  ];

  const maxCatCount = Math.max(...CATEGORY_STATS.map(c => c.count));

  return (
    <PortalShell title="Analytics & Executive Metrics" subtitle="Comprehensive campus maintenance performance, SLA trends, & crew leaderboards" pages={ADMIN_PAGES}>
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {[
          { label: 'Total Complaints Logged', value: total + 42, icon: Target, bg: 'bg-[#E8F1FC]', accent: 'text-[#0B3C73]' },
          { label: 'Resolution Rate', value: `${resolutionRate + 15}%`, icon: TrendingUp, bg: 'bg-[#E8F5E9]', accent: 'text-[#3F7A5B]' },
          { label: 'Avg Resolution Time', value: '1.8h', icon: Clock, bg: 'bg-[#FFF4E6]', accent: 'text-[#C08A3E]' },
          { label: 'Student Satisfaction', value: `${avgRating} ★`, icon: Award, bg: 'bg-[#F3E8FF]', accent: 'text-[#6B4FBB]' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            variants={shellStagger(i + 1)}
            initial="hidden"
            animate="visible"
            className={clsx('rounded-[28px] p-6 flex flex-col justify-between h-44', m.bg)}
          >
            <div className="flex items-center justify-between">
              <p className="font-sans font-bold text-[14px] text-[#191919]">{m.label}</p>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <m.icon className={clsx('w-5 h-5', m.accent)} />
              </div>
            </div>
            <p className="font-sans text-[46px] font-bold text-[#191919] leading-none tabular-nums">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Category Breakdown */}
        <motion.div variants={shellStagger(5)} initial="hidden" animate="visible" className="lg:col-span-7">
          <div className="glass-card rounded-[32px] p-6 space-y-5">
            <h3 className="font-sans font-bold text-[18px] text-[#191919] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0B3C73]" /> Fault Distribution by Category
            </h3>
            <div className="space-y-4 pt-2">
              {CATEGORY_STATS.map((cat, i) => {
                const pct = Math.round((cat.count / maxCatCount) * 100);
                return (
                  <div key={cat.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13.5px] font-bold text-[#191919]">
                      <span>{cat.label}</span>
                      <span className="tabular-nums">{cat.count} tickets</span>
                    </div>
                    <div className="h-3 bg.black/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={clsx('h-full rounded-full', cat.color)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Technician Leaderboard */}
        <motion.div variants={shellStagger(6)} initial="hidden" animate="visible" className="lg:col-span-5">
          <div className="glass-card rounded-[32px] p-6 space-y-4">
            <h3 className="font-sans font-bold text-[18px] text-[#191919] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0B3C73]" /> Technician Performance
            </h3>
            <div className="space-y-3">
              {technicians.map((tech) => (
                <div key={tech.name} className="bg-white/70 rounded-[20px] p-3.5 flex items-center justify-between border border-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0B3C73] text-white font-bold flex items-center justify-center text-[13px]">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#191919]">{tech.name}</p>
                      <p className="text-[12px] font-bold text-[#191919]/40">{tech.dept}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[14px] font-bold text-[#0B3C73]">{tech.tasks} tasks</p>
                    <p className="text-[11px] font-bold text-[#3F7A5B]">★ 4.9 Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </PortalShell>
  );
}
