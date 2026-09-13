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
      'Абонент подключается, только если договор активен и баланс позволяет; адрес и скорость приходят из тарифа.',
    smitAdvantage:
      'Обработчики авторизации на Python внутри FreeRADIUS: логин, баланс, пул адресов и параметры тарифа в одном ответе.',
  },
  'sorm3': {
    term: 'СОРМ-3',
    title: 'СОРМ-3 (Приказ Минкомсвязи №573)',
    category: 'Госрегулирование и безопасность',
    icon: 'shield',
    summary:
      'Государственная система сбора и хранения информации о пользователях, договорах, платежах и интернет-сессиях на срок до 3 лет.',
    businessImpact:
      'Обязательное требование для оператора связи: нарушения грозят штрафами и приостановкой лицензии.',
    smitAdvantage:
      '13 отчётов по приказу №573, выгрузка по расписанию и готовые профили форматов под 6 комплексов СОРМ (Норси-Транс, МФИ Софт, Сигнатек, VAS Experts и др.).',
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
      'Абоненту не нужно вводить логин и пароль: подключил кабель — интернет работает, меньше звонков в поддержку.',
    smitAdvantage:
      'Привязка абонента к порту коммутатора по Option 82; формат полей настраивается под модель коммутатора.',
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
      'Команда разрыва сессии уходит на все NAS параллельно, по каждому видно ответ: принято или сессии нет.',
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
      'Проверка атрибута Message-Authenticator в ответах RADIUS.',
  },
  '54fz': {
    term: '54-ФЗ',
    title: '54-ФЗ и фискализация (Онлайн-кассы)',
    category: 'Налоговое законодательство',
    icon: 'shield',
    summary:
      'Закон РФ, требующий формирования электронного фискального чека и его отправки в ОФД/ФНС при любом платеже абонента.',
    businessImpact:
      'Помогает избежать штрафов за непробитые чеки: по КоАП это от 75 до 100% суммы расчёта.',
    smitAdvantage:
      'Своя касса АТОЛ на каждую организацию: чеки по безналу из банковских выписок и очередь отправки в ОФД. Платежи через ЮKassa и Wallet One фискализируют сами агрегаторы.',
  },
  'sbp': {
    term: 'СБП',
    title: 'СБП (Система быстрых платежей)',
    category: 'Платежные технологии',
    icon: 'bolt',
    summary:
      'Сервис Банка России для мгновенной оплаты по динамическому QR-коду или платежной ссылке в приложении банка.',
    businessImpact:
      'Обычно дешевле эквайринга по картам: комиссия зависит от банка и договора.',
    smitAdvantage:
      'Приём оплат через ЮKassa: СБП доступна абоненту, если способ включён в кабинете ЮKassa.',
  },
  'sla': {
    term: 'SLA',
    title: 'Контроль SLA (Service Level Agreement)',
    category: 'Стандарты техподдержки',
    icon: 'chip',
    summary:
      'Нормативное время первой реакции оператора и максимальный срок устранения аварий, зафиксированные в регламенте.',
    businessImpact:
      'Видно, какие заявки близки к просрочке, — клиент не уходит из-за забытого обращения.',
    smitAdvantage:
      'Автоматический эскалационный таймер, цветовая дифференциация дедлайнов и уведомления дежурного инженера в Telegram.',
  },
  'gis': {
    term: 'ВОЛС (GIS)',
    title: 'Карта сети ВОЛС и GIS-паспортизация',
    category: 'Оптическая инфраструктура',
    icon: 'network',
    summary:
      'Карта кабельных трасс, узлов, муфт, зон покрытия и опор электросетей.',
    businessImpact:
      'Бригада видит трассы, муфты и опоры на карте — место аварии искать быстрее, чем по бумажным схемам.',
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
      'Серийные номера на складе: приход по накладной, выдача монтажнику, установка клиенту и возврат.',
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
