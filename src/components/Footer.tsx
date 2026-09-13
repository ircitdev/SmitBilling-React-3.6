import React from 'react';
import { Mail, Phone, Send, ExternalLink, FileText, Bot } from 'lucide-react';

interface FooterProps {
  onOpenDemo: () => void;
  onOpenAi: () => void;
}

// Контакты, ресурсы и правовые страницы — те же, что на прежнем billing.smit34.ru.
const PRODUCT_LINKS = [
  { href: '#features', label: 'Возможности' },
  { href: '#modules', label: 'Модули' },
  { href: '#mobile-app', label: 'Приложение' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#api', label: 'API' },
  { href: '/compare/', label: 'Сравнение' },
  { href: '/blog/', label: 'Блог' },
];

const RESOURCE_LINKS = [
  { href: 'https://docs.billing.smit34.ru', label: 'Документация', external: true },
  { href: 'https://license.billing.smit34.ru/developers/', label: 'Разработчикам', external: true },
  { href: 'https://docs.billing.smit34.ru/pages/api.html', label: 'API Reference', external: true },
  { href: 'https://docs.billing.smit34.ru/pages/installation.html', label: 'Установка', external: true },
  { href: 'https://docs.billing.smit34.ru/pages/troubleshooting.html', label: 'Частые проблемы', external: true },
  { href: '/SMIT_Billing_KP.pdf', label: 'Коммерческое предложение (PDF)', external: true },
  { href: 'https://t.me/smitbillingdev', label: 'Канал разработки', external: true },
];

const LEGAL_LINKS = [
  { href: '/license/', label: 'Лицензионный договор' },
  { href: '/privacy.html', label: 'Конфиденциальность' },
  { href: '/support.html', label: 'Поддержка' },
  { href: '/copyright.html', label: 'Авторские права' },
];

const linkClass = 'inline-block py-1.5 sm:py-0 hover:text-emerald-400 transition-colors';

export const Footer: React.FC<FooterProps> = ({ onOpenDemo, onOpenAi }) => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 mb-12">
          {/* Бренд */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
                С
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  СмИТ <span className="text-emerald-400">Биллинг</span> 3.6
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  Единая платформа · 24 модуля
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Биллинговая платформа для операторов связи и сервис-провайдеров. Python 3.11, Django 4.2,
              PostgreSQL 17. Мобильное приложение iOS/Android, своя Поддержка и CRM, AI-агент.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <a
                href="https://t.me/smit34"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>Telegram</span>
              </a>
              <a
                href="https://vk.com/smit34"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>ВКонтакте</span>
              </a>
            </div>
          </div>

          {/* Продукт */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Продукт</h4>
            <ul className="space-y-1 sm:space-y-2.5 text-sm sm:text-xs">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ресурсы */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Ресурсы</h4>
            <ul className="space-y-1 sm:space-y-2.5 text-sm sm:text-xs">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className={`${linkClass} inline-flex items-center gap-1.5`}
                  >
                    {l.href.endsWith('.pdf') && <FileText className="w-3.5 h-3.5" />}
                    <span>{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Контакты</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:uspeshnyy@billing.smit34.ru" className="hover:text-white break-all">
                  uspeshnyy@billing.smit34.ru
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:support@smit34.ru" className="hover:text-white">
                  support@smit34.ru
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+79169535760" className="hover:text-white">
                  +7 916-953-57-60
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+79222248165" className="hover:text-white">
                  +7 922-224-81-65
                </a>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={onOpenDemo}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Запросить демо
                </button>
                <button
                  onClick={onOpenAi}
                  className="w-full py-2 px-3 rounded-xl border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 text-xs font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Спросить AI-консультанта</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя строка */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 ООО «СмИТ». Все права защищены.</div>
          <nav aria-label="Правовая информация" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
