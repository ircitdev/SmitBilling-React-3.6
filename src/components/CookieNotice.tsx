import React, { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

/**
 * Уведомление о куках.
 *
 * Появляется не сразу, а через минуту: человек успевает посмотреть страницу,
 * и окно не встречает его на пороге. Ответ запоминается, поэтому второй раз
 * оно не показывается.
 *
 * Ничего не блокирует: это уведомление, а не согласие на обработку — сайт
 * ставит только свои служебные куки.
 */
const KEY = 'smit_cookie_notice';
/** Через сколько показывать, мс. */
const DELAY = 60_000;

export const CookieNotice: React.FC = () => {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === '1';
    } catch {
      // приватный режим — покажем и не запомним
    }
    if (seen) return;

    const id = window.setTimeout(() => setShow(true), DELAY);
    return () => window.clearTimeout(id);
  }, []);

  if (!show) return null;

  const close = () => {
    setLeaving(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // не запомнилось — покажется в следующий раз, это не страшно
    }
    // даём доиграть уходу
    window.setTimeout(() => setShow(false), 260);
  };

  return (
    <div
      role="status"
      className={`fixed z-[60] left-3 right-3 bottom-3 sm:left-auto sm:right-5 sm:bottom-5 sm:w-[22rem] ${
        leaving ? 'cookie-out' : 'cookie-in'
      }`}
    >
      <div className="glass-card relative rounded-2xl p-4 pr-10 shadow-xl">
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть уведомление"
          className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Мы используем куки
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Только служебные: запоминаем тему оформления и то, что вы уже
              видели это окно. Ничего не передаём третьим сторонам.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
