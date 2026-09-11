import React, { useState } from 'react';
import { Check, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { PRICING_PLANS } from '../data/landingData';

interface PricingSectionProps {
  onSelectPlan: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Прозрачные тарифы</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Лицензия по составу модулей
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Без скрытых платежей, без комиссии за абонента. Все обновления ядра, законодательства
            и техподдержка уже включены в стоимость.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 mt-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !isAnnual
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Помесячно
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                isAnnual
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>За год</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white">
                2 мес в подарок (−17%)
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual
              ? Math.round(plan.annualPrice / 12)
              : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  plan.highlighted
                    ? 'border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/10 lg:-translate-y-2'
                    : 'border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {plan.name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                        {price.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">₽/мес</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {isAnnual ? (
                        <>или {plan.annualPrice.toLocaleString('ru-RU')} ₽ при оплате за год</>
                      ) : (
                        <>помесячная оплата без скидки</>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                    Включено {plan.modulesIncluded} модулей платформы
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>Выбрать {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] text-center text-slate-400 mt-2">
                    {plan.targetAudience}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Modules Note */}
        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          Нужен индивидуальный набор модулей?{' '}
          <button
            onClick={() => onSelectPlan('Индивидуальный')}
            className="text-emerald-600 dark:text-emerald-400 font-semibold underline underline-offset-4 cursor-pointer"
          >
            Соберём персональный тариф под ваши задачи
          </button>
        </div>
      </div>
    </section>
  );
};
