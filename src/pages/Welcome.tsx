import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { LANGUAGES, getCurrentLanguage, setCurrentLanguage, t, type Language } from '../utils/i18n';

const BoomerangVideoBg = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<ImageBitmap[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const framesRef = useRef<ImageBitmap[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastTime = -1;
    let captureRaf: number;

    const captureFrame = () => {
      if (video.ended) {
        setIsVideoPlaying(false);
        setFrames([...framesRef.current]);
        return;
      }

      if (video.currentTime !== lastTime && video.videoWidth > 0) {
        lastTime = video.currentTime;
        const width = 960;
        const height = (video.videoHeight / video.videoWidth) * width;

        createImageBitmap(video, { resizeWidth: width, resizeHeight: height })
          .then(bitmap => {
            framesRef.current.push(bitmap);
          })
          .catch(() => {});
      }

      if ('requestVideoFrameCallback' in video) {
        (video as any).requestVideoFrameCallback(captureFrame);
      } else {
        captureRaf = requestAnimationFrame(captureFrame);
      }
    };

    video.addEventListener('play', () => {
      if ('requestVideoFrameCallback' in video) {
        (video as any).requestVideoFrameCallback(captureFrame);
      } else {
        captureFrame();
      }
    }, { once: true });

    return () => cancelAnimationFrame(captureRaf);
  }, []);

  useEffect(() => {
    if (isVideoPlaying || frames.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    let frameIdx = 0;
    let direction = 1;
    const playbackInterval = setInterval(() => {
      ctx.drawImage(frames[frameIdx], 0, 0);

      frameIdx += direction;
      if (frameIdx >= frames.length - 1) {
        direction = -1;
        frameIdx = frames.length - 1;
      } else if (frameIdx <= 0) {
        direction = 1;
        frameIdx = 0;
      }
    }, 1000 / 30);

    return () => clearInterval(playbackInterval);
  }, [isVideoPlaying, frames]);

  return (
    <div className="absolute inset-0 z-0 scale-[1.15] origin-top overflow-hidden bg-gray-100">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4"
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        autoPlay
        className={clsx("w-full h-full object-cover object-top", !isVideoPlaying && "hidden")}
      />
      <canvas
        ref={canvasRef}
        className={clsx("w-full h-full object-cover object-top", isVideoPlaying && "hidden")}
      />
    </div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [currentLang, setLangState] = useState<Language>(getCurrentLanguage());

  // Listen for language changes
  useEffect(() => {
    const handleLangChange = () => setLangState(getCurrentLanguage());
    window.addEventListener('civx_lang_change', handleLangChange);
    return () => window.removeEventListener('civx_lang_change', handleLangChange);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/login');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans antialiased text-[#191919] relative">
      <BoomerangVideoBg />

      {/* Language Switcher in Welcome Page */}
      <div className="absolute top-6 right-6 z-30 flex items-center bg-white/85 backdrop-blur-md shadow-sm rounded-full px-3 py-1.5 border border-black/[0.06] text-[12px] font-bold text-[#191919] hover:scale-[1.01] transition-transform">
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

      <AnimatePresence>
        {!isExiting && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center overflow-hidden h-screen"
          >
            {/* Hero Copy Block */}
            <div className="pt-28 sm:pt-32 md:pt-40 px-4 sm:px-6 text-center w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
              <h1 
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal"
                style={{ fontFamily: '"P22 Mackinac W01 Book", Georgia, serif' }}
              >
                {t('welcomeTitle', currentLang)}
              </h1>
              <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed font-sans font-bold">
                {t('welcomeSub', currentLang)}
              </p>
              <button
                onClick={handleEnter}
                className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] hover:bg-[#191919]/95 text-white text-sm font-bold rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 group shadow-lg hover:scale-[1.02] border-none"
              >
                <span>{t('enterCivix', currentLang)}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Info Panel */}
            <div className="mt-auto w-full max-w-5xl px-4 sm:px-6">
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm rounded-t-[32px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16 pb-6 sm:pb-8">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-bold">{t('whatDoWeDo', currentLang)}</div>
                    <h2 
                      className="mt-3 text-2xl sm:text-3xl md:text-4xl font-normal leading-tight tracking-tight text-[#191919]"
                      style={{ fontFamily: '"P22 Mackinac W01 Book", Georgia, serif' }}
                    >
                      {t('intelligentReporting', currentLang)}
                    </h2>
                  </div>
                  <div className="flex items-end">
                    <p className="text-sm md:text-[15px] text-[#191919]/70 leading-relaxed font-bold">
                      {t('turnsComplaints', currentLang)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full"></div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 py-6">
                  {[
                    { num: '01', nameKey: 'report' },
                    { num: '02', nameKey: 'prioritize' },
                    { num: '03', nameKey: 'resolve' }
                  ].map((item) => (
                    <div
                      key={item.num}
                      onClick={handleEnter}
                      className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between rounded-xl hover:pl-6"
                    >
                      <div className="flex items-center">
                        <span className="text-[#191919]/40 font-bold tracking-wide text-sm">{item.num}</span>
                        <span className="mx-2 text-[#191919]/30">/</span>
                        <span className="font-bold text-[#191919] text-sm">{t(item.nameKey, currentLang)}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Welcome;
