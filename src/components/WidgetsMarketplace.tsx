import React, { useState } from 'react';
import {
  Boxes,
  Tag,
  DownloadCloud,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { WIDGETS_DATA } from '../data/landingData';
import { WidgetItem } from '../types';

export const WidgetsMarketplace: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [activeWidget, setActiveWidget] = useState<WidgetItem | null>(null);

  const categories = [
    { id: 'all', label: 'Все виджеты' },
    { id: 'crm', label: 'CRM · Продажи' },
    { id: 'support', label: 'Поддержка' },
    { id: 'analytics', label: 'Аналитика' },
  ];

  const filteredWidgets = selectedCat === 'all'
    ? WIDGETS_DATA
    : WIDGETS_DATA.filter((w) => w.cat === selectedCat);

  return (
    <section id="widgets" className="py-14 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Boxes className="w-3.5 h-3.5" />
            <span>Маркетплейс расширений</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Готовые виджеты для amoCRM и панели биллинга
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Расширяйте функционал под ваши бизнес-процессы в один клик: автосделки по геолокации, сводки чат-ботов, аналитика воронок и Telegram-рассылки.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid of Widget Cards */}
        <div className="m-scroll flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
          {filteredWidgets.map((widget) => (
            <div
              key={widget.id}
              onClick={() => setActiveWidget(widget)}
              className="group shrink-0 w-[85%] sm:w-auto snap-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Widget Cover Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                <img
                  src={widget.cover || widget.image || widget.shots?.[0]}
                  alt={widget.title || widget.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-emerald-400 font-mono text-xs font-bold">
                  {widget.version}
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs font-medium">
                  {widget.catName}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-2">
                    {widget.title || widget.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {widget.shortDesc || widget.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {widget.developer}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Подробнее</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget Detail Modal */}
      {activeWidget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setActiveWidget(null)} />

          <div className="relative w-full max-w-2xl h-[100dvh] sm:h-auto rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-3 pb-8 sm:p-8 shadow-2xl overflow-y-auto overscroll-contain max-h-[100dvh] sm:max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveWidget(null)}
              aria-label="Закрыть"
              className="sticky sm:absolute top-0 sm:top-5 sm:right-5 z-20 ml-auto mb-1 sm:m-0 flex w-11 h-11 sm:w-auto sm:h-auto items-center justify-center p-2 rounded-xl bg-white/95 dark:bg-slate-900/95 sm:bg-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <img
                  src={activeWidget.cover || activeWidget.image || activeWidget.shots?.[0]}
                  alt={activeWidget.title || activeWidget.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {activeWidget.catName}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {activeWidget.version}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {activeWidget.title || activeWidget.name}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {activeWidget.fullDesc || activeWidget.desc}
            </p>

            {/* Features list */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Ключевые возможности виджета
              </h4>
              <ul className="space-y-2.5">
                {activeWidget.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How it works */}
            {(activeWidget.howItWorks || (activeWidget.how && activeWidget.how.length > 0)) && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Принцип работы
                </h4>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  {Array.isArray(activeWidget.howItWorks) ? (
                    activeWidget.howItWorks.map((h, i) => <p key={i}>{h}</p>)
                  ) : activeWidget.howItWorks ? (
                    <p>{activeWidget.howItWorks}</p>
                  ) : (
                    activeWidget.how?.map((h, i) => <p key={i}>• {h}</p>)
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Разработчик: {activeWidget.developer}
              </span>
              <button
                onClick={() => setActiveWidget(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
