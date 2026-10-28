import React from 'react';
import {
  Cpu,
  CheckCircle2,
  CreditCard,
  Receipt,
  Tv,
  MessageSquare,
  HardDrive,
} from 'lucide-react';
import { INTEGRATION_GROUPS } from '../data/landingData';

export const IntegrationsSection: React.FC = () => {
  // Поиск и фильтры убраны — показываем все группы целиком.
  const filteredGroups = INTEGRATION_GROUPS
    .map((group) => ({ ...group, groupId: group.id || group.title }))
    .filter((group) => group.items.length > 0);

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Экосистема и совместимость</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            24+ проверенные интеграции
            {/* Вторая часть — пояснение: мельче и фирменным зелёным. */}
            <span className="block mt-1.5 text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              «из коробки»
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Подключайте ваш BNG, платёжный шлюз, облачную кассу или IPTV сервис без заказной разработки. Всё протестировано на высоких нагрузках.
          </p>
        </div>

        {/* Поиск и фильтры убраны: интеграций немного, они помещаются на
            экран целиком, а ряд фильтров переносился на вторую строку
            и разрывал шапку секции. */}

        {/* Integration Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {filteredGroups.map((group) => {
            const gid = group.groupId;
            return (
              <div
                key={gid}
                // стекло: цвет и рамку задаёт класс, bg/border не нужны
                className="glass-card relative p-4 sm:p-8 rounded-3xl hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                    {getGroupIcon(gid)}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {group.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
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
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 sm:line-clamp-1 sm:pl-5.5">
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
