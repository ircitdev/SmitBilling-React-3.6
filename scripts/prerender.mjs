/**
 * Prerender главной страницы для поисковиков.
 *
 * Сайт — SPA: в index.html лежит пустой <div id="root">, весь текст рисует
 * JavaScript. Поисковый робот такой страницы почти не видит — в выдачу
 * попадают только мета-теги. Поэтому после сборки прогоняем страницу через
 * настоящий браузер, дожидаемся, пока отрисуются все секции, и кладём
 * получившийся HTML обратно в index.html.
 *
 * Когда страницу откроет человек, React подхватит эту разметку и заменит
 * своей — для пользователя ничего не меняется, зато робот получает текст.
 *
 * Запуск: node scripts/prerender.mjs   (после `vite build`)
 * Пропустить: PRERENDER=0 npm run build
 */
import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve(process.cwd(), 'dist');
const PORT = 4188;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/** Отдаёт собранную папку dist; неизвестные пути — на index.html, как nginx. */
function serveDist() {
  return createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = join(DIST, urlPath);
    try {
      const s = await stat(file);
      if (s.isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(DIST, 'index.html');
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
}

const server = serveDist();
await new Promise((ok) => server.listen(PORT, ok));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (compatible; SmitPrerender/1.0)',
});

// Внешние запросы (каталог модулей, аналитика, виджет) при prerender не нужны:
// без них страница собирается быстрее и не зависит от чужой доступности.
await page.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith(`http://localhost:${PORT}`)) return route.continue();
  return route.abort();
});

await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle', timeout: 60000 });

// Секции монтируются по одной, когда браузер свободен (useStagedSections).
// Ждём, пока их число перестанет расти — значит отрисовались все.
await page.waitForFunction(
  () => {
    const w = window;
    const n = document.querySelectorAll('section, footer').length;
    if (w.__prevCount === n) {
      w.__same = (w.__same || 0) + 1;
    } else {
      w.__same = 0;
      w.__prevCount = n;
    }
    return w.__same >= 4 && n > 5;
  },
  { timeout: 60000, polling: 400 },
);

const html = await page.evaluate(() => {
  // Модалки и всплывающие панели в статическую разметку не нужны.
  document.querySelectorAll('[role="dialog"], .fixed.inset-0').forEach((el) => el.remove());
  return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
});

await browser.close();
server.close();

const sections = (html.match(/<section/g) || []).length;
const headings = (html.match(/<h[12][\s>]/g) || []).length;
const text = html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .split(/\s+/)
  .filter(Boolean)
  .join(' ');

if (text.length < 2000 || headings < 3) {
  console.error(
    `prerender: страница вышла пустой (${text.length} символов, ${headings} заголовков) — index.html не трогаем`,
  );
  process.exit(1);
}

await writeFile(join(DIST, 'index.html'), html, 'utf8');
console.log(
  `prerender: готово — ${sections} секций, ${headings} заголовков, ${text.length} символов текста`,
);
