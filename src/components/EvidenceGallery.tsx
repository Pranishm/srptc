import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, X, ChevronLeft, ChevronRight, Camera, Wrench } from 'lucide-react';
import clsx from 'clsx';

type Tone = 'report' | 'resolution';

const TONE: Record<Tone, { chip: string; icon: typeof Camera; accent: string }> = {
  report: { chip: 'bg-[#E7F1FD] text-[#0B3C73]', icon: Camera, accent: '#0B3C73' },
  resolution: { chip: 'bg-[#E8F5E9] text-[#3F7A5B]', icon: Wrench, accent: '#3F7A5B' },
};

interface EvidenceGalleryProps {
  images?: string[];
  label?: string;
  tone?: Tone;
  /** When provided, each thumbnail gets a delete affordance. */
  onRemove?: (index: number) => void;
  emptyText?: string;
  /** Hides the whole block instead of rendering the empty state. */
  hideWhenEmpty?: boolean;
  columns?: 2 | 3 | 4;
}

/**
 * Read-only (or removable) grid of evidence photos with a full-screen lightbox.
 * Shared by the reporter, technician and admin views so every role sees the
 * exact same evidence in the exact same way.
 */
export const EvidenceGallery = ({
  images = [],
  label = 'Photo Evidence',
  tone = 'report',
  onRemove,
  emptyText = 'No photo evidence was attached to this report.',
  hideWhenEmpty = false,
  columns = 4,
}: EvidenceGalleryProps) => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const cfg = TONE[tone];
  const Icon = cfg.icon;

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(i => (i === null ? null : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setLightbox(i => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (images.length === 0 && hideWhenEmpty) return null;

  const gridCols = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="font-bold text-[11px] text-[#191919]/45 uppercase tracking-widest flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color: cfg.accent }} /> {label}
        </p>
        {images.length > 0 && (
          <span className={clsx('px-2.5 py-0.5 rounded-full text-[10.5px] font-bold', cfg.chip)}>
            {images.length} photo{images.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {images.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-black/10 rounded-[20px] py-6 px-4 text-center">
          <ImageOff className="w-6 h-6 text-[#191919]/25 mx-auto mb-1.5" />
          <p className="text-[12px] font-bold text-[#191919]/35">{emptyText}</p>
        </div>
      ) : (
        <div className={clsx('grid gap-2.5', gridCols)}>
          {images.map((src, i) => (
            <div key={i} className="relative group">
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="block w-full aspect-square rounded-[18px] overflow-hidden border border-black/[0.06] cursor-pointer bg-[#F4F4F3] p-0 hover:ring-2 hover:ring-[#0B3C73]/30 transition-all"
              >
                <img src={src} alt={`${label} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove photo ${i + 1}`}
                  className="absolute -top-1.5 -right-1.5 p-1.5 bg-[#191919] hover:bg-[#B23A48] text-white rounded-full cursor-pointer border-none shadow-md transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightbox !== null && images[lightbox] && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <button onClick={() => setLightbox(null)} aria-label="Close preview"
                className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer border-none">
                <X className="w-5 h-5 text-white" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }}
                    aria-label="Previous photo"
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer border-none">
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }}
                    aria-label="Next photo"
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer border-none">
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              <motion.img
                key={lightbox}
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                onClick={e => e.stopPropagation()}
                src={images[lightbox]}
                alt={`${label} ${lightbox + 1}`}
                className="max-h-[82vh] max-w-[92vw] object-contain rounded-[24px] shadow-2xl"
              />

              <div className="absolute bottom-6 px-4 py-2 bg-white/10 rounded-full text-white text-[12px] font-bold">
                {label} · {lightbox + 1} / {images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default EvidenceGallery;
