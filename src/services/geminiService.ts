import { GoogleGenAI } from '@google/genai';

export interface ProviderCaseInput {
  providerName: string;
  region: string;
  subscribersCount: string;
  currentBilling: string;
  networkEquipment: string;
  challenges: string[];
  additionalNotes?: string;
  demoCompanyName?: string;
}

export interface GeneratedBusinessCase {
  summary: string;
  architecture: string[];
  roiCalculations: {
    monthlySavings: string;
    hoursSaved: string;
    paybackMonths: string;
    churnReduction: string;
  };
  regulatoryCompliance: string;
  migrationPlan: string[];
  recommendedPlan: string;
  fullProposalMarkdown: string;
}

export async function generateProviderBusinessCase(
  input: ProviderCaseInput
): Promise<GeneratedBusinessCase> {
  const apiKey = process.env.API_KEY || '';

  const prompt = `
Составь персонализированный коммерческий и технический бизнес-кейс автоматизации для оператора связи на базе платформы «СмИТ Биллинг 3.6».

Данные провайдера:
- Название оператора: ${input.providerName || 'Региональный оператор ШПД'}
- Регион / локация: ${input.region || 'Россия'}
- Абонентская база: ${input.subscribersCount}
- Текущая биллинговая система: ${input.currentBilling || 'Устаревший биллинг / Excel'}
- Сетевая инфраструктура / BNG: ${input.networkEquipment || 'MikroTik / Linux FreeRADIUS'}
- Приоритетные задачи и болевые точки: ${input.challenges.length ? input.challenges.join(', ') : 'Автоматизация счетов, СОРМ-3, мобильное приложение'}
- Дополнительные требования: ${input.additionalNotes || 'Бесшовная миграция без остановки услуг'}

Требования к ответу:
Ответь структурированным, экспертным языком сетевого инженера и финансового директора.
Используй разделы с эмодзи:
1. 🎯 Резюме аудита и ключевые риски текущей конфигурации
2. ⚙️ Целевой архитектурный стек «СмИТ Биллинг 3.6» под оборудование провайдера
3. 🛡️ Регуляторная защита: СОРМ-3 (приказ №573) и фискализация 54-ФЗ
4. 💰 Расчёт экономической эффективности (ROI): экономия человеко-часов, снижение кассового разрыва и дебиторки
5. 🚀 Регламент ночной миграции базы данных с гарантией сходимости сальдо
6. 📋 Рекомендуемый тарифный план и срок окупаемости инвестиций
`;

  try {
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Ты — главный системный архитектор биллинговой платформы «СмИТ Биллинг 3.6» для интернет-провайдеров и телеком-операторов. Твои предложения опираются на реальные цифры, протоколы (FreeRADIUS, CoA, Opt82, IPoE, PPPoE), нормативные акты (приказ №573 Минцифры по СОРМ-3, 54-ФЗ) и модули системы (авторазбор выписок, PayLog, склад ТМЦ, личный кабинет абонента). Пиши убедительно, предметно и профессионально.',
          temperature: 0.7,
        },
      });

      const markdownText = response.text || '';
      if (markdownText) {
        return parseAndFormatCase(markdownText, input);
      }
    }
  } catch (error) {
    console.warn('Gemini API call encountered an issue, generating expert fallback proposal:', error);
  }

  // High-fidelity fallback proposal if API key is not active or during offline testing
  return generateExpertFallbackCase(input);
}

function parseAndFormatCase(
  markdownText: string,
  input: ProviderCaseInput
): GeneratedBusinessCase {
  const subsNum = parseInt(input.subscribersCount.replace(/\D/g, '')) || 3000;
  const estimatedSavings = Math.round(subsNum * 18 + 45000).toLocaleString('ru-RU');
  const hours = Math.min(120, Math.round(subsNum * 0.015 + 35));

  return {
    summary: `Индивидуальный план трансформации для «${input.providerName || 'Оператора'}» (${input.subscribersCount}, инфраструктура ${input.networkEquipment}). Замена ${input.currentBilling} на микросервисный стек СмИТ Биллинг 3.6.`,
    architecture: [
      `FreeRADIUS 3.2 с откликом 0.03 мс и интеграцией с ${input.networkEquipment}`,
      'Модуль «Банковские выписки» с автораспознаванием 1C/Сбер/Т-Банк',
      'Облачная фискализация 54-ФЗ через АТОЛ Онлайн',
      'Выгрузка СОРМ-3 по 13 форматам приказа №573 Минцифры',
      'Личный кабинет абонента + мобильное приложение iOS / Android с СБП',
      'Модуль учёта муфт и кабелей ВОЛС + Склад ТМЦ',
    ],
    roiCalculations: {
      monthlySavings: `${estimatedSavings} ₽/мес`,
      hoursSaved: `${hours} часов/мес`,
      paybackMonths: '1.5 месяца',
      churnReduction: 'на 22-30%',
    },
    regulatoryCompliance:
      '100% соответствие приказу Минцифры №573 (СОРМ-3) и 54-ФЗ (авточеки без задержек).',
    migrationPlan: [
      'День 1-2: Развёртывание изолированного Docker-контура СмИТ Биллинг рядом с текущей системой',
      `День 3-4: ETL-экспорт абонентов, договоров и сальдо из ${input.currentBilling} со сверкой копейка в копейку`,
      'День 5: Тестовая RADIUS-авторизация 50 тестовых абонентов (IPoE/PPPoE)',
      'День 6: Ночное переключение RADIUS-трафика без разрыва активных сессий абонентов',
      'День 7: Обучение бухгалтера и службы техподдержки',
    ],
    recommendedPlan: subsNum > 8000 ? 'Тариф «Бизнес» (37 900 ₽/мес)' : 'Тариф «Pro» (24 900 ₽/мес)',
    fullProposalMarkdown: markdownText,
  };
}

function generateExpertFallbackCase(input: ProviderCaseInput): GeneratedBusinessCase {
  const subsNum = parseInt(input.subscribersCount.replace(/\D/g, '')) || 3000;
  const name = input.providerName || 'Вашей компании';
  const billing = input.currentBilling || 'текущей системы';
  const net = input.networkEquipment || 'MikroTik / Linux BNG';
  const estimatedSavings = Math.round(subsNum * 18 + 45000).toLocaleString('ru-RU');
  const hours = Math.min(120, Math.round(subsNum * 0.015 + 35));
  const plan = subsNum > 8000 ? 'Тариф «Бизнес» (37 900 ₽/мес)' : 'Тариф «Pro» (24 900 ₽/мес)';

  const markdown = `
### 🎯 1. Аудит профиля оператора «${name}»
- **Локация и масштаб:** ${input.region || 'Региональная сеть'}, ${input.subscribersCount}.
- **Текущая платформа:** ${billing}. Характеризуется высокими трудозатратами на сопровождение, риском расхождения сальдо при ручном разборе платежей и сложностями с регламентными выгрузками СОРМ-3.
- **Сетевое ядро:** ${net}. Требует автоматического управления скоростями (CoA), выдачи статических/динамических белых IP и изоляции должников на Captive Portal.

---

### ⚙️ 2. Целевая архитектура «СмИТ Биллинг 3.6»
1. **FreeRADIUS 3.2 High-Load:** Отклик на Access-Request 0.03 мс. Прямая поддержка CoA/PoD для ${net}.
2. **Банковский модуль:** Автоматический опрос защищённого почтового ящика, парсинг текстовых выписок 1C (Сбербанк, Т-Банк, Альфа, ВТБ), сверка по 4 параметрам и распределение оплат по договорам.
3. **Фискализация 54-ФЗ:** Интеграция с АТОЛ Онлайн / Orange Data. Автоматическая отправка электронного чека в ОФД и на e-mail/телефон абонента.
4. **Абонентский сервис:** Мобильные приложения iOS/Android + PWA ЛК с оплатой через Систему быстрых платежей (комиссия до 0.4% вместо 2.5% эквайринга).
5. **Склад и ВОЛС:** Учёт кроссов, свитчей, оптических муфт и кабельных трасс с привязкой к абонентам и нарядам монтажников.

---

### 🛡️ 3. СОРМ-3 и законодательная безопасность
- Модуль СОРМ генерирует 13 обязательных отчётов в строгом соответствии с **приказом Минцифры №573**.
- Все форматы (HEX IP, разделители \`;\`, таймзоны UTC+N) валидируются внутренним линтером до выгрузки.
- Готовые профили совместимости с ПУ Норси-Транс, МФИ Софт, Сигнатек, Специальные Технологии.

---

### 💰 4. Расчёт экономического эффекта (ROI)
- **Прямая экономия:** от **${estimatedSavings} ₽ ежемесячно** за счёт ликвидации ручного труда бухгалтера и операторов ввода платежей.
- **Высвобождение рабочего времени:** **~${hours} часов в месяц** у инженеров и бухгалтерии.
- **Снижение кассового разрыва:** Автоматические Push/SMS-напоминания и автоплатежи через СБП снижают процент должников на **25-35%**.
- **Окупаемость затрат на биллинг:** **1–2 месяца** с момента запуска.

---

### 🚀 5. План бесшовной миграции без простоя
- **Этап 1:** Развёртывание СмИТ Биллинг на вашем сервере в Docker за 15 минут параллельно с ${billing}.
- **Этап 2:** Автоматический импорт базы (абоненты, адреса, тарифы, лицевые счета, остатки на балансах).
- **Этап 3:** Двойной аудит сальдо главным бухгалтером.
- **Этап 4:** Перевод RADIUS-запросов с ${net} на новый сервер в ночное технологическое окно.
- **Результат:** Абоненты даже не заметят перехода — интернет работает непрерывно.

---

### 💡 6. Рекомендуемый тариф
Рекомендуем **${plan}**. Включает все необходимые модули под ключ, бесплатную техническую поддержку первой линии и гарантию обновления под новые приказы Минцифры.
  `.trim();

  return parseAndFormatCase(markdown, input);
}
