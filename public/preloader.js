/* Прелоадер первой загрузки: тетрис.

   На сетке точек появляются фигуры и опускаются вниз, складываясь в стопку —
   как в игре. Когда страница готова, экран уходит.

   Показывается только при первом заходе и только если страница не успела
   отрисоваться сразу: на быстром соединении посетитель его не увидит.

   Самодостаточный файл: стили и разметку добавляет сам.
*/
(function () {
  'use strict';
  if (window.__smitPreloader) return;
  window.__smitPreloader = true;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || /bot|crawl|spider|lighthouse/i.test(navigator.userAgent)) return;

  // Второй заход за сессию — без прелоадера: он для первого впечатления.
  try {
    if (sessionStorage.getItem('smit_preloaded')) return;
    sessionStorage.setItem('smit_preloaded', '1');
  } catch (e) { /* приватный режим — покажем один раз */ }

  var COLS = 9;
  var ROWS = 10;
  var CELL = 26;          // сторона клетки, px — фигуры крупные
  var GAP = 4;
  var DROP = 90;          // шаг падения, мс
  var MAX = 7000;         // страховка: дольше не держим экран

  // Фигуры тетриса: смещения клеток от левого верхнего угла.
  var SHAPES = [
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: '#34d399' },   // квадрат
    { cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: '#22d3ee' },   // палка
    { cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: '#a78bfa' },   // Т
    { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: '#fbbf24' },   // J
    { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: '#fb7185' },   // S
    { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: '#38bdf8' },   // Z
  ];

  var W = COLS * (CELL + GAP) - GAP;
  var H = ROWS * (CELL + GAP) - GAP;

  var css =
    '.spl{position:fixed;inset:0;z-index:2147483200;display:flex;flex-direction:column;' +
      'align-items:center;justify-content:center;gap:18px;background:#020617;' +
      'transition:opacity .34s ease}' +
    'html:not(.dark) .spl{background:#f8fafc}' +
    '.spl.is-out{opacity:0;pointer-events:none}' +
    '.spl-field{position:relative;width:' + W + 'px;height:' + H + 'px}' +
    '.spl-dot{position:absolute;width:' + CELL + 'px;height:' + CELL + 'px;' +
      'border-radius:6px;background:rgba(148,163,184,.14)}' +
    'html:not(.dark) .spl-dot{background:rgba(100,116,139,.15)}' +
    '.spl-blk{position:absolute;width:' + CELL + 'px;height:' + CELL + 'px;' +
      'border-radius:6px;box-shadow:inset 0 2px 0 rgba(255,255,255,.35);' +
      'transition:transform ' + DROP + 'ms linear}' +
    '.spl-cap{font:600 13px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
      'color:#64748b;letter-spacing:.02em}' +
    '@media (prefers-reduced-motion: reduce){.spl{display:none}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var box = document.createElement('div');
  box.className = 'spl';
  box.setAttribute('aria-hidden', 'true');

  var field = document.createElement('div');
  field.className = 'spl-field';

  // сетка-подложка
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var d = document.createElement('i');
      d.className = 'spl-dot';
      d.style.left = c * (CELL + GAP) + 'px';
      d.style.top = r * (CELL + GAP) + 'px';
      field.appendChild(d);
    }
  }

  var cap = document.createElement('div');
  cap.className = 'spl-cap';
  cap.textContent = 'СмИТ Биллинг';

  box.appendChild(field);
  box.appendChild(cap);

  var mounted = false;
  function mount() {
    if (mounted || !document.body) return;
    mounted = true;
    document.body.appendChild(box);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });

  // Занятость клеток: по ней фигура понимает, где остановиться.
  var filled = [];
  for (var i = 0; i < ROWS; i++) filled.push(new Array(COLS).fill(false));

  var timer = 0;
  var stopped = false;

  function canPlace(shape, col, row) {
    for (var k = 0; k < shape.cells.length; k++) {
      var x = col + shape.cells[k][0];
      var y = row + shape.cells[k][1];
      if (x < 0 || x >= COLS || y >= ROWS) return false;
      if (y >= 0 && filled[y][x]) return false;
    }
    return true;
  }

  function spawn() {
    if (stopped) return;
    var shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    var width = Math.max.apply(null, shape.cells.map(function (p) { return p[0]; })) + 1;
    var col = Math.floor(Math.random() * (COLS - width + 1));

    // куда фигура упадёт: ищем самую нижнюю свободную позицию
    var row = -4;
    while (canPlace(shape, col, row + 1)) row += 1;

    // поле забилось — начинаем заново, чтобы стопка не перекрывала подпись
    if (row < 0) {
      for (var y = 0; y < ROWS; y++) filled[y].fill(false);
      Array.prototype.forEach.call(field.querySelectorAll('.spl-blk'), function (b) {
        b.remove();
      });
      timer = setTimeout(spawn, DROP * 2);
      return;
    }

    // рисуем клетки фигуры сверху и роняем их к найденной позиции
    var blocks = shape.cells.map(function (p) {
      var b = document.createElement('i');
      b.className = 'spl-blk';
      b.style.background = shape.color;
      b.style.left = (col + p[0]) * (CELL + GAP) + 'px';
      b.style.top = p[1] * (CELL + GAP) + 'px';
      b.style.transform = 'translateY(-' + (CELL + GAP) * 4 + 'px)';
      field.appendChild(b);
      return b;
    });

    // падение: одним переходом до места
    requestAnimationFrame(function () {
      blocks.forEach(function (b) {
        b.style.transitionDuration = (DROP * (row + 4) / 3) + 'ms';
        b.style.transform = 'translateY(' + row * (CELL + GAP) + 'px)';
      });
    });

    shape.cells.forEach(function (p) {
      var y = row + p[1];
      if (y >= 0) filled[y][col + p[0]] = true;
    });

    timer = setTimeout(spawn, DROP * 4);
  }

  spawn();

  var done = false;
  function hide() {
    if (done) return;
    done = true;
    stopped = true;
    if (timer) clearTimeout(timer);
    mount();
    box.classList.add('is-out');
    setTimeout(function () {
      if (box.parentNode) box.parentNode.removeChild(box);
    }, 360);
  }

  // Держим экран минимум три секунды: страница обычно готова быстрее, и
  // прелоадер мигал обрывком анимации — выглядело как сбой.
  var MIN_SHOW = 3000;
  var shownAt = Date.now();

  function finish() {
    var left = MIN_SHOW - (Date.now() - shownAt);
    setTimeout(hide, left > 0 ? left : 0);
  }

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });

  setTimeout(hide, MAX);
})();
