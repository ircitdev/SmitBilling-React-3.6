import React from 'react';
import { ArrowRight, Play, Check, Wallet, FileText } from 'lucide-react';
import { LANDING_IMAGES, LANDING_ROBOTS, LANDING_NOTES } from '../data/landingImages';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenVideoModal: () => void;
}

/**
 * Первый экран по макету: слева текст и два действия, справа — дашборд
 * под углом, перед ним фигура, вокруг парят карточки-уведомления.
 *
 * Карточки набраны текстом, а не взяты картинкой: так они читаются
 * экранным диктором, ищутся по странице и не мылятся на плотных экранах.
 */

/** Карточки-уведомления вокруг дашборда. */
const NOTIFICATIONS = [
  {
    icon: Wallet,
    title: 'Платёж получен',
    lines: ['+1 250 ₽ · Л/с 110301'],
    // положение подобрано так, чтобы не перекрывать KPI на дашборде
    className: 'left-[-6%] top-[14%]',
    tone: 'emerald' as const,
  },
  {
    icon: FileText,
    title: 'Новая заявка',
    lines: ['ул. Лесная, 12 · Подключение'],
    className: 'right-[-4%] top-[42%]',
    tone: 'slate' as const,
  },
  {
    icon: Check,
    title: 'Сеть в норме',
    lines: ['248 узлов · без аварий'],
    className: 'left-[2%] bottom-[8%]',
    tone: 'emerald' as const,
  },
];

export const Hero: React.FC<HeroProps> = ({ onOpenDemoModal, onOpenVideoModal }) => (
  <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden z-10">
    {/* Мягкое свечение за композицией — как в макете */}
    <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
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

            {/* Неоновая подпись над экраном — как в макете */}
            <img
              src={LANDING_NOTES.platform.src}
              alt={LANDING_NOTES.platform.alt}
              loading="lazy"
              className="hidden xl:block absolute z-30 -top-20 right-[6%] w-[200px] h-auto pointer-events-none select-none"
            />

            {/* Фигура — перед экраном, правым краем выходит за него */}
            <img
              src={LANDING_ROBOTS.girlPoint.src}
              width={LANDING_ROBOTS.girlPoint.width}
              height={LANDING_ROBOTS.girlPoint.height}
              alt=""
              aria-hidden="true"
              className="hidden lg:block absolute z-20 right-[-8%] bottom-[-12%] w-[42%] max-w-[320px] h-auto pointer-events-none select-none drop-shadow-2xl"
            />

            {/* Уведомления вокруг — показывают, что система живёт */}
            {NOTIFICATIONS.map(({ icon: Icon, title, lines, className, tone }) => (
              <div
                key={title}
                className={`hidden md:flex absolute z-30 items-start gap-2.5 max-w-[215px] px-3.5 py-2.5 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-xl ${className}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tone === 'emerald'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-500/15 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    {title}
                  </span>
                  {lines.map((l) => (
                    <span key={l} className="block text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {l}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
