import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calculator as CalcIcon,
  Check,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  Percent,
  Coins,
  Bot,
  Scale,
  ShieldCheck,
  Layers,
  HelpCircle,
  SlidersHorizontal,
  UserPlus,
  UserMinus,
  TrendingDown,
  RotateCcw,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { getRecommendedPlan } from '../data/landingData';

interface CalculatorProps {
  onSelectPlan?: (planName: string, subscribers: number) => void;
  onOpenDemoModal?: (subscribers: number, planName?: string) => void;
  onOpenAiCase?: (subscribers: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onSelectPlan,
  onOpenDemoModal,
  onOpenAiCase,
}) => {
  const [subscribers, setSubscribers] = useState(1500);
  const [chartView, setChartView] = useState<'competitive' | 'cumulative' | 'comparison'>('competitive');

  // Forecast Market Growth states (subscriber acquisition and churn modeling)
  const [forecastGrowthEnabled, setForecastGrowthEnabled] = useState(false);
  const [acquisitionRate, setAcquisitionRate] = useState(12); // % annual subscriber acquisition rate
  const [churnRate, setChurnRate] = useState(4); // % annual churn rate

  const { plan, annualCost, costPerSubscriberPerMonth } = getRecommendedPlan(subscribers);

  // График рисуется с анимацией и на телефоне занимал больше секунды сразу при загрузке
  // страницы, хотя калькулятор далеко внизу. Строим его, когда блок подъезжает к экрану;
  // место под него зарезервировано высотой контейнера.
  const chartBoxRef = useRef<HTMLDivElement>(null);
  const [chartVisible, setChartVisible] = useState(false);
  useEffect(() => {
    const box = chartBoxRef.current;
    if (!box || !('IntersectionObserver' in window)) {
      setChartVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setChartVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const handleChoosePlan = () => {
    if (typeof onSelectPlan === 'function') {
      onSelectPlan(plan.name, subscribers);
    } else if (typeof onOpenDemoModal === 'function') {
      onOpenDemoModal(subscribers, plan.name);
    }
  };

  // Net annual growth rate based on toggle and rates
  const netGrowthRate = useMemo(() => {
    if (!forecastGrowthEnabled) return 0.08; // 8% baseline default
    return (acquisitionRate - churnRate) / 100;
  }, [forecastGrowthEnabled, acquisitionRate, churnRate]);

  // 5-year projection math based on subscriber count, growth forecast, and market benchmark
  const projectionData = useMemo(() => {
    const data = [];
    let cumulativeLegacy = 0;
    let cumulativeMarket = 0;

    for (let year = 1; year <= 5; year++) {
      const yearSubs = Math.max(50, Math.round(subscribers * Math.pow(1 + netGrowthRate, year - 1)));
      
      // 1. Legacy costs: manual statements, 1C discrepancies, manual RADIUS/network maintenance, uncollected debts
      const manualHoursCost = Math.round(yearSubs * 95); // ~95 руб/год на ручную обработку платежей и кассы
      const uncollectedDebt = Math.round(yearSubs * 550 * 0.022 * 12); // ~2.2% выручки теряется из-за запоздалых блокировок
      const legacySoftwareSupport = Math.round(180000 + yearSubs * 25); // сопровождение старого биллинга
      const totalLegacyCost = manualHoursCost + uncollectedDebt + legacySoftwareSupport;

      // 2. Industry Average Billing System Costs in Russia/CIS (e.g., Carbon, LanBilling, BGBilling, Mikbill):
      // Standard commercial market model charges:
      // - Per-subscriber fee: ~18 ₽/мес (216 ₽/год на абонента)
      // - Vendor SLA / mandatory support: ~160 000 ₽ базово + 15% от абонентских лицензий
      // - Separate module fees (SORM-3 adapter, 54-FZ cashier bridge, mobile apps): ~75 000 ₽ + ~15 ₽/абонент
      const industryPerSubFee = Math.round(yearSubs * 18 * 12);
      const industryBaseAndSla = Math.round(160000 + (yearSubs * 18 * 12 * 0.15));
      const industryModulesTax = Math.round(75000 + yearSubs * 15);
      const totalIndustryAvgCost = industryPerSubFee + industryBaseAndSla + industryModulesTax;

      // 3. СмИТ Биллинг 3.7 has flat predictable license cost regardless of growth
      const smitCost = annualCost;
      
      // Savings calculations
      const annualSavingsLegacy = Math.max(0, totalLegacyCost - smitCost);
      cumulativeLegacy += annualSavingsLegacy;

      const annualSavingsVsMarket = Math.max(0, totalIndustryAvgCost - smitCost);
      cumulativeMarket += annualSavingsVsMarket;

      const marketSavingsPercent = Math.min(
        92,
        Math.max(18, Math.round((annualSavingsVsMarket / totalIndustryAvgCost) * 100))
      );

      data.push({
        year: `Год ${year}`,
        subsCount: yearSubs,
        legacyCost: totalLegacyCost,
        industryAvgCost: totalIndustryAvgCost,
        smitCost: smitCost,
        annualSavings: annualSavingsLegacy,
        cumulativeSavings: cumulativeLegacy,
        annualSavingsVsMarket: annualSavingsVsMarket,
        cumulativeSavingsVsMarket: cumulativeMarket,
        marketSavingsPercent,
      });
    }
    return data;
  }, [subscribers, annualCost, netGrowthRate]);

  const total5YearSavings = projectionData[4]?.cumulativeSavings || 0;
  const total5YearMarketSavings = projectionData[4]?.cumulativeSavingsVsMarket || 0;
  const avgMonthlySavings = Math.round(projectionData[0]?.annualSavings / 12) || 0;
  const avgMonthlyMarketSavings = Math.round(projectionData[0]?.annualSavingsVsMarket / 12) || 0;
  
  const paybackMonths = Number(
    Math.max(0.8, (annualCost / (projectionData[0]?.annualSavings / 12 || 1))).toFixed(1)
  );
  const paybackMonthsVsMarket = Number(
    Math.max(0.7, (annualCost / (projectionData[0]?.annualSavingsVsMarket / 12 || 1))).toFixed(1)
  );

  const roi5Year = Math.round(((total5YearSavings - annualCost * 5) / (annualCost * 5)) * 100);
  const roiMarket5Year = Math.round(
    ((total5YearMarketSavings) / (annualCost * 5)) * 100
  );

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(2)} млн ₽`;
    }
    return `${val.toLocaleString('ru-RU')} ₽`;
  };

  return (
    <section id="calculator" className="relative py-14 sm:py-20 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <CalcIcon className="w-3.5 h-3.5" />
            <span>Калькулятор окупаемости и 5-летней выгоды</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Экономика внедрения и динамика ROI на 5 лет
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Укажите размер абонентской базы. Интерактивная модель рассчитает окупаемость,
            высвобождение бюджета и 5-летний кумулятивный эффект от перехода на СмИТ Биллинг 3.7.
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-10 space-y-8">
          
          {/* Top Controls: Slider & Presets */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
              <label htmlFor="subscribers-range" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Активных абонентов в вашей сети:
              </label>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {subscribers.toLocaleString('ru-RU')}
                </span>
                <span className="text-sm font-medium text-slate-500">абонентов</span>
              </div>
            </div>

            {/* Slider Input */}
            <div className="space-y-2 mb-4">
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

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Быстрый выбор:</span>
              {[500, 1500, 3500, 7500, 15000].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSubscribers(num)}
                  className={`px-3 py-2.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                    subscribers === num
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {num.toLocaleString('ru-RU')}
                </button>
              ))}
            </div>
          </div>

          {/* Forecast Market Growth Toggle & Detailed Controls */}
          <div
            id="forecast-market-growth-container"
            className={`rounded-2xl border transition-all duration-300 p-4 sm:p-5 ${
              forecastGrowthEnabled
                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Header with Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2 rounded-xl shrink-0 transition-colors ${
                    forecastGrowthEnabled
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Прогноз роста абонентской базы
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                        forecastGrowthEnabled
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {forecastGrowthEnabled
                        ? `Модель активна: ${netGrowthRate >= 0 ? '+' : ''}${(netGrowthRate * 100).toFixed(1)}%/год`
                        : 'Базовый расчёт (+8%/год)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {forecastGrowthEnabled
                      ? 'Настройте приток (Acquisition) и отток (Churn) абонентов для расчёта динамики окупаемости и ROI в реальном времени'
                      : 'Включите, чтобы смоделировать темпы притока и оттока абонентов и увидеть пересчёт ROI в реальном времени'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <label
                  htmlFor="forecast-growth-toggle"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                >
                  {forecastGrowthEnabled ? 'Прогноз активен' : 'Включить прогноз'}
                </label>
                <button
                  type="button"
                  id="forecast-growth-toggle"
                  role="switch"
                  aria-checked={forecastGrowthEnabled}
                  onClick={() => setForecastGrowthEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                    forecastGrowthEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      forecastGrowthEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Expanded Controls when forecastGrowthEnabled is true */}
            {forecastGrowthEnabled && (
              <div className="mt-5 pt-4 border-t border-emerald-500/20 dark:border-emerald-500/15 space-y-5">
                {/* 2 Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Acquisition Rate Slider */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <UserPlus className="w-4 h-4" />
                        </div>
                        <label
                          htmlFor="acquisition-rate-slider"
                          className="text-xs font-bold text-slate-900 dark:text-white"
                        >
                          Приток абонентов (Acquisition Rate)
                        </label>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        +{acquisitionRate}% / год
                      </span>
                    </div>

                    <input
                      id="acquisition-rate-slider"
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={acquisitionRate}
                      onChange={(e) => setAcquisitionRate(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>0% (стабильно)</span>
                      <span>10%</span>
                      <span>20%</span>
                      <span>30% (экспансия)</span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      Органические заявки, реклама, расширение покрытия (FTTH/GPON).
                    </p>
                  </div>

                  {/* Churn Rate Slider */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <UserMinus className="w-4 h-4" />
                        </div>
                        <label
                          htmlFor="churn-rate-slider"
                          className="text-xs font-bold text-slate-900 dark:text-white"
                        >
                          Прогнозируемый отток (Churn Rate)
                        </label>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                        -{churnRate}% / год
                      </span>
                    </div>

                    <input
                      id="churn-rate-slider"
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={churnRate}
                      onChange={(e) => setChurnRate(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
                    />

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>0% (мин)</span>
                      <span>4% (норма)</span>
                      <span>8%</span>
                      <span>15% (критич)</span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      Переезды, сезонность, конкуренция.
                    </p>
                  </div>
                </div>

                {/* Preset scenario buttons & Net Impact Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Preset chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-slate-400 mr-0.5">Сценарии:</span>
                    <button
                      type="button"
                      onClick={() => { setAcquisitionRate(10); setChurnRate(4); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        acquisitionRate === 10 && churnRate === 4
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                          : 'bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Органический (+6%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAcquisitionRate(20); setChurnRate(5); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        acquisitionRate === 20 && churnRate === 5
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                          : 'bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Быстрая экспансия (+15%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAcquisitionRate(6); setChurnRate(6); }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        acquisitionRate === 6 && churnRate === 6
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                          : 'bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Плотный рынок (0%)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAcquisitionRate(12); setChurnRate(4); }}
                      className="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                      title="Сброс к отраслевому стандарту (+8%)"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Базовый (+8%)</span>
                    </button>
                  </div>

                  {/* Live Net Growth Summary Pill */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
                    <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Чистый темп:</span>
                    <span
                      className={`font-mono font-bold ${
                        netGrowthRate > 0
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : netGrowthRate === 0
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {netGrowthRate >= 0 ? '+' : ''}{(netGrowthRate * 100).toFixed(1)}% в год
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-slate-600 dark:text-slate-400">База к 5 году:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {projectionData[4]?.subsCount.toLocaleString('ru-RU')} аб.
                    </span>
                  </div>
                </div>

                {/* Strategic Insight Alert */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Экономический эффект фиксированной модели: </span>
                    {netGrowthRate > 0 ? (
                      <>
                        При росте базы до <strong>{projectionData[4]?.subsCount.toLocaleString('ru-RU')} абонентов</strong> биллинг с оплатой за абонента (условно 18–22 ₽/мес) увеличил бы расходы на{' '}
                        <strong>{Math.round(projectionData[4]?.industryAvgCost - projectionData[0]?.industryAvgCost).toLocaleString('ru-RU')} ₽/год</strong>. 
                        Лицензия СмИТ Биллинг остаётся фиксированной, сохраняя операционную маржу!
                      </>
                    ) : (
                      <>
                        Цена лицензии не зависит от числа абонентов: рост базы не увеличивает расходы на биллинг.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 Executive KPI Metric Tiles */}
          {/* Summary Metric Cards */}
          {(() => {
            const isCompetitive = chartView === 'competitive';
            return (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{isCompetitive ? 'Разница за 5 лет' : 'Экономия за 5 лет'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    {formatCurrency(isCompetitive ? total5YearMarketSavings : total5YearSavings)}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {isCompetitive ? 'против условной оплаты за абонента' : 'оценка по модели'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-400 font-medium mb-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{isCompetitive ? 'В среднем в месяц' : 'В среднем в месяц'}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400 font-mono">
                    {(isCompetitive ? avgMonthlyMarketSavings : avgMonthlySavings).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {isCompetitive ? 'сохраняется в IT-бюджете' : 'высвобождаемый бюджет'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Окупаемость</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                    {isCompetitive ? paybackMonthsVsMarket : paybackMonths} мес.
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {isCompetitive ? 'полный возврат лицензии' : 'полный возврат инвестиций'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">
                    <Percent className="w-3.5 h-3.5" />
                    <span>5-летний ROI</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 font-mono">
                    +{isCompetitive ? roiMarket5Year : roi5Year}%
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {isCompetitive ? 'преимущество перед аналогами' : 'рентабельность внедрения'}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Interactive Recharts 5-Year Growth & Savings Projection Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {chartView === 'competitive'
                      ? 'Сравнение с рынком: СмИТ Биллинг vs Средние расходы на аналоги'
                      : chartView === 'cumulative'
                      ? 'Динамика накопительной экономии (5-летний прогноз)'
                      : 'Сравнение затрат: СмИТ Биллинг vs Ручной труд / старая система'}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {forecastGrowthEnabled ? (
                    <span>
                      С учётом прогноза динамики: приток{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400">+{acquisitionRate}%</strong>, отток{' '}
                      <strong className="text-rose-500 dark:text-rose-400">-{churnRate}%</strong> (чистый темп:{' '}
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {netGrowthRate >= 0 ? '+' : ''}{(netGrowthRate * 100).toFixed(1)}%/год
                      </strong>
                      ) • Прогноз базы к 5 году: <strong className="text-slate-900 dark:text-white font-mono">{projectionData[4]?.subsCount.toLocaleString('ru-RU')}</strong> аб.
                    </span>
                  ) : chartView === 'competitive' ? (
                    'Сравнение с условной моделью оплаты за абонента (18–22 ₽/мес плюс сопровождение) — оценка, а не цены конкретного вендора'
                  ) : chartView === 'cumulative' ? (
                    'Учитывает фиксированную лицензию СмИТ Биллинг и базовый рост сети на 8% ежегодно'
                  ) : (
                    'Сравнение суммарных издержек старой системы и ручного сопровождения с прозрачной лицензией СмИТ'
                  )}
                </p>
              </div>

              {/* Chart Toggle Buttons */}
              <div className="inline-flex rounded-xl p-1 bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60 self-start sm:self-auto flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setChartView('competitive')}
                  className={`inline-flex items-center px-3 py-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    chartView === 'competitive'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 mr-1" />
                  Сравнение с оплатой за абонента
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('cumulative')}
                  className={`px-3 py-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    chartView === 'cumulative'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Накопительная выгода
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('comparison')}
                  className={`px-3 py-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    chartView === 'comparison'
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Сравнение со старой системой
                </button>
              </div>
            </div>

            {/* Recharts Chart Area */}
            <div ref={chartBoxRef} className="w-full h-72 sm:h-80">
              {chartVisible && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={projectionData}
                  margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="savingsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="legacyBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="industryBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                    </linearGradient>
                    <linearGradient id="smitBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#0d9488" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} vertical={false} />
                  <XAxis
                    dataKey="year"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#475569', opacity: 0.3 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                      return `${val}`;
                    }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[240px]">
                          <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex justify-between items-center">
                            <span>{label}</span>
                            <div className="flex items-center gap-1.5">
                              {forecastGrowthEnabled && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                  {netGrowthRate >= 0 ? '+' : ''}{(netGrowthRate * 100).toFixed(1)}%/г
                                </span>
                              )}
                              <span className="text-emerald-400 font-mono font-bold">{item.subsCount.toLocaleString('ru-RU')} аб.</span>
                            </div>
                          </div>
                          
                          {chartView === 'competitive' ? (
                            <>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-purple-300 font-medium">Оплата за абонента:</span>
                                <span className="font-mono font-bold text-white">
                                  {item.industryAvgCost.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-emerald-400 font-medium">СмИТ Биллинг 3.7:</span>
                                <span className="font-mono font-bold text-white">
                                  {item.smitCost.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-amber-300 border-t border-slate-800 pt-1.5 font-bold">
                                <span>Чистая экономия оператора:</span>
                                <span className="font-mono">
                                  +{item.annualSavingsVsMarket.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>Доля сохранённого IT-бюджета:</span>
                                <span className="font-mono text-emerald-400 font-semibold">{item.marketSavingsPercent}%</span>
                              </div>
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>Накопленная выгода:</span>
                                <span className="font-mono text-slate-200">
                                  {item.cumulativeSavingsVsMarket.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </>
                          ) : chartView === 'cumulative' ? (
                            <>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-emerald-400 font-medium">Накопленная выгода:</span>
                                <span className="font-mono font-bold text-white">
                                  {item.cumulativeSavings.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Экономия за год:</span>
                                <span className="font-mono text-emerald-300">
                                  {item.annualSavings.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-rose-400 font-medium">Затраты без СмИТ:</span>
                                <span className="font-mono font-bold text-white">
                                  {item.legacyCost.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-slate-300">
                                <span className="text-emerald-400 font-medium">СмИТ Биллинг:</span>
                                <span className="font-mono font-bold text-white">
                                  {item.smitCost.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <div className="flex justify-between text-emerald-300 border-t border-slate-800 pt-1 font-semibold">
                                <span>Чистая экономия:</span>
                                <span className="font-mono">
                                  +{item.annualSavings.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  />

                  {chartView === 'competitive' ? (
                    <>
                      <Bar
                        dataKey="industryAvgCost"
                        name="Условная оплата за абонента (₽)"
                        fill="url(#industryBarGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={34}
                      />
                      <Bar
                        dataKey="smitCost"
                        name="СмИТ Биллинг 3.7 (Фиксированная цена) (₽)"
                        fill="url(#smitBarGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={34}
                      />
                      <Line
                        type="monotone"
                        dataKey="annualSavingsVsMarket"
                        name="Чистая годовая экономия (ROI) (₽)"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#f59e0b', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </>
                  ) : chartView === 'cumulative' ? (
                    <>
                      <Area
                        type="monotone"
                        dataKey="cumulativeSavings"
                        name="Накопительная экономия (₽)"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#savingsAreaGradient)"
                      />
                      <Bar
                        dataKey="annualSavings"
                        name="Чистая экономия за год (₽)"
                        fill="#0d9488"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={44}
                        opacity={0.85}
                      />
                    </>
                  ) : (
                    <>
                      <Bar
                        dataKey="legacyCost"
                        name="Расходы старой системы / ручной труд (₽)"
                        fill="url(#legacyBarGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={38}
                      />
                      <Bar
                        dataKey="smitCost"
                        name="Лицензия СмИТ Биллинг (₽)"
                        fill="url(#smitBarGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={38}
                      />
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
              )}
            </div>

            {/* Contextual ROI Competitive Breakdown */}
            {chartView === 'competitive' && (
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 text-slate-600 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Условие сравнения:</span>
                    Модель с оплатой за абонента: 18–22 ₽/мес, сопровождение 15–20% и отдельные модули. Условный пример для расчёта.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-slate-600 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">СмИТ Биллинг 3.7:</span>
                    Всего {costPerSubscriberPerMonth} ₽/мес на абонента при прозрачной фиксированной стоимости без «налога» на прирост вашей абонентской базы.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-slate-600 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">Оценка по модели:</span>
                    Чистая экономия {formatCurrency(total5YearMarketSavings)} за 5 лет с выходом на полную окупаемость за ~{paybackMonthsVsMarket} мес.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recommendation Output Box */}
          <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Plan Info */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
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

              {/* Pricing Math & Actions */}
              <div className="md:col-span-5 md:border-l md:border-slate-200 md:dark:border-slate-800 md:pl-8 flex flex-col justify-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Стоимость лицензии:
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono my-1">
                  {annualCost.toLocaleString('ru-RU')}{' '}
                  <span className="text-lg font-normal text-slate-500">₽/год</span>
                </div>

                {/* Per subscriber unit economics */}
                <div className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-700 dark:text-emerald-300 my-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span>
                    Всего <strong>{costPerSubscriberPerMonth} ₽</strong> за абонента в месяц!
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <button
                    id="calc-choose-plan-btn"
                    onClick={handleChoosePlan}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
                  >
                    <span>Запросить этот тариф</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {onOpenAiCase && (
                    <button
                      type="button"
                      onClick={() => onOpenAiCase(subscribers)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Бизнес-кейс для руководства</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Honest Pricing Note */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed text-center sm:text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Важное преимущество:</span>{' '}
            Стоимость лицензии СмИТ Биллинг фиксирована по составу модулей и <strong>не увеличивается</strong> при росте вашей абонентской базы. Чем больше у вас клиентов, тем выгоднее становится каждый подключённый абонент.
          </div>
        </div>
      </div>
    </section>
  );
};

