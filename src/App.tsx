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
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { VideoModal } from './components/VideoModal';
import { Footer } from './components/Footer';
import { BillingModule } from './types';
import { MEDIA_URLS } from './data/landingData';
import { Bot, Play } from 'lucide-react';

export default function App() {
  // Theme state: default to dark for telecom high-tech aesthetics
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smit_billing_theme');
      if (saved) return saved === 'dark';
    }
    return true; // default dark
  });

  // Modal & Drawer states
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<BillingModule | null>(null);
  const [selectedPlanForDemo, setSelectedPlanForDemo] = useState('Pro');
  const [subscriberCountForDemo, setSubscriberCountForDemo] = useState(1500);

  // Sync dark class with document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smit_billing_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smit_billing_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleOpenDemo = (planName = 'Pro', subscribers = 1500) => {
    setSelectedPlanForDemo(planName);
    setSubscriberCountForDemo(subscribers);
    setIsDemoModalOpen(true);
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
        onToggleTheme={toggleTheme}
        onOpenDemoModal={() => handleOpenDemo()}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenVideoModal={() => setIsVideoModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative">
        {/* Hero Section with Live Interactive Mockup and Video Play */}
        <Hero
          onOpenDemoModal={() => handleOpenDemo()}
          onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
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
        <Calculator onOpenDemoModal={(subs) => handleOpenDemo('Pro', subs)} />

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
          onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          onOpenDemoModal={() => handleOpenDemo()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenDemo={() => handleOpenDemo()}
        onOpenAi={() => setIsAiDrawerOpen(true)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
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

        {/* Sticky Floating AI Assistant Widget */}
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          aria-label="Открыть AI-консультанта"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="hidden sm:inline">AI-консультант</span>
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
        onClose={() => setIsDemoModalOpen(false)}
      />

      {/* Telecom Knowledge AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        onOpenDemo={() => {
          setIsAiDrawerOpen(false);
          handleOpenDemo();
        }}
      />
    </div>
  );
}
