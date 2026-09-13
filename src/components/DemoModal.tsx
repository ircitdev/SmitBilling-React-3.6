import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ArrowRight, Loader2, Sparkles, Volume2, AlertCircle } from 'lucide-react';
import { DemoFormData } from '../types';
import { playSuccessChime } from '../utils/audioFeedback';
import { reachGoal } from '../lib/aiWidget';

// Заявка уходит так же, как с прежнего billing.smit34.ru: в Telegram-топик LEADS
// группы «СМИТ CRM». Токен бота и ключ DaData живут в nginx-прокси на сервере
// (/api/demo-lead, /api/inn-check, /api/whoami), в браузер они не попадают.
const LEADS_CHAT = '-1002910452601';
const LEADS_THREAD = '23487';

const STATUS_RU: Record<string, string> = {
  ACTIVE: 'действующая',
  LIQUIDATING: 'в стадии ликвидации',
  LIQUIDATED: 'ликвидирована',
  BANKRUPT: 'банкротство',
  REORGANIZING: 'реорганизация',
};

interface CompanyInfo {
  ok: boolean;
  err?: boolean;
  value?: string;
  full?: string;
  status?: string;
  statusRu?: string;
  kpp?: string;
  ogrn?: string;
  okved?: string;
  address?: string;
  director?: string;
  regDate?: string;
}

interface DadataParty {
  value?: string;
  data?: {
    name?: { full_with_opf?: string };
    state?: { status?: string; registration_date?: number };
    management?: { name?: string; post?: string };
    kpp?: string;
    ogrn?: string;
    okved?: string;
    address?: { value?: string };
  };
}

const innCache = new Map<string, CompanyInfo>();

function fmtDate(ms?: number): string {
  if (!ms) return '';
  const d = new Date(ms);
  const p = (x: number) => ('0' + x).slice(-2);
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function extractCompany(s: DadataParty): CompanyInfo {
  const d = s.data || {};
  const st = d.state?.status || '';
  const mg = d.management || {};
  return {
    ok: true,
    value: s.value,
    full: d.name?.full_with_opf || s.value,
    status: st,
    statusRu: STATUS_RU[st] || st || '',
    kpp: d.kpp || '',
    ogrn: d.ogrn || '',
    okved: d.okved || '',
    address: d.address?.value || '',
    director: mg.name ? mg.name + (mg.post ? ' — ' + mg.post : '') : '',
    regDate: fmtDate(d.state?.registration_date),
  };
}

async function checkInn(inn: string): Promise<CompanyInfo> {
  const cached = innCache.get(inn);
  if (cached) return cached;
  try {
    const r = await fetch('/api/inn-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: inn }),
    });
    const data = (await r.json()) as { suggestions?: DadataParty[] };
    const first = data?.suggestions?.[0];
    const out = first ? extractCompany(first) : { ok: false };
    innCache.set(inn, out);
    return out;
  } catch {
    return { ok: false, err: true };
  }
}

function esc(s?: string): string {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function deviceInfo(): string {
  const ua = navigator.userAgent || '';
  let os = 'н/д';
  let br = 'н/д';
  let m: RegExpMatchArray | null;
  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
  else if (/Windows/.test(ua)) os = 'Windows';
  else if ((m = ua.match(/Android[ /]([\d.]+)/))) os = 'Android ' + m[1];
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  if ((m = ua.match(/Edg\/(\d+)/))) br = 'Edge ' + m[1];
  else if ((m = ua.match(/OPR\/(\d+)/))) br = 'Opera ' + m[1];
  else if ((m = ua.match(/YaBrowser\/(\d+)/))) br = 'Yandex ' + m[1];
  else if ((m = ua.match(/Chrome\/(\d+)/))) br = 'Chrome ' + m[1];
  else if ((m = ua.match(/Firefox\/(\d+)/))) br = 'Firefox ' + m[1];
  else if ((m = ua.match(/Version\/(\d+)[.\d]* Safari/))) br = 'Safari ' + m[1];
  const mob = /Mobi|Android|iPhone|iPad/.test(ua) ? 'моб.' : 'десктоп';
  return `${os} · ${br} · ${screen.width}×${screen.height} @${window.devicePixelRatio || 1}x · ${mob}`;
}

function utmInfo(): string {
  const q = new URLSearchParams(location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'yclid'];
  const out: string[] = [];
  keys.forEach((k) => {
    const v = q.get(k);
    if (v) out.push(k.replace('utm_', '') + '=' + v);
  });
  return out.length ? out.join(' / ') : 'нет (прямой переход)';
}

function companyBlock(c: CompanyInfo | null): string {
  if (!c || !c.ok) return '';
  const lines = ['\n🏛 <b>Данные по ИНН (DaData):</b>', '   • ' + esc(c.full)];
  if (c.statusRu) lines.push('   • Статус: ' + esc(c.statusRu));
  const ids: string[] = [];
  if (c.ogrn) ids.push('ОГРН ' + esc(c.ogrn));
  if (c.kpp) ids.push('КПП ' + esc(c.kpp));
  if (ids.length) lines.push('   • ' + ids.join(' · '));
  if (c.director) lines.push('   • Руководитель: ' + esc(c.director));
  if (c.okved) lines.push('   • ОКВЭД: ' + esc(c.okved));
  if (c.regDate) lines.push('   • Регистрация: ' + esc(c.regDate));
  if (c.address) lines.push('   • Адрес: ' + esc(c.address));
  return lines.join('\n');
}

type InnStatus = 'idle' | 'checking' | 'valid' | 'notfound' | 'error';

interface DemoModalProps {
  isOpen: boolean;
  preselectedPlan?: string;
  initialSubscribers?: number;
  initialCompanyName?: string;
  initialComment?: string;
  onClose: () => void;
}

const inputBase =
  'w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2';
const inputOk = 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20';
const inputBad = 'border-red-500 focus:ring-red-500/20';

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  preselectedPlan = 'Pro',
  initialSubscribers = 1500,
  initialCompanyName = '',
  initialComment = '',
  onClose,
}) => {
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: initialCompanyName,
    inn: '',
    subscribersCount: initialSubscribers.toString(),
    selectedPlan: preselectedPlan,
    comment: initialComment,
  });
  const [website, setWebsite] = useState(''); // ловушка для ботов — человек поле не видит
  const [innStatus, setInnStatus] = useState<InnStatus>('idle');
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [stage, setStage] = useState<'' | 'inn' | 'send'>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const lastInn = useRef('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedPlan: preselectedPlan || prev.selectedPlan,
      subscribersCount: initialSubscribers ? initialSubscribers.toString() : prev.subscribersCount,
      companyName: initialCompanyName || prev.companyName,
      comment: initialComment || prev.comment,
    }));
  }, [preselectedPlan, initialSubscribers, initialCompanyName, initialComment]);

  // Каждое открытие — чистая форма, как на прежнем сайте, и цель в Метрике.
  useEffect(() => {
    if (!isOpen) return;
    setIsSuccess(false);
    setSubmitError('');
    reachGoal('demo_open');
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7') && digits.length > 0) digits = '7' + digits;
    digits = digits.slice(0, 11);

    let formatted = '';
    if (digits.length > 0) formatted = '+7';
    if (digits.length > 1) formatted += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 4) formatted += `) ${digits.slice(4, 7)}`;
    if (digits.length >= 7) formatted += `-${digits.slice(7, 9)}`;
    if (digits.length >= 9) formatted += `-${digits.slice(9, 11)}`;

    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handleInnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFormData((prev) => ({ ...prev, inn: raw }));
    if (errors.inn) setErrors((prev) => ({ ...prev, inn: '' }));
    lastInn.current = raw;

    if (raw.length !== 10 && raw.length !== 12) {
      setInnStatus('idle');
      setCompany(null);
      return;
    }
    setInnStatus('checking');
    checkInn(raw).then((c) => {
      if (lastInn.current !== raw) return; // пока проверяли, ИНН уже поменяли
      if (c.ok) {
        setInnStatus('valid');
        setCompany(c);
        setFormData((prev) => (prev.companyName.trim() ? prev : { ...prev, companyName: c.value || '' }));
      } else {
        setInnStatus(c.err ? 'error' : 'notfound');
        setCompany(null);
      }
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Укажите ваше имя';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Введите корректный email';
    if (formData.phone.replace(/\D/g, '').length !== 11) errs.phone = 'Введите телефон полностью: +7 (___) ___-__-__';
    if (!/^(\d{10}|\d{12})$/.test(formData.inn)) errs.inn = 'ИНН компании должен содержать 10 или 12 цифр';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (website) {
      onClose();
      return;
    }
    if (!validate()) return;

    setStage('inn');
    try {
      const c = await checkInn(formData.inn);
      if (!c.ok) {
        setErrors((prev) => ({
          ...prev,
          inn: c.err
            ? 'Не удалось проверить ИНН. Попробуйте ещё раз.'
            : 'Организация с таким ИНН не найдена в реестре.',
        }));
        setStage('');
        return;
      }
      setCompany(c);

      setStage('send');
      let ip = 'н/д';
      try {
        ip = (await (await fetch('/api/whoami')).text()).trim() || 'н/д';
      } catch {
        /* без IP заявка всё равно ценна */
      }

      const text =
        '🎯 <b>Заявка на демо</b> — billing.smit34.ru\n\n' +
        '👤 <b>Имя:</b> ' + esc(formData.name.trim()) + '\n' +
        '📧 <b>Email:</b> ' + esc(formData.email.trim()) + '\n' +
        '📞 <b>Телефон:</b> ' + esc(formData.phone) + '\n' +
        '🏢 <b>Компания:</b> ' + (esc(formData.companyName.trim()) || esc(c.value)) + '\n' +
        '🧾 <b>ИНН:</b> ' + esc(formData.inn) + '\n' +
        '📦 <b>Тариф:</b> ' + esc(formData.selectedPlan) + '\n' +
        '💬 <b>Комментарий:</b> ' + (esc(formData.comment.trim()) || '—') + '\n' +
        companyBlock(c) + '\n\n' +
        '🌐 <b>IP:</b> ' + esc(ip) + '\n' +
        '📱 <b>Устройство:</b> ' + esc(deviceInfo()) + '\n' +
        '🌍 <b>Язык:</b> ' + esc(navigator.language || 'н/д') + '\n' +
        '🔗 <b>UTM:</b> ' + esc(utmInfo()) + '\n' +
        '↩️ <b>Referrer:</b> ' + esc(document.referrer || 'нет') + '\n' +
        '📄 <b>Страница:</b> ' + esc(location.href);

      const body = new URLSearchParams({
        chat_id: LEADS_CHAT,
        message_thread_id: LEADS_THREAD,
        parse_mode: 'HTML',
        disable_web_page_preview: 'true',
        text,
      });
      const r = await fetch('/api/demo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      const d = (await r.json().catch(() => null)) as { ok?: boolean } | null;
      if (!d || !d.ok) throw new Error('lead');

      if (formData.companyName) localStorage.setItem('smit_demo_company', formData.companyName);
      reachGoal('lead', { tariff: formData.selectedPlan });
      setIsSuccess(true);
      playSuccessChime();
    } catch {
      setSubmitError('Не удалось отправить. Позвоните нам или напишите на почту — мы на связи.');
    } finally {
      setStage('');
    }
  };

  const isSubmitting = stage !== '';

  return (
    <div
      id="demo-request-modal"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 overflow-y-auto overscroll-contain bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg min-h-[100dvh] sm:min-h-0 sm:my-8 rounded-none sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl px-5 pt-3 pb-8 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Закрыть окно"
          className="sticky sm:absolute top-3 sm:top-5 sm:right-5 z-20 ml-auto mb-1 sm:m-0 w-11 h-11 sm:w-8 sm:h-8 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Демонстрация без обязательств</span>
              </div>
              <h3 id="demo-modal-title" className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Запросить демонстрацию
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Покажем СмИТ Биллинг на ваших задачах и ответим на вопросы.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Ловушка для ботов */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ваше имя <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Константин Константинов"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Компания
                  </label>
                  <input
                    type="text"
                    autoComplete="organization"
                    placeholder="Подставим по ИНН"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className={`${inputBase} ${inputOk}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="ceo@isp-network.ru"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value.replace(/\s/g, '') });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Телефон <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`${inputBase} ${errors.phone ? inputBad : inputOk}`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ИНН компании <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="10 или 12 цифр"
                    value={formData.inn}
                    onChange={handleInnChange}
                    className={`${inputBase} font-mono ${errors.inn ? inputBad : inputOk}`}
                  />
                  <div className="min-h-[16px] mt-1 text-[11px]" aria-live="polite">
                    {errors.inn ? (
                      <span className="text-red-500">{errors.inn}</span>
                    ) : innStatus === 'checking' ? (
                      <span className="text-slate-400 inline-flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Проверяем ИНН в DaData…
                      </span>
                    ) : innStatus === 'valid' && company ? (
                      <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {company.value}
                          {company.statusRu && company.status !== 'ACTIVE' ? ` (${company.statusRu})` : ''}
                        </span>
                      </span>
                    ) : innStatus === 'notfound' ? (
                      <span className="text-red-500">Организация с таким ИНН не найдена</span>
                    ) : innStatus === 'error' ? (
                      <span className="text-amber-600">Не удалось проверить ИНН, попробуйте ещё раз</span>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Тариф
                  </label>
                  <select
                    value={formData.selectedPlan}
                    onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
                    className={`${inputBase} ${inputOk} cursor-pointer`}
                  >
                    <option value="Старт">Старт (9 900 ₽/мес)</option>
                    <option value="Pro">Pro (24 900 ₽/мес)</option>
                    <option value="Бизнес">Бизнес (37 900 ₽/мес)</option>
                    <option value="Enterprise">Enterprise (49 900 ₽/мес)</option>
                    <option value="Индивидуальный">Индивидуальный набор</option>
                    {!['Старт', 'Pro', 'Бизнес', 'Enterprise', 'Индивидуальный'].includes(formData.selectedPlan) && (
                      <option value={formData.selectedPlan}>{formData.selectedPlan}</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Комментарий
                </label>
                <textarea
                  rows={2}
                  placeholder="Работаем на Mikbill, 2 000 абонентов, хотим перенести базу…"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {submitError && (
                <div className="flex items-start gap-2 p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-600 dark:text-red-400" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{stage === 'inn' ? 'Проверяем ИНН…' : 'Отправляем…'}</span>
                  </>
                ) : (
                  <>
                    <span>Отправить заявку</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных.{' '}
                <a href="/privacy.html" target="_blank" rel="noopener" className="underline hover:text-emerald-500">
                  Политика конфиденциальности
                </a>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/25 animate-glow-ring pointer-events-none" />
              <div className="absolute -top-1 left-2 w-2 h-2 rounded-full bg-emerald-400 animate-sparkle-float pointer-events-none" />
              <div className="absolute top-3 -right-1 w-1.5 h-1.5 rounded-full bg-teal-400 animate-sparkle-float [animation-delay:200ms] pointer-events-none" />
              <div className="absolute -bottom-1 right-3 w-2 h-2 rounded-full bg-amber-400 animate-sparkle-float [animation-delay:400ms] pointer-events-none" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 border-2 border-white/30 dark:border-slate-800 animate-success-pop">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Заявка отправлена!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Мы свяжемся с вами в ближайшее время — по телефону {formData.phone} или на{' '}
              <strong>{formData.email}</strong>.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={playSuccessChime}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Повторить звуковой сигнал"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Звуковой сигнал</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
