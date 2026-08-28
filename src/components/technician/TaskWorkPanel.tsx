import { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, Sparkles, Upload, MessageSquare, Play, Pause, Camera } from 'lucide-react';
import type { Issue } from '../../utils/db';
import { generateTechResolutionAI } from '../../utils/ai';
import { t, getCurrentLanguage, type Language } from '../../utils/i18n';
import { formatSla } from '../../hooks/useTechnicianTasks';
import EvidenceGallery from '../EvidenceGallery';
import EvidencePicker from '../EvidencePicker';

interface TaskWorkPanelProps {
  task: Issue | null;
  seconds: number;
  isTimerRunning: boolean;
  onToggleTimer: (running: boolean) => void;
  onAdvance: (taskId: string, current: Issue['status']) => void;
  onSubmitResolution: (taskId: string, note: string, evidence: string[]) => void;
  emptyLabel?: string;
  /** Hides the action buttons — used by the read-only Completed page. */
  readOnly?: boolean;
}

/**
 * The technician work surface: SLA stopwatch, the reporter's photo evidence,
 * proof-of-work capture and the resolution note. Shared by every technician
 * page so each route shows the same detail UI.
 */
export const TaskWorkPanel = ({
  task,
  seconds,
  isTimerRunning,
  onToggleTimer,
  onAdvance,
  onSubmitResolution,
  emptyLabel = 'Select a task from the priority queue',
  readOnly = false,
}: TaskWorkPanelProps) => {
  const [lang, setLang] = useState<Language>(getCurrentLanguage());
  const [techNote, setTechNote] = useState('');
  const [proofPhotos, setProofPhotos] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    const onLangChange = () => setLang(getCurrentLanguage());
    window.addEventListener('civx_lang_change', onLangChange);
    return () => window.removeEventListener('civx_lang_change', onLangChange);
  }, []);

  // Reset the draft whenever a different ticket is opened.
  useEffect(() => {
    setTechNote('');
    setProofPhotos(task?.resolutionEvidence ?? []);
  }, [task?.id, task?.resolutionEvidence]);

  const handleAiDraft = async () => {
    if (!task) return;
    setIsGeneratingAi(true);
    setTechNote(await generateTechResolutionAI(task.title, task.description));
    setIsGeneratingAi(false);
  };

  if (!task) {
    return (
      <div className="glass-card rounded-[32px] p-8 text-center text-[#191919]/40 font-bold h-[300px] flex items-center justify-center sticky top-6">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-[32px] p-8 space-y-6 sticky top-6">

      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block px-3 py-1 bg-[#0B3C73] text-white font-bold text-[11px] rounded-full tracking-wide mb-3">{task.id}</span>
          <h2 className="font-serif text-[30px] font-bold text-[#191919] leading-tight">{task.title}</h2>
          <p className="text-[14px] font-bold text-[#191919]/50 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {task.location} · {task.room}
          </p>
        </div>
      </div>

      {/* SLA stopwatch */}
      {task.status === 'In Progress' && (
        <div className="bg-gradient-to-r from-[#0B3C73] via-[#0A4595] to-[#0B3C73] rounded-[24px] p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-white/20 relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="relative w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/30 shrink-0">
              <div className="absolute inset-1 rounded-full border border-dashed border-white/40 animate-[spin_10s_linear_infinite]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D8F6] animate-ping" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D8F6]" /> {t('activeSla', lang)}
              </p>
              <h4 className="font-mono text-[34px] font-bold tracking-wider mt-0.5 drop-shadow-[0_0_12px_rgba(0,216,246,0.5)]">{formatSla(seconds)}</h4>
            </div>
          </div>
          <div className="flex gap-2 z-10">
            <button onClick={() => onToggleTimer(!isTimerRunning)}
              className="p-3 bg-white/20 hover:bg-white text-white hover:text-[#0B3C73] rounded-full font-bold text-[13px] transition-all cursor-pointer flex items-center justify-center gap-1.5 px-5 shadow-sm border border-white/30">
              {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {isTimerRunning ? t('pause', lang) : t('resume', lang)}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/60 rounded-[20px] p-5 space-y-2 border border-white">
        <p className="font-bold text-[12px] text-[#0B3C73] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> {t('description', lang).toUpperCase()}
        </p>
        <p className="font-bold text-[#191919] text-[15px] leading-relaxed">{task.description}</p>
        <p className="text-[12px] font-bold text-[#191919]/40 pt-1">Reported by {task.reportedBy}</p>
      </div>

      {/* What the reporter photographed */}
      <div className="bg-[#FAF8F5] rounded-[20px] p-5 border border-black/[0.05]">
        <EvidenceGallery
          images={task.evidence}
          label="Reported Photo Evidence"
          tone="report"
          emptyText="The reporter did not attach a photo."
        />
      </div>

      {/* Proof of work already on file */}
      {task.resolutionEvidence && task.resolutionEvidence.length > 0 && task.status !== 'Uploaded' && (
        <div className="bg-[#E8F5E9]/60 rounded-[20px] p-5 border border-[#3F7A5B]/10">
          <EvidenceGallery
            images={task.resolutionEvidence}
            label="Repair Proof Photos"
            tone="resolution"
            hideWhenEmpty
          />
        </div>
      )}

      {task.techNote && (
        <div className="bg-[#E8F5E9] rounded-[20px] p-5 space-y-1.5">
          <p className="font-bold text-[12px] text-[#3F7A5B] flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4" /> {t('resolutionNote', lang).toUpperCase()}
          </p>
          <p className="font-bold text-[#191919] text-[14px]">{task.techNote}</p>
        </div>
      )}

      {!readOnly && (
        <div className="pt-2">
          {task.status === 'Assigned' && (
            <button onClick={() => onAdvance(task.id, 'Assigned')}
              className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full hover:bg-black transition-transform hover:scale-[1.01] shadow-md cursor-pointer border-none">
              {t('startTask', lang)} →
            </button>
          )}

          {task.status === 'In Progress' && (
            <button onClick={() => onAdvance(task.id, 'In Progress')}
              className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full flex items-center justify-center gap-2 hover:bg-black transition-transform hover:scale-[1.01] cursor-pointer border-none shadow-md">
              <Upload className="w-5 h-5" /> {t('uploadResolution', lang)}
            </button>
          )}

          {task.status === 'Uploaded' && (
            <div className="space-y-5">
              <div className="bg-[#FAF8F5] rounded-[24px] p-5 border border-black/[0.05] space-y-3">
                <p className="font-bold text-[12px] text-[#3F7A5B] uppercase tracking-widest flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> Proof of repair
                </p>
                <p className="text-[12.5px] font-bold text-[#191919]/45 -mt-1">
                  Photograph the completed work — the reporter and the admin both see these images.
                </p>
                <EvidencePicker
                  images={proofPhotos}
                  onChange={setProofPhotos}
                  tone="resolution"
                  label="Repair Proof Photos"
                  compact
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <label className="text-[13px] font-bold text-[#191919]">{t('resolutionNote', lang)}</label>
                  <button
                    type="button"
                    onClick={handleAiDraft}
                    disabled={isGeneratingAi}
                    className="text-[11px] font-bold text-[#0B3C73] bg-[#E8F1FC] hover:bg-[#0B3C73] hover:text-white px-3 py-1 rounded-full border border-[#0B3C73]/20 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingAi ? t('drafting', lang) : '✨ ' + t('aiAutoDraft', lang)}</span>
                  </button>
                </div>
                <textarea
                  value={techNote}
                  onChange={e => setTechNote(e.target.value)}
                  rows={3}
                  placeholder="Provide details about the resolution..."
                  className="w-full px-4 py-3 bg-white rounded-[20px] text-[13px] font-bold focus:outline-none resize-none border border-black/5"
                />
              </div>

              <button
                onClick={() => onSubmitResolution(task.id, techNote, proofPhotos)}
                className="w-full py-4 bg-[#0B3C73] text-white font-bold text-[15px] rounded-full hover:bg-black transition-transform hover:scale-[1.01] shadow-md cursor-pointer border-none"
              >
                {t('submitResolution', lang)} →
              </button>
            </div>
          )}

          {(task.status === 'Resolved' || task.status === 'Verified') && (
            <div className="bg-[#E8F5E9] rounded-[24px] p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#3F7A5B] mx-auto mb-2" />
              <p className="font-bold text-[18px] text-[#3F7A5B]">{t('verifiedClosed', lang)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskWorkPanel;
