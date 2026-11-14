/* SIMAT core: language (Arabic first, English toggle), shared header/footer, icons, small helpers.
   Bilingual markup convention: sibling pairs <x data-l lang="ar">…</x><x data-l lang="en">…</x>.
   CSS hides the inactive language, so switching never re-renders. In JS use L(ar, en). */
(function () {
  var KEY = 'simat-lang';
  var ICONS = window.SIMAT_ICONS || {};

  function getLang() { try { return localStorage.getItem(KEY) || 'ar'; } catch (e) { return 'ar'; } }
  function applyLang(lang) {
    var r = document.documentElement;
    r.setAttribute('lang', lang); r.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); r.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-ph-ar]').forEach(function (el) { el.setAttribute('placeholder', el.getAttribute('data-ph-' + lang) || ''); });
    document.querySelectorAll('[data-aria-ar]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang) || ''); });
    var t = document.querySelector('meta[name="simat-title-' + lang + '"]');
    if (t) document.title = t.getAttribute('content');
    document.dispatchEvent(new CustomEvent('simat:lang', { detail: lang }));
  }
  function setLang(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} applyLang(lang); }
  applyLang(getLang());
  /* The site is designed as Paper with Genome-green bands. The host may set data-theme="dark" on <html>;
     pinning the body keeps every page on its designed palette (dark bands carry their own data-theme). */
  function pinLight() { if (document.body && !document.body.hasAttribute('data-theme')) document.body.setAttribute('data-theme', 'light'); }
  pinLight(); document.addEventListener('DOMContentLoaded', pinLight);

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function L(ar, en, tag) { tag = tag || 'span'; return '<' + tag + ' data-l lang="ar">' + ar + '</' + tag + '><' + tag + ' data-l lang="en">' + (en == null ? ar : en) + '</' + tag + '>'; }
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }
  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-icon]').forEach(function (el) {
      var w = document.createElement('span'); w.innerHTML = icon(el.getAttribute('data-icon'), el.className);
      var svg = w.firstChild; if (el.getAttribute('style')) svg.setAttribute('style', el.getAttribute('style'));
      el.replaceWith(svg);
    });
  }
  var toastTimer;
  function toast(htmlMsg, ic) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.innerHTML = icon(ic || 'check') + '<span>' + htmlMsg + '</span>'; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function lang() { return document.documentElement.getAttribute('data-lang'); }

  window.SIMAT = { L: L, icon: icon, esc: esc, toast: toast, setLang: setLang, lang: lang, hydrateIcons: hydrateIcons };
  window.L = L;

  /* ---------- public header / footer ---------- */
  var NAV = [
    ['about.html', 'عن سمات', 'About'],
    ['how-it-works.html', 'كيف تعمل', 'How it works'],
    ['conditions.html', 'الحالات المشمولة', 'Conditions'],
    ['families.html', 'للأفراد والأسر', 'Families'],
    ['professionals.html', 'للممارسين', 'Clinicians'],
    ['authorities.html', 'للجهات الصحية', 'Health authorities'],
    ['faq.html', 'الأسئلة', 'FAQ']
  ];
  function logo(dark) {
    var v = dark === false ? 'light' : 'primary';
    return '<img class="logo-ar" data-l lang="ar" src="assets/logo/simat-ar-' + v + '.svg" alt="سمات" width="140" height="79">' +
      '<span data-l lang="en" style="display:flex;align-items:center;gap:10px"><img class="logo-sym" src="assets/logo/simat-symbol-small-' + v + '.svg" alt="" width="19" height="44"><img class="logo-en" src="assets/logo/simat-en-plain-' + v + '.svg" alt="SIMAT" width="149" height="30"></span>';
  }
  function langBtn() {
    return '<button type="button" class="lang-btn" data-lang-toggle>' + icon('globe') + L('English', 'العربية') + '</button>';
  }
  function header(page) {
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[0] === page ? ' aria-current="page"' : '') + '>' + L(n[1], n[2]) + '</a>'; }).join('');
    return '<a class="skip" href="#main">' + L('انتقل إلى المحتوى', 'Skip to content') + '</a>' +
      '<div class="ribbon"><div class="wrap">' + icon('alert', '') .replace('<svg', '<svg style="width:15px;height:15px;color:var(--strand-gold)"') +
      L('<b>نموذج عرض أوّلي</b> · MEDATHON 2026 · البيانات توضيحية، وكل ربط بالأنظمة الحكومية محاكاة', '<b>Early prototype</b> · MEDATHON 2026 · Data are illustrative; every government-system connection is simulated') +
      '<button type="button" class="tour-launch" data-tour-start="0">' + icon('play') + L('جولة إرشادية', 'Guided tour') + '</button></div></div>' +
      '<header class="site-header" data-theme="dark"><div class="wrap head-row">' +
      '<a class="brand-link" href="index.html" aria-label="SIMAT">' + logo(true) + '</a>' +
      '<nav class="nav" aria-label="Main">' + links + '</nav>' +
      '<div class="head-actions">' + langBtn() +
      '<a class="btn btn-sm hide-m hide-l" href="console.html">' + icon('grid') + L('لوحة الجهة المشرفة', 'Authority console') + '</a>' +
      '<a class="btn btn-sm btn-primary" href="portal.html">' + icon('user') + L('بوابة المستفيد', 'My SIMAT') + '</a>' +
      '<button type="button" class="menu-btn" aria-expanded="false" aria-controls="drawer" data-aria-ar="القائمة" data-aria-en="Menu">' + icon('menu') + '</button></div></div>' +
      '<div class="wrap"><div class="drawer" id="drawer" data-open="false">' + links +
      '<div class="row"><a class="btn btn-sm" href="console.html">' + icon('grid') + L('لوحة الجهة المشرفة', 'Authority console') + '</a></div></div></div></header>';
  }
  function footer() {
    function col(title, items) {
      return '<div><h4>' + title + '</h4><ul>' + items.map(function (i) { return '<li><a href="' + i[0] + '">' + L(i[1], i[2]) + '</a></li>'; }).join('') + '</ul></div>';
    }
    return '<div class="wrap"><div class="cols">' +
      '<div class="stack-sm"><img class="foot-logo" src="assets/logo/simat-lockup-stacked-primary.svg" alt="سمات SIMAT" width="220" height="169">' +
      '<p class="t-small" style="max-width:40ch">' + L('برنامج وطني مقترح للاستشارة الوراثية ورعاية ما بعد نتائج الفحوص الوراثية، متوافق مع هدف برنامج الجينوم السعودي في الحد من الأمراض الوراثية، وداعم لبرامج الفحص القائمة مثل برنامج الزواج الصحي وفحص حديثي الولادة.',
        'A proposed national programme for genetic counselling and care after genetic test results, aligned with the Saudi Genome Program’s goal of reducing genetic disease and supporting existing screening such as the Healthy Marriage and Newborn Screening programmes.') + '</p></div>' +
      col(L('البرنامج', 'The programme'), [['about.html', 'عن سمات', 'About SIMAT'], ['how-it-works.html', 'كيف تعمل', 'How it works'], ['conditions.html', 'الحالات المشمولة', 'Conditions covered'], ['privacy.html', 'الخصوصية والأخلاقيات', 'Privacy & ethics'], ['sources.html', 'المصادر', 'Sources']]) +
      col(L('لمن', 'Who it serves'), [['families.html', 'الأفراد والأسر', 'Individuals & families'], ['professionals.html', 'الممارسون الصحيون', 'Clinicians & counsellors'], ['authorities.html', 'الجهات الصحية', 'Health authorities'], ['faq.html', 'الأسئلة الشائعة', 'FAQ'], ['contact.html', 'تواصل معنا', 'Contact']]) +
      col(L('المنصات التجريبية', 'Demo platforms'), [['portal.html', 'بوابة المستفيد', 'My SIMAT (citizen portal)'], ['console.html', 'لوحة الجهة المشرفة', 'Authority console'], ['clinical.html', 'مساحة العمل السريرية', 'Clinical workspace']]) +
      '</div><div class="legal"><span>' + L('© 2026 فريق سمات · MEDATHON، الملتقى السعودي الشبابي للرعاية الصحية · ليست جهة حكومية ولا تمثّل أي جهة حكومية', '© 2026 Team SIMAT · MEDATHON, SYHF 2026 · Not a government body and does not represent one') + '</span>' +
      '<span>' + L('الخطوط: IBM Plex (رخصة OFL) · الهوية والرسومات: أصلية', 'Type: IBM Plex (OFL) · Identity and artwork: original') + '</span></div></div>';
  }

  function mountShell() {
    var h = document.getElementById('site-header');
    if (h) h.outerHTML = header(h.getAttribute('data-page') || '');
    var f = document.getElementById('site-footer');
    if (f) { f.className = 'site-footer'; f.innerHTML = footer(); }
    hydrateIcons();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lang-toggle]');
      if (t) { setLang(lang() === 'ar' ? 'en' : 'ar'); return; }
      var m = e.target.closest('.menu-btn');
      if (m) { var d = document.getElementById('drawer'); var open = d.getAttribute('data-open') !== 'true'; d.setAttribute('data-open', open); m.setAttribute('aria-expanded', open); }
    });
    applyLang(lang());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountShell); else mountShell();
})();
