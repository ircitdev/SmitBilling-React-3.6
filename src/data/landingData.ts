import { PricingPlan, ApiEndpoint, FaqItem } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  // Состав — по каталогу лицензионного сервера (Plan ↔ Module). Базовые модули
  // (биллинг-ядро, RADIUS, отчёты, карта сети) есть в любом тарифе и в счёт не входят.
  {
    id: 'start',
    name: 'Старт',
    description: 'Базовый биллинг + СОРМ',
    monthlyPrice: 9900,
    annualPrice: 99000,
    modulesIncluded: 4,
    features: [
      'Базовые модули: биллинг-ядро, интернет-доступ (FreeRADIUS), отчёты, карта сети',
      'ЛК и мобильные приложения iOS/Android',
      'СОРМ',
      'Captive Portal',
      'Документ: договоры, счета и акты в PDF',
    ],
    targetAudience: '',
    subscribersCapacity: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Полный набор для роста',
    monthlyPrice: 24900,
    annualPrice: 249000,
    modulesIncluded: 14,
    highlighted: true,
    badge: 'Популярный выбор',
    features: [
      'Всё, что входит в «Старт»',
      'Банковские выписки',
      'Фискализация 54-ФЗ',
      'Склад (ТМЦ и оборудование)',
      'Поддержка и CRM / Продажи',
      'Голосовая связь',
      'IPTV и видеонаблюдение',
      'Лендинги',
      'Почтовый сервер',
    ],
    targetAudience: '',
    subscribersCapacity: '',
  },
  {
    id: 'business',
    name: 'Бизнес',
    description: 'Всё для среднего оператора',
    monthlyPrice: 37900,
    annualPrice: 379000,
    modulesIncluded: 17,
    features: [
      'Всё, что входит в «Pro»',
      'AI-ассистент',
      'IP-телефония',
      'Мультиорганизация: несколько юрлиц в одной установке',
    ],
    targetAudience: '',
    subscribersCapacity: '',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Максимум + white-label',
    monthlyPrice: 49900,
    annualPrice: 499000,
    modulesIncluded: 20,
    features: [
      'Всё, что входит в «Бизнес»',
      'Whitelabel: свой бренд',
      'Автообзвон',
      'Игры / Маркетинг',
    ],
    targetAudience: '',
    subscribersCapacity: '',
  },
];

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/rest_api/v2/Abonents/5552/',
    label: 'Карточка абонента',
    description: 'Получение полной информации об абоненте, услугах, балансе и сетевых параметрах',
    requestHeaders: {
      Authorization: 'Token 8f92a10b4238719f9d77421...',
      Accept: 'application/json',
    },
    responsePayload: `{
  "id": 5552,
  "contract_number": "SM-2026-5552",
  "name": "Иванов Иван Иванович",
  "phone": "+7 (920) 123-45-67",
  "email": "ivanov.i@domain.ru",
  "balance": "1250.00",
  "credit_limit": "0.00",
  "status": "active",
  "enabled": true,
  "tarif": {
    "id": 14,
    "name": "Оптика 300 Мбит/с + ТВ",
    "price": "850.00",
    "speed_in": 300000,
    "speed_out": 300000
  },
  "ip_address": "100.64.14.88",
  "nas_ip": "10.0.0.1",
  "address": "г. Волгоград, ул. Ленина, д. 42, кв. 15",
  "promise_pay_available": true
}`,
  },
  {
    method: 'POST',
    path: '/lk/payments/webhook/',
    label: 'Webhook платежа',
    description: 'Унифицированный приём уведомления о платеже от ЮKassa, Wallet One или СБП',
    requestHeaders: {
      'Content-Type': 'application/json',
      'X-Signature': 'd41d8cd98f00b204e9800998ecf8427e',
    },
    requestPayload: `{
  "event": "payment.succeeded",
  "transaction_id": "pay_2f8a1c9e4871",
  "contract_number": "SM-2026-5552",
  "amount": "850.00",
  "currency": "RUB",
  "payment_method": "sbp",
  "paid_at": "2026-09-11T12:30:00Z"
}`,
    responsePayload: `{
  "status": "success",
  "code": 200,
  "message": "Платёж зачислен на лицевой счёт SM-2026-5552",
  "operation_id": 481920,
  "new_balance": "2100.00",
  "unblocked": true,
  "coa_sent": true,
  "receipt_queued": true
}`,
  },
  {
    method: 'POST',
    path: '/rest_api/v2/promise_pay/5552/',
    label: 'Обещанный платёж',
    description: 'Включение доверительного платежа для мгновенной разблокировки интернета',
    requestHeaders: {
      Authorization: 'Token 8f92a10b4238719f9d77421...',
      'Content-Type': 'application/json',
    },
    requestPayload: `{
  "days": 5,
  "amount": "850.00",
  "reason": "Запрос из мобильного приложения"
}`,
    responsePayload: `{
  "success": true,
  "abonent_id": 5552,
  "activated_at": "2026-09-11T12:32:00Z",
  "expires_at": "2026-09-16T12:32:00Z",
  "amount": "850.00",
  "fee": "0.00",
  "radius_action": "CoA-Request sent (session restored)"
}`,
  },
  {
    method: 'GET',
    path: '/rest_api/v2/FinanceOperations/?abonent=5552&limit=5',
    label: 'Журнал операций',
    description: 'Финансовая выписка по лицевому счёту абонента с фильтрацией и пагинацией',
    requestHeaders: {
      Authorization: 'Token 8f92a10b4238719f9d77421...',
    },
    responsePayload: `{
  "count": 48,
  "next": "/rest_api/v2/FinanceOperations/?abonent=5552&limit=5&offset=5",
  "results": [
    {
      "id": 894012,
      "date": "2026-09-11 12:30:14",
      "op_type": 1,
      "op_name": "Пополнение через СБП (ЮKassa)",
      "amount": "+850.00",
      "balance_after": "2100.00",
      "fiscal_receipt_url": "https://ofd.ru/check/..."
    },
    {
      "id": 891004,
      "date": "2026-09-01 00:00:01",
      "op_type": 2,
      "op_name": "Абонентская плата: Тариф 300 Мбит/с",
      "amount": "-850.00",
      "balance_after": "1250.00"
    }
  ]
}`,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-selfhosted',
    question: 'Это облачный сервис или установка на собственный сервер?',
    answer: 'СмИТ Биллинг поставляется в формате Self-Hosted: система целиком разворачивается через готовый Docker Compose на вашем собственном физическом сервере или в VPS. Все базы данных абонентов, финансовые проводки и сетевые логи остаются исключительно в вашем закрытом периметре в соответствии со 152-ФЗ.',
    category: 'Архитектура',
  },
  {
    id: 'faq-migration',
    question: 'Как происходит переход с других биллингов (Mikbill, Carbon, UTM5, LANBilling)?',
    answer: 'Сначала забираем выгрузку и разворачиваем копию рядом — ваша система продолжает работать. Переносим клиентов, договоры, тарифы, лицевые счета и историю операций, затем сверяем балансы и начисления с оригиналом построчно. Переключение — повторный импорт свежих данных и перевод RADIUS ночью, без простоя для абонентов.',
    category: 'Внедрение',
  },
  {
    id: 'faq-sorm',
    question: 'Как реализована поддержка требований СОРМ-3 по приказу №573?',
    answer: 'Модуль СОРМ формирует все 13 регламентированных отчётов в точном соответствии с приказом Минцифры №573 (HEX-форматы IP-адресов, масок, даты с таймзонами, разделители `;`). В систему встроены готовые профили форматов под 6 комплексов СОРМ (Норси-Транс, МФИ Софт, Сигнатек, VAS Experts и др.) с автоматической отправкой по расписанию на FTP-сервер комплекса.',
    category: 'Законодательство',
  },
  {
    id: 'faq-server-req',
    question: 'Какие аппаратные требования предъявляются к серверу?',
    answer: 'Нужен сервер с Docker (Linux). Минимум — 2 ядра, 4 ГБ оперативной памяти и 40 ГБ SSD; рекомендуется 4+ ядра, 8+ ГБ и 100+ ГБ SSD/NVMe. Точнее подберём под размер вашей сети и набор модулей.',
    category: 'Архитектура',
  },
  {
    id: 'faq-ai-agent',
    question: 'Как именно работает AI-ассистент и безопасны ли данные абонентов?',
    answer: 'AI-агент первого уровня поддержки работает на 7 каналах (чат в ЛК, моб. приложение, Telegram, VK, Email, сайт и телефонная линия). Он подключён к защищённому API биллинга через Function Calling: знает тарифы оператора, баланс конкретного авторизованного абонента, статус сессии и диагностику. Если абонент задаёт нестандартный вопрос или жалуется на физический обрыв, диалог мгновенно эскалируется дежурному инженеру с передачей контекста.',
    category: 'AI и автоматизация',
  },
  {
    id: 'faq-multiorg',
    question: 'Можно ли вести несколько юрлиц или брендов в одной установке?',
    answer: 'Да! Модуль «Мультиорганизация» специально спроектирован для холдингов. Вы можете завести отдельные компании (например, ООО «Провайдер-Сеть», ИП «Сервис-Плюс», ЧОП «Видеонаблюдение»). У каждого юрлица будут свои договоры, реквизиты, независимые кассы ЮKassa/АТОЛ, почтовые ящики и сотрудники, при этом общая физическая сеть.',
    category: 'Функционал',
  },
  {
    id: 'faq-updates',
    question: 'Как выходят обновления и входит ли поддержка в лицензию?',
    answer: 'Все обновления ядра, модулей и адаптеров СОРМ входят в стоимость лицензии. Обновления приходят через сервер лицензий, миграции базы применяются автоматически. Техническая поддержка доступна в Telegram, по телефону и через ServiceDesk.',
    category: 'Лицензирование',
  },
];

export function getRecommendedPlan(subscribersCount: number): {
  plan: PricingPlan;
  monthlyCost: number;
  annualCost: number;
  costPerSubscriberPerMonth: number;
} {
  let planId = 'start';
  if (subscribersCount <= 500) {
    planId = 'start';
  } else if (subscribersCount <= 3000) {
    planId = 'pro';
  } else if (subscribersCount <= 10000) {
    planId = 'business';
  } else {
    planId = 'enterprise';
  }

  const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];
  const costPerSubscriber = plan.annualPrice / 12 / Math.max(subscribersCount, 1);

  return {
    plan,
    monthlyCost: plan.monthlyPrice,
    annualCost: plan.annualPrice,
    costPerSubscriberPerMonth: Number(costPerSubscriber.toFixed(1)),
  };
}

// Media URLs
export const MEDIA_URLS = {
  promoVideo: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo.mp4',
  promoPoster: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo-poster.jpg',
  platformPromoVideo: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo.mp4',
  platformPromoPoster: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/platform-promo-poster.jpg',
  moneyVideo: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/money-bez-buhgaltera.mp4',
  moneyPoster: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/video/money-bez-buhgaltera-poster.jpg',
  podcastAudio: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/podcast_smit_billing.m4a',
  appMockup: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/assets/app_mockup.jpg',
  mascot: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/assets/mascot.webp',
  heroLightVideo: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/assets/hero_light_desktop.mp4',
};

export const GALLERY_SHOTS: import('../types').ScreenshotItem[] = [
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/dashboard.png',
    label: 'Сводный дашборд оператора: ключевые показатели сети',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/abonents.png',
    label: 'Список абонентов: древовидная структура и статусы',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/abonent_card.png',
    label: 'Карточка абонента со всеми вкладками',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/debtors.png',
    label: 'Реестр должников и управление финансовыми блокировками',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/tarifs.png',
    label: 'Тарифные планы, периодические услуги и опции скорости',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/finops.png',
    label: 'Финансовые операции: журнал проводок и распределение',
    cat: 'reports',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/reports_dashboard.png',
    label: 'Аналитика и динамика выручки, ARPU и оттока',
    cat: 'reports',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/paylog.png',
    label: 'Журнал PayLog: фиксация каждого рубля с миллионной ёмкостью',
    cat: 'reports',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/custom_reports.png',
    label: 'Конструктор параметрических SQL-отчётов с графиками',
    cat: 'reports',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/dev_reports.png',
    label: 'Dev Reports: трассировка сетевых событий и аудит воркеров',
    cat: 'reports',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/payment.png',
    label: 'Настройка шлюзов эквайринга: ЮKassa, Wallet One, СБП',
    cat: 'settings',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/crm_v1846/crm_kanban.png',
    label: 'CRM-воронка заявок на подключение новых клиентов',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/ai_v1846/ai_hub.png',
    label: 'AI-ассистент: единый хаб 7 каналов и автоматические сценарии',
    cat: 'admin',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/integrations.png',
    label: 'Интеграции: FreeRADIUS, АТОЛ Онлайн, SMS Aero, DaData',
    cat: 'settings',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/backup.png',
    label: 'Автоматическое резервное копирование баз и конфигураций',
    cat: 'settings',
  },
  {
    src: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/billing_v1847/homes.png',
    label: 'География сети: дома, адреса, подъезды и порты коммутаторов',
    cat: 'admin',
  },
];

export const BLOG_ARTICLES: import('../types').BlogArticle[] = [
  {
    id: 'sorm-573',
    title: 'СОРМ по приказу №573: что выгружать и почему выгрузка — не главное',
    excerpt: 'Файлы формируются, расписание работает, проверка проходит — а данные внутри пустые. Разбираем, из чего состоит выгрузка и где она ломается на практике.',
    tag: 'Закон',
    date: '30 августа 2026',
    dateIso: '2026-08-30',
    readTime: '7 мин',
    cover: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/sorm-573.jpg',
    coverLight: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/sorm-573-light.jpg',
    href: '/blog/sorm-573',
  },
  {
    id: 'karta-seti',
    title: 'Карта сети: кто останется без интернета, если оборвётся эта трасса',
    excerpt: 'Схема сети обычно живёт в голове монтажника и в файле у одного человека. Что меняется, когда узлы, трассы и абоненты оказываются на одной карте.',
    tag: 'Сеть и оборудование',
    date: '29 августа 2026',
    dateIso: '2026-08-29',
    readTime: '6 мин',
    cover: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/karta-seti.jpg',
    coverLight: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/karta-seti-light.jpg',
    href: '/blog/karta-seti',
  },
  {
    id: 'bankovskie-vypiski',
    title: 'Платежи юрлиц: как перестать разбирать выписку руками',
    excerpt: 'Оплата пришла, а клиент числится должником и уходит в блокировку. Разбираем путь платежа от письма банка до зачисления и то, почему часть платежей всегда придётся смотреть глазами.',
    tag: 'Деньги',
    date: '27 августа 2026',
    dateIso: '2026-08-27',
    readTime: '7 мин',
    cover: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/bankovskie-vypiski.jpg',
    coverLight: 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/landing_site/blog/covers/bankovskie-vypiski-light.jpg',
    href: '/blog/bankovskie-vypiski',
  },
];

// Виджеты — из каталога сервера лицензий: название, описание, возможности, версия.
export const WIDGETS_DATA: import('../types').WidgetItem[] = [
  {
    "id": "salesbot-summary",
    "name": "Salesbot",
    "cat": "crm",
    "catName": "CRM · Продажи",
    "version": "1.1.0",
    "icon": "Bot",
    "desc": "Обращения и заявки ботов за период: сколько диалогов, сколько дошло до сделки и какие боты работают.",
    "fullDesc": "Что происходит с чат-ботами: сколько диалогов за период, какая доля дошла до заявки, разбивка по ботам и каналам. Показывает, окупается ли бот и не обрывается ли сценарий на каком-то шаге.",
    "image": "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/salesbot-summary-cover_877a7868.jpg",
    "developer": "СмИТ",
    "features": [
      "Диалоги за период и доля дошедших до заявки",
      "Разбивка по ботам и каналам (Telegram, VK, MAX, сайт)",
      "Последние обращения с переходом в диалог",
      "Учитывает выбранную организацию"
    ],
    "how": [
      "Виджет считает сессии ботов и заявки, созданные по их итогам.",
      "Сами боты собираются визуальным конструктором: шаги, кнопки, ветвления, передача человеку — и публикуются отдельно от черновика."
    ],
    "shots": [
      "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/salesbot-summary-cover_877a7868.jpg"
    ]
  },
  {
    "id": "deal-nearby",
    "name": "Рядом с адресом",
    "cat": "crm",
    "catName": "CRM · Продажи",
    "version": "1.2.0",
    "icon": "MapPin",
    "desc": "Аргумент для продажи: подключённые абоненты в доме сделки и в радиусе 300 м, другие сделки в этом доме.",
    "fullDesc": "Аргумент для продажи и планирования монтажа: в карточке сделки показывает, кто уже подключён в этом доме и в радиусе 300 метров, и какие ещё сделки есть по этому адресу. Видно, что сеть рядом — и что монтажник может закрыть несколько адресов за один выезд.",
    "image": "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/deal-nearby_60e2a812.webp",
    "developer": "СмИТ",
    "features": [
      "Подключённые клиенты в доме сделки и в радиусе 300 метров",
      "Другие сделки по этому же адресу",
      "Расстояние до ближайшего подключения",
      "Ссылки на клиента и сделку"
    ],
    "how": [
      "Адрес сделки сопоставляется со справочником адресов и координатами.",
      "Виджет ищет рядом подключённых клиентов и активные сделки, показывает их списком с расстоянием."
    ],
    "shots": [
      "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/deal-nearby_60e2a812.webp"
    ]
  },
  {
    "id": "funnel-summary",
    "name": "Сводка воронки",
    "cat": "crm",
    "catName": "CRM · Продажи",
    "version": "1.0.0",
    "icon": "BarChart2",
    "desc": "Счётчики сделок по стадиям воронки — прямо на дашборде CRM.",
    "fullDesc": "Короткая сводка воронки на дашборде CRM: сколько сделок на каждой стадии, на какую сумму и какая конверсия до выигранной. Позволяет увидеть затор — стадию, где сделки копятся и не двигаются.",
    "image": "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/funnel-summary_c4f9a10b.webp",
    "developer": "СмИТ",
    "features": [
      "Сделки по стадиям выбранной воронки: количество и сумма",
      "Конверсия от первой стадии до выигранной",
      "Переход в канбан с фильтром по стадии",
      "Учитывает выбранную в шапке организацию"
    ],
    "how": [
      "Виджет считает сделки по стадиям текущей воронки и показывает столбиками с цифрами.",
      "Клик по стадии открывает канбан, уже отфильтрованный по ней."
    ],
    "shots": [
      "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/funnel-summary_c4f9a10b.webp"
    ]
  },
  {
    "id": "lead-sources",
    "name": "Лиды по источникам",
    "cat": "analytics",
    "catName": "Аналитика",
    "version": "1.1.0",
    "icon": "PieChart",
    "desc": "Лиды за 7/30 дней и конверсия по источникам; при мультиорганизации — чипы организаций и org-изоляция.",
    "fullDesc": "Откуда приходят заявки: формы сайта, звонки, мессенджеры, боты, рекламные кампании — за 7 и 30 дней, с конверсией каждого канала. Помогает решить, куда добавить бюджет, а какой канал не окупается.",
    "image": "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/lead-sources-stats_ad5cb384.webp",
    "developer": "СмИТ",
    "features": [
      "Заявки по источникам за 7 и 30 дней",
      "Конверсия источника в выигранные сделки",
      "Чипы организаций при мультиорганизационном режиме",
      "Переход к списку заявок источника"
    ],
    "how": [
      "Каждая заявка помечается источником при приёме — форма, звонок, мессенджер, бот.",
      "Виджет группирует заявки по источникам и считает, сколько из них дошло до сделки."
    ],
    "shots": [
      "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/lead-sources-stats_ad5cb384.webp"
    ]
  },
  {
    "id": "campaign-perf",
    "name": "Рекламные кампании",
    "cat": "crm",
    "catName": "CRM · Продажи",
    "version": "1.0.1",
    "icon": "TrendingUp",
    "desc": "Топ кампаний за 30 дней: заявки, сделки, выручка и окупаемость. Если подключён рекламный кабинет Яндекс.Директа — рядом расход, и стоимость заявки считается по факту, а не по вбитому бюджету.",
    "fullDesc": "Показывает на дашборде CRM, что принесла реклама за 30 дней: сколько заявок и сделок дала каждая кампания, какая выручка и окупились ли вложения. Итоговая строка складывает бюджет и выручку по всем кампаниям, чтобы видеть общую картину, а не только лидеров.",
    "image": "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/campaign-performance-cover_c212814f.jpg",
    "developer": "СмИТ",
    "features": [
      "Заявки, сделки и выручка по каждой кампании за 30 дней",
      "Окупаемость вложений: считается только там, где были лиды",
      "Итоговая строка: суммарный бюджет и выручка",
      "Переход к кампании и к её заявкам"
    ],
    "how": [
      "Кампания помечает заявки UTM-метками или QR-кодом.",
      "Виджет собирает по ним сделки и выручку, сопоставляет с бюджетом и показывает отдачу.",
      "Черновики без лидов не портят картину — у них отдача не считается."
    ],
    "shots": [
      "https://storage.googleapis.com/uspeshnyy-projects/smit/license/widgets/covers/campaign-performance-cover_c212814f.jpg"
    ]
  }
];

export const INTEGRATION_GROUPS: import('../types').IntegrationGroup[] = [
  {
    title: 'Деньги и кассы',
    description: 'Платёжные шлюзы, интернет-эквайринг, СБП и фискализация по 54-ФЗ',
    items: [
      { name: 'ЮKassa', description: 'Онлайн-оплата в кабинете и приложении', iconType: 'credit-card' },
      { name: 'Wallet One', description: 'Приём платежей и уведомления об оплате', iconType: 'wallet' },
      { name: 'Сбербанк', description: 'Выписки и реестры платежей из почты', iconType: 'building' },
      { name: 'Выписки 1С', description: 'Разбор выписок любого банка в формате 1С', iconType: 'landmark' },
      { name: 'АТОЛ Онлайн', description: 'Облачная фискализация чеков по 54-ФЗ', iconType: 'receipt' },
    ],
  },
  {
    title: 'Связь с клиентом',
    description: 'Омниканальные коммуникации, мессенджеры и push-уведомления',
    items: [
      { name: 'Telegram Bot API', description: 'Интерактивный бот, уведомления, привязка договора', iconType: 'send' },
      { name: 'ВКонтакте', description: 'Чат сообщества и виджет авторизации', iconType: 'message-circle' },
      { name: 'MAX', description: 'Мессенджер: чат поддержки и боты', iconType: 'messages-square' },
      { name: 'SMS Aero', description: 'Доставка SMS с кодами авторизации и напоминаниями', iconType: 'phone' },
      { name: 'Firebase FCM', description: 'Нативные push-сообщения на iOS и Android', iconType: 'bell' },
      { name: 'SMTP / DKIM / DMARC', description: 'Почта со своего домена: счета, акты, уведомления', iconType: 'mail' },
    ],
  },
  {
    title: 'Сеть, связь и ТВ',
    description: 'Сетевое оборудование, BNG-серверы, телефония и IPTV-платформы',
    items: [
      { name: 'FreeRADIUS 3.2', description: 'PPPoE, IPoE, CoA/PoD и пулы IP-адресов', iconType: 'network' },
      { name: 'MikroTik RouterOS', description: 'RADIUS, CoA и настройка по SSH', iconType: 'router' },
      { name: 'Asterisk', description: 'Своя АТС: звонки из карточки и запись разговоров', iconType: 'phone-call' },
      { name: 'Novofon / Mango Office', description: 'Облачные АТС и виртуальные телефонные номера', iconType: 'radio' },
      { name: 'TVIP Media', description: 'Интерактивное телевидение, приставки и архив ТВ', iconType: 'tv' },
      { name: 'Смотрёшка', description: 'Аккаунты и пакеты ТВ из услуги биллинга', iconType: 'monitor' },
    ],
  },
  {
    title: 'Данные и инфраструктура',
    description: 'Искусственный интеллект, геоданные, картография и облачные хранилища',
    items: [
      { name: 'AI-модели', description: 'Несколько провайдеров с автоматическим резервом', iconType: 'sparkles' },
      { name: 'DaData.ru', description: 'ФИАС/КЛАДР стандартизация адресов и реквизитов', iconType: 'database' },
      { name: 'OpenStreetMap / Яндекс / 2ГИС', description: 'Тайловые подложки для геоинформационной карты ВОЛС', iconType: 'map' },
      { name: 'Google Cloud Storage', description: 'Файлы, документы и резервные копии', iconType: 'hard-drive' },
      { name: 'Cloudflare', description: 'Защита внешних веб-сервисов и SSL-терминация', iconType: 'shield' },
    ],
  },
];

export const MIGRATION_SYSTEMS = [
  {
    name: 'Carbon Billing 4',
    description: 'Структуру его базы система унаследовала — перенос идёт напрямую, без промежуточных выгрузок.',
    badge: 'Перенос напрямую',
  },
  {
    name: 'Mikbill',
    description: 'Обычный путь оператора, которому стало тесно в PHP + MySQL: клиенты, тарифы и платежи переносятся целиком.',
    badge: 'Клиенты и платежи',
  },
  {
    name: 'UTM5 / LANBilling',
    description: 'Переносим справочники, абонентов и финансовую историю; RADIUS переключается на новый сервер в отдельное окно.',
    badge: 'Сверка балансов',
  },
  {
    name: 'Самописные БД и 1С',
    description: 'Разбираем вашу схему и пишем импорт под неё — так уже переносили базы из Expert Billing.',
    badge: 'Импорт под схему',
  },
];
