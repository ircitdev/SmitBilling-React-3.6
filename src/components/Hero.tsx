import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight,
  Calculator,
  Download,
  Terminal,
  Activity,
  Wifi,
  Sparkles,
  Play,
} from 'lucide-react';
import { MEDIA_URLS } from '../data/landingData';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenAiDrawer: () => void;
  onOpenVideoModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenDemoModal,
  onOpenAiDrawer,
  onOpenVideoModal,
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'payment' | 'ai' | 'video'>('session');

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden z-10">
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Version & Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Релиз 3.6: Python 3.11 · FreeRADIUS 3.2 · СОРМ-3 · AI-агент</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
              Современный{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                биллинг
              </span>{' '}
              для операторов связи — и AI, отвечающий абонентам
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
              Полный цикл телеком-провайдера на одном сервере: тарификация, RADIUS-авторизация,
              обязательный СОРМ-3, автоматический разбор банковских выписок по 54-ФЗ и AI-агент,
              закрывающий <strong>73% обращений абонентов</strong> без участия оператора.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
              <button
                id="hero-demo-cta"
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/35 transition-all cursor-pointer"
              >
                <span>Запросить демо-стенд</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="hero-video-cta"
                onClick={onOpenVideoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-base font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Видеообзор (4 мин)</span>
              </button>

              <button
                id="hero-ai-cta"
                onClick={onOpenAiDrawer}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Спросить AI</span>
              </button>
            </div>

            {/* Quick Guarantees / Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Перенос базы за 1 день</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Развёртывание в Docker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Без роялти за абонента</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Mock Console */}
          <div className="lg:col-span-5 relative">
            {/* Ambient blur backdrop */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl" />

            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl p-5 sm:p-6">
              {/* Window Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">
                    smit-core:8877/dashboard
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3 animate-pulse" />
                  ONLINE
                </span>
              </div>

              {/* Mode switch tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg mb-4 text-[11px] font-medium">
                <button
                  onClick={() => setActiveTab('session')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'session'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  RADIUS
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'payment'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Оплаты
                </button>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                    activeTab === 'ai'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  AI-чат
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`py-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'video'
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Видео</span>
                </button>
              </div>

              {/* Dynamic Tab Content */}
              {activeTab === 'session' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Абонент #5552</div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Иванов Иван Иванович
                      </div>
                      <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                        100.64.14.88 · PPPoE MikroTik-BNG
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Баланс</div>
                      <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        +1 250 ₽
                      </div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Шейпер 300 Мбит
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5" />
                      <span>FreeRADIUS 3.2.3: CoA-Request Success</span>
                    </div>
                    <div className="text-slate-400">
                      Framed-IP: 100.64.14.88 | Rate-Limit: 300M/300M
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Session-Time: 14d 08h 12m · Acct-Input-Octets: 48.2 GB
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>Active RADIUS Pool: 4 821 online</span>
                    <span className="text-emerald-500 font-semibold">Ping 0.03 ms</span>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                      <span>Webhook: СБП ЮKassa</span>
                      <span>+850.00 ₽</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Автозачисление на Л/С SM-5552. Чек 54-ФЗ отправлен в ОФД АТОЛ.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1">
                    <div className="text-cyan-400">[BankParser] Выписка Сбербанк #149 обработана</div>
                    <div className="text-slate-400">Сопоставлено: 42/42 юрлица по ИНН</div>
                    <div className="text-emerald-400">Счёт и акт сформированы автоматически (PDF)</div>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>Фискализация: Чек #8912 в ОФД</span>
                    <span className="text-emerald-500 font-medium">Комиссия 0%</span>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 max-w-[85%]">
                    <div className="text-[10px] font-semibold text-slate-400 mb-0.5">Абонент (Telegram)</div>
                    «Здравствуйте! Почему у меня интернет отключился?»
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-xs text-slate-800 dark:text-slate-200 max-w-[90%] ml-auto">
                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">
                      AI-агент СмИТ
                    </div>
                    «Здравствуйте, Иван! На вашем договоре SM-5552 баланс 0 ₽. Списание тарифа
                    было сегодня ночью. Вы можете подключить обещанный платёж на 5 дней прямо
                    здесь или пополнить через СБП без комиссии.»
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-semibold">
                      Закрыто AI за 4 сек
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'video' && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                  <img
                    src={MEDIA_URLS.promoPoster}
                    alt="Презентация СмИТ Биллинг"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
                    <button
                      onClick={onOpenVideoModal}
                      className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition-all transform hover:scale-110 shadow-xl shadow-emerald-500/30 cursor-pointer mb-2"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                    <span className="text-xs font-semibold text-white">
                      Смотреть презентацию платформы (4:12)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
