import React, { useEffect, useState } from 'react';
import { Rocket, Terminal, Settings2, CheckCircle2 } from 'lucide-react';

// «Запуск за три шага» — как на прежнем billing.smit34.ru: шаги переключаются сами,
// клик выбирает шаг. Справа — терминал развёртывания или живой экран биллинга.
const STEPS = [
  {
    icon: Terminal,
    title: 'Развернул через Docker',
    text: 'Один docker compose up — PostgreSQL, Redis, gunicorn, FreeRADIUS и Celery поднимаются примерно за 15 минут.',
  },
  {
    icon: Settings2,
    title: 'Подключил инфраструктуру',
    text: 'Завёл NAS и тарифы, включил приём оплат (ЮKassa, Wallet One, банк), настроил выгрузку СОРМ и каналы поддержки.',
  },
  {
    icon: CheckCircle2,
    title: 'Всё работает',
    text: 'Абоненты авторизуются и списываются, Поддержка и CRM ведут заявки, AI-агент отвечает в чате, на почте и по телефону.',
  },
];

const SHOTS = [
  '',
  'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/tarifs.png',
  'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/dashboard.png',
];

const STEP_MS = 6000;

export const HowItWorksSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || paused) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section id="howitworks" className="relative py-14 sm:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <Rocket className="w-3.5 h-3.5" />
            <span>Как это работает</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Запуск за три шага
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            От чистого сервера до работающего биллинга — без интеграторов и месяцев внедрения.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="lg:col-span-2 flex flex-col gap-3" role="tablist" aria-label="Шаги запуска">
            {STEPS.map((s, i) => {
              const on = i === active;
              const Icon = s.icon;
              return (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="hiw-panel"
                  onClick={() => setActive(i)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    on
                      ? 'border-emerald-500/50 bg-white dark:bg-slate-900 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                        on ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-500" />
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.text}</p>
                      <div className="mt-3 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          key={on ? `run-${active}-${paused}` : 'idle'}
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: on ? '100%' : '0%',
                            transition: on && !paused ? `width ${STEP_MS}ms linear` : 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div id="hiw-panel" role="tabpanel" className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              {/* на телефоне терминал растёт по содержимому — в 16:10 последняя строка обрезалась */}
              <div className={`relative ${active === 0 ? 'sm:aspect-[16/10]' : 'aspect-[16/10]'}`}>
                {active === 0 ? (
                  <div className="sm:absolute sm:inset-0 p-5 sm:p-7 font-mono text-xs sm:text-sm leading-7 text-slate-300 overflow-hidden">
                    <div>
                      <span className="text-slate-500">$</span> <span className="text-emerald-400">docker compose up -d</span>
                    </div>
                    <div className="text-slate-500">[+] Running 6/6</div>
                    {[
                      ['smit-db', 'PostgreSQL 17'],
                      ['smit-redis', 'Redis 7'],
                      ['smit-web', 'gunicorn'],
                      ['smit-freeradius', 'FreeRADIUS'],
                      ['smit-celery + beat', ''],
                    ].map(([name, what]) => (
                      <div key={name}>
                        <span className="text-emerald-400">✔</span> {name}
                        {what && <span className="text-slate-500"> · {what}</span>}
                        <span className="text-slate-500"> · </span>
                        <span className="text-emerald-400">Started</span>
                      </div>
                    ))}
                    <div className="mt-3">
                      Готово за <span className="text-emerald-400">14м 32с</span>. Биллинг на{' '}
                      <span className="text-emerald-400">:8877</span> <span className="text-emerald-400">✓</span>
                    </div>
                  </div>
                ) : (
                  <img
                    key={SHOTS[active]}
                    src={SHOTS[active]}
                    alt={active === 1 ? 'Настройка тарифов и инфраструктуры' : 'Рабочий дашборд биллинга'}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
