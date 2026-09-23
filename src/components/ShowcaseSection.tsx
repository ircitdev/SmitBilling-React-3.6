import React from 'react';
import { Check } from 'lucide-react';
import type { LandingImage } from '../data/landingImages';

/**
 * Секция «картинка + тезисы»: карта сети, AI, СОРМ и безопасность
 * устроены одинаково, поэтому это один компонент, а не три копии.
 * Картинка и текст меняются местами (`flip`), чтобы страница не была
 * однообразной.
 */

interface ShowcaseSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  image: LandingImage;
  /** true — картинка слева, текст справа. */
  flip?: boolean;
  /** Тёмная подложка: так секции карты и безопасности отделяются от соседних. */
  dark?: boolean;
  /** Фоновая текстура секции — уходит под затемнение, читаемости не мешает. */
  backdrop?: string;
  /** Фигура-маскот сбоку. Прячется на узких экранах: там важнее текст. */
  robot?: LandingImage;
}

export const ShowcaseSection: React.FC<ShowcaseSectionProps> = ({
  id,
  eyebrow,
  title,
  lead,
  points,
  image,
  flip = false,
  dark = false,
  backdrop,
  robot,
}) => (
  <section
    id={id}
    className={`relative py-14 sm:py-24 z-10 overflow-hidden ${
      dark ? 'bg-slate-900 dark:bg-slate-950/60' : ''
    }`}
  >
    {backdrop && (
      <>
        <img
          src={backdrop}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none select-none"
        />
        {/* Затемнение поверх фона: без него текст на светлых участках теряется */}
        <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
      </>
    )}

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div className={flip ? 'lg:order-2' : ''}>
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
              dark
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {eyebrow}
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${
              dark ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-base sm:text-lg mb-6 ${
              dark ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {lead}
          </p>
          <ul className="space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="w-5 h-5 mt-0.5 rounded-md bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
                <span
                  className={`text-sm sm:text-[15px] ${
                    dark ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`relative ${flip ? 'lg:order-1' : ''}`}>
          {robot && (
            <img
              src={robot.src}
              width={robot.width}
              height={robot.height}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`hidden xl:block absolute z-20 -bottom-10 w-[34%] max-w-[230px] h-auto pointer-events-none select-none drop-shadow-2xl ${
                flip ? '-left-16' : '-right-16'
              }`}
            />
          )}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950">
            <img
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);
