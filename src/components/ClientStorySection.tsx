import React from 'react';
import {
  ArrowRight,
  Wallet,
  Wifi,
  Router,
  Phone,
  Briefcase,
  Headphones,
  FileText,
  History,
} from 'lucide-react';
import { LANDING_IMAGES } from '../data/landingImages';

/**
 * «Один клиент. Одна история.» — по макету: слева текст, справа карточка
 * абонента, а по бокам от неё плитки с тем, что к нему привязано.
 *
 * Плитки стоят двумя колонками вокруг карточки на широких экранах и
 * уходят в сетку под ней на узких — иначе они сжались бы до нечитаемых.
 */

const LEFT = [
  { icon: Wallet, label: 'Платежи' },
  { icon: Wifi, label: 'Тарифы' },
  { icon: Router, label: 'Оборудование' },
  { icon: Phone, label: 'Звонки' },
];

const RIGHT = [
  { icon: Briefcase, label: 'CRM' },
  { icon: Headphones, label: 'Обращения' },
  { icon: FileText, label: 'Документы' },
  { icon: History, label: 'История' },
];

const Tile: React.FC<{ icon: React.ElementType; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4" aria-hidden="true" />
    </span>
    <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{label}</span>
  </div>
);

export const ClientStorySection: React.FC = () => (
  <section id="client-story" className="relative py-14 sm:py-24 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Слева: заголовок и пояснение */}
        <div className="lg:col-span-4">
          <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400 mb-3">
            Одна платформа — весь клиент
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
            Один клиент.
            <br />
            Одна история.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mb-6">
            Все данные клиента в одном месте: платежи, тарифы, оборудование, обращения,
            документы и история событий. Не нужно искать по разным программам и сверять,
            где сведения свежее.
          </p>
          <a
            href="#modules"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:gap-2.5 transition-all"
          >
            Узнать больше
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Справа: карточка абонента между двумя колонками плиток */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 lg:grid-cols-[auto_1fr_auto] gap-3 lg:gap-4 items-center">
            <div className="flex flex-col gap-3 lg:w-[150px]">
              {LEFT.map((t) => (
                <Tile key={t.label} {...t} />
              ))}
            </div>

            {/* Карточка идёт первой в потоке на узких экранах: она главная */}
            <div className="order-first col-span-2 lg:order-none lg:col-span-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900">
              <img
                src={LANDING_IMAGES.clientStory.src}
                width={LANDING_IMAGES.clientStory.width}
                height={LANDING_IMAGES.clientStory.height}
                alt={LANDING_IMAGES.clientStory.alt}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>

            <div className="flex flex-col gap-3 lg:w-[150px]">
              {RIGHT.map((t) => (
                <Tile key={t.label} {...t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
