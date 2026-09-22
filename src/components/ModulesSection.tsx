import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Layers, ArrowUpRight, Play, Image as ImageIcon, Check } from 'lucide-react';
import { BILLING_MODULES } from '../data/modulesData';
import { loadModules } from '../data/modulesCatalog';
import { BillingModule, CategoryId } from '../types';

interface ModulesSectionProps {
  onOpenModuleModal: (module: BillingModule) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ onOpenModuleModal }) => {
  // Содержание каталога ведётся на сервере лицензий; до ответа показываем
  // локальный снимок, чтобы раздел не был пустым.
  const [modules, setModules] = useState<BillingModule[]>(BILLING_MODULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  // на телефоне 24 карточки — это 9 экранов; показываем первые, остальные по кнопке
  const [showAll, setShowAll] = useState(false);
  const MOBILE_LIMIT = 8;

  const categories: Array<{ id: CategoryId; label: string }> = [
    { id: 'all', label: 'Все модули' },
    { id: 'core', label: 'Ядро' },
    { id: 'network', label: 'Сеть и RADIUS' },
    { id: 'crm', label: 'Продажи и CRM' },
    { id: 'comms', label: 'Связь и Поддержка' },
    { id: 'finance', label: 'Финансы' },
    { id: 'gov', label: 'Госрегулирование' },
    { id: 'media', label: 'Медиа и ТВ' },
    { id: 'platform', label: 'Платформа' },
    { id: 'operations', label: 'Эксплуатация' },
  ];

  // Каталог загружен (или попытка провалилась) — до этого момента карточку
  // по ссылке не открываем: иначе она покажет локальный снимок без
  // разработчика и свежей версии.
  const [catalogReady, setCatalogReady] = useState(false);
  useEffect(() => {
    const ac = new AbortController();
    loadModules(ac.signal)
      .then(setModules)
      .catch(() => {
        /* сервер каталога недоступен — остаёмся на локальном снимке */
      })
      .finally(() => {
        if (!ac.signal.aborted) setCatalogReady(true);
      });
    return () => ac.abort();
  }, []);

  // Ссылка вида #module-<code> открывает карточку модуля: этим делятся
  // кнопкой «поделиться» в самой карточке.
  const openedFromHash = useRef(false);
  useEffect(() => {
    if (!catalogReady) return;
    const openFromHash = () => {
      const m = /^#module-([\w-]+)$/.exec(window.location.hash || '');
      if (!m) return;
      const mod = modules.find((x) => x.code === m[1]);
      if (mod) onOpenModuleModal(mod);
    };
    if (!openedFromHash.current) {
      openedFromHash.current = true;
      openFromHash();
    }
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [catalogReady, modules, onOpenModuleModal]);

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      const matchCategory = selectedCategory === 'all' || mod.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        mod.name.toLowerCase().includes(query) ||
        mod.shortDesc.toLowerCase().includes(query) ||
        mod.categoryName.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [modules, searchQuery, selectedCategory]);

  return (
    <section id="modules" className="relative py-14 sm:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Каталог {modules.length} модулей</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Модульная архитектура: подключайте только нужное
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Базовое ядро уже включает абонентскую базу и RADIUS. Любой дополнительный модуль
            активируется без переустановки системы. Нажмите на модуль для просмотра видео и скриншотов.
          </p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="module-search-input"
              type="text"
              placeholder={`Поиск по ${modules.length} модулям...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Category Pills */}
          <div className="m-scroll flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible gap-1.5 justify-start sm:justify-center w-[calc(100%+2rem)] sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0 md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3.5 py-3 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filteredModules.map((mod, idx) => (
            <div
              key={mod.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenModuleModal(mod)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenModuleModal(mod); } }}
              className={`group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer flex-row sm:flex-col justify-between overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                !showAll && idx >= MOBILE_LIMIT ? 'hidden sm:flex' : 'flex'
              }`}
            >
              {/* Module Image Thumbnail */}
              {mod.img && (
                <div className="relative w-28 shrink-0 sm:w-full sm:aspect-[16/9] overflow-hidden bg-slate-950">
                  <img
                    src={mod.img}
                    alt={mod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                  {/* Top Badges over image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 hidden sm:flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-slate-700/60">
                      {mod.categoryName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-slate-700/60">
                      {mod.version}
                    </span>
                  </div>

                  {/* Media Indicators (Video & Shots) */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
                    {mod.video && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-sm">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        <span>Видео</span>
                      </span>
                    )}
                    {mod.shots && mod.shots.length > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/85 text-slate-300 text-[10px] border border-slate-700/60">
                        <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{mod.shots.length} фото</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-3.5 sm:p-5 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  {!mod.img && (
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        {mod.categoryName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{mod.version}</span>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                    <span>{mod.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 flex-shrink-0 ml-1" />
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1 sm:mt-2 line-clamp-2 sm:line-clamp-3">
                    {mod.shortDesc}
                  </p>
                </div>

                <div className="mt-2 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>{mod.isCore ? 'Включён в ядро' : mod.plans[0]}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline">
                    Подробнее →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && filteredModules.length > MOBILE_LIMIT && (
          <div className="mt-5 sm:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              Показать все модули ({filteredModules.length})
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            Ничего не найдено по запросу «{searchQuery}». Попробуйте изменить параметры поиска.
          </div>
        )}
      </div>
    </section>
  );
};
