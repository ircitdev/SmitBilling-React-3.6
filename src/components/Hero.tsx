import React from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Play } from 'lucide-react';
import { LANDING_IMAGES, LANDING_ROBOTS } from '../data/landingImages';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenVideoModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenDemoModal,
  onOpenAiDrawer,
  onOpenVideoModal,
}) => {

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden z-10">
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Version & Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Релиз 3.7: Python 3.11 · FreeRADIUS 3.2 · СОРМ-3 · AI-агент</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
              Весь оператор связи —{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                в одной системе
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
              Биллинг, сеть, CRM, поддержка, СОРМ, документы и помощник — на единой клиентской
              базе, на вашем сервере. Без зоопарка отдельных сервисов, между которыми данные
              переносят руками.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                id="hero-demo-cta"
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/35 transition-all cursor-pointer"
              >
                <span>Запросить демо-стенд</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-video-cta"
                onClick={onOpenVideoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Видеообзор (3 мин)</span>
              </button>

              <button
                id="hero-ai-cta"
                onClick={onOpenAiDrawer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Спросить AI</span>
              </button>
            </div>

            {/* Quick Guarantees / Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Перенос базы за 1 день</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Развёртывание в Docker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Без роялти за абонента</span>
              </div>
            </div>
          </div>

          {/* Справа: дашборд и робот — композиция из макета.
              Фигура вынесена за пределы текстовой колонки и на узких
              экранах прячется: там она только отнимала бы место у сути. */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent rounded-[2rem] blur-2xl pointer-events-none" />

            <div className="relative">
              <img
                src={LANDING_IMAGES.dashboard.src}
                width={LANDING_IMAGES.dashboard.width}
                height={LANDING_IMAGES.dashboard.height}
                alt={LANDING_IMAGES.dashboard.alt}
                fetchPriority="high"
                className="relative z-10 w-full h-auto drop-shadow-2xl"
              />

              {/* Робот стоит рядом с экраном, заходя за его правый край */}
              <img
                src={LANDING_ROBOTS.girlPoint.src}
                width={LANDING_ROBOTS.girlPoint.width}
                height={LANDING_ROBOTS.girlPoint.height}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="hidden xl:block absolute z-20 -right-16 -bottom-8 w-[46%] max-w-[300px] h-auto pointer-events-none select-none drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
