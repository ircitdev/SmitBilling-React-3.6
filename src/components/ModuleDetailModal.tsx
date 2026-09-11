import React, { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  Layers,
  ArrowRight,
  Shield,
  Clock,
  ExternalLink,
  GitBranch,
  Play,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';
import { BillingModule, ScreenshotItem } from '../types';

interface ModuleDetailModalProps {
  module: BillingModule | null;
  onClose: () => void;
  onSelectModuleForDemo: (moduleName: string) => void;
}

export const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
  module,
  onClose,
  onSelectModuleForDemo,
}) => {
  const [selectedShot, setSelectedShot] = useState<ScreenshotItem | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedShot) {
          setSelectedShot(null);
        } else {
          onClose();
        }
      }
    };
    if (module) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [module, onClose, selectedShot]);

  if (!module) return null;

  return (
    <div
      id="module-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-module-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl my-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Module Cover Image Banner (if exists) */}
        {module.img && (
          <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-slate-950 flex-shrink-0 border-b border-slate-800">
            <img
              src={module.img}
              alt={module.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />

            {/* Top close button inside banner */}
            <button
              onClick={onClose}
              aria-label="Закрыть окно"
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/60 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner bottom info */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white shadow-sm">
                    {module.categoryName}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                    {module.version}
                  </span>
                  {module.isCore && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold">
                      Базовый модуль
                    </span>
                  )}
                </div>
                <h3
                  id="modal-module-title"
                  className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md"
                >
                  {module.name}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Header if no banner */}
        {!module.img && (
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-4 flex-shrink-0">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {module.categoryName}
                  </span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {module.version}
                  </span>
                  {module.isCore && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Базовый модуль
                    </span>
                  )}
                </div>
                <h3
                  id="modal-module-title"
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
                >
                  {module.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Закрыть окно"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Authentic Training Video (if module has video) */}
          {module.video && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-black p-2 sm:p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2 px-1 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Обучающее видео по модулю</span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <video
                  controls
                  playsInline
                  poster={module.vposter || module.img}
                  className="w-full h-full object-contain"
                >
                  <source src={module.video} type="video/mp4" />
                  Ваш браузер не поддерживает видео.
                </video>
              </div>
            </div>
          )}

          {/* Overview */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
              Назначение модуля
            </h4>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {module.fullDesc}
            </p>
          </div>

          {/* Module Screenshots (if present) */}
          {module.shots && module.shots.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Скриншоты интерфейса модуля ({module.shots.length})</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {module.shots.map((shot, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedShot(shot)}
                    className="group relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 aspect-[16/10] cursor-pointer hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-md"
                  >
                    <img
                      src={shot.src}
                      alt={shot.cap}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-xs text-white font-medium line-clamp-1">
                        {shot.cap}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included Plans */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5">
              Доступен в тарифных планах
            </h4>
            <div className="flex flex-wrap gap-2">
              {module.plans.map((plan, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {plan}
                </span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          {module.features.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-3">
                Ключевые функциональные возможности
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {module.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works */}
          {module.howItWorks.length > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400">
                Принцип работы в системе
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {module.howItWorks.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Version Changelog (if exists) */}
          {module.history && module.history.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5">
                История обновлений
              </h4>
              <div className="space-y-2">
                {module.history.map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-1">
                      <GitBranch className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Версия {hist.version}</span>
                      <span className="text-slate-400 font-normal">({hist.date})</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 pl-5">
                      {hist.changelog}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Входит в пакет обновлений и технической поддержки
          </div>
          <button
            onClick={() => {
              onClose();
              onSelectModuleForDemo(module.name);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
          >
            <span>Попробовать модуль в демо</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Shot Lightbox */}
      {selectedShot && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
            <span className="text-sm font-semibold truncate pr-4">{selectedShot.cap}</span>
            <button
              onClick={() => setSelectedShot(null)}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={selectedShot.src}
              alt={selectedShot.cap}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
