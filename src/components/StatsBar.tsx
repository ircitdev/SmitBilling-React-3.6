import React from 'react';
import { Users, Bot, Layers, Zap } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: '6 300+',
      label: 'Абонентов на платформе',
      sublabel: 'Рабочая база оператора на СмИТ Биллинге',
      icon: Users,
      spark: [30, 45, 40, 58, 52, 74, 90],
    },
    {
      value: '73%',
      label: 'Обращений AI решает без оператора',
      sublabel: 'Диагностика, баланс, обещанный платёж',
      icon: Bot,
      spark: [50, 42, 60, 54, 70, 64, 84],
    },
    {
      value: '24',
      label: 'Модуля в каталоге',
      sublabel: 'Ядро включено, остальное — по тарифу',
      icon: Layers,
      spark: [70, 80, 72, 85, 78, 90, 82],
    },
    {
      value: '15 мин',
      label: 'Время развёртывания',
      sublabel: 'Один docker compose up с PostgreSQL 17',
      icon: Zap,
      spark: [90, 72, 56, 46, 36, 28, 20],
    },
  ];

  return (
    <div id="stats-section" className="relative z-10 py-10 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Sparkline visualization */}
                  <div className="flex items-end gap-1 h-6 opacity-60">
                    {stat.spark.map((h, i) => (
                      <span
                        key={i}
                        className="w-1.5 rounded-t bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-300"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {stat.sublabel}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
