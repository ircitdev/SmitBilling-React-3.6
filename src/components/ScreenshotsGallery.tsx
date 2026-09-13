import React, { useState } from 'react';
import {
  Monitor,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  X,
} from 'lucide-react';
import { GALLERY_SHOTS } from '../data/landingData';
import { ScreenshotItem } from '../types';

export const ScreenshotsGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'admin' | 'reports' | 'settings'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const filteredShots = selectedCategory === 'all'
    ? GALLERY_SHOTS
    : GALLERY_SHOTS.filter((shot) => shot.cat === selectedCategory);

  const safeIndex = Math.min(currentIndex, filteredShots.length - 1);
  const activeShot: ScreenshotItem = filteredShots[safeIndex] || GALLERY_SHOTS[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredShots.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredShots.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="screenshots" className="py-14 sm:py-28 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Monitor className="w-3.5 h-3.5" />
            <span>Интерфейс системы</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Живые скриншоты панели управления
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Посмотрите, как выглядит реальная рабочая среда оператора связи: от дашборда до карточки абонента, SQL-конструктора и журналов аудита.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'Все разделы' },
            { id: 'admin', label: 'Админ-панель и абоненты' },
            { id: 'reports', label: 'Отчёты и финансы' },
            { id: 'settings', label: 'Настройки и интеграции' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id as any);
                setCurrentIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Big Browser Showcase Window */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden mb-8">
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="hidden sm:flex items-center gap-2 ml-3 px-3 py-1 rounded-md bg-white dark:bg-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700">
                <span className="text-emerald-500 font-bold">https://</span>
                <span>billing.isp-network.ru/admin/</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {safeIndex + 1} из {filteredShots.length}
              </span>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Увеличить на весь экран"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Во весь экран</span>
              </button>
            </div>
          </div>

          {/* Active Image Viewer */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 flex items-center justify-center group overflow-hidden">
            <img
              src={activeShot.src}
              alt={activeShot.label}
              className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
              onClick={() => setIsLightboxOpen(true)}
              loading="lazy"
            />

            {/* Prev / Next Overlay Buttons */}
            <button
              onClick={handlePrev}
              aria-label="Предыдущий скриншот"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-85 hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Следующий скриншот"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/75 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-85 hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom Caption Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90%] px-4 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-white text-xs sm:text-sm font-medium text-center shadow-lg pointer-events-none">
              {activeShot.label}
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel Strip */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {filteredShots.map((shot, idx) => (
            <button
              key={shot.src}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-32 sm:w-40 aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === safeIndex
                  ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/20'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={shot.src}
                alt={shot.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                <span className="text-[10px] text-white font-medium truncate w-full">
                  {shot.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col p-4 sm:p-8 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between text-white pb-4 border-b border-slate-800">
            <span className="text-sm sm:text-base font-semibold truncate pr-4">
              {activeShot.label}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center py-4 overflow-hidden">
            <img
              src={activeShot.src}
              alt={activeShot.label}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />

            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
