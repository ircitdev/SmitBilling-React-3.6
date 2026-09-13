import React from 'react';
import { MonitorPlay, Play, FileText, ArrowRight } from 'lucide-react';
import { MEDIA_URLS } from '../data/landingData';

interface DemoSectionProps {
  onOpenVideoModal: () => void;
}

// «Посмотрите в действии» — видеопрезентация и PDF для руководства, как на прежнем сайте.
export const DemoSection: React.FC<DemoSectionProps> = ({ onOpenVideoModal }) => {
  return (
    <section id="demo" className="relative py-14 sm:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <MonitorPlay className="w-3.5 h-3.5" />
            <span>Демонстрация</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Посмотрите в действии
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Видеопрезентация системы и PDF с описанием возможностей для руководства.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <button
            type="button"
            onClick={onOpenVideoModal}
            aria-label="Смотреть видеопрезентацию"
            className="group lg:col-span-2 relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-xl text-left cursor-pointer"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="relative aspect-video">
              <img
                src={MEDIA_URLS.promoPoster}
                alt="Видеопрезентация СмИТ Биллинг"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                </span>
              </span>
              <span className="absolute left-4 bottom-4 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur border border-slate-700 text-xs font-semibold text-slate-100">
                Видеопрезентация · обзор интерфейса
              </span>
            </div>
          </button>

          <div className="flex flex-col gap-6">
            {[
              {
                href: '/SMIT_Billing_Unified_ISP_Platform.pdf',
                title: 'Скачать презентацию',
                text: 'PDF с описанием возможностей платформы для руководства.',
              },
              {
                href: '/SMIT_Billing_KP.pdf',
                title: 'Коммерческое предложение',
                text: 'Тарифы и состав модулей — PDF на 4 страницы.',
              },
            ].map((doc) => (
              <a
                key={doc.href}
                href={doc.href}
                download
                className="group flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col"
              >
                <span className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{doc.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">{doc.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Скачать PDF
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
