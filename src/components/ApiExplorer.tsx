import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '../data/landingData';

export const ApiExplorer: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentEndpoint = API_ENDPOINTS[selectedIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentEndpoint.responsePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="relative py-14 sm:py-20 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Разработчикам и интеграторам</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Открытый REST API v2 и Webhooks
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Интегрируйте биллинг с любыми внутренними системами, 1С, порталами самообслуживания и
            банковскими сервисами через стандартизированный OpenAPI/Swagger интерфейс.
          </p>
        </div>

        {/* API Console */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Top Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
            {API_ENDPOINTS.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`shrink-0 flex items-center gap-2 px-3 py-3 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    ep.method === 'GET'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {ep.method}
                </span>
                <span>{ep.label}</span>
              </button>
            ))}
          </div>

          {/* Endpoint Bar & Description */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentEndpoint.method}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold break-all">
                  {currentEndpoint.path}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentEndpoint.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer self-start sm:self-auto"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Копировать JSON</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer */}
          <div className="p-4 sm:p-6 bg-slate-950 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
            <pre className="text-emerald-400/90 leading-relaxed">
              {currentEndpoint.responsePayload}
            </pre>
          </div>

          {/* Footer Swagger Link */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>Автоматическая документация OpenAPI 3.0 / Swagger UI доступна в админке</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              Token & OAuth 2.0 Auth <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
