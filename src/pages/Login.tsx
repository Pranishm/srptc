import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, GraduationCap, ArrowRight, Eye, EyeOff, AlertTriangle, Users, Wrench, Globe, CheckCircle2, Lock, Sparkles, Building2 } from 'lucide-react';
import clsx from 'clsx';
import { USERS_REGISTRY, setCurrentUser } from '../utils/db';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage, t, type Language } from '../utils/i18n';

type Role = 'student' | 'staff' | 'technician' | 'admin';

const ROLE_CONFIG: Record<Role, { icon: React.ElementType; label: string; subKey: string; defaultEmail: string; color: string; activeBg: string; ring: string }> = {
  student: { icon: GraduationCap, label: 'Student', subKey: 'studentPortalDesc', defaultEmail: 'sujan.student@civix360.edu', color: 'text-[#3F7A5B]', activeBg: 'bg-[#E8F5E9]', ring: 'ring-[#3F7A5B]' },
  staff: { icon: Users, label: 'Faculty / Staff', subKey: 'staffPortalDesc', defaultEmail: 'priya.staff@civix360.edu', color: 'text-[#3E6FA6]', activeBg: 'bg-[#E7F1FD]', ring: 'ring-[#3E6FA6]' },
  technician: { icon: Wrench, label: 'Technician', subKey: 'techPortalDesc', defaultEmail: 'arun.tech@civix360.edu', color: 'text-[#C08A3E]', activeBg: 'bg-[#FFF4E6]', ring: 'ring-[#C08A3E]' },
  admin: { icon: ShieldAlert, label: 'Administrator', subKey: 'adminPortalDesc', defaultEmail: 'admin@civix360.demo', color: 'text-[#0B3C73]', activeBg: 'bg-[#EDE7FB]', ring: 'ring-[#0B3C73]' },
};

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('sujan.student@civix360.edu');
  const [password, setPassword] = useState('password123');
  const [pin, setPin] = useState('123456');
  const [showPwd, setShowPwd] = useState(false);
  const [authStep, setAuthStep] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setErrorMsg(null);
    setEmail(ROLE_CONFIG[r].defaultEmail);
    setPassword('password123');
    if (r === 'admin') setPin('123456');
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const registryUser = USERS_REGISTRY[email];
    const isValid = registryUser && registryUser.password === password && (role !== 'admin' || registryUser.pin === pin);

    if (!isValid) {
      setAuthStep(t('authenticating', currentLang));
      setTimeout(() => {
        setAuthStep(null);
        setErrorMsg('Access denied. Incorrect email, password, or security PIN.');
      }, 700);
      return;
    }

    setAuthStep(t('authenticating', currentLang));
    setTimeout(() => {
      setAuthStep(t('loadingProfile', currentLang));
      setCurrentUser({
        email: registryUser.email,
        name: registryUser.name,
        role: registryUser.role,
        dept: registryUser.dept,
        initials: registryUser.initials
      });
      
      setTimeout(() => {
        setAuthStep('✓ ' + t('accessGranted', currentLang));
        setTimeout(() => {
          if (role === 'admin') navigate('/app/admin');
          else if (role === 'technician') navigate('/app/technician');
          else if (role === 'staff') navigate('/app/staff');
          else navigate('/app/student');
        }, 400);
      }, 500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans antialiased text-[#191919] flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E8F1FC] rounded-full blur-[140px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#FFF4E6] rounded-full blur-[140px] opacity-70 pointer-events-none" />
      
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-30 flex items-center bg-white/90 backdrop-blur-md shadow-sm rounded-full px-4 py-2 border border-black/[0.06] text-[13px] font-bold text-[#191919]">
        <Globe className="w-4 h-4 text-[#0B3C73] mr-2 shrink-0" />
        <select
          value={currentLang}
          onChange={(e) => setCurrentLanguage(e.target.value as Language)}
          className="bg-transparent text-[13px] font-bold text-[#191919] focus:outline-none cursor-pointer pr-1"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.native}
            </option>
          ))}
        </select>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 20 }}
        className="relative w-full max-w-[1080px] bg-white/85 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[660px] z-10 border border-white"
      >
        {/* ══ LEFT — Premium Brand Showcase ══ */}
        <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0B3C73] via-[#093261] to-[#062447] p-12 text-white">
          
          {/* Subtle grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-auto" />
          
          <div className="relative z-10 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo.jpg" alt="Civix360 Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-[20px] font-bold tracking-tight text-white leading-none">Civix360</p>
              <p className="text-[11px] font-bold text-white/50 tracking-widest uppercase mt-0.5">Smart Campus Platform</p>
            </div>
          </div>

          {/* Central Animated Graphic */}
          <div className="relative z-10 my-auto py-8 text-center space-y-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-white/15 to-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl relative"
            >
              <Building2 className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#F27D26] flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            <div className="space-y-2">
              <h2 className="font-serif text-[32px] font-bold text-white leading-tight">Sri Ramakrishna Polytechnic</h2>
              <p className="text-[14px] font-bold text-white/60 max-w-sm mx-auto leading-relaxed">
                Real-time fault tracking, 3D campus diagnostics, and instant maintenance dispatch.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold tracking-wider uppercase text-white/90">
                ⚡ 20 Pre-configured Users
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#00D8F6]/15 border border-[#00D8F6]/30 text-[11px] font-bold tracking-wider uppercase text-[#00D8F6]">
                ● 3D Engine Active
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[12px] font-bold text-white/40 border-t border-white/10 pt-4">
            <span>v2.4 Production Engine</span>
            <span>Civix360 Operating System</span>
          </div>
        </div>

        {/* ══ RIGHT — Auth Input Panel ══ */}
        <div className="flex-1 bg-white/95 backdrop-blur-md p-8 sm:p-12 flex flex-col justify-center space-y-7 z-20">
          <div>
            <h1 className="font-serif text-[36px] font-bold text-[#191919] leading-tight">{t('workspaceLogin', currentLang)}</h1>
            <p className="text-[14px] font-bold text-[#191919]/40 mt-1">{t('selectRole', currentLang)}</p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -8, height: 0 }} 
                animate={{ opacity: 1, y: 0, height: 'auto' }} 
                exit={{ opacity: 0, y: -8, height: 0 }} 
                className="overflow-hidden"
              >
                <div className="px-4 py-3.5 bg-[#FDE7EF] text-[#B23A48] rounded-[20px] text-[13px] font-bold flex items-center gap-2 border border-[#B23A48]/15 shadow-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4 Roles grid */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([key, cfg]) => {
              const active = role === key;
              return (
                <motion.div 
                  key={key} 
                  onClick={() => handleRoleSelect(key)} 
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.98 }}
                  className={clsx(
                    'cursor-pointer rounded-[24px] p-4 transition-all flex flex-col justify-between h-32 relative border',
                    active 
                      ? `${cfg.activeBg} border-transparent shadow-md ring-2 ${cfg.ring}` 
                      : 'bg-[#FAF8F5] hover:bg-white border-[#191919]/5 hover:border-[#191919]/15'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shadow-sm", active ? "bg-white text-[#191919]" : "bg-white text-[#191919]/40")}>
                      <cfg.icon className={clsx("w-4 h-4", active ? cfg.color : "")} />
                    </div>
                    {active && <CheckCircle2 className={clsx("w-4 h-4", cfg.color)} />}
                  </div>
                  <div>
                    <p className={clsx('text-[14px] font-bold leading-tight', active ? 'text-[#191919]' : 'text-[#191919]/60')}>{t(key, currentLang)}</p>
                    <p className={clsx("text-[11px] font-bold mt-0.5 leading-tight truncate", active ? "text-[#191919]/60" : "text-[#191919]/30")}>{t(cfg.subKey, currentLang)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <form onSubmit={e => handleLogin(e)} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#191919]/60 px-1 uppercase tracking-wider">{t('civixId', currentLang)}</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3.5 rounded-[20px] bg-[#FAF8F5] text-[14px] font-bold text-[#191919] placeholder:text-[#191919]/30 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3C73]/30 transition-all border border-[#191919]/8"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label className="text-[12px] font-bold text-[#191919]/60 uppercase tracking-wider">{t('password', currentLang)}</label>
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-[12px] font-bold text-[#0B3C73] hover:underline cursor-pointer flex items-center gap-1">
                  {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPwd ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input 
                type={showPwd ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3.5 rounded-[20px] bg-[#FAF8F5] text-[14px] font-bold text-[#191919] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B3C73]/30 transition-all border border-[#191919]/8"
              />
            </div>

            {role === 'admin' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 overflow-hidden">
                <label className="text-[12px] font-bold text-[#191919]/60 px-1 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#0B3C73]" /> {t('securityPin', currentLang)}
                </label>
                <input 
                  type="password" 
                  value={pin} 
                  onChange={e => setPin(e.target.value)} 
                  placeholder="123456" 
                  required
                  className="w-full px-4 py-3.5 rounded-[20px] bg-[#EDE7FB] text-[14px] font-mono font-bold text-[#191919] placeholder:text-[#191919]/30 focus:outline-none focus:ring-2 focus:ring-[#0B3C73]/30 transition-all border border-[#0B3C73]/10"
                />
              </motion.div>
            )}

            <div className="pt-2">
              {authStep ? (
                <div className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[14px] rounded-[20px] flex items-center justify-center gap-3 shadow-lg">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{authStep}</span>
                </div>
              ) : (
                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#0B3C73] hover:bg-[#093261] text-white font-bold text-[14px] rounded-[20px] transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer border-none shadow-[#0B3C73]/25"
                >
                  <span>{t('signIn', currentLang)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
