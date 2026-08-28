import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import PortalShell, { shellStagger } from '../../components/PortalShell';
import { ADMIN_PAGES } from '../../config/navigation';

const PREDICTIONS = [
  {
    id: 'PRED-01',
    title: 'Block C Wi-Fi Router Overload & Thermal Throttle',
    location: 'Block C · 3rd Floor IT Rack',
    risk: 94,
    level: 'Critical',
    timeframe: 'Next 3 Hours',
    category: 'Network/IT',
    assignedTech: 'Suresh Patel (IT Support)',
    aiReasoning: 'Sustained 450+ concurrent connections combined with ambient temp 34°C triggers hardware reset threshold.',
    status: 'Action Required',
  },
  {
    id: 'PRED-02',
    title: 'ECE Lab 2 Air Conditioning Compressor Strain',
    location: 'ECE Building · Room 204',
    risk: 87,
    level: 'High',
    timeframe: 'Next 12 Hours',
    category: 'AC / Facilities',
    assignedTech: 'Arun Kumar (Facilities)',
    aiReasoning: 'Refrigerant pressure drop detected via sensor logs. Cooling efficiency down by 28%.',
    status: 'Scheduled Dispatch',
  },
  {
    id: 'PRED-03',
    title: 'Block A Main Elevator Door Sensor Friction',
    location: 'Block A · Ground Floor Elevator',
    risk: 72,
    level: 'Medium',
    timeframe: 'Next 24 Hours',
    category: 'Facilities',
    assignedTech: 'Anil Deshmukh (General)',
    aiReasoning: 'Door cycle latency increased by 420ms over last 200 operations. Optical sensor alignment required.',
    status: 'Monitored',
  },
  {
    id: 'PRED-04',
    title: 'CSE Lab 1 UPS Battery Reserve Degradation',
    location: 'CSE Block · Server Room',
    risk: 65,
    level: 'Medium',
    timeframe: 'Next 48 Hours',
    category: 'Electrical',
    assignedTech: 'Vikram Singh (Electrical)',
    aiReasoning: 'Self-test voltage drop indicates cell 4 degradation. Backup runtime reduced to 8 mins.',
    status: 'Monitored',
  },
];

export default function AdminPredictive() {
  const [items, setItems] = useState(PREDICTIONS);
  const [selectedPred, setSelectedPred] = useState<typeof PREDICTIONS[0] | null>(PREDICTIONS[0]);
  const [dispatched, setDispatched] = useState<Record<string, boolean>>({});

  const handleDispatch = (id: string) => {
    setDispatched(prev => ({ ...prev, [id]: true }));
    setItems(prev => prev.map(p => p.id === id ? { ...p, status: 'Dispatch Triggered' } : p));
  };

  return (
    <PortalShell title="AI Predictive Diagnostics" subtitle="Machine learning failure forecasting & proactive maintenance dispatch" pages={ADMIN_PAGES}>
      
      {/* Top AI Summary Banner */}
      <motion.div variants={shellStagger(2)} initial="hidden" animate="visible"
        className="bg-gradient-to-r from-[#0B3C73] via-[#093261] to-[#062447] text-white rounded-[28px] p-6 flex items-center justify-between border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-7 h-7 text-[#00D8F6] animate-pulse" />
          </div>
          <div>
            <h2 className="font-serif text-[24px] font-bold leading-tight flex items-center gap-2">
              CivixAI Predictive Engine <span className="text-[10px] bg-[#00D8F6]/20 text-[#00D8F6] px-2.5 py-0.5 rounded-full font-mono">MODEL v3.2 ACTIVE</span>
            </h2>
            <p className="text-[13px] font-bold text-white/60 mt-0.5">
              Analyzing sensor telemetry, historical SLA trends, and complaint heatmaps to prevent outages before they happen.
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block shrink-0">
          <p className="font-mono text-[32px] font-bold text-[#00D8F6]">94.8%</p>
          <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Prediction Accuracy</p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Side: Prediction List */}
        <motion.div variants={shellStagger(3)} initial="hidden" animate="visible" className="lg:col-span-6 space-y-3">
          <h3 className="font-sans font-bold text-[16px] text-[#191919] px-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0B3C73]" /> Active Risk Alerts ({items.length})
          </h3>

          {items.map((item) => {
            const isSelected = selectedPred?.id === item.id;
            return (
              <motion.div
                key={item.id}
                onClick={() => setSelectedPred(item)}
                whileHover={{ scale: 1.01 }}
                className={clsx(
                  'glass-card rounded-[24px] p-5 cursor-pointer transition-all border',
                  isSelected ? 'ring-2 ring-[#0B3C73] bg-white shadow-md' : 'hover:bg-white/80'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-[#191919]/40 uppercase tracking-widest">{item.id} · {item.timeframe}</span>
                    <h4 className="font-bold text-[15px] text-[#191919] truncate mt-0.5">{item.title}</h4>
                    <p className="text-[12px] font-bold text-[#191919]/40 truncate mt-0.5">{item.location}</p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className={clsx(
                      'px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white',
                      item.level === 'Critical' ? 'bg-[#B23A48]' : item.level === 'High' ? 'bg-[#C08A3E]' : 'bg-[#0B3C73]'
                    )}>
                      {item.risk}% Risk
                    </span>
                    <span className="text-[10px] font-bold text-[#191919]/40">{item.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Right Side: Prediction Deep Dive */}
        <motion.div variants={shellStagger(4)} initial="hidden" animate="visible" className="lg:col-span-6">
          {selectedPred ? (
            <div className="glass-card rounded-[32px] p-6 space-y-5 sticky top-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-3 py-1 bg-[#0B3C73] text-white font-mono text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {selectedPred.id}
                  </span>
                  <h3 className="font-serif text-[24px] font-bold text-[#191919] mt-2 leading-tight">{selectedPred.title}</h3>
                  <p className="text-[13px] font-bold text-[#191919]/40 mt-1">{selectedPred.location}</p>
                </div>
              </div>

              {/* Risk Meter Gauge */}
              <div className="bg-[#FAF8F5] rounded-[20px] p-4 border border-black/5 space-y-2">
                <div className="flex items-center justify-between text-[12px] font-bold">
                  <span className="text-[#191919]/60">AI Failure Risk Score</span>
                  <span className="font-mono text-[#B23A48] font-black text-[16px]">{selectedPred.risk}%</span>
                </div>
                <div className="h-3 bg-black/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedPred.risk}%` }}
                    transition={{ duration: 0.8 }}
                    className={clsx(
                      'h-full rounded-full',
                      selectedPred.risk > 85 ? 'bg-[#B23A48]' : selectedPred.risk > 70 ? 'bg-[#C08A3E]' : 'bg-[#0B3C73]'
                    )}
                  />
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-[#E8F1FC] rounded-[20px] p-4 space-y-1.5 border border-[#0B3C73]/10">
                <p className="font-bold text-[11px] text-[#0B3C73] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Reasoning
                </p>
                <p className="font-bold text-[13.5px] text-[#191919] leading-relaxed">{selectedPred.aiReasoning}</p>
              </div>

              <div className="space-y-2 text-[13px] font-bold text-[#191919]/60">
                <p>Category: <span className="text-[#191919]">{selectedPred.category}</span></p>
                <p>Recommended Technician: <span className="text-[#191919]">{selectedPred.assignedTech}</span></p>
                <p>Forecast Window: <span className="text-[#191919]">{selectedPred.timeframe}</span></p>
              </div>

              {/* Dispatch Action */}
              <button
                onClick={() => handleDispatch(selectedPred.id)}
                disabled={dispatched[selectedPred.id]}
                className={clsx(
                  'w-full py-4 font-bold text-[14px] rounded-full transition-all cursor-pointer border-none shadow-md flex items-center justify-center gap-2',
                  dispatched[selectedPred.id] ? 'bg-[#E8F5E9] text-[#3F7A5B]' : 'bg-[#0B3C73] hover:bg-black text-white'
                )}
              >
                {dispatched[selectedPred.id] ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Preventive Dispatch Triggered!
                  </>
                ) : (
                  <>
                    Trigger Proactive Dispatch →
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-[32px] p-12 text-center text-[#191919]/40 font-bold">
              Select a risk alert to inspect AI predictions.
            </div>
          )}
        </motion.div>

      </div>
    </PortalShell>
  );
}
