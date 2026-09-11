import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Building2,
  Users,
  Server,
  TrendingUp,
  Clock,
  Coins,
  ShieldCheck,
  FileText,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  Cpu,
  FileDown,
  Loader2,
} from 'lucide-react';
import {
  generateProviderBusinessCase,
  ProviderCaseInput,
  GeneratedBusinessCase,
} from '../services/geminiService';
import { generateBusinessCasePdf } from '../services/pdfReportService';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  demoCompanyName?: string;
  onOpenDemo: (prefill?: {
    plan?: string;
    subscribers?: number;
    companyName?: string;
    comment?: string;
  }) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isBusinessCase?: boolean;
}

const PRESET_QUESTIONS = [
  '✨ Сгенерировать бизнес-кейс',
  'Как происходит перенос базы с Mikbill или Carbon?',
  'Как настроить СОРМ-3 по 573 приказу?',
  'Какие требования к серверу и Docker?',
  'Как работает авторазбор выписок и 54-ФЗ?',
  'Чем отличается тариф Pro от Бизнес?',
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  'перенос':
    'Перенос базы данных осуществляется по безопасной схеме: 1) Разворачивается тестовая копия биллинга рядом с вашей системой. 2) Через готовые ETL-скрипты импортируются абоненты, договоры, тарифы, услуги и сальдо. 3) Ваш бухгалтер построчно сверяет балансы. 4) Переключение RADIUS-авторизации происходит в ночное окно без простоя абонентов.',
  'сорм':
    'Модуль «СОРМ» формирует 13 регламентированных отчётов в точном соответствии с приказом Минцифры №573 (HEX-форматы IP-адресов, масок, даты с таймзонами, разделители `;`). В систему встроены готовые профили адаптеров под 6 ведущих производителей СОРМ-комплексов (Норси-Транс, МФИ Софт, Сигнатек и др.) с автоматической выгрузкой по расписанию на FTP.',
  'требования':
    'Благодаря оптимизированному стеку (Python 3.11, Django 4.2 LTS, PostgreSQL 17, Redis 7) система крайне экономична. Для сети до 3 000 абонентов достаточно обычного сервера или VPS с 4 ядрами CPU (от 2.5 ГГц), 8 ГБ RAM и 100 ГБ NVMe SSD. Разворачивается за 15 минут через Docker Compose.',
  'выписок':
    'Модуль «Банковские выписки» забирает файлы выписок 1C (Сбербанк, Альфа-Банк, Т-Банк) прямо из защищённого почтового ящика, сопоставляет плательщиков по 4 алгоритмам (ИНН, номер договора, ФИО, назначение) и автоматически зачисляет средства. Юрлицам сразу выписываются счёт и акт, а касса АТОЛ Онлайн пробивает чек по 54-ФЗ.',
  'тариф':
    'Тариф «Pro» (24 900 ₽/мес) включает 14 ключевых модулей: разбор выписок, 54-ФЗ, склад ТМЦ, HelpDesk-поддержку, CRM и IPTV. Тариф «Бизнес» (37 900 ₽/мес) дополнительно включает AI-ассистента на 7 каналах, мультиорганизацию (ведение нескольких юрлиц в одной установке) и IP-телефонию с записью.',
  'default':
    'СмИТ Биллинг 3.6 — это комплексная платформа для операторов связи: FreeRADIUS 3.2 с откликом 0.03 мс, тарификация, СОРМ-3 по 573 приказу, личный кабинет, мобильные приложения iOS/Android, склад ТМЦ и авторазбор выписок 54-ФЗ. Хотите составить персональный бизнес-кейс или протестировать систему на живом демо-стенде?',
};

const CHALLENGE_OPTIONS = [
  'Сдача СОРМ-3 (приказ №573 Минцифры) без штрафов',
  'Автоматический разбор выписок банков и чеки 54-ФЗ',
  'Снижение нагрузки на техподдержку (HelpDesk)',
  'Мобильное приложение для абонентов (iOS/Android) с СБП',
  'Ликвидация дебиторки и автоматическая блокировка должников',
  'Учёт кроссов, кабелей ВОЛС и склада ТМЦ',
  'Мультиорганизация (ведение нескольких юрлиц)',
];

const PRESET_SCENARIOS = [
  {
    label: 'PON-сеть 2 500 аб.',
    providerName: 'Орион-Телеком',
    region: 'Краснодарский край',
    subscribersCount: '2 500',
    currentBilling: 'Mikbill',
    networkEquipment: 'MikroTik CCR2004 + BDCOM OLT',
    challenges: [
      'Сдача СОРМ-3 (приказ №573 Минцифры) без штрафов',
      'Автоматический разбор выписок банков и чеки 54-ФЗ',
      'Мобильное приложение для абонентов (iOS/Android) с СБП',
    ],
    additionalNotes: 'Частный сектор GPON, нужна оплата через СБП прямо в мобильном приложении.',
  },
  {
    label: 'ШПД город 7 500 аб.',
    providerName: 'СитиКом',
    region: 'Нижний Новгород',
    subscribersCount: '7 500',
    currentBilling: 'Carbon Billing 5',
    networkEquipment: 'Cisco ASR 1001-X (IPoE Opt82)',
    challenges: [
      'Сдача СОРМ-3 (приказ №573 Минцифры) без штрафов',
      'Автоматический разбор выписок банков и чеки 54-ФЗ',
      'Снижение нагрузки на техподдержку (HelpDesk)',
      'Ликвидация дебиторки и автоматическая блокировка должников',
    ],
    additionalNotes: 'Ночной перенос без разрыва сессий абонентов, интеграция с 1C Бухгалтерией.',
  },
  {
    label: 'Локальный оператор 1 200 аб.',
    providerName: 'Связь-Сервис',
    region: 'Владимирская область',
    subscribersCount: '1 200',
    currentBilling: 'Excel / 1C + самописные скрипты',
    networkEquipment: 'MikroTik CHR (PPPoE / IPoE)',
    challenges: [
      'Автоматический разбор выписок банков и чеки 54-ФЗ',
      'Ликвидация дебиторки и автоматическая блокировка должников',
      'Учёт кроссов, кабелей ВОЛС и склада ТМЦ',
    ],
    additionalNotes: 'Бухгалтер тратит по 4 часа каждый день на ручной разбор платежей.',
  },
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  demoCompanyName,
  onOpenDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'generator'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Здравствуйте! Я интеллектуальный ассистент СмИТ Биллинг. Могу ответить на технические вопросы о системе, СОРМ-3 и FreeRADIUS, или сгенерировать персонализированный бизнес-кейс автоматизации под масштаб вашей сети с помощью Gemini.',
      time: 'только что',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Business Case Generator State
  const [providerName, setProviderName] = useState(() => {
    return demoCompanyName || (typeof window !== 'undefined' ? localStorage.getItem('smit_demo_company') || '' : '');
  });
  const [region, setRegion] = useState('');
  const [subscribersCount, setSubscribersCount] = useState('3 500');
  const [currentBilling, setCurrentBilling] = useState('Mikbill');
  const [networkEquipment, setNetworkEquipment] = useState('MikroTik CCR / CHR');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([
    'Сдача СОРМ-3 (приказ №573 Минцифры) без штрафов',
    'Автоматический разбор выписок банков и чеки 54-ФЗ',
    'Мобильное приложение для абонентов (iOS/Android) с СБП',
  ]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<GeneratedBusinessCase | null>(null);
  const [resultTab, setResultTab] = useState<'summary' | 'architecture' | 'migration' | 'full'>('summary');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  useEffect(() => {
    if (demoCompanyName && !providerName) {
      setProviderName(demoCompanyName);
    } else if (!providerName && typeof window !== 'undefined') {
      const stored = localStorage.getItem('smit_demo_company');
      if (stored) setProviderName(stored);
    }
  }, [demoCompanyName, providerName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  if (!isOpen) return null;

  const toggleChallenge = (item: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const applyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setProviderName(preset.providerName);
    setRegion(preset.region);
    setSubscribersCount(preset.subscribersCount);
    setCurrentBilling(preset.currentBilling);
    setNetworkEquipment(preset.networkEquipment);
    setSelectedChallenges(preset.challenges);
    setAdditionalNotes(preset.additionalNotes);
  };

  const handleGenerateCase = async () => {
    setIsGeneratingCase(true);
    try {
      const caseInput: ProviderCaseInput = {
        providerName: providerName || 'Оператор связи',
        region: region || 'Россия',
        subscribersCount: subscribersCount || '3 000',
        currentBilling: currentBilling || 'Устаревший биллинг',
        networkEquipment: networkEquipment || 'MikroTik / Linux BNG',
        challenges: selectedChallenges,
        additionalNotes,
      };

      const result = await generateProviderBusinessCase(caseInput);
      setGeneratedCase(result);
    } catch (err) {
      console.error('Failed to generate business case:', err);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  const handleCopyProposal = () => {
    if (!generatedCase) return;
    const textToCopy = `БИЗНЕС-КЕЙС АВТОМАТИЗАЦИИ СмИТ БИЛЛИНГ 3.6\nОператор: ${providerName || 'Компания'}\nАбонентов: ${subscribersCount}\nЭкономия: ${generatedCase.roiCalculations.monthlySavings}\nВысвобождение: ${generatedCase.roiCalculations.hoursSaved}\nСрок окупаемости: ${generatedCase.roiCalculations.paybackMonths}\n\n${generatedCase.fullProposalMarkdown}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    if (!generatedCase || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const storedCompany = typeof window !== 'undefined' ? localStorage.getItem('smit_demo_company') : '';
      const resolvedCompany = providerName || demoCompanyName || storedCompany || 'Оператор связи';

      const caseInput: ProviderCaseInput = {
        providerName: resolvedCompany,
        region: region || 'Россия',
        subscribersCount: subscribersCount || '3 000',
        currentBilling: currentBilling || 'Устаревший биллинг',
        networkEquipment: networkEquipment || 'MikroTik / Linux BNG',
        challenges: selectedChallenges,
        additionalNotes,
        demoCompanyName: resolvedCompany,
      };
      await generateBusinessCasePdf(generatedCase, caseInput, { demoCompanyName: resolvedCompany });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleInjectIntoChat = () => {
    if (!generatedCase) return;
    const summaryText = `📊 **Персональный бизнес-кейс для «${providerName || 'Оператора'}» (${subscribersCount} абонентов, текущий биллинг ${currentBilling})**:\n\n` +
      `• 💰 **Прогнозируемая экономия:** ${generatedCase.roiCalculations.monthlySavings}\n` +
      `• ⏱️ **Высвобождение времени команды:** ${generatedCase.roiCalculations.hoursSaved}\n` +
      `• 🛡️ **Регуляторика:** ${generatedCase.regulatoryCompliance}\n` +
      `• 📋 **Рекомендуемый тариф:** ${generatedCase.recommendedPlan}\n` +
      `• 🚀 **Срок окупаемости:** ${generatedCase.roiCalculations.paybackMonths}\n\n` +
      `План бесшовной ночной миграции с ${currentBilling} сформирован. Готов ответить на любые вопросы по интеграции с вашим ${networkEquipment} или СОРМ-3.`;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: `Сформируй бизнес-кейс для ${providerName || 'провайдера'} (${subscribersCount} аб., ${currentBilling}, ${networkEquipment})`,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: summaryText,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isBusinessCase: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setActiveTab('chat');
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (text.includes('Сгенерировать бизнес-кейс') || text.toLowerCase().includes('бизнес-кейс')) {
      setActiveTab('generator');
      if (!textToSend) setInput('');
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = KNOWLEDGE_RESPONSES.default;

      if (lower.includes('миграц') || lower.includes('перенос') || lower.includes('mikbill') || lower.includes('carbon') || lower.includes('utm5')) {
        reply = KNOWLEDGE_RESPONSES.перенос;
      } else if (lower.includes('сорм') || lower.includes('573') || lower.includes('приказ')) {
        reply = KNOWLEDGE_RESPONSES.сорм;
      } else if (lower.includes('требован') || lower.includes('сервер') || lower.includes('docker') || lower.includes('характеристики')) {
        reply = KNOWLEDGE_RESPONSES.требования;
      } else if (lower.includes('выписк') || lower.includes('банк') || lower.includes('54-фз') || lower.includes('касс') || lower.includes('сбер')) {
        reply = KNOWLEDGE_RESPONSES.выписок;
      } else if (lower.includes('тариф') || lower.includes('pro') || lower.includes('бизнес') || lower.includes('цена') || lower.includes('стоимост')) {
        reply = KNOWLEDGE_RESPONSES.тариф;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      id="ai-consultant-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div id="ai-drawer-title" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI-консультант СмИТ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400">
                Архитектура, СОРМ-3 и бизнес-кейсы на Gemini
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeTab === 'generator' && (
              <button
                onClick={() => setActiveTab('chat')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>В чат</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Banner: Toggle between Chat & Generator */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-b border-emerald-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0 animate-pulse" />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
              {activeTab === 'chat'
                ? 'Персональный расчёт окупаемости под вашу сеть'
                : 'Генератор коммерческого предложения на Gemini'}
            </span>
          </div>
          <button
            id="btn-generate-business-case-toggle"
            onClick={() => setActiveTab((prev) => (prev === 'chat' ? 'generator' : 'chat'))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm shadow-emerald-500/20'
            }`}
          >
            {activeTab === 'generator' ? (
              <>
                <Bot className="w-3.5 h-3.5" />
                <span>Обычный чат</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Сгенерировать бизнес-кейс</span>
              </>
            )}
          </button>
        </div>

        {/* MAIN BODY: Either Chat or Generator View */}
        {activeTab === 'chat' ? (
          <>
            {/* Message Log */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-none'
                        : msg.isBusinessCase
                        ? 'bg-emerald-500/5 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 rounded-tl-none border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px]">
                      <span className={msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'}>
                        {msg.time}
                      </span>
                      {msg.isBusinessCase && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              onClose();
                              onOpenDemo({
                                plan: 'Pro',
                                companyName: providerName,
                                subscribers: parseInt(subscribersCount.replace(/\D/g, '')) || 3000,
                                comment: `Заявка на основе сформированного AI бизнес-кейса для сети ${providerName}`,
                              });
                            }}
                            className="text-emerald-500 font-bold hover:underline"
                          >
                            Запросить демо →
                          </button>
                          {generatedCase && (
                            <button
                              onClick={handleDownloadPdf}
                              disabled={isDownloadingPdf}
                              className="text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {isDownloadingPdf ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <FileDown className="w-3 h-3" />
                              )}
                              <span>{isDownloadingPdf ? 'Формирование...' : 'Скачать PDF'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <span className="text-[11px]">AI формирует ответ...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Pills */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                <span>Быстрые действия и вопросы:</span>
              </div>
              <div className="flex gap-1.5 flex-nowrap pb-1">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex-shrink-0 ${
                      q.includes('Сгенерировать')
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 font-bold'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/40'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Спросите о СОРМ-3, миграции или нажмите 'Сгенерировать бизнес-кейс'..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Gemini 2.5 Telecom Architecture Engine
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDemo();
                  }}
                  className="text-emerald-500 font-semibold hover:underline cursor-pointer"
                >
                  Запросить демо-доступ →
                </button>
              </div>
            </div>
          </>
        ) : (
          /* BUSINESS CASE GENERATOR VIEW */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs sm:text-sm space-y-5">
            {!generatedCase && !isGeneratingCase ? (
              <>
                {/* Introduction & Presets */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      Персональный расчёт автоматизации сети
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    Укажите параметры вашей телеком-сети. Gemini рассчитает финансовый эффект (ROI), подберёт модули СмИТ Биллинг 3.6, план сдачи СОРМ-3 и регламент ночной миграции.
                  </p>

                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Быстрые шаблоны провайдеров:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SCENARIOS.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 transition-all cursor-pointer font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  {/* Operator Name & Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                        Название оператора
                      </label>
                      <input
                        type="text"
                        placeholder="Например, ВолгаТелеком"
                        value={providerName}
                        onChange={(e) => setProviderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                      {Boolean(
                        (demoCompanyName || (typeof window !== 'undefined' && localStorage.getItem('smit_demo_company'))) &&
                          providerName !== (demoCompanyName || localStorage.getItem('smit_demo_company'))
                      ) && (
                        <button
                          type="button"
                          onClick={() => setProviderName(demoCompanyName || localStorage.getItem('smit_demo_company') || '')}
                          className="mt-1 text-[10px] text-emerald-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <span>Использовать из заявки: «{demoCompanyName || localStorage.getItem('smit_demo_company')}»</span>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Город / регион
                      </label>
                      <input
                        type="text"
                        placeholder="Например, Самара и область"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      />
                    </div>
                  </div>

                  {/* Subscriber Base */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        Абонентская база
                      </span>
                      <span className="text-[11px] text-emerald-500 font-bold">{subscribersCount} абонентов</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {['1 200', '3 500', '7 500', '15 000+'].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSubscribersCount(count)}
                          className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            subscribersCount === count
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Или введите точное число..."
                      value={subscribersCount}
                      onChange={(e) => setSubscribersCount(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>

                  {/* Current Billing & Network Equipment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-emerald-500" />
                        Текущий биллинг
                      </label>
                      <select
                        value={currentBilling}
                        onChange={(e) => setCurrentBilling(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="Mikbill">Mikbill</option>
                        <option value="Carbon Billing 5">Carbon Billing 5</option>
                        <option value="UTM5">UTM5</option>
                        <option value="BGBilling">BGBilling</option>
                        <option value="Самописный PHP/MySQL">Самописный PHP/MySQL</option>
                        <option value="Excel / 1C">Excel / 1C / Вручную</option>
                        <option value="Другая система">Другая система</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                        Сетевое ядро / BNG
                      </label>
                      <select
                        value={networkEquipment}
                        onChange={(e) => setNetworkEquipment(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      >
                        <option value="MikroTik CCR / CHR">MikroTik CCR / CHR</option>
                        <option value="Cisco ASR / ISG">Cisco ASR 1000 / ISG</option>
                        <option value="Huawei ME60">Huawei ME60 / NE40</option>
                        <option value="Linux FreeRADIUS / accel-ppp">Linux FreeRADIUS / accel-ppp</option>
                        <option value="PON OLT (BDCOM / Huawei / ZTE)">PON OLT (BDCOM, Huawei, ZTE)</option>
                      </select>
                    </div>
                  </div>

                  {/* Challenges Checklist */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ключевые приоритеты и боли сети:
                    </label>
                    <div className="space-y-1.5">
                      {CHALLENGE_OPTIONS.map((item) => {
                        const checked = selectedChallenges.includes(item);
                        return (
                          <div
                            key={item}
                            onClick={() => toggleChallenge(item)}
                            className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                              checked
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white font-medium'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                                checked
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {checked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="leading-tight">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Особые пожелания или детали
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Например: несколько юрлиц, интеграция с DaData, перевод ночью..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleGenerateCase}
                    disabled={isGeneratingCase}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Сгенерировать бизнес-кейс с Gemini</span>
                  </button>
                </div>
              </>
            ) : isGeneratingCase ? (
              /* Loading State */
              <div className="py-16 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 animate-spin opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Gemini формирует персональный бизнес-кейс...
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto space-y-1">
                  <p>• Анализ оборудования: {networkEquipment}</p>
                  <p>• Расчёт финансового эффекта для {subscribersCount} абонентов</p>
                  <p>• Формирование плана миграции с {currentBilling}</p>
                </div>
              </div>
            ) : (
              /* Generated Case Result View */
              generatedCase && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Top Bar: Action Buttons */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setGeneratedCase(null)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Пересчитать</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloadingPdf}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 shadow-sm"
                        title="Скачать официальное ТЭО в формате PDF с брендированной обложкой и динамическими графиками"
                      >
                        {isDownloadingPdf ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        ) : pdfSuccess ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{isDownloadingPdf ? 'Генерация ТЭО (3 стр.)...' : pdfSuccess ? 'ТЭО скачано!' : 'Скачать PDF ТЭО'}</span>
                      </button>
                      <button
                        onClick={handleCopyProposal}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Скопировано!' : 'Копировать'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white">
                        {generatedCase.recommendedPlan}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {subscribersCount} абонентов
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      {providerName || 'Оператор связи'} — План трансформации
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {generatedCase.summary}
                    </p>
                  </div>

                  {/* 4 ROI Metric Tiles */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-1">
                        <Coins className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Прямая экономия</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-emerald-500">
                        {generatedCase.roiCalculations.monthlySavings}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-1">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span>Высвобождение</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-teal-500">
                        {generatedCase.roiCalculations.hoursSaved}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                        <span>Срок окупаемости</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {generatedCase.roiCalculations.paybackMonths}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Снижение оттока</span>
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                        {generatedCase.roiCalculations.churnReduction}
                      </div>
                    </div>
                  </div>

                  {/* Result Detail Tabs */}
                  <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                      onClick={() => setResultTab('summary')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        resultTab === 'summary'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Модули
                    </button>
                    <button
                      onClick={() => setResultTab('migration')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        resultTab === 'migration'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Миграция
                    </button>
                    <button
                      onClick={() => setResultTab('full')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        resultTab === 'full'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Полный отчёт
                    </button>
                  </div>

                  {/* Tab Content */}
                  {resultTab === 'summary' && (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                        Рекомендуемый комплект модулей для {networkEquipment}:
                      </div>
                      {generatedCase.architecture.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-200 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {resultTab === 'migration' && (
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                        График бесшовной миграции с {currentBilling}:
                      </div>
                      {generatedCase.migrationPlan.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 dark:text-slate-200 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {resultTab === 'full' && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto font-mono text-[11px]">
                      {generatedCase.fullProposalMarkdown}
                    </div>
                  )}

                  {/* Action CTAs */}
                  <div className="space-y-2 pt-2">
                    {/* Download PDF Report button */}
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="w-full py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm disabled:opacity-50"
                    >
                      {isDownloadingPdf ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Формирование PDF-отчёта...</span>
                        </>
                      ) : pdfSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>PDF-отчёт успешно сформирован и скачан!</span>
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4 text-emerald-400" />
                          <span>Скачать PDF-отчёт (ТЭО для стейкхолдеров)</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenDemo({
                          plan: generatedCase.recommendedPlan.includes('Бизнес') ? 'Бизнес' : 'Pro',
                          companyName: providerName,
                          subscribers: parseInt(subscribersCount.replace(/\D/g, '')) || 3000,
                          comment: `Бизнес-кейс автоматизации для ${providerName} (${subscribersCount} аб., ${currentBilling} -> СмИТ Биллинг 3.6, оборудование: ${networkEquipment}). Задачи: ${selectedChallenges.join(', ')}`,
                        });
                      }}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <span>Запросить демо-доступ по этому кейсу</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleInjectIntoChat}
                      className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Bot className="w-4 h-4 text-emerald-500" />
                      <span>Обсудить кейс с AI-ассистентом в чате</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
