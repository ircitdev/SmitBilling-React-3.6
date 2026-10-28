/* Ссылки на каналы СмИТ Биллинга в подвале billing.smit34.ru.
   Подвал рисует React-сборка, поэтому кнопки добавляются клонированием кнопки Telegram и возвращаются,
   если подвал перерисовался. Две строки: сообщества (Telegram, ВКонтакте, MAX) и видео (YouTube, VK Видео, RUTUBE);
   на экране уже 340 px — по две кнопки в строке. MAX — ссылка-приглашение (канал приватный, пока нет Цифрового ID). */
(function () {
  'use strict';
  var ICON = {
    youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path>',
    max: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect>',
    tv: '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline>'
  };
  // порядок кнопок в подвале; tg и vk — кнопки самой сборки, остальные клонируются
  var ORDER = ['tg', 'vk', 'max', 'youtube', 'vkvideo', 'rutube'];
  var LINKS = {
    max: { label: 'MAX', href: 'https://max.ru/join/qbD07qfoTbfZUUxgocXskbS5igZ1F5zb7MNXxz8RIDo', icon: 'max' },
    youtube: { label: 'YouTube', href: 'https://www.youtube.com/channel/UCgvxteo_iVzCETomqJEi4Zg', icon: 'youtube' },
    vkvideo: { label: 'VK Видео', href: 'https://vkvideo.ru/@smitbilling', icon: 'video' },
    rutube: { label: 'RUTUBE', href: 'https://rutube.ru/channel/82326111/', icon: 'tv' }
  };
  var CSS = '.ssl-grid{display:grid!important;grid-template-columns:repeat(3,max-content);gap:12px;align-items:center}' +
    '.ssl-grid>a{justify-content:flex-start}' +
    '@media (max-width:340px){.ssl-grid{grid-template-columns:repeat(2,max-content)}}';

  function addStyle() {
    if (document.getElementById('ssl-style')) return;
    var st = document.createElement('style'); st.id = 'ssl-style'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function attach() {
    var tg = document.querySelector('a[href="https://t.me/smit34"]') || document.querySelector('a[data-ssl-tg]');
    if (!tg || !tg.parentNode) return;
    // публичный канал продукта для клиентов; t.me/smit34 — канал разработки (17.10)
    if (tg.getAttribute('href') !== 'https://t.me/smitbilling') tg.href = 'https://t.me/smitbilling';
    tg.setAttribute('data-ssl-tg', '1');
    var row = tg.parentNode;
    var vk = row.querySelector('a[href="https://vk.com/smit34"], a[href="https://vk.com/smitbilling"]');
    if (vk && vk.getAttribute('href') !== 'https://vk.com/smitbilling') vk.href = 'https://vk.com/smitbilling';   // сообщество продукта (17.10)
    var el = { tg: tg, vk: vk };
    Object.keys(LINKS).forEach(function (k) {
      var a = row.querySelector('a[data-ssl="' + k + '"]');
      if (!a) {
        var l = LINKS[k];
        a = tg.cloneNode(true);
        a.href = l.href; a.setAttribute('data-ssl', k); a.removeAttribute('data-ssl-tg');
        var svg = a.querySelector('svg');
        if (svg) { svg.innerHTML = ICON[l.icon]; svg.setAttribute('class', (svg.getAttribute('class') || '').replace(/lucide-[a-z-]+/, 'lucide-' + l.icon)); }
        var span = a.querySelector('span'); if (span) span.textContent = l.label;
      }
      el[k] = a;
    });
    // расставить по порядку, только если он нарушен (иначе MutationObserver зациклится)
    var want = ORDER.map(function (k) { return el[k]; }).filter(Boolean);
    var have = [].filter.call(row.children, function (c) { return want.indexOf(c) >= 0; });
    var same = have.length === want.length && want.every(function (a, i) { return have[i] === a; });
    if (!same) want.forEach(function (a) { row.appendChild(a); });
    if (!row.classList.contains('ssl-grid')) row.classList.add('ssl-grid');
  }

  function init() {
    addStyle(); attach();
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      setTimeout(function () { pending = false; attach(); }, 150);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
