import React from 'react';
import {
  ShieldCheck,
  Server,
  FileText,
  Mail,
  Phone,
  Send,
  ExternalLink,
  Heart,
} from 'lucide-react';

interface FooterProps {
  onOpenDemo: () => void;
  onOpenAi: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDemo, onOpenAi }) => {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-none">
                  СмИТ <span className="text-emerald-400">Биллинг</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  RELEASE v3.6.4 LTS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Автоматизированная система расчетов (АСР) нового поколения для телеком-операторов,
              интернет-провайдеров и закрытых сетей. Полная поддержка FreeRADIUS, СОРМ-3 по 573 приказу,
              54-ФЗ и мобильных приложений.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Реестр отечественного ПО</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-teal-400" />
                <span>Self-Hosted & Cloud</span>
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Платформа
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Возможности системы
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-emerald-400 transition-colors">
                  Все 24 модуля
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-emerald-400 transition-colors">
                  Калькулятор окупаемости
                </a>
              </li>
              <li>
                <a href="#mobile-app" className="hover:text-emerald-400 transition-colors">
                  Мобильное приложение
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-emerald-400 transition-colors">
                  Архитектура и Docker
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-emerald-400 transition-colors">
                  REST API и Webhooks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Law */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Закон и стандарты
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#modules" className="hover:text-emerald-400 transition-colors">
                  СОРМ-3 (Приказ №573)
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-emerald-400 transition-colors">
                  54-ФЗ Онлайн-кассы
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-emerald-400 transition-colors">
                  Выгрузка ЕРРП (Роскомнадзор)
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  152-ФЗ Персональные данные
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                  Тарифы и лицензирование
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Связь с нами
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+78005553426" className="hover:text-white">
                  +7 (800) 555-34-26
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@smit34.ru" className="hover:text-white">
                  info@smit34.ru
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Send className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  Telegram: @smit_billing
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenDemo}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Запросить демо-доступ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 СмИТ Биллинг. Все права защищены. Разработано в РФ для российских телеком-сетей.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Все сервисы онлайн</span>
            </span>
            <button
              onClick={onOpenAi}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Консультант AI
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
