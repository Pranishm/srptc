import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RefreshCw, Check, RotateCcw, Upload, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import {
  isCameraSupported,
  videoFrameToEvidenceDataUrl,
  fileToEvidenceDataUrl,
  describeCameraError,
  dataUrlSizeLabel,
} from '../utils/media';

type Facing = 'environment' | 'user';

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  /** Receives a compressed base64 JPEG data URL. */
  onCapture: (dataUrl: string) => void;
  title?: string;
  hint?: string;
}

/**
 * Live camera sheet. Falls back to the device camera app / gallery picker when
 * getUserMedia is unavailable or the user blocks the permission prompt.
 */
export const CameraCapture = ({
  open,
  onClose,
  onCapture,
  title = 'Take photo of the fault',
  hint = 'Hold steady and frame the damaged area.',
}: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackRef = useRef<HTMLInputElement>(null);

  const [facing, setFacing] = useState<Facing>('environment');
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startStream = useCallback(async (mode: Facing) => {
    if (!isCameraSupported()) {
      setError('Live camera needs a secure (https) connection. Upload a photo instead.');
      return;
    }
    setStarting(true);
    setError(null);
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      setError(describeCameraError(err));
    } finally {
      setStarting(false);
    }
  }, [stopStream]);

  // Open / close lifecycle — the stream must never outlive the sheet.
  useEffect(() => {
    if (!open) {
      stopStream();
      setShot(null);
      setError(null);
      return;
    }
    void startStream(facing);
    return stopStream;
  }, [open, facing, startStream, stopStream]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleShoot = () => {
    if (!videoRef.current) return;
    try {
      const dataUrl = videoFrameToEvidenceDataUrl(videoRef.current);
      setFlash(true);
      setTimeout(() => setFlash(false), 180);
      setShot(dataUrl);
      stopStream();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not capture the frame.');
    }
  };

  const handleRetake = () => {
    setShot(null);
    void startStream(facing);
  };

  const handleConfirm = () => {
    if (!shot) return;
    onCapture(shot);
    setShot(null);
    onClose();
  };

  const handleFallbackFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setShot(await fileToEvidenceDataUrl(file));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that photo.');
    }
  };

  if (typeof document === 'undefined') return null;

  const corners = [
    'top-0 left-0 border-t-2 border-l-2 rounded-tl-[14px]',
    'top-0 right-0 border-t-2 border-r-2 rounded-tr-[14px]',
    'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[14px]',
    'bottom-0 right-0 border-b-2 border-r-2 rounded-br-[14px]',
  ];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-black/[0.06]">
              <div>
                <p className="font-bold text-[11px] text-[#0B3C73] uppercase tracking-widest flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Live Camera
                </p>
                <h3 className="font-serif text-[22px] font-bold text-[#191919] leading-tight mt-1">{title}</h3>
                <p className="text-[12px] font-bold text-[#191919]/45 mt-0.5">{hint}</p>
              </div>
              <button onClick={onClose} aria-label="Close camera"
                className="p-2 rounded-full hover:bg-black/5 cursor-pointer border-none bg-transparent shrink-0">
                <X className="w-5 h-5 text-[#191919]/60" />
              </button>
            </div>

            {/* Viewfinder */}
            <div className="relative bg-[#0B0B0B] aspect-[4/3] overflow-hidden">
              {shot ? (
                <img src={shot} alt="Captured evidence" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className={clsx(
                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                    starting ? 'opacity-40' : 'opacity-100',
                    facing === 'user' && 'scale-x-[-1]'
                  )}
                />
              )}

              {!shot && !error && (
                <div className="absolute inset-6 pointer-events-none">
                  {corners.map(pos => (
                    <span key={pos} className={clsx('absolute w-8 h-8 border-white/70', pos)} />
                  ))}
                </div>
              )}

              {flash && <div className="absolute inset-0 bg-white" />}

              {starting && !shot && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/25 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {error && (
                <div className="absolute inset-0 bg-[#191919]/90 flex flex-col items-center justify-center text-center px-8 gap-3">
                  <AlertTriangle className="w-9 h-9 text-[#C08A3E]" />
                  <p className="text-white font-bold text-[13.5px] leading-relaxed">{error}</p>
                </div>
              )}

              {shot && (
                <span className="absolute top-4 right-4 bg-[#E8F5E9] text-[#3F7A5B] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                  Captured · {dataUrlSizeLabel(shot)}
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="p-5 flex items-center gap-3 bg-white">
              <input ref={fallbackRef} type="file" accept="image/*" capture="environment"
                className="hidden" onChange={handleFallbackFile} />

              {shot ? (
                <>
                  <button onClick={handleRetake}
                    className="px-5 py-3.5 bg-[#F4F4F3] hover:bg-[#eaeaea] text-[#191919] font-bold text-[13.5px] rounded-full cursor-pointer border-none flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Retake
                  </button>
                  <button onClick={handleConfirm}
                    className="flex-1 py-3.5 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-full cursor-pointer border-none shadow-md flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Use this photo
                  </button>
                </>
              ) : error ? (
                <button onClick={() => fallbackRef.current?.click()}
                  className="flex-1 py-3.5 bg-[#0B3C73] hover:bg-black text-white font-bold text-[14px] rounded-full cursor-pointer border-none shadow-md flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" /> Use device camera / gallery
                </button>
              ) : (
                <>
                  <button onClick={() => setFacing(f => (f === 'environment' ? 'user' : 'environment'))}
                    title="Switch camera" aria-label="Switch camera"
                    className="p-3.5 bg-[#F4F4F3] hover:bg-[#eaeaea] rounded-full cursor-pointer border-none">
                    <RefreshCw className="w-4 h-4 text-[#191919]/70" />
                  </button>
                  <button onClick={handleShoot} disabled={starting}
                    className={clsx(
                      'flex-1 py-3.5 text-white font-bold text-[14px] rounded-full cursor-pointer border-none shadow-md flex items-center justify-center gap-2 transition-all',
                      starting ? 'bg-[#0B3C73]/40 cursor-not-allowed' : 'bg-[#0B3C73] hover:bg-black'
                    )}>
                    <Camera className="w-4 h-4" /> Capture photo
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CameraCapture;
