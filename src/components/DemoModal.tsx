import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { DemoFormData } from '../types';

interface DemoModalProps {
  isOpen: boolean;
  preselectedPlan?: string;
  initialSubscribers?: number;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  preselectedPlan = 'Pro',
  initialSubscribers = 1500,
  onClose,
}) => {
  const [formData, setFormData] = useState<DemoFormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    inn: '',
    subscribersCount: initialSubscribers.toString(),
    selectedPlan: preselectedPlan,
    comment: '',
  });

  const [innStatus, setInnStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (preselectedPlan) {
      setFormData((prev) => ({ ...prev, selectedPlan: preselectedPlan }));
    }
    if (initialSubscribers) {
      setFormData((prev) => ({ ...prev, subscribersCount: initialSubscribers.toString() }));
    }
  }, [preselectedPlan, initialSubscribers]);

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

    let formatted = '+7';
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

    if (raw.length === 10 || raw.length === 12) {
      setInnStatus('checking');
      setTimeout(() => {
        setInnStatus('valid');
      }, 400);
    } else {
      setInnStatus(raw.length > 0 ? 'invalid' : 'idle');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Укажите ваше имя';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Введите корректный email';
    }
    if (formData.phone.replace(/\D/g, '').length !== 11) {
      errs.phone = 'Укажите телефон полностью: +7 (___) ___-__-__';
    }
    if (formData.inn.length !== 10 && formData.inn.length !== 12) {
      errs.inn = 'ИНН должен содержать 10 или 12 цифр';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate submission to backend API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div
      id="demo-request-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg my-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Закрыть окно"
          className="absolute top-5 right-5 w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Демо-стенд без обязательств</span>
              </div>
              <h3
                id="demo-modal-title"
                className="text-2xl font-extrabold text-slate-900 dark:text-white"
              >
                Запросить доступ к СмИТ Биллинг
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Предоставим тестовый стенд на 14 дней, логин администратора и покажем перенос вашей базы.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ваше имя <span className="text-emerald-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Константин Константинов"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Рабочий Email <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ceo@isp-network.ru"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Телефон <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* INN & Subscribers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ИНН компании <span className="text-emerald-500">*</span>
                    </label>
                    {innStatus === 'valid' && (
                      <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Проверен
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="10 или 12 цифр"
                    value={formData.inn}
                    onChange={handleInnChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 font-mono focus:outline-none focus:ring-2 ${
                      errors.inn
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.inn && <p className="text-[11px] text-red-500 mt-1">{errors.inn}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Тариф
                  </label>
                  <select
                    value={formData.selectedPlan}
                    onChange={(e) => setFormData({ ...formData, selectedPlan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                  >
                    <option value="Старт">Старт (9 900 ₽/мес)</option>
                    <option value="Pro">Pro (24 900 ₽/мес)</option>
                    <option value="Бизнес">Бизнес (37 900 ₽/мес)</option>
                    <option value="Enterprise">Enterprise (49 900 ₽/мес)</option>
                    <option value="Индивидуальный">Индивидуальный набор</option>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Текущий биллинг / Задача (необязательно)
                </label>
                <textarea
                  rows={2}
                  placeholder="Работаем на Mikbill, 2 000 абонентов, хотим перенести базу..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Отправка заявки...</span>
                  </>
                ) : (
                  <>
                    <span>Получить доступ к демо-стенду</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных (152-ФЗ).
              </div>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Заявка успешно отправлена!
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Мы подготовили тестовый демо-стенд с тарифом «{formData.selectedPlan}». Реквизиты
              доступа и контакты дежурного инженера внедрения высланы на <strong>{formData.email}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-left space-y-1.5 max-w-xs mx-auto text-slate-600 dark:text-slate-400 font-mono">
              <div>• Демо-стенд: https://demo.billing.smit34.ru</div>
              <div>• Логин: admin</div>
              <div>• Пароль: отправлен в письме</div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Закрыть окно
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
