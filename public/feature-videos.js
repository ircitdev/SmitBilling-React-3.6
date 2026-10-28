/* Обучающие ролики в карточках «Возможности платформы» (billing.smit34.ru).
   Карточки рисует React-сборка, поэтому кнопки добавляются по заголовку карточки и
   возвращаются, если раздел перерисовался. Ролик открывается в окне на весь экран. */
(function () {
  'use strict';
  var GCS = 'https://storage.googleapis.com/uspeshnyy-projects/smit/billing/blog/';
  var VIDEOS = {
    stock: { title: 'Модуль «Склад»: путь роутера', len: '6:36', src: GCS + 'stock_live/smit_stock_live.mp4',
             poster: GCS + 'stock_live/poster.jpg', post: '/blog/put-routera-sklad' },
    crm: { title: 'Модуль «CRM»: путь заявки', len: '4:34', src: GCS + 'crm_live/smit_crm_live.mp4',
           poster: GCS + 'crm_live/poster.jpg', post: '/blog/put-zayavki-crm' },
    support: { title: 'Модуль «Поддержка»: путь обращения', len: '7:37', src: GCS + 'support_live/smit_support_live.mp4',
               poster: GCS + 'support_live/poster.jpg', post: '/blog/put-obrashcheniya-podderzhka' },
    netmap: { title: 'Модуль «Карта сети»: путь опоры', len: '6:57', src: GCS + 'netmap_live/smit_netmap_live.mp4',
              poster: GCS + 'netmap_live/poster.jpg', post: '/blog/put-opory-karta-seti' }
  };
  var CARDS = [
    { h: 'Поддержка и CRM оператора', items: ['crm', 'support'] },
    { h: 'Склад ТМЦ и Оборудование', items: ['stock'] },
    { h: 'Карта сети ВОЛС (GIS)', items: ['netmap'] }
  ];
  var LABEL = { crm: 'Ролик о CRM', support: 'Ролик о Поддержке', stock: 'Смотреть ролик', netmap: 'Смотреть ролик' };

  var css = '' +
    '.sfv-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '.sfv-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 14px 8px 8px;border-radius:999px;cursor:pointer;' +
    'border:1px solid rgba(16,185,129,.35);background:rgba(16,185,129,.08);color:#047857;font:600 13px/1.2 inherit;' +
    'transition:background .15s,border-color .15s,transform .15s}' +
    '.sfv-btn:hover{background:rgba(16,185,129,.16);border-color:rgba(16,185,129,.6);transform:translateY(-1px)}' +
    '.sfv-btn:focus-visible{outline:2px solid #10b981;outline-offset:2px}' +
    '.sfv-play{width:26px;height:26px;border-radius:50%;background:#10b981;display:inline-flex;align-items:center;justify-content:center;flex:none}' +
    '.sfv-play svg{width:11px;height:11px;margin-left:2px;fill:#fff}' +
    '.sfv-len{font-weight:500;opacity:.7}' +
    'html.dark .sfv-btn{color:#6ee7b7;border-color:rgba(52,211,153,.35);background:rgba(16,185,129,.12)}' +
    '.sfv-modal{position:fixed;inset:0;z-index:2147483000;background:#020618;display:flex;flex-direction:column;opacity:0;transition:opacity .2s}' +
    '.sfv-modal.open{opacity:1}' +
    '.sfv-top{display:flex;align-items:center;gap:12px;padding:12px 16px;color:#e2e8f0;flex:none}' +
    '.sfv-title{font:600 15px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.sfv-post{color:#6ee7b7;font:500 13px/1.3 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none;white-space:nowrap}' +
    '.sfv-post:hover{text-decoration:underline}' +
    '.sfv-x{width:40px;height:40px;border-radius:10px;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none}' +
    '.sfv-x:hover{background:rgba(255,255,255,.16)}' +
    '.sfv-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:0 16px 16px}' +
    '.sfv-stage video{width:100%;height:100%;max-height:100%;object-fit:contain;background:#000;border-radius:12px}' +
    '@media (max-width:640px){.sfv-stage{padding:0}.sfv-stage video{border-radius:0}.sfv-post{display:none}}';

  function addStyle() {
    if (document.getElementById('sfv-style')) return;
    var st = document.createElement('style'); st.id = 'sfv-style'; st.textContent = css;
    document.head.appendChild(st);
  }

  var modal = null, lastFocus = null;
  function close() {
    if (!modal) return;
    var v = modal.querySelector('video'); if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
    modal.parentNode.removeChild(modal); modal = null;
    document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open(key) {
    var v = VIDEOS[key]; if (!v) return;
    lastFocus = document.activeElement;
    modal = document.createElement('div');
    modal.className = 'sfv-modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', v.title);
    modal.innerHTML =
      '<div class="sfv-top"><div class="sfv-title"></div>' +
      '<a class="sfv-post" target="_blank" rel="noopener">Подробно в блоге →</a>' +
      '<button type="button" class="sfv-x" aria-label="Закрыть"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="sfv-stage"><video controls playsinline preload="auto"></video></div>';
    modal.querySelector('.sfv-title').textContent = v.title;
    if (v.post) modal.querySelector('.sfv-post').href = v.post; else modal.querySelector('.sfv-post').style.display = 'none';
    var video = modal.querySelector('video');
    video.poster = v.poster; video.src = v.src;
    modal.querySelector('.sfv-x').addEventListener('click', close);
    modal.querySelector('.sfv-stage').addEventListener('click', function (e) { if (e.target === this) close(); });
    document.body.appendChild(modal);
    document.documentElement.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(function () { modal && modal.classList.add('open'); });
    modal.querySelector('.sfv-x').focus();
    var p = video.play(); if (p && p.catch) p.catch(function () {});
    try { if (typeof window.ymGoal === 'function') window.ymGoal('feature_video', { video: key }); } catch (e) {}
  }

  function button(key) {
    var v = VIDEOS[key];
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'sfv-btn'; b.setAttribute('data-sfv', key);
    b.innerHTML = '<span class="sfv-play"><svg viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z"/></svg></span>' +
      '<span></span><span class="sfv-len"></span>';
    b.children[1].textContent = LABEL[key];
    b.children[2].textContent = v.len;
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(key); });
    return b;
  }

  function attach() {
    var hs = document.querySelectorAll('h3');
    for (var i = 0; i < hs.length; i++) {
      var t = (hs[i].textContent || '').replace(/\s+/g, ' ').trim();
      for (var c = 0; c < CARDS.length; c++) {
        if (t.indexOf(CARDS[c].h) !== 0) continue;   // в заголовке бывает значок-подсказка после текста
        var box = hs[i].parentNode;          // блок с заголовком и описанием карточки
        if (!box || box.querySelector('.sfv-row')) continue;
        var keys = CARDS[c].items.filter(function (k) { return VIDEOS[k]; });
        if (!keys.length) continue;
        var row = document.createElement('div'); row.className = 'sfv-row';
        keys.forEach(function (k) { row.appendChild(button(k)); });
        box.appendChild(row);
      }
    }
  }

  function init() {
    addStyle(); attach();
    var pending = false;
    new MutationObserver(function () {
      if (pending) return; pending = true;
      setTimeout(function () { pending = false; attach(); }, 120);
    }).observe(document.body, { childList: true, subtree: true });
    var m = /[?&#]video=(stock|crm|support|netmap)/.exec(location.href);   // ссылка на ролик: ?video=crm
    if (m) open(m[1]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
