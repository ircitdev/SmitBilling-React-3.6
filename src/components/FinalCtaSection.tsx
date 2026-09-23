import React from 'react';
import { ArrowRight } from 'lucide-react';
import { LANDING_BACKDROPS, LANDING_ROBOTS, LANDING_NOTES } from '../data/landingImages';

/**
 * Финальный призыв: последнее, что видит читатель перед подвалом.
 * Два действия — посмотреть систему и обсудить переезд: к этому месту
 * страницы человек обычно уже знает, что ему ближе.
 */

interface FinalCtaSectionProps {
  onOpenDemoModal: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onOpenDemoModal }) => (
  <section id="final-cta" className="relative z-10 overflow-hidden bg-slate-950">
    <img
      src={LANDING_BACKDROPS.city}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950 pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="flex items-end justify-center gap-6">
        {/* Фигуры по краям — только на широких экранах: на узких они
            отбирают место у заголовка и кнопок. */}
        <div className="hidden xl:block relative flex-shrink-0 w-[210px]">
          <img
            src={LANDING_NOTES.growth.src}
            alt={LANDING_NOTES.growth.alt}
            loading="lazy"
            className="absolute -top-24 left-0 w-[190px] h-auto opacity-90 pointer-events-none select-none"
          />
          <img
            src={LANDING_ROBOTS.girlPoint.src}
            width={LANDING_ROBOTS.girlPoint.width}
            height={LANDING_ROBOTS.girlPoint.height}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-auto drop-shadow-2xl pointer-events-none select-none"
          />
        </div>

        <div className="text-center max-w-2xl py-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Одна команда. Одна система.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8">
            Покажем систему на вашей задаче: возьмём процесс вашего оператора и пройдём его
            так, как он будет выглядеть после перехода.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenDemoModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
            >
              <span>Получить демо</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <a
              href="#migrate"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
            >
              Обсудить переезд
            </a>
          </div>
        </div>

        <div className="hidden xl:block relative flex-shrink-0 w-[210px]">
          <img
            src={LANDING_NOTES.support.src}
            alt={LANDING_NOTES.support.alt}
            loading="lazy"
            className="absolute -top-24 right-0 w-[190px] h-auto opacity-90 pointer-events-none select-none"
          />
          <img
            src={LANDING_ROBOTS.boyThumb.src}
            width={LANDING_ROBOTS.boyThumb.width}
            height={LANDING_ROBOTS.boyThumb.height}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full h-auto drop-shadow-2xl pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  </section>
);
