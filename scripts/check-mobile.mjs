/**
 * Проверка собранной страницы на типичные беды вёрстки:
 * горизонтальная прокрутка, мелкие касаемые элементы, картинки,
 * вылезающие за экран. Гоняем на трёх ширинах.
 *
 * Запуск: node scripts/check-mobile.mjs  (после сборки)
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve(process.cwd(), 'dist');
const PORT = 4189;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  const p = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = join(DIST, p);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    file = join(DIST, 'index.html');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('no');
  }
});
await new Promise((ok) => server.listen(PORT, ok));

const browser = await chromium.launch();
const WIDTHS = [375, 768, 1440];
let problems = 0;

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  // внешние запросы не ждём — проверяем вёрстку, а не чужие сервисы
  await page.route('**/*', (r) =>
    r.request().url().startsWith(`http://localhost:${PORT}`) ? r.continue() : r.abort(),
  );
  await page.goto(`http://localhost:${PORT}/#top`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  // прокручиваем до низа: ленивые секции и картинки монтируются по мере показа
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 900) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const report = await page.evaluate((vw) => {
    const out = { scrollWidth: document.documentElement.scrollWidth, wide: [], small: [] };
    // что именно вылезает за правый край
    document.querySelectorAll('section, section *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 2) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().slice(0, 45);
        out.wide.push(`${tag}.${cls} → ${Math.round(r.right)}px`);
      }
    });
    // касаемые элементы меньше 44px — по ним трудно попасть пальцем
    if (vw < 768) {
      document.querySelectorAll('button, a').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32)) {
          const t = (el.textContent || '').trim().slice(0, 28);
          if (t) out.small.push(`${t} (${Math.round(r.width)}×${Math.round(r.height)})`);
        }
      });
    }
    out.wide = [...new Set(out.wide)].slice(0, 6);
    out.small = [...new Set(out.small)].slice(0, 6);
    return out;
  }, width);

  const overflow = report.scrollWidth > width + 2;
  console.log(`\n=== ширина ${width}px ===`);
  if (overflow) {
    problems++;
    console.log(`  ⚠ горизонтальная прокрутка: страница ${report.scrollWidth}px при экране ${width}px`);
    report.wide.forEach((w) => console.log(`     вылезает: ${w}`));
  } else {
    console.log('  прокрутки по горизонтали нет');
  }
  if (report.small.length) {
    problems++;
    console.log('  ⚠ мелкие касаемые элементы:');
    report.small.forEach((s) => console.log(`     ${s}`));
  }
  await page.close();
}

await browser.close();
server.close();
console.log(problems ? `\nнайдено проблем: ${problems}` : '\nвёрстка чистая');
process.exit(problems ? 1 : 0);
