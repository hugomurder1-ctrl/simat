/* SIMAT guided tour engine. Spotlight + caption card that walks a visitor through every feature,
   across pages. Steps live in window.SIMAT_TOUR (js/tour-steps.js). State: sessionStorage + ?tour=N.
   Works without core.js (clinical.html) by falling back to its own language detection. */
(function () {
  'use strict';
  var KEY = 'simat-tour', STEPS = window.SIMAT_TOUR || [];
  if (!STEPS.length) return;

  function lang() { var l = document.documentElement.getAttribute('data-lang') || document.documentElement.getAttribute('lang') || 'ar'; return l.slice(0, 2) === 'en' ? 'en' : 'ar'; }
  function tx(pair) { return pair ? pair[lang() === 'ar' ? 0 : 1] : ''; }
  function page() { var p = location.pathname.split('/').pop() || 'index.html'; return /\.html$/.test(p) ? p : 'index.html'; }
  function store(v) { try { if (v == null) sessionStorage.removeItem(KEY); else sessionStorage.setItem(KEY, String(v)); } catch (e) {} }
  function stored() {
    var m = location.search.match(/[?&]tour=(\d+)/); if (m) return +m[1];
    try { var v = sessionStorage.getItem(KEY); return v == null ? null : +v; } catch (e) { return null; }
  }
  function samePage(p) { return p === page() || (p === 'index.html' && !/\.html$/.test(location.pathname.split('/').pop() || '')); }

  var cur = null, ui = null, target = null, raf = null, token = 0;

  function chapters() { var out = [], seen = {}; STEPS.forEach(function (s, i) { var k = s.chapter[1]; if (!seen[k]) { seen[k] = 1; out.push({ i: i, t: s.chapter }); } }); return out; }

  function build() {
    if (ui) return ui;
    ui = document.createElement('div'); ui.className = 'tour'; ui.setAttribute('data-theme', 'light');
    ui.innerHTML = '<div class="tour-spot" aria-hidden="true"></div>' +
      '<div class="tour-card" role="dialog" aria-modal="false" aria-labelledby="tour-t" tabindex="-1">' +
      '<div class="tour-top"><span class="tour-chap"></span><span class="tour-count"></span>' +
      '<button type="button" class="tour-x" data-t="exit"></button></div>' +
      '<div class="tour-bar"><i></i></div>' +
      '<h2 id="tour-t" class="tour-title"></h2><p class="tour-body"></p><p class="tour-try"></p>' +
      '<div class="tour-nav"><select class="tour-jump" data-t="jump"></select>' +
      '<span class="tour-sp"></span><button type="button" class="tour-btn" data-t="back"></button>' +
      '<button type="button" class="tour-btn tour-next" data-t="next"></button></div>' +
      '<p class="tour-live" aria-live="polite"></p></div>';
    document.body.appendChild(ui);
    ui.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]'); if (!b || b.tagName === 'SELECT') return;
      var t = b.getAttribute('data-t');
      if (t === 'exit') stop(); else if (t === 'next') goTo(cur + 1); else if (t === 'back') goTo(cur - 1);
    });
    ui.querySelector('.tour-jump').addEventListener('change', function (e) { goTo(+e.target.value); });
    return ui;
  }

  function labels() {
    var c = ui.querySelector('.tour-card'), s = STEPS[cur], n = STEPS.length, last = cur === n - 1;
    ui.querySelector('.tour-chap').textContent = tx(s.chapter);
    ui.querySelector('.tour-count').textContent = (cur + 1) + ' / ' + n;
    ui.querySelector('.tour-bar i').style.width = ((cur + 1) / n * 100) + '%';
    ui.querySelector('.tour-title').textContent = tx(s.title);
    ui.querySelector('.tour-body').textContent = tx(s.body);
    var tr = ui.querySelector('.tour-try'); tr.textContent = s.try ? tx(s.try) : ''; tr.hidden = !s.try;
    var x = ui.querySelector('.tour-x'); x.textContent = lang() === 'ar' ? 'إنهاء الجولة' : 'End tour';
    var b = ui.querySelector('[data-t="back"]'); b.textContent = lang() === 'ar' ? 'السابق' : 'Back'; b.disabled = cur === 0;
    ui.querySelector('[data-t="next"]').textContent = last ? (lang() === 'ar' ? 'إنهاء' : 'Finish') : (lang() === 'ar' ? 'التالي' : 'Next');
    var j = ui.querySelector('.tour-jump');
    j.setAttribute('aria-label', lang() === 'ar' ? 'انتقل إلى قسم' : 'Jump to section');
    j.innerHTML = chapters().map(function (ch) { return '<option value="' + ch.i + '">' + tx(ch.t) + '</option>'; }).join('');
    var mine = chapters().filter(function (ch) { return ch.i <= cur; }).pop(); if (mine) j.value = mine.i;
    ui.querySelector('.tour-live').textContent = tx(s.title);
    c.setAttribute('dir', lang() === 'ar' ? 'rtl' : 'ltr');
  }

  function find(sel) {
    if (!sel) return null;
    var list = sel.split('||');
    for (var i = 0; i < list.length; i++) {
      var els = document.querySelectorAll(list[i].trim());
      for (var k = 0; k < els.length; k++) { var r = els[k].getBoundingClientRect(); if (r.width > 0 && r.height > 0) return els[k]; }
    }
    return null;
  }

  function place() {
    if (!ui) return;
    var spot = ui.querySelector('.tour-spot'), card = ui.querySelector('.tour-card');
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, narrow = vw < 700;
    if (target && document.contains(target)) {
      var r = unionRect(), pad = 8;
      var top = Math.max(r.top - pad, 4), left = Math.max(r.left - pad, 4);
      var w = Math.min(r.width + pad * 2, vw - left - 4), h = Math.min(r.height + pad * 2, vh - top - 4);
      spot.style.cssText = 'top:' + top + 'px;left:' + left + 'px;width:' + w + 'px;height:' + h + 'px';
      spot.classList.remove('none');
      if (narrow) { card.style.cssText = ''; card.classList.add('sheet'); return; }
      card.classList.remove('sheet');
      /* try below, above, beside, then the corners; keep the spot that covers the least of the highlighted area */
      var cw = Math.min(400, vw - 32), ch = card.offsetHeight || 220, g = 16;
      var midX = r.left + r.width / 2 - cw / 2, midY = r.top + r.height / 2 - ch / 2;
      var cand = [[midX, r.bottom + g], [midX, r.top - g - ch], [r.right + g, midY], [r.left - g - cw, midY],
        [g, vh - ch - g], [vw - cw - g, vh - ch - g], [vw - cw - g, g], [g, g]];
      var best = null, bestCost = Infinity;
      cand.forEach(function (c, k) {
        var x = Math.min(Math.max(c[0], g), vw - cw - g), y = Math.min(Math.max(c[1], g), Math.max(vh - ch - g, g));
        var ox = Math.max(0, Math.min(x + cw, r.right) - Math.max(x, r.left)), oy = Math.max(0, Math.min(y + ch, r.bottom) - Math.max(y, r.top));
        var cost = ox * oy + k * 400; /* small preference for the earlier, more natural positions */
        if (cost < bestCost) { bestCost = cost; best = [x, y]; }
      });
      card.style.cssText = 'top:' + best[1] + 'px;left:' + best[0] + 'px;width:' + cw + 'px';
    } else {
      spot.classList.add('none'); spot.style.cssText = '';
      card.classList.toggle('sheet', narrow);
      card.style.cssText = narrow ? '' : 'top:50%;left:50%;width:' + Math.min(440, vw - 32) + 'px;transform:translate(-50%,-50%)';
    }
  }
  /* a step can name a second element ("with") that belongs to the same feature, e.g. a control and the chart it drives */
  function unionRect() {
    var r = target.getBoundingClientRect(), s = cur != null && STEPS[cur], extra = s && s.with ? find(s.with) : null;
    if (!extra) return r;
    var e = extra.getBoundingClientRect();
    var L = Math.min(r.left, e.left), T = Math.min(r.top, e.top), R = Math.max(r.right, e.right), B = Math.max(r.bottom, e.bottom);
    return { left: L, top: T, right: R, bottom: B, width: R - L, height: B - T };
  }
  function loop() { place(); raf = requestAnimationFrame(loop); }

  function wait(fn, ms) { return new Promise(function (res) { setTimeout(function () { res(fn && fn()); }, ms || 0); }); }
  function waitFor(sel, tries) {
    return new Promise(function (res) {
      var n = 0; (function tick() { var el = find(sel); if (el || !sel || n++ >= (tries || 40)) return res(el); setTimeout(tick, 75); })();
    });
  }

  function show(i) {
    var my = ++token, s = STEPS[i];
    cur = i; store(i); build(); labels();
    ui.classList.add('on'); document.documentElement.classList.add('touring');
    target = null; place();
    Promise.resolve(s.prep ? s.prep() : null).then(function () { return wait(null, s.delay || 60); })
      .then(function () { return waitFor(s.sel); })
      .then(function (el) {
        if (my !== token) return;
        target = el;
        if (el) {
          /* on phones the card is a bottom sheet, so bring the feature to the top half */
          if (document.documentElement.clientWidth < 700) { el.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy(0, -72); }
          else el.scrollIntoView({ block: s.block || 'center', behavior: 'instant' });
          /* pages that move focus or scroll after a tab switch can undo our scroll: check again once they settle */
          setTimeout(function () { if (my !== token) return; var r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) el.scrollIntoView({ block: s.block || 'center', behavior: 'instant' }); }, 350);
        }
        labels(); place();
        if (!raf) loop();
        var nb = ui.querySelector('[data-t="next"]'); if (nb) nb.focus({ preventScroll: true });
      });
  }

  function goTo(i) {
    if (i < 0) return;
    if (i >= STEPS.length) { stop(true); return; }
    var s = STEPS[i];
    if (!samePage(s.page)) {
      store(i);
      /* the home page is the site root on the host, so address it as './' rather than by file name */
      var url = (s.page === 'index.html' ? './' : s.page) + '?tour=' + i + (s.hash ? '#' + s.hash : '');
      location.href = url; return;
    }
    if (s.hash != null && (location.hash || '').replace('#', '') !== s.hash) {
      location.hash = s.hash;
    }
    show(i);
  }

  function stop(done) {
    token++; store(null); cur = null; target = null;
    if (raf) cancelAnimationFrame(raf); raf = null;
    if (ui) ui.classList.remove('on');
    document.documentElement.classList.remove('touring');
    try { if (/[?&]tour=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
    if (done && window.SIMAT && window.SIMAT.toast) window.SIMAT.toast(window.SIMAT.L('انتهت الجولة. استكشف بحرية.', 'Tour complete. Explore freely.'), 'check');
  }

  function start(i) { goTo(i || 0); }
  window.SIMAT_TOUR_API = { start: start, stop: stop, go: goTo, current: function () { return cur; } };

  document.addEventListener('keydown', function (e) {
    if (cur == null) return;
    if (e.key === 'Escape') { stop(); return; }
    var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    var fwd = lang() === 'ar' ? 'ArrowLeft' : 'ArrowRight', bwd = lang() === 'ar' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === fwd) { e.preventDefault(); goTo(cur + 1); } else if (e.key === bwd) { e.preventDefault(); goTo(cur - 1); }
  });
  function firstHere() { for (var i = 0; i < STEPS.length; i++) if (samePage(STEPS[i].page)) return i; return 0; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-tour-start]'); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    var v = b.getAttribute('data-tour-start'); start(v === 'here' ? firstHere() : +(v || 0));
  }, true);
  function floatLauncher() {
    if (document.querySelector('[data-tour-start]')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tour-launch tour-float'; b.setAttribute('data-tour-start', 'here');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span></span>';
    var setText = function () { b.querySelector('span').textContent = lang() === 'ar' ? 'جولة إرشادية' : 'Guided tour'; };
    if (!window.SIMAT) b.classList.add('tour-float-up'); /* clinical page: sit above its sticky action bar */
    setText(); document.body.appendChild(b);
    new MutationObserver(setText).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'data-lang'] });
  }
  document.addEventListener('simat:lang', function () { if (cur != null) { labels(); place(); } });
  window.addEventListener('resize', place);

  /* clinical.html keeps its own language state; align it with the site's choice and remember changes */
  function syncClinicalLang() {
    var t = document.getElementById('lang-toggle'); if (!t || window.SIMAT) return;
    var want = null; try { want = localStorage.getItem('simat-lang'); } catch (e) {}
    if (want && want !== lang()) t.click();
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#lang-toggle')) return;
      setTimeout(function () { try { localStorage.setItem('simat-lang', lang()); } catch (er) {} if (cur != null) { labels(); place(); } }, 50);
    });
  }
  function resume() {
    syncClinicalLang();
    setTimeout(floatLauncher, 400);
    var i = stored();
    if (i == null || !STEPS[i]) return;
    if (!samePage(STEPS[i].page)) { store(null); return; }
    setTimeout(function () { show(i); }, 150);
  }
  if (document.readyState === 'complete') resume(); else window.addEventListener('load', resume);
})();
