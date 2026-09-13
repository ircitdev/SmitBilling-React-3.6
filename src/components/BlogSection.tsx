import React from 'react';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/landingData';

export const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-14 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
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
        <div className="m-scroll flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0">
          {BLOG_ARTICLES.map((article) => (
            <a
              key={article.id}
              href={article.href}
              className="group shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col cursor-pointer"
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
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
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
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/blog/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <span>Все статьи блога</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

    </section>
  );
};
