import React from 'react';
import { Quote } from 'lucide-react';
import { LANDING_IMAGES } from '../data/landingImages';

/**
 * Кейс перехода: цифры и слова техдиректора вместо общих обещаний.
 * Стоит после блока миграции — сначала объясняем, как переносим,
 * потом показываем, что это уже сделано.
 */

const NUMBERS = [
  { value: '12 000', label: 'абонентов перенесли' },
  { value: '3 месяца', label: 'от аудита до запуска' },
  { value: '−70%', label: 'ручной работы' },
];

export const CaseStudySection: React.FC = () => (
  <section id="case" className="relative py-14 sm:py-24 z-10">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <img
          src={LANDING_IMAGES.caseStudy.src}
          width={LANDING_IMAGES.caseStudy.width}
          height={LANDING_IMAGES.caseStudy.height}
          alt={LANDING_IMAGES.caseStudy.alt}
          loading="lazy"
          className="w-full h-auto"
        />

        <div className="p-6 sm:p-10">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-5">
            Переход состоялся
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-8">
            {NUMBERS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-none mb-1.5">
                  {value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{label}</div>
              </div>
            ))}
          </div>

          <figure className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <Quote className="w-6 h-6 text-emerald-500/60 mb-3" aria-hidden="true" />
            <blockquote className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
              Больше всего боялись переезда базы: у нас десять лет истории, договоры и остатки.
              Перенесли за выходные, в понедельник абоненты этого не заметили.
            </blockquote>
            <figcaption className="text-sm text-slate-500">
              Технический директор оператора связи
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
);
