import React from 'react';
import {
  DollarSign,
  Play,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { MEDIA_URLS } from '../data/landingData';

interface MoneyVideoSectionProps {
  onOpenDemoModal: () => void;
}

export const MoneyVideoSection: React.FC<MoneyVideoSectionProps> = ({ onOpenDemoModal }) => {
  return (
    <section id="money" className="py-14 sm:py-28 relative overflow-hidden bg-slate-900 text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Финансовый автопилот</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              Деньги без бухгалтера —{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                за четыре минуты
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Как перестать сверять банковские выписки вручную, ловить неопознанные платежи юрлиц и бояться штрафов налоговой за чеки.
            </p>

            {/* 3 Step Process */}
            <div className="space-y-4 w-full mb-8">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    Импорт выписки Клиент-Банка
                  </h4>
                  <p className="text-xs text-slate-300">
                    Загружайте файл 1C / TXT из Сбербанка, Альфа-Банка, ВТБ или любого банка РФ в один клик.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    Авторазбор по ИНН и назначению
                  </h4>
                  <p className="text-xs text-slate-300">
                    Плательщик сопоставляется с клиентом по ИНН, договору и назначению; деньги зачисляются на баланс, юрлицу выписываются счёт и акт.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">
                    Ручная модерация спорных платежей
                  </h4>
                  <p className="text-xs text-slate-300">
                    Нераспознанные и сомнительные платежи ждут в очереди: оператор находит клиента и привязывает платёж вручную.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
            >
              <span>Попробовать на своих данных</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column: Authentic Video Player */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl sm:rounded-3xl border border-slate-700/80 bg-slate-950 p-2 sm:p-3 shadow-2xl overflow-hidden group">
              <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black">
                <video
                  preload="none"
                  controls
                  playsInline
                  poster={MEDIA_URLS.moneyPoster}
                  className="w-full h-full object-cover"
                >
                  <source src={MEDIA_URLS.moneyVideo} type="video/mp4" />
                  Ваш браузер не поддерживает встроенное видео.
                </video>
              </div>

              {/* Bottom Feature Badges */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800 text-center">
                <div className="p-2">
                  <div className="text-emerald-400 font-extrabold text-base sm:text-lg">4 мин</div>
                  <div className="text-[11px] text-slate-400">весь путь платежа в ролике</div>
                </div>
                <div className="p-2 border-x border-slate-800">
                  <div className="text-emerald-400 font-extrabold text-base sm:text-lg">1С</div>
                  <div className="text-[11px] text-slate-400">выписки из почты банка</div>
                </div>
                <div className="p-2">
                  <div className="text-emerald-400 font-extrabold text-base sm:text-lg">54-ФЗ</div>
                  <div className="text-[11px] text-slate-400">чеки своей кассой АТОЛ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
