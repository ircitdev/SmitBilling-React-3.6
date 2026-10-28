import React, { useState } from 'react';
import { Scale, Check, Minus, X, ArrowRight, ChevronDown } from 'lucide-react';
import { COMPARE_ROWS, type CompareRow } from '../data/landingData';

interface CompareSectionProps {
  onOpenDemoModal: () => void;
}

const LABEL: Record<CompareRow['smit'], string> = {
  yes: 'есть',
  partial: 'частично',
  no: 'нет',
};

/** Значок вместо «галочка/крестик»: цвет дублируется формой и подписью,
 *  иначе строку не прочитать ни на чёрно-белой печати, ни при дальтонизме. */
const Mark: React.FC<{ value: CompareRow['smit']; own?: boolean }> = ({ value, own }) => {
  const base = 'inline-flex items-center justify-center w-6 h-6 rounded-lg';
  if (value === 'yes') {
    return (
      <span
        className={`${base} ${own
          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          : 'bg-slate-200/70 text-slate-600 dark:bg-slate-700/60 dark:text-slate-300'}`}
        title={LABEL.yes}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
        <span className="sr-only">{LABEL.yes}</span>
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span
        className={`${base} bg-amber-500/15 text-amber-700 dark:text-amber-400`}
        title={LABEL.partial}
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
        <span className="sr-only">{LABEL.partial}</span>
      </span>
    );
  }
  return (
    <span className={`${base} text-slate-300 dark:text-slate-600`} title={LABEL.no}>
      <X className="w-3.5 h-3.5" strokeWidth={3} />
      <span className="sr-only">{LABEL.no}</span>
    </span>
  );
};

export const CompareSection: React.FC<CompareSectionProps> = ({ onOpenDemoModal }) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <section id="compare" className="py-14 sm:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Честное сравнение</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Чем мы отличаемся
            {/* Вторая часть — пояснение: мельче и фирменным зелёным. */}
            <span className="block mt-1.5 text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              от Carbon и LANBilling
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            По самому биллингу разницы почти нет — все трое закрывают тарификацию,
            RADIUS и СОРМ. Разница в том, что рядом: у нас поддержка, продажи и склад
            входят в ту же систему. Где мы уступаем — сказано здесь же.
          </p>
        </div>

        {/* Таблица и всё, что ниже, скрыто до нажатия: секция начиналась
            с широкой таблицы, которая на телефоне занимала весь экран. */}
        {!showTable && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowTable(true)}
              aria-expanded={false}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500/50 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
            >
              <span>Посмотреть таблицу</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {showTable && (
          <div className="cmp-reveal">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-slate-500 dark:text-slate-400 pb-3 pr-4">
                    Возможность
                  </th>
                  <th className="pb-3 px-2 w-24 text-emerald-700 dark:text-emerald-400 font-extrabold">
                    СмИТ
                  </th>
                  <th className="pb-3 px-2 w-24 font-semibold text-slate-500 dark:text-slate-400">
                    Carbon
                  </th>
                  <th className="pb-3 px-2 w-28 font-semibold text-slate-500 dark:text-slate-400">
                    LANBilling
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 ? 'bg-slate-50/70 dark:bg-slate-800/30' : ''}
                  >
                    <td className="py-3 pr-4 pl-3 rounded-l-xl align-top">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {row.feature}
                      </div>
                      {row.note && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {row.note}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center align-top">
                      <Mark value={row.smit} own />
                    </td>
                    <td className="py-3 px-2 text-center align-top">
                      <Mark value={row.carbon} />
                    </td>
                    <td className="py-3 px-2 text-center rounded-r-xl align-top">
                      <Mark value={row.lanbilling} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-5 leading-relaxed">
            Сравнение составлено по открытым данным сайтов вендоров на сентябрь 2026 года.
            Продукты развиваются — если что-то изменилось, напишите, поправим.
          </p>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onOpenDemoModal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm cursor-pointer"
            >
              <span>Посмотреть на своих задачах</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          </div>
        )}
      </div>
    </section>
  );
};
