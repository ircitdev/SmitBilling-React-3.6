import React from 'react';
import { Network, ArrowUpRight } from 'lucide-react';

// «Граф знаний» — интерактивная карта архитектуры на docs.billing.smit34.ru.
const FACTS = ['11 логических слоёв', 'Обзор · Обучение · Погружение', 'Семантический поиск', 'Тур из 13 шагов'];

export const KnowledgeGraphSection: React.FC = () => {
  return (
    <section id="understand" className="relative py-10 sm:py-20 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 dark:via-slate-900 dark:to-teal-500/10 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Network className="w-3.5 h-3.5" />
            <span>Граф знаний</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Прозрачная архитектура — граф знаний
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Интерактивная карта всей системы. Никакого «чёрного ящика»: новая команда быстрее входит в работу, а
            сопровождение не зависит от одного человека.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {FACTS.map((f) => (
              <li
                key={f}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                {f}
              </li>
            ))}
          </ul>
          <a
            href="https://docs.billing.smit34.ru/understand/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            <span>Открыть граф знаний</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
