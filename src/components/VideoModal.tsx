import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo.mp4',
  posterUrl = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo-poster.jpg',
  title = 'СмИТ Биллинг 3.7 — Видеопрезентация платформы',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Auto play on open
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // autoplay might be blocked
        });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="video-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Window */}
      <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 text-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs sm:text-sm font-semibold text-slate-300 ml-1.5 truncate">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть видео"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            preload="none"
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};
