import React, { useState, useEffect } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { FeaturesBento } from './components/FeaturesBento';
import { ScreenshotsGallery } from './components/ScreenshotsGallery';
import { ModulesSection } from './components/ModulesSection';
import { ModuleDetailModal } from './components/ModuleDetailModal';
import { MoneyVideoSection } from './components/MoneyVideoSection';
import { Calculator } from './components/Calculator';
import { MobileAppShowcase } from './components/MobileAppShowcase';
import { WidgetsMarketplace } from './components/WidgetsMarketplace';
import { ArchitectureSection } from './components/ArchitectureSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { MigrationSection } from './components/MigrationSection';
import { ApiExplorer } from './components/ApiExplorer';
import { PricingSection } from './components/PricingSection';
import { PodcastSection } from './components/PodcastSection';
import { BlogSection } from './components/BlogSection';
import { FaqSection } from './components/FaqSection';
import { DemoModal } from './components/DemoModal';
import { VideoModal } from './components/VideoModal';
import { Footer } from './components/Footer';
import { BillingModule, ThemeMode } from './types';
import { MEDIA_URLS } from './data/landingData';
import { openAiChat, openBusinessCase } from './lib/aiWidget';
import { Play } from 'lucide-react';

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

        {/* Core Architecture & Features Bento Grid */}
        <FeaturesBento onOpenDemoModal={() => handleOpenDemo()} />

        {/* Interactive Screenshots Gallery with Category Filters */}
        <ScreenshotsGallery />

        {/* 24 Modules Catalog with Filters, Video badges and Detailed Modals */}
        <ModulesSection onOpenModuleModal={handleOpenModuleModal} />

        {/* Finance Automation with Video: Money in 4 minutes */}
        <MoneyVideoSection onOpenDemoModal={() => handleOpenDemo()} />

        {/* Interactive ROI & Savings Calculator */}
        <Calculator
          onSelectPlan={(plan, subs) => handleOpenDemo(plan, subs)}
          onOpenDemoModal={(subs, plan) => handleOpenDemo(plan || 'Pro', subs)}
          onOpenAiCase={(subs) => {
            setSubscriberCountForDemo(subs);
            void openBusinessCase({ subscribers: subs }, () => handleOpenDemo('Pro', subs));
          }}
        />

        {/* Mobile Subscriber Experience Showcase & App Mockup */}
        <MobileAppShowcase />

        {/* Widgets Marketplace for amoCRM & Billing */}
        <WidgetsMarketplace />

        {/* Architecture, Stack & Docker Deployment */}
        <ArchitectureSection onOpenDemoModal={() => handleOpenDemo()} />

        {/* Ready Out-of-the-Box Integrations Catalog */}
        <IntegrationsSection />

        {/* Migration Guide from Existing Billing Systems */}
        <MigrationSection onOpenDemoModal={() => handleOpenDemo()} />

        {/* Developer REST API & Webhooks Console */}
        <ApiExplorer />

        {/* Transparent Pricing Plans */}
        <PricingSection onSelectPlan={(plan) => handleOpenDemo(plan)} />

        {/* Audio Podcast for ISP Engineers and Executives */}
        <PodcastSection />

        {/* Knowledge Base & Blog Articles */}
        <BlogSection />

        {/* Searchable Telecom FAQ */}
        <FaqSection
          onOpenAiDrawer={handleOpenAiChat}
          onOpenDemoModal={() => handleOpenDemo()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDemo={() => handleOpenDemo()}
        onOpenAi={handleOpenAiChat}
      />

      {/* Кнопка видео — над круглой кнопкой AI-виджета (она в правом нижнем углу) */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Floating Quick Video Button */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          aria-label="Смотреть видеопрезентацию"
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-medium text-xs border border-slate-700/80 shadow-lg backdrop-blur-md hover:scale-105 transition-all cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
          <span className="hidden sm:inline">Видео 4 мин</span>
        </button>

      </div>

      {/* Fullscreen Video Presentation Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={MEDIA_URLS.promoVideo}
        posterUrl={MEDIA_URLS.promoPoster}
        title="СмИТ Биллинг 3.6 — Видеопрезентация платформы"
      />

      {/* Module Detail Modal */}
      <ModuleDetailModal
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onSelectModuleForDemo={(moduleName) => {
          const modTitle = selectedModule?.title || moduleName;
          setSelectedModule(null);
          handleOpenDemo(modTitle ? `Модуль: ${modTitle}` : 'Pro');
        }}
        onOpenDemo={() => {
          const modTitle = selectedModule?.title;
          setSelectedModule(null);
          handleOpenDemo(modTitle ? `Модуль: ${modTitle}` : 'Pro');
        }}
      />

      {/* Demo Request Modal with INN validation */}
      <DemoModal
        isOpen={isDemoModalOpen}
        preselectedPlan={selectedPlanForDemo}
        initialSubscribers={subscriberCountForDemo}
        initialCompanyName={demoCompanyName}
        initialComment={demoComment}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
