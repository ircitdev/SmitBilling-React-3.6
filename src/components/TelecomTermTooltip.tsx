import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Sparkles, Shield, Cpu, Zap, X } from 'lucide-react';

export interface TermDefinition {
  term: string;
  title: string;
  category: string;
  icon?: 'network' | 'shield' | 'bot' | 'chip' | 'bolt';
  summary: string;
  businessImpact: string;
  smitAdvantage: string;
}

export const TELECOM_TERMS: Record<string, TermDefinition> = {
  'freeradius': {
    term: 'FreeRADIUS',
    title: 'FreeRADIUS 3.2.3 (AAA-сервер)',
    category: 'Сетевая авторизация L2/L3',
    icon: 'network',
    summary:
      'Мировой промышленный стандарт высокопроизводительного сервера аутентификации, авторизации и аккаунтинга (AAA) для телеком-операторов.',
    businessImpact:
      'Мгновенная авторизация тысяч абонентов без зависания роутеров и задержек при подключении (отклик 0.03 мс).',
    smitAdvantage:
      'Асинхронный Python-модуль авторизации прямо в ядре, автоматическая репликация между BNG и встроенный кэш сессий.',
  },
  'sorm3': {
    term: 'СОРМ-3',
    title: 'СОРМ-3 (Приказ Минкомсвязи №573)',
    category: 'Госрегулирование и безопасность',
    icon: 'shield',
    summary:
      'Государственная система сбора и хранения информации о пользователях, договорах, платежах и интернет-сессиях на срок до 3 лет.',
    businessImpact:
      'Обязательное лицензионное требование в РФ. Исключает штрафы до 500 000 ₽ и риск отзыва лицензии оператора связи.',
    smitAdvantage:
      '13 готовых форматов выгрузок, полная автоматизация cron-задач и сертифицированные профили для Норси-Транс, МФИ Софт, Сигнатек и VAS Experts.',
  },
  'pppoe': {
    term: 'PPPoE',
    title: 'PPPoE (Point-to-Point Protocol over Ethernet)',
    category: 'Туннельный протокол доступа',
    icon: 'network',
    summary:
      'Сетевой протокол инкапсуляции кадров PPP в Ethernet с аутентификацией по логину и паролю. Классика для FTTB/FTTH сетей.',
    businessImpact:
      'Позволяет строго изолировать абонентов на канальном уровне и ограничивать сессии при нулевом балансе.',
    smitAdvantage:
      'Поддержка параллельных пулов белых и серых IP, динамический шейпинг без сброса соединения.',
  },
  'ipoe': {
    term: 'IPoE (DHCP Option 82)',
    title: 'IPoE и DHCP Option 82',
    category: 'Беспарольная авторизация',
    icon: 'bolt',
    summary:
      'Технология прозрачной авторизации абонента по порту управляемого коммутатора доступа без ввода логина и пароля.',
    businessImpact:
      'Снижает количество обращений в техподдержку на 40%: абонент просто вставляет кабель в ПК или роутер — интернет работает.',
    smitAdvantage:
      'Автоматическое распознавание Agent Circuit ID и Remote ID для Eltex, D-Link, SNR, TP-Link и Huawei.',
  },
  'coapod': {
    term: 'CoA / PoD',
    title: 'CoA / PoD (RFC 5176)',
    category: 'Управление сессиями на BNG',
    icon: 'bolt',
    summary:
      'Change of Authorization & Packet of Disconnect — протоколы управления параметрами активной абонентской сессии «на лету».',
    businessImpact:
      'Мгновенная блокировка должника или смена скорости (турбокнопка) без разрыва физического линка и ожидания релиза DHCP.',
    smitAdvantage:
      'Прямая отправка CoA-пакетов на MikroTik RouterOS v6/v7, Cisco ASR и Linux BNG за 15 миллисекунд.',
  },
  'blastradius': {
    term: 'BlastRADIUS',
    title: 'Защита от BlastRADIUS (CVE-2024-3596)',
    category: 'Сетевая безопасность',
    icon: 'shield',
    summary:
      'Критическая мировая уязвимость в протоколе RADIUS/UDP, позволяющая злоумышленнику подделывать ответы Access-Accept без знания секрета.',
    businessImpact:
      'Защищает биллинг от несанкционированного доступа к интернету и перехвата учетных записей абонентов.',
    smitAdvantage:
      'Обязательная валидация атрибута Message-Authenticator и опциональный RADIUS-over-TLS (RadSec).',
  },
  '54fz': {
    term: '54-ФЗ',
    title: '54-ФЗ и фискализация (Онлайн-кассы)',
    category: 'Налоговое законодательство',
    icon: 'shield',
    summary:
      'Закон РФ, требующий формирования электронного фискального чека и его отправки в ОФД/ФНС при любом платеже абонента.',
    businessImpact:
      'Исключает налоговые штрафы (от 75% до 100% суммы расчета) за пропущенные чеки при автоплатежах и переводах СБП.',
    smitAdvantage:
      'Прямая фоновая фискализация через АТОЛ Онлайн, Orange Data и Комплекс 54-ФЗ с отправкой чека по SMS и Email.',
  },
  'sbp': {
    term: 'СБП',
    title: 'СБП (Система быстрых платежей)',
    category: 'Платежные технологии',
    icon: 'bolt',
    summary:
      'Сервис Банка России для мгновенной оплаты по динамическому QR-коду или платежной ссылке в приложении банка.',
    businessImpact:
      'Экономит бюджет оператора: комиссия СБП составляет всего 0.4%–0.7% против 2.0%–2.5% у классического интернет-эквайринга.',
    smitAdvantage:
      'Генерация QR-кода на оплату в ЛК, в мобильном приложении и отправка ссылки на СБП в чат-боте Telegram при нулевом балансе.',
  },
  'sla': {
    term: 'SLA',
    title: 'Контроль SLA (Service Level Agreement)',
    category: 'Стандарты техподдержки',
    icon: 'chip',
    summary:
      'Нормативное время первой реакции оператора и максимальный срок устранения аварий, зафиксированные в регламенте.',
    businessImpact:
      'Устраняет отток премиальных B2B и B2C абонентов благодаря контролю скорости работы диспетчеров и выездных бригад.',
    smitAdvantage:
      'Автоматический эскалационный таймер, цветовая дифференциация дедлайнов и уведомления дежурного инженера в Telegram.',
  },
  'gis': {
    term: 'ВОЛС (GIS)',
    title: 'Карта сети ВОЛС и GIS-паспортизация',
    category: 'Оптическая инфраструктура',
    icon: 'network',
    summary:
      'Спутниковая геоинформационная карта кабельных трасс, оптических кроссов (ODF), муфт, сплиттеров и опор ЛЭП.',
    businessImpact:
      'Сокращает время поиска места обрыва кабеля аварийной бригадой в 4 раза по показаниям оптического рефлектометра (OTDR).',
    smitAdvantage:
      'Интерактивная схема разварки волокон внутри каждой муфты и автоматическая проверка тех. возможности подключения по адресу.',
  },
  'ont': {
    term: 'ONT / GPON',
    title: 'ONT (Optical Network Terminal)',
    category: 'Пассивные оптические сети (xPON)',
    icon: 'chip',
    summary:
      'Абонентский оптический модем/роутер, устанавливаемый в помещении клиента в сетях GPON, TurboGEPON или XG-PON.',
    businessImpact:
      'Серийный учет оборудования исключает потерю дорогостоящих роутеров при расторжении договоров и переездах абонентов.',
    smitAdvantage:
      'Автоматическая привязка GPON Serial к порту OLT (ZTE, Huawei, BDCOM) и сканирование штрихкодов с камеры инженера.',
  },
};

interface TelecomTermTooltipProps {
  termKey: keyof typeof TELECOM_TERMS | string;
  children?: React.ReactNode;
  inline?: boolean;
}

export const TelecomTermTooltip: React.FC<TelecomTermTooltipProps> = ({
  termKey,
  children,
  inline = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const def = TELECOM_TERMS[termKey.toLowerCase()];
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  if (!def) {
    return <>{children}</>;
  }

  const renderIcon = () => {
    switch (def.icon) {
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-purple-400" />;
      case 'chip':
        return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      case 'bolt':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'network':
      default:
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <span
      ref={tooltipRef}
      className={`relative ${inline ? 'inline-flex items-center gap-1' : 'inline-block'}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label={`Справка по термину: ${def.title}`}
        className="inline-flex items-center gap-1 group text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/40 rounded-sm"
      >
        <span className="border-b border-dashed border-emerald-500/40 group-hover:border-emerald-500 transition-colors">
          {children || def.term}
        </span>
        <HelpCircle className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors opacity-70 group-hover:opacity-100 flex-shrink-0" />
      </button>

      {/* Floating Glassmorphic Telecom Tooltip Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                {renderIcon()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">{def.title}</h4>
                <span className="text-[10px] font-mono text-emerald-400">{def.category}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
            {def.summary}
          </p>

          {/* Business & Smit Pillars */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[10px]">
            <div className="flex items-start gap-1.5 text-amber-300/90">
              <span className="font-semibold text-amber-400 flex-shrink-0">Ценность для ISP:</span>
              <span className="text-slate-300">{def.businessImpact}</span>
            </div>
            <div className="flex items-start gap-1.5 text-emerald-300/90">
              <span className="font-semibold text-emerald-400 flex-shrink-0">В СмИТ:</span>
              <span className="text-slate-300">{def.smitAdvantage}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2.5 h-2.5 border-r border-b border-slate-700/80 bg-slate-900 rotate-45" />
        </div>
      )}
    </span>
  );
};
