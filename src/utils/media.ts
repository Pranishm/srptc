/**
 * Image capture / compression helpers.
 *
 * Evidence photos are persisted inside localStorage (see utils/db.ts), so every
 * image is downscaled and re-encoded to JPEG before it is stored. Raw camera
 * frames are several megabytes each and would blow the ~5MB storage quota after
 * one or two reports.
 */

export const MAX_EVIDENCE_PER_ISSUE = 4;

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.72;

/** Browser can open a live camera stream (needs https or localhost). */
export const isCameraSupported = (): boolean =>
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read that image file.'));
    img.src = src;
  });

const scaledSize = (width: number, height: number) => {
  const largest = Math.max(width, height);
  if (largest <= MAX_DIMENSION) return { width, height };
  const ratio = MAX_DIMENSION / largest;
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
};

const drawToDataUrl = (
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  quality: number
): string => {
  const { width, height } = scaledSize(sourceWidth, sourceHeight);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');

  ctx.drawImage(source, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
};

/** Compress a picked file into a storable base64 JPEG data URL. */
export const fileToEvidenceDataUrl = async (
  file: File,
  quality = JPEG_QUALITY
): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files can be attached as evidence.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    return drawToDataUrl(img, img.naturalWidth, img.naturalHeight, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

/** Grab the current frame of a live <video> element as a storable data URL. */
export const videoFrameToEvidenceDataUrl = (
  video: HTMLVideoElement,
  quality = JPEG_QUALITY
): string => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  if (!width || !height) {
    throw new Error('Camera is still warming up — try again in a moment.');
  }
  return drawToDataUrl(video, width, height, quality);
};

/** Approximate on-disk size of a base64 data URL, for the UI hint. */
export const dataUrlSizeLabel = (dataUrl: string): string => {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const bytes = Math.round((base64.length * 3) / 4);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Friendly text for the various getUserMedia failures. */
export const describeCameraError = (err: unknown): string => {
  const name = (err as { name?: string })?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Camera permission was blocked. Allow camera access in your browser settings, or upload a photo instead.';
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return 'No camera was found on this device. You can still upload a photo from your gallery.';
  }
  if (name === 'NotReadableError') {
    return 'The camera is already in use by another app. Close it and try again.';
  }
  return 'Camera could not be started here. Upload a photo instead.';
};
