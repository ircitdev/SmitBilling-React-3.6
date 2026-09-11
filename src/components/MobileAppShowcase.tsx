import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Wifi,
  Bot,
  Bell,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Image as ImageIcon,
  Sliders,
} from 'lucide-react';
import { MEDIA_URLS } from '../data/landingData';

export const MobileAppShowcase: React.FC = () => {
  const [viewMode, setViewMode] = useState<'interactive' | 'mockup'>('interactive');
  const [appScreen, setAppScreen] = useState<'home' | 'tariff' | 'pay' | 'chat'>('home');

  return (
    <section id="mobile-app" className="relative py-20 sm:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Features & Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Личный кабинет и Мобильное приложение</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Абоненты решают все вопросы в приложении
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Современное брендированное приложение для iOS и Android. Абонент проверяет баланс,
              оплачивает в 1 клик через СБП, берет обещанный платёж или общается с AI-поддержкой без
              перегрузки вашей телефонной линии.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Снижение нагрузки на операторов до 40%
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Абоненты сами смотрят остаток дней, детализацию начислений и меняют тариф.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Push-уведомления вместо платных SMS
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Напоминания об окончании средств за 3 дня и уведомления о плановых работах бесплатно.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Публикация в App Store и Google Play
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ваш логотип, ваши фирменные цвета, название вашей компании.
                  </p>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setViewMode('interactive')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'interactive'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Интерактивный симулятор
                </button>
                <button
                  onClick={() => setViewMode('mockup')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'mockup'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Фото дизайн-макета</span>
                </button>
              </div>

              {viewMode === 'interactive' && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Попробуйте экраны приложения:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setAppScreen('home')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        appScreen === 'home'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Главная (Баланс)
                    </button>
                    <button
                      onClick={() => setAppScreen('tariff')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        appScreen === 'tariff'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Тарифный план
                    </button>
                    <button
                      onClick={() => setAppScreen('pay')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        appScreen === 'pay'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Оплата СБП
                    </button>
                    <button
                      onClick={() => setAppScreen('chat')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        appScreen === 'chat'
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      AI-чат поддержки
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 flex justify-center">
            {viewMode === 'mockup' ? (
              /* Photo of Mobile Design Mockup */
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group max-w-md">
                <img
                  src={MEDIA_URLS.appMockup}
                  alt="Дизайн макет мобильного приложения СмИТ"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <div className="text-white font-bold text-base">Брендированное PWA и нативное приложение</div>
                    <div className="text-emerald-400 text-xs mt-1">Доступно для всех абонентов на тарифах Про и Enterprise</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Phone Frame Interactive Simulation */
              <div className="relative w-[300px] sm:w-[320px] h-[620px] rounded-[48px] border-[10px] border-slate-800 bg-slate-950 p-4 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between overflow-hidden">
                {/* Phone Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-20" />

                {/* In-app Screen Content */}
                <div className="mt-5 flex-1 flex flex-col justify-between overflow-y-auto">
                  {/* Top App Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-100">Провайдер СмИТ</div>
                      <div className="text-[10px] text-slate-400">Договор SM-2026-5552</div>
                    </div>
                    <Bell className="w-4 h-4 text-slate-400" />
                  </div>

                  {/* Screen 1: Home */}
                  {appScreen === 'home' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 text-center">
                        <div className="text-[11px] text-slate-400">Текущий баланс</div>
                        <div className="text-3xl font-extrabold text-emerald-400 my-1">+1 250 ₽</div>
                        <div className="text-[10px] text-emerald-300">
                          Хватит на 44 дня интернета
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button className="p-3 rounded-xl bg-emerald-500 text-white font-semibold text-center hover:bg-emerald-600 transition-colors">
                          Оплатить СБП
                        </button>
                        <button className="p-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-center hover:bg-slate-700 transition-colors">
                          Обещанный платёж
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                        <div className="text-[11px] font-semibold text-slate-300">
                          Подключенные услуги:
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Интернет «Оптика 300»</span>
                          <span className="text-slate-200 font-semibold">650 ₽/мес</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>ТВ Пакет «Оптимальный»</span>
                          <span className="text-slate-200 font-semibold">200 ₽/мес</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screen 2: Tariff */}
                  {appScreen === 'tariff' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="font-bold text-slate-200 mb-1">Тариф: Оптика 300 Мбит</div>
                        <div className="text-slate-400 text-[11px]">
                          Списание 650 ₽ первого числа каждого месяца.
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                        <div className="font-bold text-slate-200 mb-1">Доступен переход:</div>
                        <div className="p-2 rounded bg-slate-800/80 mb-1.5 flex justify-between items-center">
                          <span>Гигабит 1000 Мбит</span>
                          <span className="text-emerald-400 font-bold">990 ₽</span>
                        </div>
                        <button className="w-full py-1.5 rounded bg-emerald-500 text-white text-[11px] font-bold">
                          Сменить тариф с 1 числа
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Screen 3: Pay */}
                  {appScreen === 'pay' && (
                    <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-slate-400 text-[11px]">К оплате:</div>
                        <div className="text-2xl font-bold text-emerald-400 my-1">850 ₽</div>
                        <div className="text-[10px] text-slate-400">Без комиссии через СБП</div>
                      </div>
                      <div className="space-y-1.5">
                        <button className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-center">
                          Оплатить через СБП
                        </button>
                        <button className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium text-center">
                          Банковской картой
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Screen 4: Chat */}
                  {appScreen === 'chat' && (
                    <div className="space-y-2 animate-in fade-in duration-200 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-900 text-slate-300 max-w-[85%]">
                        Здравствуйте! Как подключить статичный IP-адрес?
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 max-w-[90%] ml-auto">
                        Статичный IP подключается мгновенно! Стоимость — 150 ₽/мес. Подключить прямо сейчас к вашему договору?
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button className="px-2.5 py-1 rounded bg-emerald-500 text-white font-bold text-[10px]">
                          Да, подключить
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom In-app Nav */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-4 text-center text-[10px] text-slate-400">
                  <div
                    onClick={() => setAppScreen('home')}
                    className={`cursor-pointer ${appScreen === 'home' ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    Главная
                  </div>
                  <div
                    onClick={() => setAppScreen('tariff')}
                    className={`cursor-pointer ${appScreen === 'tariff' ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    Тариф
                  </div>
                  <div
                    onClick={() => setAppScreen('pay')}
                    className={`cursor-pointer ${appScreen === 'pay' ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    Оплата
                  </div>
                  <div
                    onClick={() => setAppScreen('chat')}
                    className={`cursor-pointer ${appScreen === 'chat' ? 'text-emerald-400 font-bold' : ''}`}
                  >
                    Чат
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
