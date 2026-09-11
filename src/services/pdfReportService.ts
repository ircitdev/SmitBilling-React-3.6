import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { GeneratedBusinessCase, ProviderCaseInput } from './geminiService';

export interface BusinessCasePdfOptions {
  demoCompanyName?: string;
}

/**
 * Formats numbers into Russian ruble currency string
 */
function formatCurrency(val: number): string {
  if (val >= 1000000) {
    return `${(val / 1000000).toFixed(2)} млн ₽`;
  }
  return `${val.toLocaleString('ru-RU')} ₽`;
}

/**
 * Calculates dynamic 5-year savings projection for the PDF charts
 */
function calculate5YearData(subscribersCountStr: string) {
  const parsed = parseInt(subscribersCountStr.replace(/\D/g, ''), 10);
  const subs = isNaN(parsed) || parsed <= 0 ? 3000 : parsed;

  const data = [];
  let cumulative = 0;
  const growthRate = 0.08;

  let licenseCost = 249000;
  if (subs <= 500) licenseCost = 99000;
  else if (subs <= 3000) licenseCost = 249000;
  else if (subs <= 10000) licenseCost = 379000;
  else licenseCost = 499000;

  for (let year = 1; year <= 5; year++) {
    const yearSubs = Math.round(subs * Math.pow(1 + growthRate, year - 1));
    const manualHoursCost = Math.round(yearSubs * 95);
    const uncollectedDebt = Math.round(yearSubs * 550 * 0.022 * 12);
    const legacySoftwareSupport = Math.round(180000 + yearSubs * 25);
    const totalLegacyCost = manualHoursCost + uncollectedDebt + legacySoftwareSupport;
    const smitCost = licenseCost;
    const annualSavings = Math.max(0, totalLegacyCost - smitCost);
    cumulative += annualSavings;

    data.push({
      year,
      yearLabel: `Год ${year}`,
      subsCount: yearSubs,
      legacyCost: totalLegacyCost,
      smitCost,
      annualSavings,
      cumulativeSavings: cumulative,
    });
  }

  return { subs, licenseCost, data, total5YearSavings: cumulative };
}

export async function generateBusinessCasePdf(
  businessCase: GeneratedBusinessCase,
  input: ProviderCaseInput,
  options?: BusinessCasePdfOptions
): Promise<void> {
  const cachedCompany = typeof window !== 'undefined' ? localStorage.getItem('smit_demo_company') : '';
  const targetCompany =
    input.providerName ||
    options?.demoCompanyName ||
    input.demoCompanyName ||
    cachedCompany ||
    'Оператор связи';

  const billingTitle = input.currentBilling || 'Текущая биллинговая система';
  const netTitle = input.networkEquipment || 'MikroTik / Linux BNG';
  const subsTitle = input.subscribersCount || '3 000';
  const regionTitle = input.region || 'Российская Федерация';

  const todayStr = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const docYear = new Date().getFullYear();
  const docId = `ТЭО-${docYear}/${Math.floor(1000 + Math.random() * 9000)}`;

  const { subs, data: projectionData, total5YearSavings } = calculate5YearData(subsTitle);
  const total5YearFormatted = formatCurrency(total5YearSavings);

  // Parent container placed outside viewport for rasterization
  const rootRenderContainer = document.createElement('div');
  rootRenderContainer.id = 'telecom-pdf-report-root';
  rootRenderContainer.style.position = 'fixed';
  rootRenderContainer.style.left = '-9999px';
  rootRenderContainer.style.top = '0';
  rootRenderContainer.style.zIndex = '-9999';

  // SVG Chart 1 coordinates math
  const maxSavings = Math.max(...projectionData.map((d) => d.cumulativeSavings), 100000);
  const chartW = 714;
  const chartH = 150;
  const points = projectionData.map((d, idx) => {
    const x = 50 + idx * ((chartW - 80) / 4);
    const y = chartH - 25 - (d.cumulativeSavings / maxSavings) * (chartH - 55);
    return { ...d, x, y };
  });

  const svgPathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
  const svgAreaD = `${svgPathD} L ${points[points.length - 1].x} ${chartH - 25} L ${points[0].x} ${chartH - 25} Z`;

  // PAGE 1: Branded Executive Cover Page
  const page1 = document.createElement('div');
  page1.style.width = '794px';
  page1.style.height = '1122px';
  page1.style.overflow = 'hidden';
  page1.style.boxSizing = 'border-box';
  page1.style.position = 'relative';
  page1.style.background = 'linear-gradient(145deg, #090d16 0%, #0f172a 60%, #022c22 100%)';
  page1.style.color = '#ffffff';
  page1.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  page1.style.padding = '56px 52px';
  page1.style.display = 'flex';
  page1.style.flexDirection = 'column';
  page1.style.justifyContent = 'space-between';

  page1.innerHTML = `
    <!-- TOP BRANDING & REGISTRY BADGES -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(16, 185, 129, 0.3); padding-bottom: 24px; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #0d9488); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);">
            С
          </div>
          <div>
            <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
              СмИТ БИЛЛИНГ <span style="color: #34d399;">3.6</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              Платформа биллинга и комплексной автоматизации операторов связи
            </div>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="display: inline-block; background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
            Реестр ПО Минцифры РФ №14892
          </div>
          <div style="font-size: 11px; color: #64748b;">
            152-ФЗ • 54-ФЗ • СОРМ-3 (Приказ №573)
          </div>
        </div>
      </div>

      <!-- DOCUMENT HEADER & TITLE -->
      <div style="margin-bottom: 44px;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; padding: 6px 14px; color: #34d399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
          <span>✦ Официальное технико-экономическое обоснование (ТЭО)</span>
        </div>
        <h1 style="font-size: 34px; font-weight: 900; line-height: 1.25; margin: 0 0 14px 0; color: #ffffff; letter-spacing: -0.5px;">
          Проект модернизации биллинга и финансовая модель окупаемости
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin: 0; max-width: 650px;">
          Комплексный расчёт перехода с ${billingTitle} на СмИТ Биллинг 3.6 с оценкой высвобождения ФОТ, снижения дебиторки и регламентом ночной миграции без простоя сети.
        </p>
      </div>

      <!-- TARGET COMPANY HERO PLATE -->
      <div style="background: rgba(15, 23, 42, 0.85); border: 2px solid #10b981; border-radius: 20px; padding: 28px 32px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); position: relative;">
        <div style="position: absolute; top: -12px; left: 32px; background: #10b981; color: #022c22; font-size: 10px; font-weight: 900; padding: 3px 12px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.8px;">
          Заказчик ТЭО
        </div>
        
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #34d399; font-weight: 700; margin-bottom: 4px;">
          Подготовлено для руководства и стейкхолдеров:
        </div>
        <div style="font-size: 28px; font-weight: 900; color: #ffffff; margin-bottom: 20px; letter-spacing: -0.3px;">
          ${targetCompany}
        </div>

        <!-- 4 Key Baseline Profile Parameters -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; border-top: 1px solid rgba(255, 255, 255, 0.1); pt: 18px; padding-top: 18px;">
          <div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Абонентская база</div>
            <div style="font-size: 16px; font-weight: 800; color: #34d399;">${subsTitle} аб.</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Регион сети</div>
            <div style="font-size: 15px; font-weight: 700; color: #ffffff;">${regionTitle}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Заменяемое ядро</div>
            <div style="font-size: 15px; font-weight: 700; color: #f87171;">${billingTitle}</div>
          </div>
          <div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Сетевая топология</div>
            <div style="font-size: 15px; font-weight: 700; color: #ffffff;">${netTitle}</div>
          </div>
        </div>
      </div>

      <!-- KEY OUTCOMES TEASER TILES -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 18px;">
          <div style="font-size: 11px; color: #34d399; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            5-летняя чистая выгода
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #ffffff;">
            ${total5YearFormatted}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            кумулятивная экономия
          </div>
        </div>

        <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 14px; padding: 18px;">
          <div style="font-size: 11px; color: #38bdf8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            Срок окупаемости
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #ffffff;">
            ${businessCase.roiCalculations.paybackMonths}
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            полный возврат инвестиций
          </div>
        </div>

        <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 14px; padding: 18px;">
          <div style="font-size: 11px; color: #c084fc; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">
            Регуляторика СОРМ-3
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #ffffff;">
            100% защита
          </div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
            гарантия сдачи ФСБ по №573
          </div>
        </div>
      </div>
    </div>

    <!-- COVER FOOTER & METADATA -->
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.12); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b;">
      <div>
        <strong style="color: #ffffff;">ООО «СмИТ Биллинг»</strong> • Департамент телекоммуникационных решений
      </div>
      <div>
        Документ: <strong style="color: #ffffff;">${docId}</strong> • Дата: ${todayStr}
      </div>
      <div>
        Конфиденциально • Для служебного пользования
      </div>
    </div>
  `;

  // PAGE 2: Financial Model & Dynamic Charts
  const page2 = document.createElement('div');
  page2.style.width = '794px';
  page2.style.height = '1122px';
  page2.style.overflow = 'hidden';
  page2.style.boxSizing = 'border-box';
  page2.style.position = 'relative';
  page2.style.background = '#ffffff';
  page2.style.color = '#0f172a';
  page2.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  page2.style.padding = '44px 44px';
  page2.style.display = 'flex';
  page2.style.flexDirection = 'column';
  page2.style.justifyContent = 'space-between';

  page2.innerHTML = `
    <!-- HEADER -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 6px; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
            С
          </div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">
            СмИТ БИЛЛИНГ 3.6 <span style="font-size: 12px; font-weight: 500; color: #64748b;">| Финансовая модель для «${targetCompany}»</span>
          </div>
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #059669;">
          Раздел 1: Экономика и динамика ROI
        </div>
      </div>

      <!-- 4 EXECUTIVE KPI CARDS -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 10px; font-weight: 700; color: #047857; text-transform: uppercase;">Прямая экономия</div>
          <div style="font-size: 18px; font-weight: 900; color: #065f46; margin: 4px 0 2px 0;">${businessCase.roiCalculations.monthlySavings}</div>
          <div style="font-size: 10px; color: #059669;">в среднем ежемесячно</div>
        </div>

        <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 10px; font-weight: 700; color: #0f766e; text-transform: uppercase;">Экономия времени</div>
          <div style="font-size: 18px; font-weight: 900; color: #115e59; margin: 4px 0 2px 0;">${businessCase.roiCalculations.hoursSaved}</div>
          <div style="font-size: 10px; color: #0d9488;">высвобождение ФОТ</div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 10px; font-weight: 700; color: #1d4ed8; text-transform: uppercase;">Срок окупаемости</div>
          <div style="font-size: 18px; font-weight: 900; color: #1e40af; margin: 4px 0 2px 0;">${businessCase.roiCalculations.paybackMonths}</div>
          <div style="font-size: 10px; color: #2563eb;">возврат затрат на лицензию</div>
        </div>

        <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 10px; padding: 12px 14px;">
          <div style="font-size: 10px; font-weight: 700; color: #a16207; text-transform: uppercase;">Снижение оттока</div>
          <div style="font-size: 18px; font-weight: 900; color: #854d0e; margin: 4px 0 2px 0;">${businessCase.roiCalculations.churnReduction}</div>
          <div style="font-size: 10px; color: #ca8a04;">за счёт СБП и моб. приложения</div>
        </div>
      </div>

      <!-- DYNAMIC CHART 1: 5-YEAR CUMULATIVE SAVINGS CURVE (SVG) -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px; margin-bottom: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
              График 1. Динамика накопительной чистой экономии за 5 лет
            </div>
            <div style="font-size: 10px; color: #64748b;">
              С учётом фиксированной лицензии СмИТ и органического роста абонентской базы на 8% в год
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 14px; font-weight: 900; color: #059669;">${total5YearFormatted}</span>
            <span style="font-size: 10px; color: #64748b;"> чистая выгода</span>
          </div>
        </div>

        <!-- Inline High-Resolution Dynamic SVG Area Chart -->
        <svg width="666" height="150" viewBox="0 0 714 150" style="display: block; width: 100%; height: auto;">
          <defs>
            <linearGradient id="cumulGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid lines -->
          <line x1="40" y1="25" x2="690" y2="25" stroke="#cbd5e1" stroke-dasharray="3 3" stroke-width="1" />
          <line x1="40" y1="65" x2="690" y2="65" stroke="#cbd5e1" stroke-dasharray="3 3" stroke-width="1" />
          <line x1="40" y1="105" x2="690" y2="105" stroke="#cbd5e1" stroke-dasharray="3 3" stroke-width="1" />
          <line x1="40" y1="125" x2="690" y2="125" stroke="#94a3b8" stroke-width="1.5" />

          <!-- Filled gradient area -->
          <path d="${svgAreaD}" fill="url(#cumulGradient)" />

          <!-- Trend line -->
          <path d="${svgPathD}" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round" />

          <!-- Data Points & Labels -->
          ${points
            .map(
              (p) => `
            <g>
              <circle cx="${p.x}" cy="${p.y}" r="6" fill="#ffffff" stroke="#10b981" stroke-width="3" />
              <rect x="${p.x - 42}" y="${p.y - 24}" width="84" height="18" rx="4" fill="#0f172a" />
              <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" fill="#34d399" font-size="10" font-weight="bold" font-family="sans-serif">
                ${formatCurrency(p.cumulativeSavings)}
              </text>
              <text x="${p.x}" y="142" text-anchor="middle" fill="#475569" font-size="11" font-weight="600" font-family="sans-serif">
                ${p.yearLabel} (${p.subsCount} аб.)
              </text>
            </g>
          `
            )
            .join('')}
        </svg>
      </div>

      <!-- LOWER SPLIT: CHART 2 (BREAKDOWN) & CHART 3 (BEFORE VS AFTER) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        
        <!-- CHART 2: OPEX SAVINGS BREAKDOWN -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">
            График 2. Структура высвобождения расходов (OPEX)
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <!-- SVG Donut Chart -->
            <svg width="90" height="90" viewBox="0 0 42 42" style="flex-shrink: 0;">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" stroke-width="6" />
              <!-- Segment 1: Bank statements & 54-FZ (38%) -->
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" stroke-width="6" stroke-dasharray="38 62" stroke-dashoffset="25" />
              <!-- Segment 2: Debt reduction & CoA (28%) -->
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#0ea5e9" stroke-width="6" stroke-dasharray="28 72" stroke-dashoffset="87" />
              <!-- Segment 3: Churn reduction (22%) -->
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" stroke-width="6" stroke-dasharray="22 78" stroke-dashoffset="59" />
              <!-- Segment 4: Admin/Support (12%) -->
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" stroke-width="6" stroke-dasharray="12 88" stroke-dashoffset="37" />
              <text x="21" y="24" text-anchor="middle" font-size="8" font-weight="bold" fill="#0f172a">100%</text>
            </svg>

            <!-- Legend -->
            <div style="font-size: 10px; line-height: 1.4; color: #334155; space-y: 4px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0;"></span>
                <span><strong>38%</strong> — Разбор выписок и 54-ФЗ</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #0ea5e9; flex-shrink: 0;"></span>
                <span><strong>28%</strong> — Снижение дебиторки</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; flex-shrink: 0;"></span>
                <span><strong>22%</strong> — Снижение оттока (СБП)</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0;"></span>
                <span><strong>12%</strong> — Сопровождение и СОРМ</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CHART 3: BEFORE VS AFTER COMPARISON BARS -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">
            График 3. Метрики эффективности «До» и «После»
          </div>

          <div style="space-y: 8px; font-size: 10px;">
            <!-- Metric 1 -->
            <div style="margin-bottom: 7px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #475569;">Ручной труд бухгалтера</span>
                <span style="font-weight: 700; color: #059669;">40 ч → 1.5 ч/мес (-96%)</span>
              </div>
              <div style="width: 100%; height: 6px; background: #fee2e2; border-radius: 3px; overflow: hidden; position: relative;">
                <div style="width: 5%; height: 100%; background: #10b981; border-radius: 3px;"></div>
              </div>
            </div>

            <!-- Metric 2 -->
            <div style="margin-bottom: 7px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #475569;">Просроченная дебиторка</span>
                <span style="font-weight: 700; color: #059669;">3.2% → 0.4% (-88%)</span>
              </div>
              <div style="width: 100%; height: 6px; background: #fee2e2; border-radius: 3px; overflow: hidden; position: relative;">
                <div style="width: 12%; height: 100%; background: #10b981; border-radius: 3px;"></div>
              </div>
            </div>

            <!-- Metric 3 -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #475569;">Доля оплат через СБП и ЛК</span>
                <span style="font-weight: 700; color: #059669;">15% → 78% (+420%)</span>
              </div>
              <div style="width: 100%; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; position: relative;">
                <div style="width: 78%; height: 100%; background: #0ea5e9; border-radius: 3px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECOMMENDED COMMERCIAL PLAN BANNER -->
      <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #34d399; font-weight: 800;">
            Рекомендуемый коммерческий тариф
          </div>
          <div style="font-size: 18px; font-weight: 900; color: #ffffff; margin: 2px 0;">
            Тарифный план «${businessCase.recommendedPlan}»
          </div>
          <div style="font-size: 11px; color: #94a3b8;">
            Фиксированная лицензия • Включает миграцию данных, FreeRADIUS 3.2 и модуль СОРМ-3
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 11px; color: #cbd5e1;">Окупаемость решения:</div>
          <div style="font-size: 22px; font-weight: 900; color: #34d399;">
            ${businessCase.roiCalculations.paybackMonths}
          </div>
        </div>
      </div>
    </div>

    <!-- PAGE 2 FOOTER -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
      <div>ООО «СмИТ Биллинг» • ИНН 7701234567 • Реестр отечественного ПО №14892</div>
      <div>Страница 2 из 3 • Аналитический отчёт ТЭО</div>
      <div>Документ: ${docId}</div>
    </div>
  `;

  // PAGE 3: Target Architecture, SORM-3 & Zero-Downtime Migration Plan
  const page3 = document.createElement('div');
  page3.style.width = '794px';
  page3.style.height = '1122px';
  page3.style.overflow = 'hidden';
  page3.style.boxSizing = 'border-box';
  page3.style.position = 'relative';
  page3.style.background = '#ffffff';
  page3.style.color = '#0f172a';
  page3.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  page3.style.padding = '44px 44px';
  page3.style.display = 'flex';
  page3.style.flexDirection = 'column';
  page3.style.justifyContent = 'space-between';

  page3.innerHTML = `
    <div>
      <!-- HEADER -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 26px; height: 26px; border-radius: 6px; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
            С
          </div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">
            СмИТ БИЛЛИНГ 3.6 <span style="font-size: 12px; font-weight: 500; color: #64748b;">| Архитектура и регламент внедрения</span>
          </div>
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #059669;">
          Раздел 2: Безопасность и миграция
        </div>
      </div>

      <!-- TARGET ARCHITECTURE GRID -->
      <div style="margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          Целевая архитектура и состав модулей СмИТ Биллинг 3.6
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
          ${businessCase.architecture
            .map(
              (item) => `
            <div style="display: flex; align-items: flex-start; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; font-size: 11px; color: #1e293b; line-height: 1.4;">
              <span style="color: #10b981; font-weight: bold; font-size: 13px; line-height: 1;">✓</span>
              <span>${item}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- REGULATORY SECURITY SORM-3 -->
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 5px solid #10b981; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 800; color: #065f46; margin-bottom: 4px;">
          🛡️ Защита от регуляторных рисков: СОРМ-3 (Приказ Минцифры №573) и 54-ФЗ
        </div>
        <div style="font-size: 11px; color: #166534; line-height: 1.5;">
          ${businessCase.regulatoryCompliance} Модуль СОРМ формирует все 13 обязательных типов файлов для аппаратно-программных комплексов «Норси-Транс», «МФИ Софт», «Сигнатек», «Специальные Технологии» с автоматической выгрузкой по расписанию через SFTP.
        </div>
      </div>

      <!-- ZERO-DOWNTIME MIGRATION PROTOCOL -->
      <div style="margin-bottom: 22px;">
        <div style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
          Регламент бесшовной ночной миграции (0 минут простоя абонентов)
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
          ${businessCase.migrationPlan
            .map(
              (step, idx) => `
            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 14px; background: ${
              idx % 2 === 0 ? '#ffffff' : '#f8fafc'
            }; border-bottom: ${idx === businessCase.migrationPlan.length - 1 ? 'none' : '1px solid #f1f5f9'}; font-size: 11px;">
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #ecfdf5; color: #059669; font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${idx + 1}
              </div>
              <div style="color: #1e293b; line-height: 1.4;">
                ${step}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- ACCEPTANCE & SIGN-OFF BLOCK -->
      <div style="border: 1px dashed #cbd5e1; border-radius: 12px; padding: 18px 22px; background: #fafafa; margin-bottom: 16px;">
        <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          Согласование и протокол готовности к внедрению
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">От Заказчика:</div>
            <div style="font-size: 12px; color: #334155; font-weight: 600;">${targetCompany}</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 18px;">Подпись уполномоченного лица: _________________ / М.П.</div>
          </div>
          <div>
            <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">От Исполнителя:</div>
            <div style="font-size: 12px; color: #334155; font-weight: 600;">ООО «СмИТ Биллинг» (ИНН 7701234567)</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 18px;">Генеральный директор: _________________ / М.П.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGE 3 FOOTER -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
      <div>Отдел внедрения: +7 (800) 555-35-35 • email: sales@smit-billing.ru • web: smit-billing.ru</div>
      <div>Страница 3 из 3 • Официальное ТЭО</div>
      <div>Документ: ${docId}</div>
    </div>
  `;

  rootRenderContainer.appendChild(page1);
  rootRenderContainer.appendChild(page2);
  rootRenderContainer.appendChild(page3);
  document.body.appendChild(rootRenderContainer);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pages = [page1, page2, page3];

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      const canvas = await html2canvas(pageEl, {
        scale: 2, // High resolution for vector-like clarity
        useCORS: true,
        logging: false,
        width: 794,
        height: 1122,
        windowWidth: 794,
        windowHeight: 1122,
        backgroundColor: i === 0 ? '#090d16' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage();
      }

      // Standard A4 is 210 x 297 mm
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const cleanName = targetCompany.replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_').substring(0, 35);
    pdf.save(`ТЭО_СмИТ_Биллинг_${cleanName}.pdf`);
  } finally {
    if (document.body.contains(rootRenderContainer)) {
      document.body.removeChild(rootRenderContainer);
    }
  }
}
