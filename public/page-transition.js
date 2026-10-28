/* Переход между страницами: полноэкранный занавес из вертикальных полос,
   которые закрывают экран при уходе со страницы и открывают его на новой.
   Самодостаточный файл — стили и разметку добавляет сам, вёрстку страниц
   трогать не нужно. Работает на статичных страницах без сборки и React. */
(function () {
  if (window.__smitPageTransition) return;
  window.__smitPageTransition = true;

  var COLS = 6;
  var STEP = 55;          // задержка между соседними полосами, мс
  var DUR = 420;          // длительность хода одной полосы, мс
  var COVER = DUR + STEP * (COLS - 1);   // пока занавес полностью закроется
  var SAFETY = 2600;      // если переход не случился — открыть экран обратно

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  var css =
    '.sptr{position:fixed;inset:0;z-index:2147483000;display:flex;pointer-events:none;' +
      'visibility:hidden}' +
    '.sptr.is-on{visibility:visible}' +
    '.sptr-col{flex:1 1 0;transform:scaleY(0);transform-origin:top;' +
      'background:linear-gradient(180deg,#059669 0%,#047857 100%);' +
      'transition:transform ' + DUR + 'ms cubic-bezier(.76,0,.24,1)}' +
    '[data-theme="light"] .sptr-col,html:not(.dark) .sptr-col'
      + '{background:linear-gradient(180deg,#34d399 0%,#059669 100%)}' +
    '.sptr.is-cover .sptr-col{transform:scaleY(1)}' +
    '.sptr.is-reveal .sptr-col{transform-origin:bottom;transform:scaleY(0)}' +
    '.sptr-mark{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;' +
      'justify-content:center;pointer-events:none;opacity:0;visibility:hidden;' +
      'transition:opacity .3s ease}' +
    '.sptr-mark.is-on{opacity:1;visibility:visible}' +
    '.sptr-mark span{width:54px;height:54px;border-radius:16px;background:#fff;' +
      'color:#047857;font:700 30px/54px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;' +
      'text-align:center;box-shadow:0 10px 30px rgba(2,6,23,.25)}' +
    '@media (prefers-reduced-motion: reduce){.sptr,.sptr-mark{display:none}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var curtain = document.createElement('div');
  curtain.className = 'sptr';
  curtain.setAttribute('aria-hidden', 'true');
  for (var i = 0; i < COLS; i++) {
    var col = document.createElement('span');
    col.className = 'sptr-col';
    // Соседние полосы стартуют с задержкой — получается «лесенка».
    col.style.transitionDelay = (i * STEP) + 'ms';
    curtain.appendChild(col);
  }

  var mark = document.createElement('div');
  mark.className = 'sptr-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.innerHTML = '<span>С</span>';

  function mount() {
    if (!document.body) return;
    document.body.appendChild(curtain);
    document.body.appendChild(mark);
  }
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);

  function reveal() {
    curtain.classList.add('is-on', 'is-cover');
    mark.classList.remove('is-on');
    // Реверс: полосы уходят вверх, открывая новую страницу.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.classList.add('is-reveal');
        curtain.classList.remove('is-cover');
        setTimeout(function () {
          curtain.classList.remove('is-on', 'is-reveal');
        }, COVER + 60);
      });
    });
  }

  // Занавес открывается и при обычной загрузке, и при возврате «назад»
  // из кеша браузера (bfcache), где скрипт заново не выполняется.
  if (!reduced.matches) {
    if (sessionStorage.getItem('sptr') === '1') {
      sessionStorage.removeItem('sptr');
      if (document.body) reveal();
      else document.addEventListener('DOMContentLoaded', reveal);
    }
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        curtain.classList.remove('is-on', 'is-cover', 'is-reveal');
        mark.classList.remove('is-on');
      }
    });
  }

  function sameSite(a) {
    return a.protocol === location.protocol && a.host === location.host;
  }

  document.addEventListener('click', function (e) {
    if (reduced.matches) return;
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    if (a.dataset.noTransition !== undefined) return;

    var href = a.getAttribute('href') || '';
    if (!href || href[0] === '#') return;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
    if (!sameSite(a)) return;
    // Якорь на этой же странице — обычная прокрутка, занавес не нужен.
    if (a.pathname === location.pathname && a.search === location.search && a.hash) return;
    // Файл, а не страница: пусть скачивается как обычно.
    if (/\.(zip|pdf|mp4|m4a|mp3|jpe?g|png|svg|webp|gif|docx?|xlsx?)$/i.test(a.pathname)) return;

    e.preventDefault();
    sessionStorage.setItem('sptr', '1');

    curtain.classList.remove('is-reveal');
    curtain.classList.add('is-on', 'is-cover');
    setTimeout(function () { mark.classList.add('is-on'); }, 220);

    var went = false;
    function go() {
      if (went) return;
      went = true;
      location.href = a.href;
    }
    setTimeout(go, COVER);
    // Если вкладка ушла в фон, таймеры тормозят — подстраховка.
    setTimeout(function () {
      if (!went) go();
      setTimeout(function () {
        curtain.classList.remove('is-on', 'is-cover');
        mark.classList.remove('is-on');
      }, SAFETY);
    }, SAFETY);
  }, true);
})();
