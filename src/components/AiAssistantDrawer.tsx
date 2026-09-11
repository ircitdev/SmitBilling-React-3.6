import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, CornerDownLeft, RefreshCw } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const PRESET_QUESTIONS = [
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
    'СмИТ Биллинг 3.6 — это комплексная платформа для операторов связи: FreeRADIUS 3.2 с откликом 0.03 мс, тарификация, СОРМ-3 по 573 приказу, личный кабинет, мобильные приложения iOS/Android, склад ТМЦ и авторазбор выписок 54-ФЗ. Хотите протестировать систему на живом демо-стенде?',
};

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onOpenDemo,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Здравствуйте! Я интеллектуальный ассистент СмИТ Биллинг. Могу ответить на любые вопросы о платформе, модулях, СОРМ-3, оборудовании и переносе абонентской базы. О чём рассказать?',
      time: 'только что',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate AI thinking and reply matching knowledge base
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
    }, 700);
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

      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div id="ai-drawer-title" className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI-консультант СмИТ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[11px] text-slate-400">
                Знает архитектуру, СОРМ-3 и тарифы
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Закрыть чат"
            className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
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
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Частые вопросы:
          </div>
          <div className="flex gap-1.5 flex-nowrap pb-1">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/40 transition-colors cursor-pointer flex-shrink-0"
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
              placeholder="Спросите об архитектуре или модулях..."
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
            <span>Powered by Gemini & Telecom AI Engine</span>
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
      </div>
    </div>
  );
};
