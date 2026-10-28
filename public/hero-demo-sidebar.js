/* Все запросы демо — через боковую панель виджета на вкладке «Запись» (логин на демо-стенд в Telegram
   + запись на показ); старая форма DemoModal не используется (17.10).
   1) window.SmitDemoBook({plan, subscribers}) — его зовёт функция открытия формы в сборке
      (assets/index-*.js, патч по месту); тариф и число абонентов подставляются в форму записи;
   2) нажатия на кнопки демо перехватываются до React (на случай старой сборки в кеше браузера);
   3) если форма всё же появилась (#demo-request-modal) — закрыть её и открыть панель.
   Виджет ещё не готов — панель откроется, как только он загрузится. */
(function () {
  'use strict';
  var pending = null;   // последний запрос, пока виджет грузится

  function widgetReady() {
    var w = window.SmitWidget;
    return w && w.isReady && typeof w.book === 'function' ? w : null;
  }

  // «до 500», «500 – 2 000», «более 5 000» → вариант, куда попадает число (как в самом виджете)
  function pickSize(sel, n) {
    for (var i = 0; i < sel.options.length; i++) {
      var t = sel.options[i].text.toLowerCase();
      var nums = (t.replace(/(\d)\s+(?=\d)/g, '$1').match(/\d+/g) || []).map(Number);
      if (!nums.length) continue;
      var lo = 0, hi = Infinity;
      if (/^\s*до\b/.test(t)) hi = nums[0];
      else if (/более|свыше|больше|от\b/.test(t) && nums.length === 1) lo = nums[0];
      else if (nums.length >= 2) { lo = nums[0]; hi = nums[1]; }
      else continue;
      if (n >= lo && n <= hi) { sel.selectedIndex = i; return; }
    }
  }

  // Подставить тариф и размер базы в форму записи. Введённое человеком не трогаем.
  function prefill(p) {
    if (!p || (!p.plan && !p.subscribers)) return;
    var tries = 0;
    (function fill() {
      var host = document.getElementById('smit-ai-widget');
      var root = host && host.shadowRoot;
      var sz = root && root.querySelector('#f-sz');
      var cm = root && root.querySelector('#f-cm');
      if (!sz || !cm || sz.options.length < 2) {
        if (++tries < 40) setTimeout(fill, 150);
        return;
      }
      var subs = parseInt(String(p.subscribers || '').replace(/\D/g, ''), 10);
      if (subs && !sz.value) pickSize(sz, subs);
      if (!cm.value.trim()) {
        var bits = [];
        if (p.plan) bits.push('тариф «' + p.plan + '»');
        if (subs) bits.push('около ' + subs.toLocaleString('ru-RU') + ' абонентов');
        if (bits.length) cm.value = 'Интересует ' + bits.join(', ');
      }
    })();
  }

  function openBook(p) {
    var w = widgetReady();
    if (w) { w.book(); prefill(p); return; }
    var first = pending === null;
    pending = p || {};
    if (!first) return;
    var tries = 0;
    var timer = setInterval(function () {
      var w2 = widgetReady();
      if (w2 || ++tries > 60) {
        clearInterval(timer);
        var req = pending; pending = null;
        if (w2) { w2.book(); prefill(req); }
      }
    }, 250);
  }
  window.SmitDemoBook = openBook;

  function demoButton(t) {
    var b = t && t.closest && t.closest('button');
    if (!b) return null;
    if (b.id === 'hero-demo-cta' || b.id === 'nav-demo-btn') return b;
    var txt = (b.textContent || '').trim();
    if (b.closest('.nav-drawer') && txt === 'Запросить демо-доступ') return b;
    if (b.closest('footer') && txt === 'Запросить демо') return b;
    return null;
  }
  document.addEventListener('click', function (e) {
    var btn = demoButton(e.target);
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (btn.closest('.nav-drawer')) {
      var burger = document.querySelector('button[aria-label="Меню навигации"]');
      if (burger) burger.click();   // закрыть мобильное меню, как это делает сама кнопка
    }
    openBook();
  }, true);

  function killModal() {
    var m = document.getElementById('demo-request-modal');
    if (!m) return;
    var close = m.querySelector('button[aria-label="Закрыть окно"]');
    if (close) close.click();
    else document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    openBook();   // в форме тариф всегда «Pro» по умолчанию — не выдаём его за выбор человека
  }
  function init() {
    killModal();
    new MutationObserver(function () {
      if (document.getElementById('demo-request-modal')) killModal();
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
