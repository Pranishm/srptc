import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, PlusCircle, MapPin, FileText,
  Bell, Award, Users, Wrench, BarChart3,
  ShieldAlert, CheckCircle2, Building2,
  GraduationCap, Search, LogOut, Sparkles, Laptop, Globe
} from 'lucide-react';
import clsx from 'clsx';
import { getCurrentUser } from '../utils/db';
import { AIChatbot } from './AIChatbot';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage, t, type Language } from '../utils/i18n';

// ── SVG ring for campus health ──────────────────────────────────────────────
const Ring = ({ pct, color = '#0B3C73' }: { pct: number; color?: string }) => {
  const r = 13, c = 16;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
      <circle cx={c} cy={c} r={r} stroke="rgba(25,25,25,0.08)" strokeWidth="3" fill="none" />
      <circle cx={c} cy={c} r={r} stroke={color} strokeWidth="3" fill="none"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`} />
    </svg>
  );
};

const getTranslationKey = (label: string): string => {
  const mapping: Record<string, string> = {
    'Overview': 'overview',
    'Report Issue': 'reportIssue',
    'Explore Campus': 'exploreCampus',
    'My Issues': 'myIssues',
    'Command Center': 'commandCenter',
    'My Tasks': 'myTasks',
    'Priority Queue': 'priorityQueue',
    'Campus Map': 'exploreCampus',
    'Team': 'team',
    'Completed': 'completedWork',
    'Performance': 'performance',
    'Dept Console': 'overview',
    'Report Fault': 'reportIssue',
    'Lab Systems': 'exploreCampus',
    'Active Reports': 'myIssues',
    'Lab Pulses': 'exploreCampus',
    'Alerts': 'alertsCenter',
    'My Impact': 'myIssues',
    'Campus Pulse': 'exploreCampus',
    'Live Campus': 'liveCampus',
    'Issues': 'issueDispatch',
    'AI Prediction': 'aiPrediction',
    'Staff Roster': 'staffRoster',
    'Departments': 'departments',
    'Analytics': 'analytics'
  };
  return mapping[label] || label.toLowerCase();
};

// ── Nav item with clean enterprise styling ────────────────────────────────────
type NavItem = { label: string; path: string; icon: React.ElementType; num: string };

const SideItem = ({ item, active }: { item: NavItem; active: boolean }) => {
  const Icon = item.icon;
  const currentLang = getCurrentLanguage();
  const transKey = getTranslationKey(item.label);

  return (
    <NavLink to={item.path}>
      {() => (
        <motion.div
          whileHover="hov"
          initial="rest"
          animate="rest"
          className={clsx(
            'relative flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] cursor-pointer select-none transition-all duration-350 group',
            active ? 'bg-[#0B3C73] text-white font-semibold shadow-sm' : 'text-[#191919]/70 hover:bg-black/5 hover:text-[#191919] hover:pl-6'
          )}
        >
          <motion.span
            className={clsx('font-sans font-bold text-[11px] w-4 shrink-0 tabular-nums',
              active ? 'text-white/70' : 'text-[#191919]/30 group-hover:text-[#191919]/50')}
            variants={{ rest: { x: 0 }, hov: { x: -2 } }}
            transition={{ duration: 0.12 }}
          >{item.num}</motion.span>

          <Icon className={clsx('w-4 h-4 shrink-0', active ? 'text-white' : 'text-[#191919]/60')} />
          <span className="text-[13.5px] leading-none flex-1 font-sans">{t(transKey, currentLang)}</span>
        </motion.div>
      )}
    </NavLink>
  );
};

// ── Role-adaptive sidebar bottom widgets ────────────────────────────────────
const StudentWidget = () => {
  const lang = getCurrentLanguage();
  return (
    <div className="mx-3">
      <div className="bg-white rounded-[20px] p-3.5 space-y-2 border border-black/[0.06] hover:scale-[1.01] transition-transform duration-200">
        <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider">{t('status', lang)}</p>
        <div className="flex items-center gap-3">
          <Ring pct={98.2} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3F7A5B] inline-block animate-pulse" />
              <span className="text-[13px] font-bold text-[#191919]">{t('healthy', lang)}</span>
            </div>
            <p className="font-bold text-[11px] text-[#191919]/50 mt-0.5">98.2% systems up</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffWidget = () => {
  const lang = getCurrentLanguage();
  return (
    <div className="mx-3">
      <div className="bg-white rounded-[20px] p-3.5 space-y-2 border border-black/[0.06] hover:scale-[1.01] transition-transform duration-200">
        <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider">{t('status', lang)}</p>
        <div className="flex items-center gap-3">
          <Ring pct={94.8} color="#0B3C73" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0B3C73] inline-block animate-pulse" />
              <span className="text-[13px] font-bold text-[#191919]">Stable</span>
            </div>
            <p className="font-bold text-[11px] text-[#191919]/50 mt-0.5">ECE & CSE Labs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechnicianWidget = () => {
  const lang = getCurrentLanguage();
  return (
    <div className="mx-3">
      <div className="bg-white rounded-[20px] p-3.5 space-y-2 border border-black/[0.06] hover:scale-[1.01] transition-transform duration-200">
        <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider">{t('workload', lang)}</p>
        <div className="space-y-1.5">
          {[
            { tKey: '4 active tasks',  c: '#0B3C73' },
            { tKey: '2 due within 2h', c: '#C08A3E' },
            { tKey: '1 critical',      c: '#B23A48' },
          ].map(r => (
            <div key={r.tKey} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.c }} />
              <span className="text-[12px] font-bold text-[#191919]">{r.tKey}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminWidget = () => {
  const lang = getCurrentLanguage();
  return (
    <div className="mx-3">
      <div className="bg-white rounded-[20px] p-3.5 space-y-2 border border-black/[0.06] hover:scale-[1.01] transition-transform duration-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3F7A5B] inline-block animate-pulse" />
          <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider">{t('liveCampus', lang)}</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { n: '41', l: 'open',     c: '#0B3C73' },
            { n: '7',  l: 'critical', c: '#B23A48' },
            { n: '12', l: 'overdue',  c: '#C08A3E' },
          ].map(s => (
            <div key={s.l} className="bg-[#FAF8F5] rounded-[12px] p-1.5 text-center border border-black/[0.04]">
              <p className="font-bold text-[14px]" style={{ color: s.c }}>{s.n}</p>
              <p className="text-[9.5px] font-bold text-[#191919]/40 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Layout ───────────────────────────────────────────────────────────────────
const Layout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [search, setSearch] = useState('');
  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  const currentUser = getCurrentUser();

  const role = currentUser.role === 'admin' ? 'Admin'
             : currentUser.role === 'technician' ? 'Technician'
             : currentUser.role === 'staff' ? 'Staff'
             : 'Student';

  const isAdmin      = role === 'Admin';
  const isTechnician = role === 'Technician';
  const isStaff      = role === 'Staff';

  const studentNav: NavItem[] = [
    { label: 'Overview',       path: '/app/student',   icon: LayoutDashboard, num: '01' },
    { label: 'Report Issue',   path: '/app/report',    icon: PlusCircle,      num: '02' },
    { label: 'Explore Campus', path: '/app/explore',   icon: MapPin,          num: '03' },
    { label: 'My Issues',      path: '/app/my-issues', icon: FileText,        num: '04' },
  ];
  const studentComm: NavItem[] = [
    { label: 'Alerts',       path: '/app/alerts',  icon: Bell,   num: '05' },
    { label: 'My Impact',    path: '/app/impact',  icon: Award,  num: '06' },
  ];

  const staffNav: NavItem[] = [
    { label: 'Dept Console',   path: '/app/staff',     icon: LayoutDashboard, num: '01' },
    { label: 'Report Fault',   path: '/app/report',    icon: PlusCircle,      num: '02' },
    { label: 'Lab Systems',    path: '/app/explore',   icon: Laptop,          num: '03' },
    { label: 'Active Reports', path: '/app/my-issues', icon: FileText,        num: '04' },
  ];
  const staffComm: NavItem[] = [
    { label: 'Alerts',       path: '/app/alerts',  icon: Bell,   num: '05' },
  ];

  // Every technician operation now has its own route instead of a ?filter= query.
  const techNav: NavItem[] = [
    { label: 'Command Center', path: '/app/technician',          icon: LayoutDashboard, num: '01' },
    { label: 'My Tasks',       path: '/app/technician/tasks',    icon: Wrench,          num: '02' },
    { label: 'Priority Queue', path: '/app/technician/priority', icon: ShieldAlert,     num: '03' },
    { label: 'Campus Map',     path: '/app/explore',             icon: MapPin,          num: '04' },
  ];
  const techAnalytics: NavItem[] = [
    { label: 'Team',        path: '/app/technician/team',        icon: Users,        num: '05' },
    { label: 'Completed',   path: '/app/technician/completed',   icon: CheckCircle2, num: '06' },
    { label: 'Performance', path: '/app/technician/performance', icon: BarChart3,    num: '07' },
  ];

  // Likewise for the admin console — one page per operation.
  const adminNav: NavItem[] = [
    { label: 'Command Center', path: '/app/admin',        icon: LayoutDashboard, num: '01' },
    { label: 'Live Campus',    path: '/app/admin/campus', icon: MapPin,          num: '02' },
    { label: 'Issues',         path: '/app/admin/issues', icon: FileText,        num: '03' },
    { label: 'AI Prediction',  path: '/app/admin/ai',     icon: Sparkles,        num: '04' },
  ];
  const adminMgmt: NavItem[] = [
    { label: 'Staff Roster',  path: '/app/admin/staff',       icon: Users,     num: '05' },
    { label: 'Departments',   path: '/app/admin/departments', icon: Building2, num: '06' },
    { label: 'Analytics',     path: '/app/admin/analytics',   icon: BarChart3, num: '07' },
    { label: 'Alerts',        path: '/app/admin/alerts',      icon: Bell,      num: '08' },
  ];

  const primaryNav    = isAdmin ? adminNav  : isTechnician ? techNav  : isStaff ? staffNav  : studentNav;
  const secondaryNav  = isAdmin ? adminMgmt : isTechnician ? techAnalytics : isStaff ? staffComm : studentComm;
  const primaryTitle  = isAdmin || isTechnician ? 'OPERATIONS' : isStaff ? 'DEPARTMENT' : 'YOUR CAMPUS';
  const secondaryTitle= isAdmin ? 'MANAGEMENT' : isTechnician ? 'ANALYTICS' : isStaff ? 'COMMUNITY' : 'COMMUNITY';

  const userName    = currentUser.name;
  const userSub     = currentUser.dept || 'Civix360 User';
  const initials    = currentUser.initials;

  // Portal operations are real routes now, so an exact pathname match is both
  // sufficient and correct — a prefix match would light up every admin item
  // whenever any /app/admin/* page is open.
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-3 sm:p-4 flex antialiased relative">
      
      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside className="w-[250px] shrink-0 hidden lg:flex flex-col glass-sidebar rounded-[28px] overflow-hidden z-20">

        {/* Logo */}
        <div className="px-6 pt-6 pb-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Civix360 Logo" className="w-10 h-10 object-contain mix-blend-multiply" />
            <div className="leading-tight flex-1 min-w-0">
              <p className="font-serif font-bold text-[19px] text-[#191919] leading-tight tracking-tight">Civix360</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          <div className="space-y-1">
            <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider px-3 mb-2">{primaryTitle}</p>
            {primaryNav.map(item => <SideItem key={item.label} item={item} active={isActive(item.path)} />)}
          </div>

          <div className="space-y-1">
            <p className="font-bold text-[10px] text-[#191919]/40 uppercase tracking-wider px-3 mb-2">{secondaryTitle}</p>
            {secondaryNav.map(item => <SideItem key={item.label} item={item} active={isActive(item.path)} />)}
          </div>
        </div>

        {/* Role-adaptive widget */}
        <div className="pb-3 pt-1">
          <AnimatePresence mode="wait">
            <motion.div key={role}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {isAdmin ? <AdminWidget /> : isTechnician ? <TechnicianWidget /> : isStaff ? <StaffWidget /> : <StudentWidget />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Logout Button (Brought upside above the bottom profile card) */}
        <div className="px-3 pb-2">
          <button onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] text-[#191919]/60 hover:text-[#B23A48] hover:bg-red-50/70 transition-all duration-300 cursor-pointer border-none font-bold text-[13px] hover:pl-6"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* User profile card */}
        <div className="px-4 pb-4 pt-3 flex items-center gap-2.5 border-t border-black/[0.06]">
          <div className="w-9 h-9 rounded-[10px] bg-[#0B3C73]/10 text-[#0B3C73] font-bold text-[13px] flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-[13px] font-bold text-[#191919] truncate">{userName}</p>
            <p className="text-[11px] font-bold text-[#191919]/40 truncate">{userSub}</p>
          </div>
        </div>

      </aside>

      {/* ══ MAIN PANEL ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 bg-transparent lg:ml-4 overflow-hidden flex flex-col min-w-0 min-h-[calc(100vh-24px)] rounded-[28px] z-10">

        {/* Top bar */}
        <header className="h-16 px-6 sm:px-8 flex items-center justify-between shrink-0 bg-transparent z-10 gap-4 mt-1">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-bold text-[12px] text-[#191919]/50 uppercase tracking-widest hidden sm:block">
              CIVIX360 <span className="text-[#191919]/20 mx-2">/</span> {role.toUpperCase()}
            </span>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-[#191919]/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={t('searchCampus', currentLang)} value={search} onChange={e => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-white rounded-full text-[13px] font-bold text-[#191919] placeholder:text-[#191919]/30 focus:outline-none focus:ring-2 focus:ring-[#0B3C73]/20 transition-all shadow-sm border border-black/[0.06]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-white shadow-sm rounded-full px-3 py-1 border border-black/[0.06] text-[12px] font-bold text-[#191919] hover:scale-[1.01] transition-transform">
              <Globe className="w-4 h-4 text-[#0B3C73] mr-1.5 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLanguage(e.target.value as Language)}
                className="bg-transparent text-[12px] font-bold text-[#191919] focus:outline-none cursor-pointer pr-1"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.native}
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-full bg-white shadow-sm flex items-center gap-2 font-bold text-[12px] text-[#0B3C73] border border-black/[0.06] hover:bg-red-50 hover:text-[#B23A48] hover:border-red-100 transition-all cursor-pointer group"
            >
              <div className="group-hover:hidden flex items-center gap-2">
                {isAdmin ? <ShieldAlert className="w-4 h-4 text-[#0B3C73]" />
                         : isTechnician ? <Wrench className="w-4 h-4 text-[#0B3C73]" />
                                        : isStaff  ? <Users className="w-4 h-4 text-[#0B3C73]" />
                                                   : <GraduationCap className="w-4 h-4 text-[#0B3C73]" />}
                {t(role.toLowerCase(), currentLang) || role}
              </div>
              <div className="hidden group-hover:flex items-center gap-2">
                <LogOut className="w-4 h-4 text-[#B23A48]" />
                Sign Out
              </div>
            </button>
            <button onClick={() => navigate('/app/alerts')}
              className="relative p-2.5 bg-white hover:bg-white/80 rounded-full shadow-sm transition-colors cursor-pointer border border-black/[0.06]">
              <Bell className="w-4 h-4 text-[#191919]/70" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B23A48] rounded-full animate-ping" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto rounded-[28px]">
          <Outlet />
        </main>
      </div>

      {/* Global Floating AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Layout;
