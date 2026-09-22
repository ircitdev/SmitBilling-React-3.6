import React from 'react';
import { Wallet, Wifi, Headphones, Phone, Briefcase, Router, MessageSquare, FileText } from 'lucide-react';
import { LANDING_IMAGES } from '../data/landingImages';

/**
 * «Один клиент — одна история»: вокруг карточки клиента собрано всё,
 * что с ним связано. Показывает главное преимущество единой системы
 * нагляднее, чем перечисление функций.
 */

const AROUND = [
  { icon: Wallet, title: 'Платежи и баланс', text: 'Начисления, оплаты, обещанный платёж и блокировка за долг' },
  { icon: Wifi, title: 'Услуги и тариф', text: 'Что подключено, когда менялось, что спишется в следующем месяце' },
  { icon: Router, title: 'Оборудование', text: 'Роутер и ONU по серийному номеру: у клиента, в аренде или продано' },
  { icon: Headphones, title: 'Обращения', text: 'Письма, мессенджеры и соцсети — одной лентой с историей ответов' },
  { icon: Phone, title: 'Звонки', text: 'Запись разговора и его разбор рядом с карточкой' },
  { icon: Briefcase, title: 'Сделки', text: 'Подключение и допродажи в воронке, наряд монтажнику' },
  { icon: MessageSquare, title: 'Сообщения', text: 'Что отправляли клиенту и что он получил' },
  { icon: FileText, title: 'Документы', text: 'Договор с подписью, счета и акты' },
];

export const ClientStorySection: React.FC = () => (
  <section id="client-story" className="relative py-14 sm:py-24 z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Один клиент. Одна история.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Всё, что связано с абонентом, открывается из его карточки — не нужно искать
          по разным программам и сверять, где данные свежее.
        </p>
      </div>

      <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-8 sm:mb-10">
        <img
          src={LANDING_IMAGES.clientStory.src}
          width={LANDING_IMAGES.clientStory.width}
          height={LANDING_IMAGES.clientStory.height}
          alt={LANDING_IMAGES.clientStory.alt}
          loading="lazy"
          className="w-full h-auto"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {AROUND.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">{title}</div>
            <p className="text-xs sm:text-[13px] leading-snug text-slate-600 dark:text-slate-400">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
