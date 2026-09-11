import React, { useState } from 'react';
import { Calculator as CalcIcon, Check, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { getRecommendedPlan } from '../data/landingData';

interface CalculatorProps {
  onSelectPlan: (planName: string, subscribers: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onSelectPlan }) => {
  const [subscribers, setSubscribers] = useState(1500);

  const { plan, annualCost, costPerSubscriberPerMonth } = getRecommendedPlan(subscribers);

  return (
    <section id="calculator" className="relative py-20 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Калькулятор окупаемости</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Сколько это будет стоить для вашей сети
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Укажите размер абонентской базы — система автоматически подберёт оптимальный
            тарифный план без скрытых платежей и роялти за количество пользователей.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10">
          {/* Slider Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <label htmlFor="subscribers-range" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Активных абонентов в вашей базе:
            </label>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {subscribers.toLocaleString('ru-RU')}{' '}
              <span className="text-sm font-medium text-slate-500">абонентов</span>
            </div>
          </div>

          {/* Slider Input */}
          <div className="space-y-2 mb-8">
            <input
              id="subscribers-range"
              type="range"
              min="100"
              max="20000"
              step="100"
              value={subscribers}
              onChange={(e) => setSubscribers(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>100</span>
              <span>2 500</span>
              <span>5 000</span>
              <span>10 000</span>
              <span>20 000+</span>
            </div>
          </div>

          {/* Recommendation Output Box */}
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Plan Info */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Рекомендуемый тариф
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {plan.modulesIncluded} модулей включено
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Тариф «{plan.name}»
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {plan.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {plan.features.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing Math */}
              <div className="md:col-span-5 md:border-l md:border-slate-200 md:dark:border-slate-800 md:pl-8 flex flex-col justify-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Стоимость за 1 год:
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono my-1">
                  {annualCost.toLocaleString('ru-RU')}{' '}
                  <span className="text-lg font-normal text-slate-500">₽/год</span>
                </div>

                {/* Per subscriber unit economics */}
                <div className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300 my-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>
                    Всего <strong>{costPerSubscriberPerMonth} ₽</strong> за абонента в месяц!
                  </span>
                </div>

                <button
                  id="calc-choose-plan-btn"
                  onClick={() => onSelectPlan(plan.name, subscribers)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
                >
                  <span>Запросить этот тариф</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Honest Pricing Note */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center sm:text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Важное преимущество:</span>{' '}
            Стоимость лицензии СмИТ Биллинг фиксирована по составу модулей и <strong>не увеличивается</strong> при росте вашей абонентской базы. Чем больше у вас клиентов, тем выгоднее становится каждый подключённый абонент.
          </div>
        </div>
      </div>
    </section>
  );
};
