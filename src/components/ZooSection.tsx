import React from 'react';
import { ArrowRight, X } from 'lucide-react';

/**
 * «Вместо пяти систем» — объясняет ценность до перечисления функций.
 * Руководителю оператора это понятнее списка возможностей: слева то,
 * чем он пользуется сегодня, справа — одна система.
 */

const ZOO = [
  'Биллинг',
  'CRM в таблицах',
  'Почта и заявки',
  'Карта сети в стороннем редакторе',
  'Бот и рассылки',
  'Склад в тетрадке',
];

export const ZooSection: React.FC = () => (
  <section id="zoo" className="relative py-14 sm:py-24 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Вместо пяти систем — одна
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Данные клиента перестают жить в разных программах: договор, деньги, заявки,
          сеть и оборудование связаны между собой, а не переносятся руками.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center">
        {/* Было */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4">
            Обычно у оператора
          </div>
          <ul className="space-y-2.5">
            {ZOO.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <X className="w-4 h-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Одни и те же данные вводятся по нескольку раз и расходятся между программами.
          </p>
        </div>

        {/* Стрелка: на телефоне вниз, на широком экране вправо */}
        <div className="flex md:flex-col items-center justify-center text-emerald-500">
          <ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" aria-hidden="true" />
        </div>

        {/* Стало */}
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.06] dark:bg-emerald-500/10 p-5 sm:p-6 shadow-sm">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 mb-4">
            СмИТ Биллинг
          </div>
          <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-4">
            Клиенты, деньги, сеть, продажи и поддержка — в одной системе, на вашем сервере.
          </p>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-200">
            {[
              'Один клиент — одна карточка на всё',
              'Заявка и звонок связаны с договором',
              'Оборудование и склад — под тем же учётом',
              'Отчётность и СОРМ из той же базы',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold leading-5" aria-hidden="true">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
