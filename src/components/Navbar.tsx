import React, { useState } from 'react';
import { Sun, Moon, Monitor, Menu, X, Terminal, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { ThemeMode } from '../types';

interface NavbarProps {
  isDark: boolean;
  themeMode?: ThemeMode;
  onToggleTheme: () => void;
  onSetThemeMode?: (mode: ThemeMode) => void;
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

  // Пункты — как на прежнем billing.smit34.ru; внешние открываются в новой вкладке.
  const navLinks: { href: string; label: string; external?: boolean }[] = [
    { href: '#features', label: 'Возможности' },
    { href: '#modules', label: 'Модули' },
    { href: '#mobile-app', label: 'Приложение' },
    { href: '#pricing', label: 'Тарифы' },
    { href: '#api', label: 'API' },
    { href: '#demo', label: 'Демо' },
    { href: '/compare/', label: 'Сравнение' },
    { href: '/blog/', label: 'Блог' },
    { href: 'https://docs.billing.smit34.ru', label: 'Документация', external: true },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 h-16 z-50 transition-colors duration-300 backdrop-blur-xl border-b ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/60 text-slate-100'
          : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-sm'
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
              3.7
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium">
          {navLinks.map((link) => (
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

          {/* Theme toggle with system sync detection */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
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
            className="relative w-11 h-11 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
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
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
          >
            <span>Демо</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню навигации"
            className="xl:hidden w-11 h-11 sm:w-9 sm:h-9 rounded-lg border flex items-center justify-center border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 p-6 flex flex-col gap-3 text-center animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 text-left">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-emerald-400 px-3 py-3 rounded-lg bg-slate-900/60 hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Theme Preference Selector */}
          <div className="pt-3 pb-2 px-1 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Тема оформления:</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => onSetThemeMode ? onSetThemeMode('system') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Автоматическая синхронизация с системной темой ОС"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Авто ({isDark ? 'Тёмная' : 'Светлая'})</span>
              </button>
              <button
                type="button"
                onClick={() => onSetThemeMode ? onSetThemeMode('dark') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Принудительно тёмная тема"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Тёмная</span>
              </button>
              <button
                type="button"
                onClick={() => onSetThemeMode ? onSetThemeMode('light') : onToggleTheme()}
                className={`px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Принудительно светлая тема"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Светлая</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            {onOpenVideoModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVideoModal();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-slate-800 text-white flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                Смотреть видеопрезентацию (3 мин)
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiDrawer();
              }}
              className="w-full py-2.5 rounded-xl font-semibold text-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Спросить AI-консультанта
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              Запросить демо-доступ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
