import React, { useState } from 'react';
import {
  Cpu,
  Search,
  CheckCircle2,
  CreditCard,
  Receipt,
  Tv,
  MessageSquare,
  HardDrive,
} from 'lucide-react';
import { INTEGRATION_GROUPS } from '../data/landingData';

export const IntegrationsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');

  const filteredGroups = INTEGRATION_GROUPS.map((group) => {
    const groupId = group.id || group.title;
    const matchesSearch = group.items.filter((item: any) => {
      const name = typeof item === 'string' ? item : item.name;
      const desc = typeof item === 'string' ? '' : item.description || '';
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    return {
      ...group,
      groupId,
      items: matchesSearch,
    };
  }).filter((group) => {
    if (activeGroup !== 'all' && group.groupId !== activeGroup) return false;
    return group.items.length > 0;
  });

  const getGroupIcon = (groupId: string) => {
    if (groupId.includes('payment') || groupId.includes('Деньги')) {
      return <CreditCard className="w-5 h-5" />;
    }
    if (groupId.includes('comm') || groupId.includes('Связь с')) {
      return <MessageSquare className="w-5 h-5" />;
    }
    if (groupId.includes('network') || groupId.includes('Сеть')) {
      return <Cpu className="w-5 h-5" />;
    }
    return <HardDrive className="w-5 h-5" />;
  };

  return (
    <section id="integrations" className="py-14 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Экосистема и совместимость</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            24+ проверенные интеграции «из коробки»
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Подключайте ваш BNG, платёжный шлюз, облачную кассу или IPTV сервис без заказной разработки. Всё протестировано на высоких нагрузках.
          </p>
        </div>

        {/* Controls: Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск интеграции (MikroTik, СБП...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Group Filter Buttons */}
          <div className="m-scroll flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto sm:overflow-visible w-[calc(100%+2rem)] -mx-4 px-4 sm:mx-0 sm:px-0 sm:w-auto justify-start sm:justify-end">
            <button
              onClick={() => setActiveGroup('all')}
              className={`shrink-0 px-3.5 py-3 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeGroup === 'all'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Все
            </button>
            {INTEGRATION_GROUPS.map((g) => {
              const gid = g.id || g.title;
              return (
                <button
                  key={gid}
                  onClick={() => setActiveGroup(gid)}
                  className={`shrink-0 px-3.5 py-3 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeGroup === gid
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Integration Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {filteredGroups.map((group) => {
            const gid = group.groupId;
            return (
              <div
                key={gid}
                className="p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    {getGroupIcon(gid)}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {group.desc || group.description}
                    </p>
                  </div>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-4 sm:mt-6">
                  {group.items.map((item: any, idx: number) => {
                    const itemName = typeof item === 'string' ? item : item.name;
                    const itemDesc = typeof item === 'string' ? '' : item.description;

                    return (
                      <div
                        key={idx}
                        className="flex flex-col min-w-0 p-2.5 sm:p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 text-xs hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate">{itemName}</span>
                        </div>
                        {itemDesc && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 sm:line-clamp-1 sm:pl-5.5">
                            {itemDesc}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
