import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { LANDING_IMAGES, LANDING_ROBOTS, LANDING_NOTES } from '../data/landingImages';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenVideoModal: () => void;
}

/**
 * Первый экран: слева текст и два действия, справа — дашборд, перед ним
 * фигура.
 *
 * Карточек-уведомлений в коде нет намеренно: они уже нарисованы на самой
 * картинке дашборда. Свои поверх давали дубли — два «платежа» и две
 * «заявки» на одном экране.
 */

export const Hero: React.FC<HeroProps> = ({ onOpenDemoModal, onOpenVideoModal }) => (
  <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden z-10">
    {/* Мягкое свечение за композицией — как в макете */}
    <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Слева: заголовок и действия */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <div className="text-[11px] sm:text-xs font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-4">
            Надёжная платформа для операторов связи
          </div>

          <h1 className="text-[2rem] sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5">
            Весь оператор связи —{' '}
            <span className="text-emerald-600 dark:text-emerald-400">в одной системе</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Биллинг, сеть, CRM, поддержка, СОРМ, документы и помощник — на единой клиентской
            базе, на вашем сервере. Без зоопарка отдельных сервисов.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              id="hero-demo-cta"
              onClick={onOpenDemoModal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Получить демо</span>
              <ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
            </button>

            <button
              id="hero-video-cta"
              onClick={onOpenVideoModal}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" aria-hidden="true" />
              </span>
              <span>Посмотреть систему</span>
            </button>
          </div>
        </div>

        {/* Справа: дашборд под углом, фигура и уведомления */}
        <div className="lg:col-span-7 relative">
          <div className="relative mx-auto max-w-[640px] lg:max-w-none">
            {/* Дашборд повёрнут в перспективе — приём из макета.
                На узких экранах поворот убираем: там он только мельчит текст. */}
            <img
              src={LANDING_IMAGES.dashboard.src}
              width={LANDING_IMAGES.dashboard.width}
              height={LANDING_IMAGES.dashboard.height}
              alt={LANDING_IMAGES.dashboard.alt}
              fetchPriority="high"
              className="relative z-10 w-full h-auto rounded-2xl shadow-2xl lg:[transform:perspective(1600px)_rotateY(-14deg)_rotateX(3deg)]"
            />

            {/* Неоновая подпись — только в тёмной теме: светлый неон на белом
                фоне почти не виден, в макете он и был на тёмном. */}
            <img
              src={LANDING_NOTES.platform.src}
              alt={LANDING_NOTES.platform.alt}
              loading="lazy"
              className="hidden dark:xl:block absolute z-30 -top-16 right-[-6%] w-[190px] h-auto pointer-events-none select-none"
            />

            {/* Фигура — перед экраном, правым краем выходит за него */}
            <img
              src={LANDING_ROBOTS.girlPoint.src}
              width={LANDING_ROBOTS.girlPoint.width}
              height={LANDING_ROBOTS.girlPoint.height}
              alt=""
              aria-hidden="true"
              className="hidden xl:block absolute z-20 -right-28 -bottom-14 w-[185px] h-auto pointer-events-none select-none drop-shadow-2xl"
            />

          </div>
        </div>
      </div>
    </div>
  </section>
);
