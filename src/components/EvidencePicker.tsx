import { useRef, useState } from 'react';
import { Camera, Upload, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import EvidenceGallery from './EvidenceGallery';
import { fileToEvidenceDataUrl, MAX_EVIDENCE_PER_ISSUE } from '../utils/media';

interface EvidencePickerProps {
  images: string[];
  onChange: (next: string[]) => void;
  max?: number;
  label?: string;
  tone?: 'report' | 'resolution';
  cameraTitle?: string;
  cameraHint?: string;
  /** Renders the two buttons side by side at a smaller scale. */
  compact?: boolean;
}

/**
 * "Take photo (camera) + upload" evidence input. Photos are stored as
 * compressed base64 JPEGs so they survive a reload and stay visible to the
 * technician and the admin.
 */
export const EvidencePicker = ({
  images,
  onChange,
  max = MAX_EVIDENCE_PER_ISSUE,
  label = 'Photo Evidence',
  tone = 'report',
  compact = false,
}: EvidencePickerProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const full = images.length >= max;
  const remaining = max - images.length;

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;

    const accepted = files.slice(0, remaining);
    if (files.length > accepted.length) setError(`Only ${max} photos can be attached — extras were skipped.`);

    try {
      const encoded = await Promise.all(accepted.map(f => fileToEvidenceDataUrl(f)));
      onChange([...images, ...encoded]);
      if (files.length <= accepted.length) setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read those photos.');
    }
  };

  const removeAt = (index: number) => {
    setError(null);
    onChange(images.filter((_, i) => i !== index));
  };

  const btn = compact ? 'py-2.5 px-4 text-[12.5px]' : 'py-3.5 px-5 text-[13.5px]';

  return (
    <div className="space-y-3.5">
      <EvidenceGallery
        images={images}
        label={label}
        tone={tone}
        onRemove={removeAt}
        emptyText="No photo yet — take one with your camera or upload from the gallery."
      />

      <div className="flex flex-wrap gap-2.5">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFiles} />

        <button
          type="button"
          onClick={() => { setError(null); cameraRef.current?.click(); }}
          disabled={full}
          className={clsx(
            'flex items-center gap-2 rounded-full font-bold text-white cursor-pointer border-none shadow-sm transition-all',
            btn,
            full ? 'bg-[#0B3C73]/35 cursor-not-allowed' : 'bg-[#0B3C73] hover:bg-black hover:scale-[1.01]'
          )}
        >
          <Camera className="w-4 h-4" /> Take photo
        </button>

        <button
          type="button"
          onClick={() => { setError(null); fileRef.current?.click(); }}
          disabled={full}
          className={clsx(
            'flex items-center gap-2 rounded-full font-bold cursor-pointer border border-black/[0.08] transition-all',
            btn,
            full ? 'bg-[#F4F4F3] text-[#191919]/30 cursor-not-allowed' : 'bg-white text-[#191919] hover:bg-[#F4F4F3]'
          )}
        >
          <Upload className="w-4 h-4" /> Upload
        </button>

        <span className="flex items-center text-[11.5px] font-bold text-[#191919]/40 px-1">
          {images.length}/{max} attached
        </span>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#B23A48]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
};

export default EvidencePicker;
