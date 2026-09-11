import React, { useState } from 'react';
import {
  Server,
  Layers,
  Database,
  Cpu,
  Terminal,
  ArrowDown,
  Shield,
  Radio,
  CheckCircle,
} from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Быстрый запуск в Docker',
      desc: 'Одна команда `docker compose up -d` разворачивает PostgreSQL 17, Redis 7, Django, FreeRADIUS и Celery за ~15 минут.',
      terminal: `$ docker compose up -d
[+] Running 6/6
 ✔ Network smit_default        Created
 ✔ Container smit-db (PostgreSQL 17)   Started (healthy)
 ✔ Container smit-redis (Redis 7)     Started
 ✔ Container smit-web (Django/Gunicorn) Started
 ✔ Container smit-freeradius (3.2.3)   Started
 ✔ Container smit-celery (workers)     Started
All services up in 14m 28s. Listening on port :8877 ✓`,
    },
    {
      step: '02',
      title: 'Подключение оборудования',
      desc: 'Заводите ваши NAS (MikroTik, Cisco, Juniper), настраиваете RADIUS-секреты, заводите тарифные планы и включаете приём платежей.',
      terminal: `# Регистрация NAS BNG в системе
POST /rest_api/v2/Equipment/
{
  "name": "MikroTik-CCR2004-Core",
  "ip_address": "10.0.0.1",
  "secret": "******",
  "type": "mikrotik_radius",
  "coa_port": 3799,
  "pools": ["100.64.0.0/20"]
}
Response 201 Created: NAS активен, radius-клиенты обновлены.`,
    },
    {
      step: '03',
      title: 'Бесшовная эксплуатация',
      desc: 'Абоненты авторизуются через FreeRADIUS, деньги зачисляются через ЮKassa и банки, СОРМ выгружается по расписанию, AI закрывает 73% обращений.',
      terminal: `# Реальный мониторинг в рантайме:
FreeRADIUS Auth: 4 821 online сессий
Celery Queue: 0 backlog, 12 задач/сек
PayLog: транзакции зачисляются с чеками ОФД
SORM-3: 13/13 отчётов проверены и готовы к выгрузке
AI-Agent: статус 200 OK, время ответа 1.2s`,
    },
  ];

  return (
    <section id="architecture" className="relative py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Инженерный стек и запуск</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Проверенная надежность без микросервисного хаоса
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Один мощный сервер под управлением Docker Compose. Монолитная надёжность, строгая типизация
            и производительность PostgreSQL 17 с мгновенным откликом.
          </p>
        </div>

        {/* 3 Step Interactive Deployment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          {/* Step Selector Buttons */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((st, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  activeStep === idx
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-xl shadow-emerald-500/5'
                    : 'border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                      activeStep === idx
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ШАГ {st.step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-11">
                  {st.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Terminal Console View */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 text-slate-500 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2">bash terminal — deploy@isp-server</span>
                </div>
                <span className="text-emerald-400 text-[11px]">DOCKER READY</span>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {steps[activeStep].terminal}
              </pre>
            </div>
          </div>
        </div>

        {/* Full Layered Architecture Map */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-10 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Логическая схема распределения потоков
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Балансировка запросов, WAF-фильтрация и терминация HTTPS-сертификатов
              </div>
            </div>

            {/* Connecting flow */}
            <div className="flex justify-center text-emerald-500 py-1">
              <ArrowDown className="w-5 h-5" />
            </div>

            {/* Layer 3: Docker Compose Application */}
            <div className="p-6 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>DOCKER COMPOSE CONTAINER CLUSTER</span>
                <span>PYTHON 3.11</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Django 4.2 + Gunicorn
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    REST API v2, логика биллинга, админка, ServiceDesk, CRM и интеграции
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    FreeRADIUS 3.2.3 Daemon
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Асинхронный rlm_python3 обработчик авторизации и CoA-управления
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Celery + Beat Workers
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
