import React from 'react';
import {
  Network,
  Bot,
  ShieldCheck,
  CreditCard,
  Headphones,
  MapPin,
  Smartphone,
  Package,
  Layers,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { TelecomTermTooltip } from './TelecomTermTooltip';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="relative py-14 sm:py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Возможности платформы</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Всё для управления современным ISP
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-3">
            Откажитесь от зоопарка разрозненных скриптов и сторонних сервисов. Полный цикл работы
            оператора связи в единой экосистеме.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700/60">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Нажмите на подчёркнутый термин — откроется пояснение</span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: RADIUS (Featured Wide) */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-emerald-500/5 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/25">
                  <Network className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                  <TelecomTermTooltip termKey="freeradius">
                    FreeRADIUS 3.2.3
                  </TelecomTermTooltip>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Сетевой доступ и RADIUS-авторизация
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                FreeRADIUS с обработчиками на Python.{' '}
                <TelecomTermTooltip termKey="pppoe">PPPoE</TelecomTermTooltip>,{' '}
                <TelecomTermTooltip termKey="ipoe">IPoE (DHCP Option 82)</TelecomTermTooltip>,
                выдача адресов из пулов, шейпер по тарифу, блокировка
                должников через{' '}
                <TelecomTermTooltip termKey="coapod">CoA/PoD</TelecomTermTooltip> на оборудовании
                доступа (NAS).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <TelecomTermTooltip termKey="pppoe">
                  <span>PPPoE / IPoE Opt.82</span>
                </TelecomTermTooltip>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <TelecomTermTooltip termKey="coapod">
                  <span>CoA-разрыв сессий</span>
                </TelecomTermTooltip>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <TelecomTermTooltip termKey="blastradius">
                  <span>BlastRADIUS защита</span>
                </TelecomTermTooltip>
              </div>
            </div>
          </div>

          {/* Card 2: AI Agent (Highlights 7 channels) */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-cyan-500/5 dark:from-slate-900 dark:to-cyan-950/20 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-cyan-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/25">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500">
                  7 каналов + голос
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Встроенный AI-ассистент
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Умный оператор первого уровня: проверяет баланс, статус договора, консультирует по
                тарифам и активирует обещанный платёж в Telegram, VK, ЛК и по телефону.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              Около 73% обращений решаются без оператора
            </div>
          </div>

          {/* Card 3: SORM-3 */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/25 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                <TelecomTermTooltip termKey="sorm3">
                  СОРМ-3 (Приказ №573)
                </TelecomTermTooltip>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                13 регламентированных отчётов: абоненты, договоры, IP-сессии, платежи. Готовые
                профили адаптеров под 6 ведущих производителей СОРМ-комплексов.
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Норси-Транс · МФИ Софт · Сигнатек · VAS Experts
            </div>
          </div>

          {/* Card 4: Payments & 54-FZ */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/25 mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Деньги и{' '}
                <TelecomTermTooltip termKey="54fz">
                  кассы 54-ФЗ
                </TelecomTermTooltip>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                ЮKassa, <TelecomTermTooltip termKey="sbp">СБП</TelecomTermTooltip>, Wallet One и
                автоматический разбор банковских выписок 1C (Сбербанк, Альфа-Банк). Фискализация
                через АТОЛ Онлайн с отправкой чеков клиентам.
              </p>
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              Автовыписка счетов и актов юрлицам
            </div>
          </div>

          {/* Card 5: ServiceDesk & CRM */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/25 mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Поддержка и CRM оператора
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Омниканальные тикеты с контролем{' '}
                <TelecomTermTooltip termKey="sla">SLA</TelecomTermTooltip>, Salesbot-сценарии
                привлечения абонентов, канбан-воронки подключения и мобильные наряды для инженеров.
              </p>
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Всё в одном окне без CRM со стороны
            </div>
          </div>

          {/* Card 6: Network Map */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/25 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Карта сети{' '}
                <TelecomTermTooltip termKey="gis">
                  ВОЛС (GIS)
                </TelecomTermTooltip>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Узлы, кабельные трассы, оптические муфты со схемами сварок, опоры ЛЭП и аварийные
                заявки на карте. Проверка тех. возможности подключения при вводе адреса.
              </p>
            </div>
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Импорт из KML / Google Earth в 1 клик
            </div>
          </div>

          {/* Card 7: Subscriber Apps */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-500/25 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Личный кабинет и Приложение
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Приложения для iOS и Android и личный кабинет: баланс и платежи, тариф и услуги,
                обещанный платёж, обращения в поддержку и чат с AI-ассистентом.
              </p>
            </div>
            <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">
              App Store & Google Play
            </div>
          </div>

          {/* Card 8: Warehouse & Stock */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/25 mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Склад ТМЦ и Оборудование
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                Серийный учёт оптических{' '}
                <TelecomTermTooltip termKey="ont">
                  роутеров ONT
                </TelecomTermTooltip>
                , привязка материалов к нарядам монтажа, списание в аренду абоненту и сканирование
                штрихкодов с камеры смартфона.
              </p>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              Инвентаризация и мобильный сканер
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
