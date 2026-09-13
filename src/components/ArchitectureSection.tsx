import React from 'react';
import { Cpu, ArrowDown } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="relative py-14 sm:py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Инженерный стек</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Проверенная надежность без микросервисного хаоса
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Один сервер под Docker Compose: PostgreSQL 17, Redis, Celery и FreeRADIUS.
            Без зоопарка микросервисов — проще сопровождать и восстанавливать.
          </p>
        </div>

        {/* Full Layered Architecture Map */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Логическая схема распределения потоков
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Бесшовная маршрутизация между клиентами, сетевым оборудованием и базами данных
            </p>
          </div>

          {/* Layer 1: Clients & Inbound */}
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-400 text-center">
              1. Клиентский и Внешний периметр
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  Абоненты (ЛК / App)
                </div>
                <div className="text-[11px] text-slate-400">iOS, Android, Web</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  NAS / BNG роутеры
                </div>
                <div className="text-[11px] text-slate-400">RADIUS 1812 / CoA 3799</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  Платёжные шлюзы
                </div>
                <div className="text-[11px] text-slate-400">ЮKassa, СБП, Банки</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  СОРМ-комплекс
                </div>
                <div className="text-[11px] text-slate-400">Защищённый SFTP/FTP</div>
              </div>
            </div>

            {/* Connecting flow */}
            <div className="flex justify-center text-emerald-500 py-1">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>

            {/* Layer 2: Ingress Nginx */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center max-w-xl mx-auto">
              <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                Nginx Reverse Proxy & TLS Let's Encrypt
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Приём запросов и HTTPS-сертификаты Let's Encrypt
              </div>
            </div>

            {/* Connecting flow */}
            <div className="flex justify-center text-emerald-500 py-1">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Layer 3: Docker Compose Application */}
            <div className="p-6 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>DOCKER COMPOSE CONTAINER CLUSTER</span>
                <span>PYTHON 3.11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Django 4.2 + Gunicorn
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    REST API v2, логика биллинга, админка, ServiceDesk, CRM и интеграции
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    FreeRADIUS 3.2.3 Daemon
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Асинхронный rlm_python3 обработчик авторизации и CoA-управления
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Celery + Beat Workers
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Фоновые начисления, авторазбор выписок, СОРМ-экспорт и рассылки
                  </div>
                </div>
              </div>
            </div>

            {/* Connecting flow */}
            <div className="flex justify-center text-emerald-500 py-1">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Layer 4: Storage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-200">
                <div className="font-bold text-sm text-emerald-400">PostgreSQL 17 Primary DB</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Транзакции ACID, таблицы абонентов, PayLog и СОРМ
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-200">
                <div className="font-bold text-sm text-emerald-400">Redis 7 Fast In-Memory</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Кэширование сессий, очередь задач Celery и блокировки
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
