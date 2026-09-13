import React, { useState, useEffect, useRef, lazy, Suspense, startTransition } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { BillingModule, ThemeMode } from './types';
import { MEDIA_URLS } from './data/landingData';
import { openAiChat, openBusinessCase } from './lib/aiWidget';
import { Play } from 'lucide-react';

// Первый экран (шапка, hero, счётчики) — в основном файле: он нужен сразу.
// Остальное грузится отдельными частями, калькулятор — вместе с библиотекой графиков.
const chunks = {
  FeaturesBento: () => import('./components/FeaturesBento'),
  HowItWorksSection: () => import('./components/HowItWorksSection'),
  KnowledgeGraphSection: () => import('./components/KnowledgeGraphSection'),
  DemoSection: () => import('./components/DemoSection'),
  ScreenshotsGallery: () => import('./components/ScreenshotsGallery'),
  ModulesSection: () => import('./components/ModulesSection'),
  MoneyVideoSection: () => import('./components/MoneyVideoSection'),
  Calculator: () => import('./components/Calculator'),
  MobileAppShowcase: () => import('./components/MobileAppShowcase'),
  WidgetsMarketplace: () => import('./components/WidgetsMarketplace'),
  ArchitectureSection: () => import('./components/ArchitectureSection'),
  IntegrationsSection: () => import('./components/IntegrationsSection'),
  MigrationSection: () => import('./components/MigrationSection'),
  ApiExplorer: () => import('./components/ApiExplorer'),
  PricingSection: () => import('./components/PricingSection'),
  PodcastSection: () => import('./components/PodcastSection'),
  BlogSection: () => import('./components/BlogSection'),
  FaqSection: () => import('./components/FaqSection'),
  Footer: () => import('./components/Footer'),
  ModuleDetailModal: () => import('./components/ModuleDetailModal'),
  DemoModal: () => import('./components/DemoModal'),
  VideoModal: () => import('./components/VideoModal'),
};
const loadAllChunks = () => Promise.all(Object.values(chunks).map((load) => load()));

const FeaturesBento = lazy(() => chunks.FeaturesBento().then((m) => ({ default: m.FeaturesBento })));
const HowItWorksSection = lazy(() => chunks.HowItWorksSection().then((m) => ({ default: m.HowItWorksSection })));
const KnowledgeGraphSection = lazy(() => chunks.KnowledgeGraphSection().then((m) => ({ default: m.KnowledgeGraphSection })));
const DemoSection = lazy(() => chunks.DemoSection().then((m) => ({ default: m.DemoSection })));
const ScreenshotsGallery = lazy(() => chunks.ScreenshotsGallery().then((m) => ({ default: m.ScreenshotsGallery })));
const ModulesSection = lazy(() => chunks.ModulesSection().then((m) => ({ default: m.ModulesSection })));
const MoneyVideoSection = lazy(() => chunks.MoneyVideoSection().then((m) => ({ default: m.MoneyVideoSection })));
const Calculator = lazy(() => chunks.Calculator().then((m) => ({ default: m.Calculator })));
const MobileAppShowcase = lazy(() => chunks.MobileAppShowcase().then((m) => ({ default: m.MobileAppShowcase })));
const WidgetsMarketplace = lazy(() => chunks.WidgetsMarketplace().then((m) => ({ default: m.WidgetsMarketplace })));
const ArchitectureSection = lazy(() => chunks.ArchitectureSection().then((m) => ({ default: m.ArchitectureSection })));
const IntegrationsSection = lazy(() => chunks.IntegrationsSection().then((m) => ({ default: m.IntegrationsSection })));
const MigrationSection = lazy(() => chunks.MigrationSection().then((m) => ({ default: m.MigrationSection })));
const ApiExplorer = lazy(() => chunks.ApiExplorer().then((m) => ({ default: m.ApiExplorer })));
const PricingSection = lazy(() => chunks.PricingSection().then((m) => ({ default: m.PricingSection })));
const PodcastSection = lazy(() => chunks.PodcastSection().then((m) => ({ default: m.PodcastSection })));
const BlogSection = lazy(() => chunks.BlogSection().then((m) => ({ default: m.BlogSection })));
const FaqSection = lazy(() => chunks.FaqSection().then((m) => ({ default: m.FaqSection })));
const Footer = lazy(() => chunks.Footer().then((m) => ({ default: m.Footer })));
const ModuleDetailModal = lazy(() => chunks.ModuleDetailModal().then((m) => ({ default: m.ModuleDetailModal })));
const DemoModal = lazy(() => chunks.DemoModal().then((m) => ({ default: m.DemoModal })));
const VideoModal = lazy(() => chunks.VideoModal().then((m) => ({ default: m.VideoModal })));

// Окно не нужно, пока его не открыли: иначе его код качается ещё до первой отрисовки.
// После первого открытия остаётся смонтированным, чтобы не грузиться заново.
function MountOnFirstOpen({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return open || opened ? <Suspense fallback={null}>{children}</Suspense> : null;
}

// Дальнейшая работа (секции, предзагрузка частей кода) — только после первой отрисовки:
// на медленной сети запросы, начатые раньше, отодвигают появление первого экрана.
function afterFirstPaint(cb: () => void) {
  let done = false;
  const run = () => {
    if (!done) {
      done = true;
      cb();
    }
  };
  if (performance.getEntriesByName('first-contentful-paint').length) {
    run();
    return;
  }
  try {
    const observer = new PerformanceObserver((list) => {
      if (list.getEntriesByName('first-contentful-paint').length) {
        observer.disconnect();
        run();
      }
    });
    observer.observe({ type: 'paint', buffered: true });
  } catch {
    // браузер без Paint Timing — остаётся запасной путь ниже
  }
  // запасной путь: нет Paint Timing или вкладка открыта в фоне и не рисуется
  const fallback = () => window.setTimeout(run, 3000);
  if (document.readyState === 'complete') fallback();
  else window.addEventListener('load', fallback, { once: true });
}

const idle = (cb: () => void) =>
  window.requestIdleCallback ? window.requestIdleCallback(cb, { timeout: 800 }) : window.setTimeout(cb, 16);
const cancelIdle = (handle: number) =>
  window.cancelIdleCallback ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);

const hashTarget = (href: string | null) => {
  if (!href || href.length < 2 || href[0] !== '#') return '';
  try {
    return decodeURIComponent(href.slice(1));
  } catch {
    return href.slice(1);
  }
};

// Секции ниже первого экрана монтируются по одной, когда браузер свободен: разом
// два десятка секций держали поток на телефоне несколько секунд. Текст страницы
// всё равно появляется целиком — и для поисковиков, и для поиска по странице.
// Переход к якорю (из адреса или по ссылке) показывает всё сразу и доезжает до цели.
function useStagedSections(total: number) {
  const initialTarget = hashTarget(window.location.hash);
  const [shown, setShown] = useState(initialTarget ? total : 0);
  const [painted, setPainted] = useState(false);
  const pendingTarget = useRef(initialTarget);

  useEffect(() => {
    const showAllAndGo = (id: string) => {
      if (!id || document.getElementById(id)) return;
      pendingTarget.current = id;
      setShown(total);
    };
    const onHashChange = () => showAllAndGo(hashTarget(window.location.hash));
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (link) showAllAndGo(hashTarget(link.getAttribute('href')));
    };
    // после первой отрисовки: секции начинают появляться, части кода качаются параллельно
    let active = true;
    afterFirstPaint(() => {
      if (!active) return;
      setPainted(true);
      idle(() => void loadAllChunks());
    });
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onClick, true);
    return () => {
      active = false;
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onClick, true);
    };
  }, [total]);

  useEffect(() => {
    if (!painted || shown >= total) return;
    const handle = idle(() => startTransition(() => setShown((n) => Math.min(total, n + 1))));
    return () => cancelIdle(handle);
  }, [shown, total, painted]);

  useEffect(() => {
    if (shown < total) return;
    const id = pendingTarget.current;
    if (!id) return;
    pendingTarget.current = '';
    // Секции выше цели появляются не в один кадр — цель уезжает вниз. Доводим до неё
    // несколько раз, пока пользователь сам не начал листать или не перешёл к другому якорю.
    let userScrolled = false;
    const stop = () => { userScrolled = true; };
    // клик по той же ссылке тоже меняет якорь — это не уход к другой цели
    const onHashChange = () => {
      if (hashTarget(window.location.hash) !== id) userScrolled = true;
    };
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    inputs.forEach((type) => window.addEventListener(type, stop, { passive: true, once: true }));
    window.addEventListener('hashchange', onHashChange);
    const timers: number[] = [];
    const align = () => {
      const el = document.getElementById(id);
      if (!el || userScrolled) return;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(el.getBoundingClientRect().top - padding) > 4) el.scrollIntoView();
    };
    loadAllChunks().then(() => {
      [0, 250, 700, 1500].forEach((ms) => timers.push(window.setTimeout(align, ms)));
    });
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      inputs.forEach((type) => window.removeEventListener(type, stop));
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [shown, total]);

  return shown;
}

export default function App() {
  // Theme state: supports 'system' | 'dark' | 'light' with automatic OS preference sync
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smit_billing_theme');
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved as ThemeMode;
      }
    }
    // Default to 'system' to automatically detect and synchronize with OS theme on initial load
    return 'system';
  });

  // Track the OS/browser preferred color scheme dynamically
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Fallback default
  });

  // Modal & Drawer states
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<BillingModule | null>(null);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState('Pro');
  const [subscriberCountForDemo, setSubscriberCountForDemo] = useState(1500);
  const [demoCompanyName, setDemoCompanyName] = useState('');
  const [demoComment, setDemoComment] = useState('');

  // Listen for system-level color scheme changes in real-time
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Ensure state matches current query on mount
    setSystemPrefersDark(mediaQuery.matches);

    const handleSystemChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if ((mediaQuery as unknown as { addListener?: (cb: (e: MediaQueryListEvent) => void) => void }).addListener) {
      (mediaQuery as unknown as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else if ((mediaQuery as unknown as { removeListener?: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener) {
        (mediaQuery as unknown as { removeListener: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener(handleSystemChange);
      }
    };
  }, []);

  // Compute active dark mode state
  const isDark = themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';

  // Synchronize document root classes and meta theme-color with current dark state
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDark ? '#020617' : '#f8fafc');
    }
  }, [isDark]);

  // Persist theme preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smit_billing_theme', themeMode);
    }
  }, [themeMode]);

  // Toggle theme cycling: system -> explicit opposite -> other -> back to system
  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === 'system') {
        // From system, switch to the opposite of current system theme
        return systemPrefersDark ? 'light' : 'dark';
      } else if (prev === 'dark') {
        return 'light';
      } else {
        return 'system';
      }
    });
  };

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleOpenDemo = (
    planName = 'Pro',
    subscribers = 1500,
    companyName = '',
    comment = ''
  ) => {
    setSelectedPlanForDemo(planName);
    setSubscriberCountForDemo(subscribers);
    setDemoCompanyName(companyName);
    setDemoComment(comment);
    setIsDemoModalOpen(true);
  };

  // AI-консультант — виджет сервера лицензий. Не загрузился (блокировщик, сеть) —
  // остаётся форма заявки, чтобы вопрос всё равно дошёл до нас.
  const handleOpenAiChat = () => {
    void openAiChat(undefined, () => handleOpenDemo());
  };

  const handleOpenModuleModal = (module: BillingModule) => {
    setSelectedModule(module);
  };

  // Порядок секций на странице
  const sections: React.ReactElement[] = [
    // Core Architecture & Features Bento Grid
    <FeaturesBento key="features" onOpenDemoModal={() => handleOpenDemo()} />,
    // Запуск за три шага: Docker → инфраструктура → работает
    <HowItWorksSection key="howitworks" />,
    // Interactive Screenshots Gallery with Category Filters
    <ScreenshotsGallery key="screenshots" />,
    // Modules Catalog with Filters, Video badges and Detailed Modals
    <ModulesSection key="modules" onOpenModuleModal={handleOpenModuleModal} />,
    // Finance Automation with Video
    <MoneyVideoSection key="money" onOpenDemoModal={() => handleOpenDemo()} />,
    // Interactive ROI & Savings Calculator
    <Calculator
      key="calculator"
      onSelectPlan={(plan, subs) => handleOpenDemo(plan, subs)}
      onOpenDemoModal={(subs, plan) => handleOpenDemo(plan || 'Pro', subs)}
      onOpenAiCase={(subs) => {
        setSubscriberCountForDemo(subs);
        void openBusinessCase({ subscribers: subs }, () => handleOpenDemo('Pro', subs));
      }}
    />,
    // Mobile Subscriber Experience Showcase & App Mockup
    <MobileAppShowcase key="mobile" />,
    // Витрина виджетов для CRM и панели биллинга
    <WidgetsMarketplace key="widgets" />,
    // Architecture, Stack & Docker Deployment
    <ArchitectureSection key="architecture" onOpenDemoModal={() => handleOpenDemo()} />,
    // Граф знаний: интерактивная карта архитектуры в документации
    <KnowledgeGraphSection key="graph" />,
    // Ready Out-of-the-Box Integrations Catalog
    <IntegrationsSection key="integrations" />,
    // Migration Guide from Existing Billing Systems
    <MigrationSection key="migrate" onOpenDemoModal={() => handleOpenDemo()} />,
    // Developer REST API & Webhooks Console
    <ApiExplorer key="api" />,
    // Transparent Pricing Plans
    <PricingSection key="pricing" onSelectPlan={(plan) => handleOpenDemo(plan)} />,
    // Посмотрите в действии: видеопрезентация и PDF для руководства
    <DemoSection key="demo" onOpenVideoModal={() => setIsVideoModalOpen(true)} />,
    // Audio Podcast for ISP Engineers and Executives
    <PodcastSection key="podcast" />,
    // Knowledge Base & Blog Articles
    <BlogSection key="blog" />,
    // Searchable Telecom FAQ
    <FaqSection key="faq" onOpenAiDrawer={handleOpenAiChat} onOpenDemoModal={() => handleOpenDemo()} />,
  ];
  const shownSections = useStagedSections(sections.length);
  const allSectionsShown = shownSections >= sections.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative selection:bg-emerald-500/30 selection:text-emerald-400 font-sans transition-colors duration-200">
      {/* Dynamic Animated Particle & Node Canvas */}
      <BackgroundCanvas isDark={isDark} />

      {/* Navigation Bar */}
      <Navbar
        isDark={isDark}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onSetThemeMode={handleSetThemeMode}
        onOpenDemoModal={() => handleOpenDemo()}
        onOpenAiDrawer={handleOpenAiChat}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative">
        {/* Hero Section with Live Interactive Mockup and Video Play */}
        <Hero
          onOpenDemoModal={() => handleOpenDemo()}
          onOpenAiDrawer={handleOpenAiChat}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
        />

        {/* Real-time Telemetry & Stats Bar */}
        <StatsBar />

        {sections.slice(0, shownSections).map((section) => (
          <Suspense key={section.key} fallback={null}>
            {section}
          </Suspense>
        ))}
        {/* пока секции появляются, страница не обрывается сразу за первым экраном */}
        {!allSectionsShown && <div className="min-h-screen" aria-hidden="true" />}
      </main>

      {/* Footer */}
      {allSectionsShown && (
        <Suspense fallback={null}>
          <Footer
            onOpenDemo={() => handleOpenDemo()}
            onOpenAi={handleOpenAiChat}
          />
        </Suspense>
      )}

      {/* Кнопка видео — над круглой кнопкой AI-виджета (она в правом нижнем углу) */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Floating Quick Video Button */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          aria-label="Смотреть видеопрезентацию"
          className="group relative hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-medium text-xs border border-slate-700/80 shadow-lg backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
          <span className="hidden sm:inline">Видео 3 мин</span>
        </button>

      </div>

      {/* Fullscreen Video Presentation Modal */}
      <MountOnFirstOpen open={isVideoModalOpen}>
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={MEDIA_URLS.promoVideo}
          posterUrl={MEDIA_URLS.promoPoster}
          title="СмИТ Биллинг 3.6 — Видеопрезентация платформы"
        />
      </MountOnFirstOpen>

      {/* Module Detail Modal */}
      <MountOnFirstOpen open={selectedModule !== null}>
        <ModuleDetailModal
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onSelectModuleForDemo={(moduleName) => {
            const modTitle = selectedModule?.name || moduleName;
            setSelectedModule(null);
            handleOpenDemo(modTitle ? `Модуль: ${modTitle}` : 'Pro');
          }}
          onOpenDemo={() => {
            const modTitle = selectedModule?.name;
            setSelectedModule(null);
            handleOpenDemo(modTitle ? `Модуль: ${modTitle}` : 'Pro');
          }}
        />
      </MountOnFirstOpen>

      {/* Demo Request Modal with INN validation */}
      <MountOnFirstOpen open={isDemoModalOpen}>
        <DemoModal
          isOpen={isDemoModalOpen}
          preselectedPlan={selectedPlanForDemo}
          initialSubscribers={subscriberCountForDemo}
          initialCompanyName={demoCompanyName}
          initialComment={demoComment}
          onClose={() => setIsDemoModalOpen(false)}
        />
      </MountOnFirstOpen>
    </div>
  );
}
