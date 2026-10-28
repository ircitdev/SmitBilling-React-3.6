import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, Menu, X, Terminal, ArrowRight,
  ShieldCheck, Play, HelpCircle, Sparkles, LayoutGrid, Boxes,
  Smartphone, Tag, Code2, MonitorPlay, Scale, Newspaper, BookOpen,
  Calculator, Network, Puzzle, Truck, Mic, Share2, HelpingHand,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  isDark: boolean;
  themeMode?: ThemeMode;
  /** Точка нажатия — от неё раскрывается круг новой темы. */
  onToggleTheme: (origin?: { x: number; y: number }) => void;
  onSetThemeMode?: (mode: ThemeMode, origin?: { x: number; y: number }) => void;
  onOpenDemoModal: (plan?: string) => void;
  onOpenAiDrawer: () => void;
  onOpenVideoModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  themeMode = 'system',
  onToggleTheme,
  onSetThemeMode,
  onOpenDemoModal,
  onOpenAiDrawer,
  onOpenVideoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Шапка «проявляется» при прокрутке: над первым экраном она прозрачная и
  // не отрезает картинку полосой.
  const [scrolled, setScrolled] = useState(false);
  // Закрытие меню проигрывается до конца, поэтому разметка живёт чуть дольше
  // самого состояния «открыто».
  const [menuMounted, setMenuMounted] = useState(false);


  /** Центр нажатой кнопки — отсюда пойдёт круг новой темы. */
  const originOf = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) { setMenuMounted(true); return; }
    // ждём конца анимации закрытия
    const id = window.setTimeout(() => setMenuMounted(false), 220);
    return () => window.clearTimeout(id);
  }, [mobileMenuOpen]);

  // Под открытым меню страница не должна ехать: палец промахивался мимо
  // пункта и уводил фон. Фиксируем тело на текущем смещении и возвращаем
  // прокрутку на прежнее место — overflow:hidden на body здесь не держит,
  // страницу прокручивает корень документа.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.position = 'fixed';
    body.style.top = `${-y}px`;
    body.style.width = '100%';
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, y);
    };
  }, [mobileMenuOpen]);

  // Пункты — как на прежнем billing.smit34.ru; внешние открываются в новой вкладке.
  const DOCS_URL = 'https://docs.billing.smit34.ru';

  const navLinks: { href: string; label: string; external?: boolean;
                    mobileOnly?: boolean; icon: React.ComponentType<{ className?: string }>;
                    desktop?: boolean }[] = [
    // desktop: false — пункт только в мобильном меню, чтобы шапка на десктопе
    // не переполнялась; в меню телефона места хватает на весь список.
    { href: '#features', label: 'Возможности', icon: LayoutGrid, desktop: true },
    { href: '#modules', label: 'Модули', icon: Boxes, desktop: true },
    { href: '#widgets', label: 'Виджеты', icon: Puzzle },
    { href: '#mobile-app', label: 'Приложение', icon: Smartphone, desktop: true },
    { href: '#calculator', label: 'Калькулятор', icon: Calculator },
    { href: '#pricing', label: 'Тарифы', icon: Tag, desktop: true },
    { href: '#api', label: 'API', icon: Code2, desktop: true },
    { href: '#integrations', label: 'Интеграции', icon: Network },
    { href: '#architecture', label: 'Архитектура', icon: Share2 },
    { href: '#migrate', label: 'Миграция', icon: Truck },
    { href: '#demo', label: 'Демо', icon: MonitorPlay, desktop: true },
    { href: '#podcast', label: 'Подкаст', icon: Mic },
    { href: '#faq', label: 'Вопросы', icon: HelpingHand },
    { href: '/compare/', label: 'Сравнение', icon: Scale, desktop: true },
    { href: '/blog/', label: 'Блог', icon: Newspaper, desktop: true },
    // На десктопе документация вынесена кнопкой со значком вопроса рядом с
    // «Видео»: в меню она занимала место, а нужна точечно.
    { href: DOCS_URL, label: 'Документация', external: true, icon: BookOpen },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      } ${
        scrolled
          ? `backdrop-blur-xl border-b ${
              isDark
                ? 'bg-slate-950/80 border-slate-800/60'
                : 'bg-white/85 border-slate-200/80 shadow-sm'
            }`
          // до прокрутки — ни фона, ни рамки, ни тени
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            С
          </div>
          <div className="flex items-baseline gap-1.5 font-bold tracking-tight text-base sm:text-lg">
            <span>СмИТ Биллинг</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              3.9
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium">
          {navLinks.filter((l) => l.desktop).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5">
          {/* Документация — значком: ссылка ушла из меню */}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Документация"
            aria-label="Документация"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </a>

          {/* Quick Video Button */}
          {onOpenVideoModal && (
            <button
              onClick={onOpenVideoModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="Смотреть видеопрезентацию"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Видео</span>
            </button>
          )}

          {/* AI Helper trigger button */}
          <button
            id="nav-ai-btn"
            onClick={onOpenAiDrawer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all cursor-pointer"
            title="Задать вопрос AI-агенту"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI-чат
          </button>

          {/* На телефоне вместо переключателя темы — AI: тема остаётся в
              меню, а спросить AI нужно чаще. */}
          <button
            type="button"
            onClick={onOpenAiDrawer}
            aria-label="Задать вопрос AI-агенту"
            title="Задать вопрос AI-агенту"
            className="sm:hidden relative w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer text-emerald-600 dark:text-emerald-400"
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Theme toggle with system sync detection */}
          <button
            id="theme-toggle-btn"
            onClick={(e) => onToggleTheme(originOf(e))}
            aria-label={
              themeMode === 'system'
                ? `Тема: Авто-синхронизация с системой (ОС: ${isDark ? 'тёмная' : 'светлая'}). Нажмите для переключения`
                : isDark
                ? 'Тема: Тёмная. Нажмите для переключения на светлую'
                : 'Тема: Светлая. Нажмите для авто-синхронизации с ОС'
            }
            title={
              themeMode === 'system'
                ? `Тема: Авто-синхронизация с ОС (${isDark ? 'тёмная' : 'светлая'}). Нажмите для переключения на ${isDark ? 'светлую' : 'тёмную'}`
                : themeMode === 'dark'
                ? 'Тема: Тёмная (пользовательский выбор). Нажмите для переключения на светлую'
                : 'Тема: Светлая (пользовательский выбор). Нажмите для авто-синхронизации с ОС'
            }
            className="hidden sm:flex relative w-9 h-9 rounded-lg items-center justify-center transition-all cursor-pointer text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {themeMode === 'system' ? (
              <>
                <Monitor className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span
                  className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  title="Синхронизировано с ОС"
                />
              </>
            ) : isDark ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Demo CTA */}
          <button
            id="nav-demo-btn"
            onClick={() => onOpenDemoModal()}
            // высота как у «Видео»: py-2 делал кнопку выше соседних
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
          >
            <span>Демо</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню навигации"
            className="xl:hidden w-11 h-11 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-200 sm:border sm:border-slate-300 sm:dark:border-slate-800 sm:bg-slate-100 sm:dark:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuMounted && (
        <div
          className={`nav-drawer xl:hidden fixed inset-x-0 top-16 bottom-0 overflow-y-auto p-6 flex flex-col gap-3 text-center shadow-2xl ${
            mobileMenuOpen ? 'nav-drawer-in' : 'nav-drawer-out'
          }`}
        >
          <div className="grid grid-cols-2 gap-2 text-left">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm font-medium text-slate-200 hover:text-emerald-400 px-3 py-3 rounded-lg bg-slate-900/60 hover:bg-slate-800"
              >
                <link.icon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </div>


          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              Запросить демо-доступ
            </button>

          {/* Переключатель темы — в самом низу меню: в середине он
              разрывал список разделов. */}
          {/* Mobile Theme Preference Selector */}
          <div className="pt-3 pb-2 px-1 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Тема</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={(e) => onSetThemeMode ? onSetThemeMode('system', originOf(e)) : onToggleTheme(originOf(e))}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Автоматическая синхронизация с системной темой ОС"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={(e) => onSetThemeMode ? onSetThemeMode('dark', originOf(e)) : onToggleTheme(originOf(e))}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Принудительно тёмная тема"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => onSetThemeMode ? onSetThemeMode('light', originOf(e)) : onToggleTheme(originOf(e))}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Принудительно светлая тема"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </header>
  );
};
