import React from 'react';
import {
  ArrowRightLeft,
  ShieldCheck,
  Server,
  Database,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Users,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { MIGRATION_SYSTEMS } from '../data/landingData';

interface MigrationSectionProps {
  onOpenDemoModal: () => void;
}

export const MigrationSection: React.FC<MigrationSectionProps> = ({ onOpenDemoModal }) => {
  return (
    <section id="migrate" className="py-20 sm:py-28 relative bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Миграция без боли</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Переезд с любого биллинга без простоя абонентов
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Мы перенесли более 40 операторов. Абоненты продолжают пользоваться интернетом во время миграции, а сальдо сходится копейка в копейку.
          </p>
        </div>

        {/* 4 Systems Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {MIGRATION_SYSTEMS.map((sys) => (
            <div
              key={sys.name}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
                    <Server className="w-5 h-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {sys.badge || '100% совместимость'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {sys.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {sys.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{sys.badge || 'Без разрыва сессий'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3-Stage Process Banner */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Снимок базы и выгрузка
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Скрипт читает абонентов, тарифы, балансы, связки IP/MAC и историю платежей из вашей СУБД.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Параллельная работа и сверка
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Оба биллинга работают одновременно несколько дней. Бухгалтерия сверяет начисления до нуля расхождений.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Ночное переключение RADIUS
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Перенаправление порта 1812 на СмИТ Биллинг за 30 секунд. Клиентские роутеры остаются в сети.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-emerald-500/20">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>
                Полная гарантия сохранения лицевых счетов, истории платежей и договоров абонентов.
              </span>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all cursor-pointer flex-shrink-0"
            >
              <span>Обсудить план миграции</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
