// AI-консультант — виджет лицензионного сервера (widget.js подключён в index.html),
// тот же, что на прежнем лендинге. У него база знаний, ключи и расчёт бизнес-кейса
// на сервере, а не в браузере. Если виджет не загрузился (блокировщик, нет сети),
// вызывается запасной вариант.

type SmitWidgetApi = {
  open: (tab?: 'chat' | 'book' | 'case') => void;
  close: () => void;
  chat: () => void;
  ask: (text: string) => void;
  book: () => void;
  caseStudy?: (prefill?: { subscribers?: number; company?: string; billing?: string }) => void;
  isReady?: boolean;
};

declare global {
  interface Window {
    SmitWidget?: SmitWidgetApi;
    ymGoal?: (goal: string, params?: Record<string, unknown>) => void;
  }
}

const READY_TIMEOUT_MS = 4000;

function whenWidgetReady(): Promise<SmitWidgetApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.SmitWidget?.isReady) return Promise.resolve(window.SmitWidget);
  return new Promise((resolve) => {
    const done = () => {
      document.removeEventListener('smit-widget-ready', done);
      clearTimeout(timer);
      resolve(window.SmitWidget?.isReady ? window.SmitWidget : null);
    };
    const timer = setTimeout(done, READY_TIMEOUT_MS);
    document.addEventListener('smit-widget-ready', done);
  });
}

/** Открыть разговор с AI-консультантом; с вопросом — сразу задать его. */
export async function openAiChat(question?: string, fallback?: () => void): Promise<void> {
  const widget = await whenWidgetReady();
  if (!widget) {
    fallback?.();
    return;
  }
  const q = (question || '').trim();
  if (q) widget.ask(q);
  else widget.chat();
}

/** Вкладка «Бизнес-кейс» виджета — с тем, что посетитель уже ввёл на странице. */
export async function openBusinessCase(
  prefill?: { subscribers?: number },
  fallback?: () => void
): Promise<void> {
  const widget = await whenWidgetReady();
  if (!widget) {
    fallback?.();
    return;
  }
  if (widget.caseStudy) widget.caseStudy(prefill);
  else widget.open('case');
}

/** Цель Яндекс.Метрики (счётчик подключён в index.html). */
export function reachGoal(goal: string, params?: Record<string, unknown>): void {
  try {
    window.ymGoal?.(goal, params);
  } catch {
    /* аналитика не должна ломать страницу */
  }
}
