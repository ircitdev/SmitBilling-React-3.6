import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Share2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { BLOG_ARTICLES } from '../data/landingData';
import { BlogArticle } from '../types';

export const BlogSection: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  return (
    <section id="blog" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>База знаний и статьи</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Практика и опыт для операторов связи
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Пошаговые руководства от инженеров: сдача СОРМ-3 по приказу №573, автоматизация банковских выписок и ведение картографии ВОЛС без потерь.
          </p>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-emerald-400 text-xs font-bold">
                  {article.category || article.tag}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime || '5 мин'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug mb-3">
                    {article.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {(article.tags || [article.tag]).slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Читать</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reading Article Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0" onClick={() => setActiveArticle(null)} />

          <div className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cover Banner */}
            <div className="rounded-2xl overflow-hidden aspect-[21/9] mb-6 border border-slate-200 dark:border-slate-700">
              <img src={activeArticle.cover} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {activeArticle.category || activeArticle.tag}
              </span>
              <span>•</span>
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readTime || '5 мин'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              {activeArticle.title}
            </h3>

            <p className="text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
              {activeArticle.excerpt}
            </p>

            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-6">
              <p>
                Операторы связи в России сталкиваются со всё более строгими нормативными и финансовыми требованиями. В рамках платформы «СмИТ Биллинг» мы автоматизировали эти ключевые рутинные участки.
              </p>
              <p>
                Система обеспечивает сквозную прозрачность: от первого обращения клиента в CRM до закрытия финансового периода в 1С и регулярной передачи статистики по защищенным каналам связи.
              </p>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm">
                💡 Если вы хотите получить полный чек-лист внедрения или методические рекомендации наших архитекторов, оставьте заявку на демонстрацию стенда.
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {(activeArticle.tags || [activeArticle.tag]).map((tag) => (
                  <span key={tag} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
