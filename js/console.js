/* SIMAT Authority console. Vanilla JS, hash routes, all figures illustrative (labelled), all integrations simulated (labelled). */
(function () {
  'use strict';
  var S = window.SIMAT, L = window.L, ic = S.icon;
  Object.assign(window.SIMAT_ICONS, {
    users2: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.7-3.4 3.1-5.3 6-5.3s5.3 1.9 6 5.3"/><path d="M16 11.5h5M18.5 9v5"/>',
    queue: '<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'
  });
  function lang() { return S.lang(); }
  function T(ar, en) { return lang() === 'ar' ? ar : en; }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function pct(n, d) { return (n * 100).toFixed(d == null ? 0 : d) + '%'; }
  var ILLUS = '<span class="illus">' + L('بيانات توضيحية', 'Illustrative data') + '</span>';
  var SIM = '<span class="simt">' + L('محاكاة', 'Simulated') + '</span>';

  /* ======================= DATA (illustrative) ======================= */
  var R = [
    { id: 'riyadh', ar: 'الرياض', en: 'Riyadh', sar: 'الرياض', sen: 'Riyadh', x: 3, y: 2, share: .245, c14: 76, t90: 52, fte: 9, clinics: 44, hplc: 6, mri: 3, esc: 8 },
    { id: 'makkah', ar: 'مكة المكرمة', en: 'Makkah', sar: 'مكة', sen: 'Makkah', x: 1, y: 2, share: .255, c14: 72, t90: 49, fte: 9, clinics: 46, hplc: 6, mri: 2, esc: 9 },
    { id: 'eastern', ar: 'المنطقة الشرقية', en: 'Eastern Province', sar: 'الشرقية', sen: 'Eastern', x: 3.5, y: 1, share: .175, c14: 74, t90: 54, fte: 7, clinics: 34, hplc: 5, mri: 2, esc: 6 },
    { id: 'madinah', ar: 'المدينة المنورة', en: 'Madinah', sar: 'المدينة', sen: 'Madinah', x: 1.5, y: 1, share: .065, c14: 69, t90: 47, fte: 3, clinics: 14, hplc: 2, mri: 1, esc: 3 },
    { id: 'qassim', ar: 'القصيم', en: 'Al-Qassim', sar: 'القصيم', sen: 'Qassim', x: 2, y: 2, share: .04, c14: 66, t90: 45, fte: 2, clinics: 10, hplc: 2, mri: 0, esc: 2 },
    { id: 'asir', ar: 'عسير', en: 'Asir', sar: 'عسير', sen: 'Asir', x: 2.5, y: 3, share: .055, c14: 61, t90: 41, fte: 2, clinics: 12, hplc: 2, mri: 1, esc: 2 },
    { id: 'jazan', ar: 'جازان', en: 'Jazan', sar: 'جازان', sen: 'Jazan', x: 2, y: 4, share: .065, c14: 55, t90: 38, fte: 3, clinics: 14, hplc: 2, mri: 0, esc: 3 },
    { id: 'tabuk', ar: 'تبوك', en: 'Tabuk', sar: 'تبوك', sen: 'Tabuk', x: 1, y: 0, share: .025, c14: 63, t90: 44, fte: 1, clinics: 7, hplc: 1, mri: 0, esc: 1 },
    { id: 'hail', ar: 'حائل', en: 'Hail', sar: 'حائل', sen: 'Hail', x: 2.5, y: 1, share: .02, c14: 64, t90: 46, fte: 1, clinics: 6, hplc: 1, mri: 0, esc: 1 },
    { id: 'najran', ar: 'نجران', en: 'Najran', sar: 'نجران', sen: 'Najran', x: 3.5, y: 3, share: .02, c14: 58, t90: 40, fte: 1, clinics: 5, hplc: 1, mri: 0, esc: 1 },
    { id: 'jouf', ar: 'الجوف', en: 'Al-Jouf', sar: 'الجوف', sen: 'Jouf', x: 2, y: 0, share: .015, c14: 60, t90: 42, fte: 1, clinics: 5, hplc: 1, mri: 0, esc: 0 },
    { id: 'baha', ar: 'الباحة', en: 'Al-Baha', sar: 'الباحة', sen: 'Baha', x: 1.5, y: 3, share: .012, c14: 67, t90: 48, fte: 1, clinics: 4, hplc: 1, mri: 0, esc: 1 },
    { id: 'north', ar: 'الحدود الشمالية', en: 'Northern Borders', sar: 'الشمالية', sen: 'N. Borders', x: 3, y: 0, share: .008, c14: 52, t90: 36, fte: 1, clinics: 3, hplc: 1, mri: 0, esc: 0 }
  ];
  var NAT = { received: 18000, started: 16380, completed: 15120, informed: 11340, decision: .91, median: 6,
    identified: 41600, invited: 27900, booked: 19500, tested: 15800, found: 6950 };
  // region results sum exactly to national
  (function () { var s = 0; R.forEach(function (r) { r.results = Math.round(r.share * NAT.received); s += r.results; }); R[1].results += NAT.received - s; })();
  function wavg(k) { var s = 0; R.forEach(function (r) { s += r[k] * r.results; }); return s / NAT.received; }
  NAT.c14 = wavg('c14'); NAT.t90 = wavg('t90');
  var MONTHS_EN = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  var MONTHS_AR = ['نوفمبر', 'ديسمبر', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر'];
  var SEASON = [0.92, 0.95, 1.02, 1.1, 0.86, 0.9, 1.08, 1.12, 1.05, 0.98, 1.0, 1.02];
  (function () { var s = SEASON.reduce(function (a, b) { return a + b; }, 0); SEASON = SEASON.map(function (v) { return v * 12 / s; }); })();
  var RAMP = [0.6, 0.62, 0.64, 0.66, 0.67, 0.69, 0.7, 0.72, 0.73, 0.75, 0.76, 0.78];

  var state = { period: '12m', region: 'all', mapInd: 'c14', selRegion: 'makkah', caseId: 'FAM-0427', famFilter: { cond: 'all', entry: 'all', stage: 'all', region: 'all' },
    report: null, rbs: null, builder: null, letterTone: 'formal' };
  var PERIODS = { '12m': [1, 'آخر 12 شهرًا', 'Last 12 months'], 'q': [0.25, 'آخر ربع سنة', 'Last quarter'], 'm': [1 / 12, 'آخر 30 يومًا', 'Last 30 days'] };

  function scope() {
    var f = PERIODS[state.period][0];
    if (state.region === 'all') return { f: f, share: 1, c14: NAT.c14 / 100, t90: NAT.t90 / 100, esc: 37, name: T('المملكة', 'National') };
    var r = R.filter(function (x) { return x.id === state.region; })[0];
    return { f: f, share: r.results / NAT.received, c14: r.c14 / 100, t90: r.t90 / 100, esc: r.esc, name: T(r.ar, r.en) };
  }
  function rname(id) { var r = R.filter(function (x) { return x.id === id; })[0]; return r ? L(r.ar, r.en) : id; }

  /* ======================= NAV ======================= */
  var ROUTES = [
    ['g', 'المتابعة', 'Monitor'],
    ['overview', 'نظرة عامة', 'Overview', 'chart'],
    ['regions', 'المناطق والتجمعات', 'Regions & clusters', 'map'],
    ['families', 'الأسر (غير معرِّفة)', 'Families (de-identified)', 'family'],
    ['record', 'ملف الأسرة (مقيّد)', 'Family record (restricted)', 'key'],
    ['counselling', 'الاستشارة والكوادر', 'Counselling & workforce', 'chat'],
    ['g', 'الإعداد', 'Configure'],
    ['rulebooks', 'الحالات والأدلة السريرية', 'Conditions & rulebooks', 'layers'],
    ['content', 'مكتبة المحتوى', 'Content library', 'book'],
    ['reports', 'التقارير', 'Reports', 'report'],
    ['g', 'الحوكمة', 'Govern'],
    ['privacy', 'الخصوصية والتدقيق', 'Privacy & audit', 'privacy'],
    ['integrations', 'الربط بالأنظمة', 'Integrations', 'plug'],
    ['users', 'المستخدمون والصلاحيات', 'Users & roles', 'users']
  ];
  function route() { var h = (location.hash || '').replace('#', ''); return ROUTES.some(function (r) { return r[0] === h; }) ? h : 'overview'; }
  function renderNav() {
    var cur = route();
    document.getElementById('cx-nav').innerHTML = ROUTES.map(function (r) {
      if (r[0] === 'g') return '<div class="grp">' + L(r[1], r[2]) + '</div>';
      return '<a href="#' + r[0] + '"' + (r[0] === cur ? ' aria-current="page"' : '') + '>' + ic(r[3]) + L(r[1], r[2]) + '</a>';
    }).join('');
  }
  function renderFilters() {
    var p = document.getElementById('f-period'), g = document.getElementById('f-region');
    p.innerHTML = Object.keys(PERIODS).map(function (k) { return '<option value="' + k + '"' + (k === state.period ? ' selected' : '') + '>' + T(PERIODS[k][1], PERIODS[k][2]) + '</option>'; }).join('');
    g.innerHTML = '<option value="all">' + T('كل المناطق', 'All regions') + '</option>' + R.slice().sort(function (a, b) { return b.results - a.results; }).map(function (r) {
      return '<option value="' + r.id + '"' + (r.id === state.region ? ' selected' : '') + '>' + T(r.ar, r.en) + '</option>'; }).join('');
  }

  /* ======================= CHART HELPERS ======================= */
  function spark(vals, color) {
    var w = 160, h = 34, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rg = (mx - mn) || 1;
    var pts = vals.map(function (v, i) { return [i * (w - 8) / (vals.length - 1) + 4, h - 5 - (v - mn) / rg * (h - 12)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    var a = d + 'L' + pts[pts.length - 1][0] + ' ' + h + 'L' + pts[0][0] + ' ' + h + 'Z';
    var e = pts[pts.length - 1];
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + a + '" fill="' + color + '" opacity=".1"/><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="' + e[0] + '" cy="' + e[1] + '" r="3.5" fill="' + color + '" stroke="#fff" stroke-width="2"/></svg>';
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(v))); var m = Math.ceil(v / p); m = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10; return m * p; }
  function compact(v) { return v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0).replace('.0', '') + 'K' : String(Math.round(v)); }
  function trendData() {
    var sc = scope();
    return SEASON.map(function (s, i) {
      var rec = NAT.received / 12 * s * sc.share;
      var adj = sc.c14 / (NAT.c14 / 100);
      return { m: i, rec: rec, c14: rec * Math.min(.95, RAMP[i] * adj) };
    });
  }
  function lineChart(data) {
    var narrow = window.innerWidth < 700; var W = narrow ? 420 : 760, H = narrow ? 240 : 280, pl = 42, pr = narrow ? 58 : 120, pt = 16, pb = 34;
    var mx = niceMax(Math.max.apply(null, data.map(function (d) { return d.rec; })) * 1.05);
    var X = function (i) { return pl + i * (W - pl - pr) / (data.length - 1); };
    var Y = function (v) { return pt + (1 - v / mx) * (H - pt - pb); };
    var g = '';
    for (var k = 0; k <= 4; k++) { var v = mx * k / 4; g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--grid)" stroke-width="1"/><text x="' + (pl - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + compact(v) + '</text>'; }
    var mlab = lang() === 'ar' ? MONTHS_AR : MONTHS_EN;
    data.forEach(function (d, i) { if (narrow ? (i % 4 === 0 || i === data.length - 1) : (i % 2 === 0 || i === data.length - 1)) g += '<text x="' + X(i) + '" y="' + (H - 10) + '" text-anchor="middle">' + mlab[i] + '</text>'; });
    function path(key) { return data.map(function (d, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(d[key]).toFixed(1); }).join(''); }
    var area = path('rec') + 'L' + X(data.length - 1) + ' ' + Y(0) + 'L' + X(0) + ' ' + Y(0) + 'Z';
    var last = data[data.length - 1];
    var lines = '<path d="' + area + '" fill="var(--chart-1)" opacity=".08"/>' +
      '<path d="' + path('rec') + '" fill="none" stroke="var(--chart-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="' + path('c14') + '" fill="none" stroke="var(--chart-2)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="' + X(11) + '" cy="' + Y(last.rec) + '" r="4.5" fill="var(--chart-1)" stroke="#fff" stroke-width="2"/>' +
      '<circle cx="' + X(11) + '" cy="' + Y(last.c14) + '" r="4.5" fill="var(--chart-2)" stroke="#fff" stroke-width="2"/>' +
      '<text class="lbl" x="' + (X(11) + 10) + '" y="' + (Y(last.rec) + 4) + '">' + fmt(last.rec) + '</text>' +
      '<text class="lbl" x="' + (X(11) + 10) + '" y="' + (Y(last.c14) + 4) + '">' + fmt(last.c14) + '</text>';
    var hits = data.map(function (d, i) {
      var tip = '<b>' + mlab[i] + '</b><br>' + T('نتائج مستلمة', 'Results received') + ': ' + fmt(d.rec) + '<br>' + T('استشارة خلال 14 يومًا', 'Counselled within 14 days') + ': ' + fmt(d.c14) + ' (' + pct(d.c14 / d.rec) + ')';
      var w = (W - pl - pr) / (data.length - 1);
      return '<rect x="' + (X(i) - w / 2) + '" y="' + pt + '" width="' + w + '" height="' + (H - pt - pb) + '" fill="transparent" data-tip="' + S.esc(tip) + '" data-x="' + X(i) + '"/>';
    }).join('');
    return '<div class="chart-wrap"><svg class="chart trend" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + T('اتجاه شهري', 'Monthly trend') + '">' + g + '<line class="xh" x1="0" x2="0" y1="' + pt + '" y2="' + (H - pb) + '" stroke="var(--line-strong)" stroke-width="1" opacity="0"/>' + lines + hits + '</svg></div>';
  }
  function seqColor(v, lo, hi) { var steps = ['--seq-1', '--seq-2', '--seq-3', '--seq-4', '--seq-5']; var i = Math.max(0, Math.min(4, Math.floor((v - lo) / (hi - lo) * 5))); return { c: 'var(' + steps[i] + ')', dark: i >= 3 }; }
  /* Saudi Arabia, 13 administrative regions. Boundaries: Natural Earth admin-1 (public domain) via the
     geojson-places package (ISC), simplified with mapshaper; equirectangular projection at 24°N. */
  var SA_GEO = {"vb":[0,0,620,511],"r":{"asir":{"d":"M267.3 468.9L268.4 451.5L267.3 446.1L268.9 442.3L276.7 434.4L279.4 429.8L287.1 425.9L289.0 422.5L287.9 414.9L292.1 409.8L292.4 404.1L280.7 393.0L275.9 385.5L276.8 378.4L279.4 372.0L272.3 362.2L268.2 358.4L260.6 362.3L255.4 361.9L247.7 363.6L238.7 369.4L231.4 376.1L227.1 378.1L224.9 376.4L221.5 369.4L220.1 374.2L220.1 380.3L216.1 383.3L214.8 388.8L212.0 395.2L216.5 396.3L215.8 402.3L217.4 408.2L215.7 412.5L208.8 413.2L203.2 415.4L203.0 422.6L205.4 426.8L211.0 427.2L213.0 428.8L214.9 435.0L214.0 441.6L218.3 441.7L218.2 447.1L222.7 450.0L225.3 453.8L231.1 454.4L238.5 462.0L240.3 460.7L243.1 453.2L247.0 451.6L248.0 455.6L258.9 467.6L261.5 466.3Z","lx":249.8,"ly":413.1},"baha":{"d":"M221.5 369.4L218.0 367.8L214.1 369.8L207.1 371.0L204.1 366.7L199.1 366.4L199.1 374.2L195.3 381.2L189.5 382.8L186.5 387.4L190.8 391.7L191.1 402.0L196.8 407.7L202.0 407.7L206.4 396.1L212.0 395.2L214.8 388.8L216.1 383.3L220.1 380.3L220.1 374.2Z","lx":205.0,"ly":384.8},"hail":{"d":"M203.7 215.8L213.2 211.5L217.9 210.5L217.7 206.1L219.3 202.2L224.9 202.6L224.6 196.9L226.7 193.5L230.0 193.2L235.8 185.4L246.8 177.2L253.3 174.5L256.5 169.9L261.0 166.0L271.9 160.5L277.6 161.4L283.3 166.4L290.1 167.9L295.6 163.1L295.5 158.7L300.5 153.8L294.6 147.9L291.7 146.4L282.9 145.1L278.7 141.8L276.3 135.7L271.4 127.2L267.8 126.3L263.3 128.9L257.8 127.0L251.6 126.7L249.1 120.9L241.6 122.3L238.2 121.8L230.3 115.0L220.6 112.8L210.8 113.8L203.9 111.6L199.7 111.7L184.6 115.1L179.0 113.3L176.5 113.0L165.7 117.2L155.2 123.1L150.2 124.4L139.3 129.3L134.9 133.6L136.5 134.8L148.4 138.1L157.4 145.2L161.1 158.8L168.2 164.2L163.4 170.4L158.2 180.8L158.9 184.2L157.1 188.6L162.3 192.3L160.7 202.8L162.2 211.1L161.9 219.4L166.7 222.7L173.8 220.2L181.4 219.5L188.3 214.1L193.2 213.9Z","lx":208.1,"ly":155.1},"eastern":{"d":"M305.9 153.4L310.7 157.8L313.2 162.8L321.3 167.4L326.0 168.4L331.0 173.6L343.2 176.8L350.2 181.7L359.1 182.3L365.7 188.9L374.8 192.5L376.6 195.9L377.3 237.8L378.6 240.9L388.7 248.2L395.9 255.4L400.2 263.9L400.4 274.6L392.3 342.0L384.6 403.6L375.6 479.8L380.1 468.2L396.5 446.8L421.5 433.3L424.1 432.3L441.5 429.7L478.1 424.3L505.5 420.3L528.2 412.0L552.7 403.1L591.2 389.0L600.4 358.5L610.0 327.0L609.7 325.6L597.1 304.4L594.8 307.0L567.1 303.2L522.8 297.3L521.5 296.5L494.5 261.4L493.8 255.9L486.3 251.2L488.8 248.6L485.2 244.3L477.0 246.1L470.0 239.4L469.7 236.3L465.0 230.9L464.0 223.4L462.2 218.6L458.9 217.5L455.7 213.4L452.4 205.5L451.9 201.7L455.2 194.6L454.5 188.7L449.9 185.9L447.3 174.5L440.4 171.4L435.2 164.2L432.1 165.9L429.2 159.9L425.0 156.7L423.0 152.9L416.8 150.9L414.3 146.8L417.0 143.9L409.2 134.9L406.0 123.2L404.3 121.9L382.4 122.1L380.4 119.8L375.7 107.7L350.0 104.6L347.0 105.2L333.1 110.5L329.1 112.6L322.4 120.0L312.3 138.3L306.1 145.9L304.5 150.7Z","lx":463.6,"ly":339.5},"jouf":{"d":"M179.0 113.3L183.9 107.6L184.6 97.1L189.7 91.6L213.6 77.4L217.1 71.9L211.4 67.5L208.8 62.6L205.2 59.7L198.0 59.1L190.6 54.1L168.4 53.3L159.7 49.2L140.4 46.4L115.1 48.7L110.0 46.6L107.7 42.6L102.8 37.8L102.5 33.4L105.9 21.5L76.6 29.7L91.5 44.8L105.8 60.7L95.9 66.5L91.2 76.5L70.8 80.5L62.8 92.1L51.2 101.3L49.7 101.6L19.2 96.6L16.5 106.2L16.2 111.2L26.9 111.9L31.3 109.8L45.1 108.1L53.5 111.3L60.9 120.6L63.6 121.3L73.6 118.7L84.2 120.8L90.6 120.5L93.3 115.2L97.6 111.9L99.8 113.6L99.8 123.2L101.9 127.5L110.0 131.1L123.3 131.7L125.2 134.4L132.1 132.3L134.9 133.6L139.3 129.3L150.2 124.4L155.2 123.1L165.7 117.2L176.5 113.0Z","lx":128.9,"ly":90.4},"jazan":{"d":"M214.0 441.6L209.0 447.6L212.5 454.3L223.2 462.3L229.2 468.5L230.2 477.2L236.1 482.5L236.0 486.5L241.6 493.0L241.3 496.2L245.4 501.4L250.1 497.2L251.5 492.9L255.1 489.8L252.2 484.9L253.6 476.1L256.2 474.8L255.3 470.6L258.9 467.6L248.0 455.6L247.0 451.6L243.1 453.2L240.3 460.7L238.5 462.0L231.1 454.4L225.3 453.8L222.7 450.0L218.2 447.1L218.3 441.7Z","lx":242.0,"ly":472.9},"madinah":{"d":"M158.2 180.8L155.4 178.5L143.6 180.3L138.2 179.8L129.5 174.8L120.3 174.0L117.8 176.0L110.2 168.4L104.6 167.1L101.1 159.5L98.7 157.8L93.3 160.6L83.4 158.4L72.7 162.5L77.3 166.3L77.2 175.0L79.3 180.3L85.0 182.8L82.5 190.9L85.5 198.9L88.3 197.8L93.4 200.7L95.6 205.0L100.7 210.1L102.6 216.3L107.0 219.2L106.0 226.3L106.3 236.6L104.7 238.9L98.8 239.6L96.0 242.3L90.1 243.3L88.7 247.0L90.0 252.4L92.7 255.5L97.1 254.8L102.5 259.2L108.6 261.7L119.3 270.6L120.5 275.0L123.5 277.4L124.7 282.0L132.0 281.1L140.8 289.9L147.3 289.8L148.8 293.0L159.7 290.3L161.8 291.5L160.5 301.2L164.9 303.4L166.3 310.7L171.0 310.4L175.1 307.1L182.4 308.1L186.3 302.7L200.1 290.9L204.3 286.6L200.0 284.0L202.3 280.6L211.1 276.3L213.8 272.3L213.0 266.3L220.1 265.4L220.6 251.2L223.3 244.7L219.4 240.6L216.9 232.6L212.4 231.1L210.2 228.0L210.7 219.9L209.4 217.4L203.7 215.8L193.2 213.9L188.3 214.1L181.4 219.5L173.8 220.2L166.7 222.7L161.9 219.4L162.2 211.1L160.7 202.8L162.3 192.3L157.1 188.6L158.9 184.2Z","lx":148.4,"ly":250.8},"makkah":{"d":"M212.0 395.2L206.4 396.1L202.0 407.7L196.8 407.7L191.1 402.0L190.8 391.7L186.5 387.4L189.5 382.8L195.3 381.2L199.1 374.2L199.1 366.4L204.1 366.7L207.1 371.0L214.1 369.8L218.0 367.8L221.5 369.4L224.9 376.4L227.1 378.1L231.4 376.1L238.7 369.4L247.7 363.6L255.4 361.9L260.6 362.3L268.2 358.4L260.7 347.0L261.2 333.3L263.6 327.1L262.2 316.7L263.0 310.8L258.0 309.1L253.4 310.1L249.5 308.6L249.4 300.8L246.7 298.2L234.8 297.5L230.6 295.1L226.9 286.2L223.6 274.4L219.9 270.4L220.1 265.4L213.0 266.3L213.8 272.3L211.1 276.3L202.3 280.6L200.0 284.0L204.3 286.6L200.1 290.9L186.3 302.7L182.4 308.1L175.1 307.1L171.0 310.4L166.3 310.7L164.9 303.4L160.5 301.2L161.8 291.5L159.7 290.3L148.8 293.0L147.3 289.8L140.8 289.9L132.0 281.1L124.7 282.0L129.3 292.2L129.6 295.6L133.9 299.2L133.7 302.1L139.0 314.1L136.0 319.0L134.3 330.7L137.1 335.6L139.8 345.0L137.2 347.8L143.4 359.9L149.3 365.6L153.3 374.4L161.2 380.6L165.4 379.9L171.1 385.0L178.4 389.8L181.4 395.4L186.0 397.8L185.9 401.5L190.4 404.3L190.7 409.4L194.0 416.2L197.0 418.1L195.9 421.5L199.1 425.3L198.0 429.6L204.5 436.9L204.9 440.3L209.0 447.6L214.0 441.6L214.9 435.0L213.0 428.8L211.0 427.2L205.4 426.8L203.0 422.6L203.2 415.4L208.8 413.2L215.7 412.5L217.4 408.2L215.8 402.3L216.5 396.3Z","lx":210.9,"ly":330.5},"najran":{"d":"M267.3 468.9L270.5 471.9L280.6 471.7L289.2 469.6L310.9 469.3L318.5 472.9L344.0 475.7L355.0 474.1L362.5 484.0L368.8 483.9L375.6 479.8L384.6 403.6L380.9 404.6L314.0 412.1L306.6 411.6L300.4 409.3L292.4 404.1L292.1 409.8L287.9 414.9L289.0 422.5L287.1 425.9L279.4 429.8L276.7 434.4L268.9 442.3L267.3 446.1L268.4 451.5Z","lx":330.0,"ly":442.2},"qassim":{"d":"M203.7 215.8L209.4 217.4L210.7 219.9L210.2 228.0L212.4 231.1L216.9 232.6L219.4 240.6L223.3 244.7L225.7 240.7L228.8 239.4L235.2 241.9L249.4 242.5L252.9 239.5L251.6 235.4L254.9 230.1L259.0 226.6L268.5 224.3L273.9 220.6L277.4 215.5L281.4 214.2L287.5 215.1L298.0 214.5L298.4 208.9L297.0 201.3L288.4 188.6L288.9 181.1L292.7 179.0L297.1 173.6L301.1 171.5L300.9 167.0L295.6 163.1L290.1 167.9L283.3 166.4L277.6 161.4L271.9 160.5L261.0 166.0L256.5 169.9L253.3 174.5L246.8 177.2L235.8 185.4L230.0 193.2L226.7 193.5L224.6 196.9L224.9 202.6L219.3 202.2L217.7 206.1L217.9 210.5L213.2 211.5Z","lx":254.7,"ly":201.5},"riyadh":{"d":"M292.4 404.1L300.4 409.3L306.6 411.6L314.0 412.1L380.9 404.6L384.6 403.6L392.3 342.0L400.4 274.6L400.2 263.9L395.9 255.4L388.7 248.2L378.6 240.9L377.3 237.8L376.6 195.9L374.8 192.5L365.7 188.9L359.1 182.3L350.2 181.7L343.2 176.8L331.0 173.6L326.0 168.4L321.3 167.4L313.2 162.8L310.7 157.8L305.9 153.4L300.5 153.8L295.5 158.7L295.6 163.1L300.9 167.0L301.1 171.5L297.1 173.6L292.7 179.0L288.9 181.1L288.4 188.6L297.0 201.3L298.4 208.9L298.0 214.5L287.5 215.1L281.4 214.2L277.4 215.5L273.9 220.6L268.5 224.3L259.0 226.6L254.9 230.1L251.6 235.4L252.9 239.5L249.4 242.5L235.2 241.9L228.8 239.4L225.7 240.7L223.3 244.7L220.6 251.2L220.1 265.4L219.9 270.4L223.6 274.4L226.9 286.2L230.6 295.1L234.8 297.5L246.7 298.2L249.4 300.8L249.5 308.6L253.4 310.1L258.0 309.1L263.0 310.8L262.2 316.7L263.6 327.1L261.2 333.3L260.7 347.0L268.2 358.4L272.3 362.2L279.4 372.0L276.8 378.4L275.9 385.5L280.7 393.0Z","lx":329.2,"ly":291.1},"north":{"d":"M300.5 153.8L305.9 153.4L304.5 150.7L306.1 145.9L312.3 138.3L322.4 120.0L329.1 112.6L333.1 110.5L347.0 105.2L345.0 105.6L318.6 103.3L297.4 101.2L274.5 83.6L245.1 60.8L222.7 42.5L207.6 34.1L175.5 16.3L164.3 14.0L139.4 10.0L133.8 14.0L105.9 21.5L102.5 33.4L102.8 37.8L107.7 42.6L110.0 46.6L115.1 48.7L140.4 46.4L159.7 49.2L168.4 53.3L190.6 54.1L198.0 59.1L205.2 59.7L208.8 62.6L211.4 67.5L217.1 71.9L213.6 77.4L189.7 91.6L184.6 97.1L183.9 107.6L179.0 113.3L184.6 115.1L199.7 111.7L203.9 111.6L210.8 113.8L220.6 112.8L230.3 115.0L238.2 121.8L241.6 122.3L249.1 120.9L251.6 126.7L257.8 127.0L263.3 128.9L267.8 126.3L271.4 127.2L276.3 135.7L278.7 141.8L282.9 145.1L291.7 146.4L294.6 147.9Z","lx":241.2,"ly":90.0},"tabuk":{"d":"M134.9 133.6L132.1 132.3L125.2 134.4L123.3 131.7L110.0 131.1L101.9 127.5L99.8 123.2L99.8 113.6L97.6 111.9L93.3 115.2L90.6 120.5L84.2 120.8L73.6 118.7L63.6 121.3L60.9 120.6L53.5 111.3L45.1 108.1L31.3 109.8L26.9 111.9L16.2 111.2L14.3 118.0L15.1 122.3L10.0 133.8L10.6 135.9L17.8 136.3L22.1 135.1L29.9 142.7L34.7 150.3L36.6 155.8L43.9 164.1L44.4 167.2L48.6 171.7L52.0 177.8L55.8 181.8L64.5 198.8L69.1 200.6L68.1 205.8L75.9 212.4L80.8 222.5L84.3 226.5L85.8 233.7L82.0 237.3L88.7 247.0L90.1 243.3L96.0 242.3L98.8 239.6L104.7 238.9L106.3 236.6L106.0 226.3L107.0 219.2L102.6 216.3L100.7 210.1L95.6 205.0L93.4 200.7L88.3 197.8L85.5 198.9L82.5 190.9L85.0 182.8L79.3 180.3L77.2 175.0L77.3 166.3L72.7 162.5L83.4 158.4L93.3 160.6L98.7 157.8L101.1 159.5L104.6 167.1L110.2 168.4L117.8 176.0L120.3 174.0L129.5 174.8L138.2 179.8L143.6 180.3L155.4 178.5L158.2 180.8L163.4 170.4L168.2 164.2L161.1 158.8L157.4 145.2L148.4 138.1L136.5 134.8Z","lx":71.8,"ly":140.4}}};
  // small regions get their label outside the outline, joined by a leader line
  var SA_LEAD = { baha: { tx: 140, ty: 424 }, jazan: { tx: 178, ty: 490 } };
  function hexMap(ind, hl) {
    var lo = ind === 'c14' ? 50 : 35, hi = ind === 'c14' ? 80 : 55;
    var shapes = '', selShape = '', labels = '';
    R.forEach(function (g) {
      var geo = SA_GEO.r[g.id]; if (!geo) return;
      var col = seqColor(g[ind], lo, hi), tc = col.dark ? '#fff' : 'var(--ink)';
      var tip = '<b>' + T(g.ar, g.en) + '</b><br>' + T('استشارة خلال 14 يومًا', 'Counselled within 14 days') + ': ' + g.c14 + '%<br>' + T('فحص الأقارب خلال 90 يومًا', 'Relatives tested within 90 days') + ': ' + g.t90 + '%<br>' + T('نتائج مستلمة', 'Results received') + ': ' + fmt(g.results);
      var isSel = hl && state.selRegion === g.id;
      var shp = '<path class="rg' + (isSel ? ' sel' : '') + '" d="' + geo.d + '" fill="' + col.c + '" data-region="' + g.id + '" data-tip="' + S.esc(tip) + '" tabindex="0" role="button" aria-label="' + S.esc(T(g.ar, g.en) + ' ' + g[ind] + '%') + '"/>';
      if (isSel) selShape = shp; else shapes += shp;
      var name = S.esc(T(g.sar, g.sen)), lead = SA_LEAD[g.id];
      if (lead) {
        labels += '<line class="lead" x1="' + (lead.tx + 4) + '" y1="' + (lead.ty - 4) + '" x2="' + geo.lx + '" y2="' + geo.ly + '"/><circle class="dot" cx="' + geo.lx + '" cy="' + geo.ly + '" r="2.5"/>' +
          '<text class="n" x="' + lead.tx + '" y="' + (lead.ty - 9) + '" text-anchor="end">' + name + '</text><text class="v" x="' + lead.tx + '" y="' + (lead.ty + 10) + '" text-anchor="end">' + g[ind] + '%</text>';
      } else {
        labels += '<text class="n" x="' + geo.lx + '" y="' + (geo.ly - 4) + '" fill="' + tc + '">' + name + '</text><text class="v" x="' + geo.lx + '" y="' + (geo.ly + 15) + '" fill="' + tc + '">' + g[ind] + '%</text>';
      }
    });
    var vb = SA_GEO.vb;
    var leg = '<div class="seq-legend"><span>' + lo + '%</span><span class="sw">' + [1, 2, 3, 4, 5].map(function (i) { return '<i style="background:var(--seq-' + i + ')"></i>'; }).join('') + '</span><span>' + hi + '%+</span></div>';
    return '<div class="chart-wrap"><svg class="samap" viewBox="' + vb.join(' ') + '" role="img" aria-label="' + T('خريطة المملكة العربية السعودية حسب المنطقة', 'Map of Saudi Arabia by region') + '">' +
      '<g class="shapes">' + shapes + selShape + '</g><g class="labels" aria-hidden="true">' + labels + '</g></svg></div>' + leg;
  }

  /* ======================= VIEWS ======================= */
  function head(ar, en, subAr, subEn, extra) {
    return '<div class="cx-head"><div><h1>' + L(ar, en) + '</h1>' + (subAr ? '<p>' + L(subAr, subEn) + '</p>' : '') + '</div>' + (extra || '') + '</div>';
  }
  function panel(titleAr, titleEn, body, opts) {
    opts = opts || {};
    return '<section class="panel ' + (opts.cls || '') + '"><div class="panel-h"><div><h2>' + L(titleAr, titleEn) + '</h2>' + (opts.subAr ? '<div class="sub">' + L(opts.subAr, opts.subEn) + '</div>' : '') + '</div><div class="row" style="gap:8px">' + (opts.right || '') + (opts.noIllus ? '' : ILLUS) + '</div></div>' + body + '</section>';
  }

  var V = {};
  V.overview = function () {
    var sc = scope(), f = sc.f * sc.share, td = trendData();
    var rec = NAT.received * f, inv = NAT.invited * f;
    function dl(num, ar, en) { return '<bdi dir="ltr">' + num + '</bdi>' + (ar ? ' ' + T(ar, en) : ''); }
    var VS = T('عن الفترة السابقة', 'vs previous period');
    var kp = [
      ['النتائج المستلمة', 'Results received', fmt(rec), td.map(function (d) { return d.rec; }), 'var(--chart-1)', dl('+6%'), VS, 'up'],
      ['استشارة خلال 14 يومًا', 'Counselled within 14 days', pct(sc.c14), RAMP, 'var(--chart-1)', dl('+5', 'نقاط', 'pts'), VS, 'up'],
      ['معدل القرار المستنير (ذاتي التقييم)', 'Informed-decision rate (self-reported)', pct(NAT.decision), [.84, .85, .86, .86, .87, .88, .88, .89, .9, .9, .91, .91], 'var(--chart-1)', dl('+2', 'نقاط', 'pts'), VS, 'up'],
      ['أقارب تمت دعوتهم', 'Relatives invited', fmt(inv), td.map(function (d) { return d.rec * 1.55; }), 'var(--chart-3)', dl('+9%'), VS, 'up'],
      ['أقارب فُحصوا خلال 90 يومًا', 'Relatives tested within 90 days', pct(sc.t90), [.38, .39, .41, .42, .42, .44, .45, .46, .47, .48, .49, .5], 'var(--chart-3)', dl('+4', 'نقاط', 'pts'), T('من المدعوّين', 'of invited'), 'up'],
      ['الوسيط حتى الاستشارة', 'Median time to counselling', '<bdi dir="ltr">' + NAT.median + '</bdi> ' + T('أيام', 'days'), [11, 10, 10, 9, 9, 8, 8, 7, 7, 7, 6, 6], 'var(--chart-1)', dl('−2', 'يومان', 'days'), VS, 'up'],
      ['تصعيدات مفتوحة', 'Open escalations', String(sc.esc), [41, 39, 44, 40, 38, 42, 39, 36, 40, 38, 35, 37], 'var(--chart-2)', dl('3', 'متأخرة', 'overdue'), T('عن مهلة الاستجابة', 'past response target'), 'down']
    ];
    var kpis = '<div class="kpis">' + kp.map(function (k) {
      return '<div class="kpi"><span class="k">' + L(k[0], k[1]) + '</span><span class="v">' + k[2] + '</span><span class="d"><span class="' + k[7] + '">' + k[5] + '</span>' + k[6] + '</span>' + spark(k[3], k[4]) + '</div>';
    }).join('') + '</div>';
    var fam = [['نتائج حمل صفة مستلمة', 'Carrier results received', NAT.received], ['بدأوا جلسة الاستشارة', 'Started the counselling session', NAT.started], ['أكملوا الجلسة', 'Completed the session', NAT.completed], ['اختاروا إبلاغ أقاربهم', 'Chose to inform relatives', NAT.informed]];
    var rel = [['أقارب تم تحديدهم في شجرة الأسرة', 'Relatives identified in family trees', NAT.identified], ['دُعوا للفحص', 'Invited to test', NAT.invited], ['حجزوا موعدًا', 'Booked an appointment', NAT.booked], ['فُحصوا', 'Tested', NAT.tested], ['تبيّن أنهم يحملون الصفة', 'Found to be carriers', NAT.found]];
    function frow(r, base, cls) { var v = r[2] * f; return '<div class="f-row ' + cls + '"><span>' + L(r[0], r[1]) + '</span><span class="f-bar"><span style="width:' + (r[2] / base * 100).toFixed(1) + '%"></span></span><span class="f-v">' + fmt(v) + '<span class="f-p">' + pct(r[2] / base) + '</span></span></div>'; }
    var funnel = '<div class="funnel">' + fam.map(function (r) { return frow(r, NAT.received, ''); }).join('') +
      '<div class="f-bridge">' + L('من الأسر إلى الأقارب · متوسط ' + (NAT.identified / NAT.informed).toFixed(1) + ' أقارب لكل أسرة اختارت الإبلاغ', 'From families to relatives · ' + (NAT.identified / NAT.informed).toFixed(1) + ' relatives per family that chose to inform') + '</div>' +
      rel.map(function (r) { return frow(r, NAT.identified, 'rel'); }).join('') + '</div>';
    var table = '<details class="data-table"><summary>' + L('عرض البيانات كجدول', 'View as table') + '</summary><div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الشهر', 'Month') + '</th><th class="n">' + L('نتائج مستلمة', 'Results received') + '</th><th class="n">' + L('استشارة خلال 14 يومًا', 'Counselled ≤14 days') + '</th></tr></thead><tbody>' +
      td.map(function (d, i) { return '<tr><td>' + L(MONTHS_AR[i], MONTHS_EN[i]) + '</td><td class="n">' + fmt(d.rec) + '</td><td class="n">' + fmt(d.c14) + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
    var alerts = [
      ['crit', 'alert', 'جازان: الاستشارة خلال 14 يومًا 55% (الهدف 70%)', 'Jazan: counselled within 14 days at 55% (target 70%)', 'نقص في الكوادر · 3 مستشارين لكل 1,170 نتيجة سنويًا', 'Workforce gap · 3 counsellors for 1,170 results a year', 'اليوم', 'Today'],
      ['warn', 'clock', '3 تصعيدات تجاوزت مهلة الاستجابة', '3 escalations past the response target', 'ضيق نفسي (1) · سؤال شرعي (2)', 'Distress (1) · religious question (2)', 'منذ ساعتين', '2 h ago'],
      ['warn', 'flag', 'الحدود الشمالية: لا يوجد موقع رنين T2* في المنطقة', 'Northern Borders: no cardiac T2* MRI site in region', 'الإحالات إلى تجمع آخر: 6 هذا الشهر', 'Referrals to another cluster: 6 this month', 'أمس', 'Yesterday'],
      ['info', 'layers', 'دليل الثلاسيميا بيتا: نسخة 2.3 بانتظار المراجعة السريرية', 'β-thalassaemia rulebook: v2.3 awaiting clinical review', 'تحديث نص الخيارات المتاحة', 'Update to the options text', 'منذ يومين', '2 days ago']
    ];
    var al = '<ul class="alerts">' + alerts.map(function (a) { return '<li class="' + a[0] + '">' + ic(a[1]) + '<div><div class="t">' + L(a[2], a[3]) + '</div><div class="s">' + L(a[4], a[5]) + '</div></div><span class="tm">' + L(a[6], a[7]) + '</span></li>'; }).join('') + '</ul>';
    var indSel = '<label class="sr-only" for="map-ind">Indicator</label><select class="cx-select" id="map-ind"><option value="c14"' + (state.mapInd === 'c14' ? ' selected' : '') + '>' + T('استشارة خلال 14 يومًا', 'Counselled within 14 days') + '</option><option value="t90"' + (state.mapInd === 't90' ? ' selected' : '') + '>' + T('فحص الأقارب خلال 90 يومًا', 'Relatives tested within 90 days') + '</option></select>';
    return head('نظرة عامة على المسار الوطني', 'National pathway overview', 'من نتيجة الفحص إلى القرار المستنير وفحص الأقارب · ' + scope().name + ' · ' + PERIODS[state.period][1], 'From screening result to informed decision and relative testing · ' + scope().name + ' · ' + PERIODS[state.period][2], ILLUS) +
      kpis +
      '<div class="cx-grid">' +
      panel('الاتجاه الشهري', 'Monthly trend', '<div class="legend"><span><i style="background:var(--chart-1)"></i>' + L('نتائج حمل صفة مستلمة', 'Carrier results received') + '</span><span><i style="background:var(--chart-2)"></i>' + L('استشارة خلال 14 يومًا', 'Counselled within 14 days') + '</span></div>' + lineChart(td) + table, { cls: 'span-7' }) +
      panel('المناطق', 'Regions', indSel + hexMap(state.mapInd) + '<p class="t-cap" style="text-align:center">' + L('اضغط على منطقة لفتح تفاصيلها', 'Select a region to open its detail') + '</p>', { cls: 'span-5' }) +
      panel('مسار الأسرة', 'Family cascade', funnel + '<p class="t-cap">' + L('لا تقيس سمات «إلغاء الزواج» مؤشرًا للنجاح. المؤشر هو أن يكون القرار مستنيرًا، أيًّا كان.', 'SIMAT never counts cancelled marriages as success. The indicator is an informed decision, whatever that decision is.') + '</p>', { cls: 'span-7', subAr: 'كل خطوة نسبةً إلى أول خطوة في مرحلتها', subEn: 'Each step as a share of the first step in its stage' }) +
      panel('تنبيهات', 'Alerts', al, { cls: 'span-5' }) +
      '</div>';
  };

  V.regions = function () {
    var rows = R.slice().sort(function (a, b) { return b.results - a.results; });
    var mx = Math.max.apply(null, rows.map(function (r) { return r.results; }));
    var tbl = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('المنطقة', 'Region') + '</th><th class="n">' + L('نتائج مستلمة', 'Results') + '</th><th>' + L('استشارة ≤14 يومًا', 'Counselled ≤14 d') + '</th><th class="n">' + L('أقارب فُحصوا ≤90 يومًا', 'Relatives tested ≤90 d') + '</th><th class="n">' + L('مستشارون', 'Counsellors') + '</th><th class="n">' + L('عيادات استشارة', 'Counselling clinics') + '</th><th class="n">' + L('مختبرات HPLC', 'HPLC labs') + '</th><th class="n">' + L('مواقع رنين T2*', 'T2* MRI sites') + '</th><th class="n">' + L('تصعيدات', 'Escalations') + '</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var st = r.c14 >= 70 ? 'ok' : r.c14 >= 60 ? 'warn' : 'crit';
        return '<tr class="click' + (r.id === state.selRegion ? ' sel' : '') + '" data-region="' + r.id + '" tabindex="0"><td>' + L(r.ar, r.en) + '</td><td class="n">' + fmt(r.results) + '</td><td><span class="chip ' + st + '">' + r.c14 + '%</span></td><td class="n">' + r.t90 + '%</td><td class="n">' + r.fte + '</td><td class="n">' + r.clinics + '</td><td class="n">' + r.hplc + '</td><td class="n">' + r.mri + '</td><td class="n">' + r.esc + '</td></tr>';
      }).join('') +
      '<tr><td><b>' + L('المجموع', 'Total') + '</b></td><td class="n"><b>' + fmt(NAT.received) + '</b></td><td><b>' + Math.round(NAT.c14) + '%</b></td><td class="n"><b>' + Math.round(NAT.t90) + '%</b></td><td class="n"><b>' + sum('fte') + '</b></td><td class="n"><b>' + sum('clinics') + '</b></td><td class="n"><b>' + sum('hplc') + '</b></td><td class="n"><b>' + sum('mri') + '</b></td><td class="n"><b>' + sum('esc') + '</b></td></tr>' +
      '</tbody></table></div>';
    var r = R.filter(function (x) { return x.id === state.selRegion; })[0];
    var letters = ['A', 'B', 'C'];
    var n = r.share > .1 ? 3 : r.share > .03 ? 2 : 1;
    var clusters = letters.slice(0, n).map(function (c, i) {
      var tert = i === 0;
      return { name: T('التجمع ', 'Cluster ') + c + ' ' + T('(توضيحي)', '(illustrative)'), hplc: true, clinic: true, mri: tert && r.mri > 0, share: n === 1 ? 1 : tert ? .5 : (.5 / (n - 1)) };
    });
    function cap(b, a, e) { return b ? '<span class="acc y">' + ic('check') + L(a, e) + '</span>' : '<span class="acc n">' + ic('x') + L(a, e) + '</span>'; }
    var cl = '<div class="tbl-wrap"><table class="ct compact"><thead><tr><th>' + L('التجمع الصحي', 'Health cluster') + '</th><th>' + L('القدرات', 'Capabilities') + '</th><th class="n">' + L('حصة النتائج', 'Share of results') + '</th></tr></thead><tbody>' + clusters.map(function (c) {
      return '<tr><td>' + c.name + '</td><td class="wrap"><div class="row" style="gap:10px">' + cap(c.hplc, 'HPLC', 'HPLC') + cap(c.clinic, 'عيادة استشارة', 'Counselling clinic') + cap(c.mri, 'رنين T2* القلبي', 'Cardiac T2* MRI') + '</div></td><td class="n">' + pct(c.share) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var refs = r.mri > 0 ? L('الإحالات للرنين القلبي T2* تُستقبل داخل المنطقة (التجمع A).', 'Cardiac T2* MRI referrals are received inside the region (Cluster A).') :
      L('لا يوجد موقع رنين T2* في المنطقة: تُحال الحالات إلى أقرب تجمع لديه القدرة. ' + Math.max(2, r.esc + 3) + ' إحالات هذا الشهر.', 'No T2* MRI site in the region: cases are referred to the nearest cluster with capacity. ' + Math.max(2, r.esc + 3) + ' referrals this month.');
    var detail = '<div class="stat-row"><div><span class="v">' + fmt(r.results) + '</span><span class="k">' + L('نتائج مستلمة', 'Results received') + '</span></div><div><span class="v">' + r.c14 + '%</span><span class="k">' + L('استشارة ≤14 يومًا', 'Counselled ≤14 days') + '</span></div><div><span class="v">' + r.t90 + '%</span><span class="k">' + L('أقارب فُحصوا ≤90 يومًا', 'Relatives tested ≤90 days') + '</span></div><div><span class="v">' + fmt(r.results / r.fte) + '</span><span class="k">' + L('نتيجة لكل مستشار سنويًا', 'Results per counsellor a year') + '</span></div></div>' +
      cl + '<div class="note-box">' + ic('flow') + '<div>' + refs + '</div></div>';
    function sum(k) { return R.reduce(function (a, b) { return a + b[k]; }, 0); }
    return head('المناطق والتجمعات الصحية', 'Regions and health clusters', 'أداء المسار وقدرات المنشآت في 13 منطقة إدارية', 'Pathway performance and facility capability across the 13 administrative regions', ILLUS) +
      '<div class="cx-grid">' + panel('كل المناطق', 'All regions', tbl, { cls: 'span-12', subAr: 'اختر صفًا لعرض تفاصيل المنطقة', subEn: 'Select a row to open the region' }) +
      panel(r.ar, r.en, detail, { cls: 'span-7', subAr: 'تفاصيل المنطقة المختارة', subEn: 'Selected region' }) +
      panel('المنطقة على الخريطة', 'Region on the map', hexMap('c14', true), { cls: 'span-5', subAr: 'استشارة خلال 14 يومًا', subEn: 'Counselled within 14 days' }) + '</div>';
  };

  /* ---------- families ---------- */
  var COND = { bt: ['الثلاسيميا بيتا', 'β-thalassaemia'], scd: ['فقر الدم المنجلي', 'Sickle cell disease'] };
  var ENTRY = { single: ['حامل للصفة · قبل الزواج', 'Premarital · single carrier'], couple: ['زوجان معرّضان للخطر', 'At-risk couple'], newborn: ['صفة لدى مولود', 'Newborn trait'], relative: ['قريب مدعو', 'Invited relative'] };
  var STAGE = { sched: ['استشارة مجدولة', 'Counselling scheduled', 'neu'], done: ['أكمل الجلسة', 'Session completed', 'teal'], cascade: ['فحص الأسرة جارٍ', 'Family cascade in progress', 'teal'], await: ['بانتظار نتائج الأقارب', 'Awaiting relatives’ results', 'warn'], closed: ['مغلقة · قرار مستنير مسجّل', 'Closed · informed decision recorded', 'ok'], esc: ['مُصعَّدة لمستشار', 'Escalated to a counsellor', 'crit'] };
  var CASES = [
    ['FAM-0427', 'bt', 'single', 'makkah', 'cascade', 4, 1, 3],
    ['FAM-0431', 'scd', 'couple', 'eastern', 'esc', 2, 0, 0],
    ['FAM-0436', 'scd', 'single', 'jazan', 'sched', 0, 0, 1],
    ['FAM-0440', 'bt', 'newborn', 'riyadh', 'await', 5, 3, 2],
    ['FAM-0442', 'scd', 'relative', 'eastern', 'closed', 3, 3, 9],
    ['FAM-0445', 'bt', 'couple', 'makkah', 'done', 0, 0, 1],
    ['FAM-0449', 'scd', 'newborn', 'madinah', 'cascade', 6, 2, 4],
    ['FAM-0452', 'scd', 'single', 'asir', 'await', 3, 1, 6],
    ['FAM-0455', 'bt', 'single', 'riyadh', 'closed', 2, 2, 12],
    ['FAM-0458', 'scd', 'couple', 'jazan', 'esc', 1, 0, 0],
    ['FAM-0461', 'bt', 'relative', 'qassim', 'done', 0, 0, 2],
    ['FAM-0463', 'scd', 'single', 'najran', 'sched', 0, 0, 1],
    ['FAM-0466', 'scd', 'newborn', 'eastern', 'cascade', 4, 1, 3],
    ['FAM-0470', 'bt', 'single', 'tabuk', 'closed', 1, 1, 15]
  ];
  function pedigree() {
    var s = 36, h = s / 2;
    function sq(x, y, o) { o = o || {}; return '<rect class="sym' + (o.aff ? ' aff' : '') + '" x="' + (x - h) + '" y="' + (y - h) + '" width="' + s + '" height="' + s + '"/>' + (o.dot ? '<circle class="dot" cx="' + x + '" cy="' + y + '" r="5"/>' : ''); }
    function ci(x, y, o) { o = o || {}; return '<circle class="sym' + (o.aff ? ' aff' : '') + '" cx="' + x + '" cy="' + y + '" r="' + h + '"/>' + (o.dot ? '<circle class="dot" cx="' + x + '" cy="' + y + '" r="5"/>' : ''); }
    function lab(x, y, id, lines) { var o = '<text class="id" x="' + x + '" y="' + (y + h + 16) + '">' + id + '</text>'; (lines || []).forEach(function (l, i) { o += '<text x="' + x + '" y="' + (y + h + 31 + i * 14) + '">' + l + '</text>'; }); return o; }
    var y1 = 46, y2 = 170, y3 = 310, o = '';
    var gx = [270, 350], ux = 170, sx = 80, fx = 460, mx = 580, kids = [380, 510, 640, 770], cx = 125;
    o += '<line class="ln" x1="' + (gx[0] + h) + '" y1="' + y1 + '" x2="' + (gx[1] - h) + '" y2="' + y1 + '"/>' + sq(gx[0], y1) + ci(gx[1], y1) + lab(gx[0], y1, 'I-1') + lab(gx[1], y1, 'I-2');
    o += '<line class="ln" x1="310" y1="' + y1 + '" x2="310" y2="' + (y2 - 50) + '"/><line class="ln" x1="' + ux + '" y1="' + (y2 - 50) + '" x2="' + fx + '" y2="' + (y2 - 50) + '"/><line class="ln" x1="' + ux + '" y1="' + (y2 - 50) + '" x2="' + ux + '" y2="' + (y2 - h) + '"/><line class="ln" x1="' + fx + '" y1="' + (y2 - 50) + '" x2="' + fx + '" y2="' + (y2 - h) + '"/>';
    o += '<line class="ln" x1="' + (sx + h) + '" y1="' + y2 + '" x2="' + (ux - h) + '" y2="' + y2 + '"/>' + ci(sx, y2) + sq(ux, y2) + lab(sx, y2, 'II-1') + lab(ux, y2, 'II-2', [T('العم · لم يُفحص', 'uncle · untested')]);
    o += '<line class="ln" x1="' + (fx + h) + '" y1="' + (y2 - 4) + '" x2="' + (mx - h) + '" y2="' + (y2 - 4) + '"/><line class="ln" x1="' + (fx + h) + '" y1="' + (y2 + 4) + '" x2="' + (mx - h) + '" y2="' + (y2 + 4) + '"/>';
    o += '<text x="' + ((fx + mx) / 2) + '" y="' + (y2 - 30) + '">' + T('أبناء عم', '1st cousins') + '</text>';
    o += sq(fx, y2, { dot: 1 }) + ci(mx, y2, { dot: 1 }) + lab(fx, y2, 'II-3', [T('حامل إلزامي', 'obligate carrier')]) + lab(mx, y2, 'II-4', [T('حاملة إلزامية', 'obligate carrier')]);
    o += '<line class="ln" x1="' + cx + '" y1="' + y2 + '" x2="' + cx + '" y2="' + (y3 - h) + '"/>' + sq(cx, y3) + lab(cx, y3, 'III-1', [T('ابن العم', 'cousin'), T('لم يُفحص', 'untested')]);
    var mid = (fx + mx) / 2;
    o += '<line class="ln" x1="' + mid + '" y1="' + (y2 + 4) + '" x2="' + mid + '" y2="' + (y3 - 50) + '"/><line class="ln" x1="' + kids[0] + '" y1="' + (y3 - 50) + '" x2="' + kids[3] + '" y2="' + (y3 - 50) + '"/>';
    kids.forEach(function (x) { o += '<line class="ln" x1="' + x + '" y1="' + (y3 - 50) + '" x2="' + x + '" y2="' + (y3 - h) + '"/>'; });
    o += sq(kids[0], y3, { dot: 1 }) + lab(kids[0], y3, 'III-2 · 20', [T('حامل', 'carrier'), 'HbA2 5.2%']);
    o += sq(kids[1], y3) + lab(kids[1], y3, 'III-3 · 17', [T('فُحص', 'tested'), T('غير حامل', 'not a carrier')]);
    o += ci(kids[2], y3, { aff: 1 }) + lab(kids[2], y3, 'III-4 · 15', [T('مصابة', 'affected'), 'TDT']);
    o += ci(kids[3], y3) + lab(kids[3], y3, 'III-5 · 6', [T('لم تُفحص', 'untested')]);
    var px = kids[0];
    o += '<line class="arrow" x1="' + (px - 56) + '" y1="' + (y3 + 30) + '" x2="' + (px - h - 6) + '" y2="' + (y3 + 6) + '"/><polygon class="arrowhead" points="' + (px - h - 2) + ',' + (y3 + 3) + ' ' + (px - h - 15) + ',' + (y3 + 5) + ' ' + (px - h - 9) + ',' + (y3 + 15) + '"/><text class="p" x="' + (px - 70) + '" y="' + (y3 + 40) + '">P</text>';
    return '<svg class="ped" viewBox="40 10 790 390" role="img" aria-label="' + T('شجرة أسرة غير معرِّفة', 'De-identified pedigree') + '">' + o + '</svg>' +
      '<div class="ped-key"><span><svg viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"/></svg>' + L('ذكر', 'Male') + '</span><span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="2"/></svg>' + L('أنثى', 'Female') + '</span><span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="currentColor"/></svg>' + L('مصاب', 'Affected') + '</span><span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="10" r="2.5" fill="currentColor"/></svg>' + L('حامل للصفة', 'Carrier') + '</span><span><svg viewBox="0 0 20 20"><path d="M2 8h16M2 12h16" stroke="currentColor" stroke-width="2"/></svg>' + L('زواج أقارب', 'Consanguinity') + '</span><span style="color:var(--teal-ink)"><b>P</b>&nbsp;' + L('الشخص الأول (المُستدل)', 'Proband') + '</span></div>';
  }
  V.families = function () {
    var ff = state.famFilter;
    var list = CASES.filter(function (c) { return (ff.cond === 'all' || c[1] === ff.cond) && (ff.entry === 'all' || c[2] === ff.entry) && (ff.stage === 'all' || c[4] === ff.stage) && (ff.region === 'all' || c[3] === ff.region); });
    function sel(id, map, cur, allAr, allEn, labelAr, labelEn) {
      return '<label>' + L(labelAr, labelEn) + '<select class="cx-select" id="' + id + '"><option value="all">' + T(allAr, allEn) + '</option>' + Object.keys(map).map(function (k) { return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + T(map[k][0], map[k][1]) + '</option>'; }).join('') + '</select></label>';
    }
    var regMap = {}; R.forEach(function (r) { regMap[r.id] = [r.ar, r.en]; });
    var filters = '<div class="frow">' + sel('ff-cond', COND, ff.cond, 'كل الحالات', 'All conditions', 'الحالة', 'Condition') + sel('ff-entry', ENTRY, ff.entry, 'كل نقاط البدء', 'All entry points', 'نقطة البدء', 'Entry point') + sel('ff-stage', STAGE, ff.stage, 'كل المراحل', 'All stages', 'المرحلة', 'Stage') + sel('ff-region', regMap, ff.region, 'كل المناطق', 'All regions', 'المنطقة', 'Region') + '</div>';
    var tbl = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('رقم الحالة', 'Case ID') + '</th><th>' + L('الحالة', 'Condition') + '</th><th>' + L('نقطة البدء', 'Entry point') + '</th><th>' + L('المنطقة', 'Region') + '</th><th>' + L('المرحلة', 'Stage') + '</th><th class="n">' + L('أقارب مدعوّون', 'Relatives invited') + '</th><th class="n">' + L('فُحصوا', 'Tested') + '</th><th class="n">' + L('آخر نشاط', 'Last activity') + '</th></tr></thead><tbody>' +
      (list.length ? list.map(function (c) {
        var st = STAGE[c[4]];
        return '<tr class="click' + (c[0] === state.caseId ? ' sel' : '') + '" data-case="' + c[0] + '" tabindex="0"><td class="id">' + c[0] + '</td><td>' + L(COND[c[1]][0], COND[c[1]][1]) + '</td><td>' + L(ENTRY[c[2]][0], ENTRY[c[2]][1]) + '</td><td>' + rname(c[3]) + '</td><td><span class="chip ' + st[2] + '">' + L(st[0], st[1]) + '</span></td><td class="n">' + c[5] + '</td><td class="n">' + c[6] + '</td><td class="n">' + L('منذ ' + c[7] + ' يوم', c[7] + ' d ago') + '</td></tr>';
      }).join('') : '<tr><td colspan="8">' + L('لا توجد حالات تطابق هذه المرشحات.', 'No cases match these filters.') + '</td></tr>') + '</tbody></table></div>';
    var c = CASES.filter(function (x) { return x[0] === state.caseId; })[0] || CASES[0];
    var detail;
    if (c[0] === 'FAM-0427') {
      var tl = [
        ['0', 'نتيجة الفحص قبل الزواج مستلمة من المختبر', 'Premarital result received from the lab', 'حامل لصفة الثلاسيميا بيتا · HbA2 5.2%', 'β-thalassaemia trait · HbA2 5.2%', 0],
        ['2', 'أكمل جلسة الاستشارة بالعربية', 'Completed the Arabic counselling session', 'قرار مستنير مسجّل ذاتيًا · لم يُطلب مستشار', 'Informed decision self-recorded · no counsellor requested', 0],
        ['3', 'حدّدت الجهة الأقارب المعنيّين من شجرة الأسرة', 'The authority identified the relatives concerned from the family tree', 'الوالدان، والأخت الصغرى، والعم وابنه', 'Parents, younger sister, uncle and his son', 0],
        ['4', 'صدرت 4 دعوات', '4 invitations issued', 'لا تذكر الدعوة اسم أي فرد من الأسرة', 'The invitation names no family member', 0],
        ['7', 'العم (II-2) حجز موعدًا عبر صحتي', 'Uncle (II-2) booked through Sehhaty', 'محاكاة', 'Simulated', 0],
        ['21', 'العم فُحص · النتيجة خاصة به', 'Uncle tested · result private to him', 'لا تظهر النتيجة في سجل الأسرة', 'The result does not appear in the family record', 0],
        ['—', 'الأخت (III-5، 6 سنوات): بانتظار موافقة الوالدين على الفحص مع تحليل HLA', 'Sister (III-5, 6 y): awaiting parents’ consent for testing with HLA typing', 'هدف 90 يومًا: متبقٍّ 69 يومًا', '90-day target: 69 days left', 1]
      ];
      detail = '<div class="note-box">' + ic('privacy') + '<div>' + L('هذه القائمة غير معرِّفة. الملف الكامل بالأسماء متاح لفريق الحالات المخوَّل في «ملف الأسرة».', 'This list is de-identified. The full named record is available to the authorised case team under “Family record”.') + ' <a href="#record">' + L('فتح ملف الأسرة', 'Open family record') + '</a>' + '</div></div>' +
        '<dl class="kv"><dt>' + L('رقم الحالة', 'Case') + '</dt><dd class="mono">FAM-0427</dd><dt>' + L('المنطقة', 'Region') + '</dt><dd>' + L('مكة المكرمة · جدة · التجمع B (توضيحي)', 'Makkah · Jeddah · Cluster B (illustrative)') + '</dd><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + L('الثلاسيميا بيتا · دليل v2.2', 'β-thalassaemia · rulebook v2.2') + '</dd><dt>' + L('نقطة البدء', 'Entry point') + '</dt><dd>' + L('فحص قبل الزواج · حامل واحد', 'Premarital · single carrier') + '</dd><dt>' + L('الشخص الأول', 'Index person') + '</dt><dd>' + L('ذكر، 20 سنة', 'Male, 20 y') + '</dd></dl>' +
        '';
      detail = '<div class="case-grid"><div>' + detail + pedigree() + '</div><div><h3 class="t-h3" style="font-size:16px">' + L('الخط الزمني للحالة', 'Case timeline') + '</h3><ol class="tline">' + tl.map(function (t) { return '<li class="' + (t[5] ? 'pend' : '') + '"><span class="day">' + (t[0] === '—' ? '—' : L('يوم ' + t[0], 'Day ' + t[0])) + '</span><span class="node"></span><div><div class="tt">' + L(t[1], t[2]) + '</div><div class="ts">' + L(t[3], t[4]) + '</div></div></li>'; }).join('') + '</ol></div></div>';
    } else {
      var st = STAGE[c[4]];
      detail = '<div class="note-box">' + ic('privacy') + '<div>' + L('هذه القائمة غير معرِّفة. الملف الكامل بالأسماء متاح لفريق الحالات المخوَّل في «ملف الأسرة».', 'This list is de-identified. The full named record is available to the authorised case team under “Family record”.') + ' <a href="#record">' + L('فتح ملف الأسرة', 'Open family record') + '</a>' + '</div></div>' +
        '<dl class="kv"><dt>' + L('رقم الحالة', 'Case') + '</dt><dd class="mono">' + c[0] + '</dd><dt>' + L('المنطقة', 'Region') + '</dt><dd>' + rname(c[3]) + '</dd><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + L(COND[c[1]][0], COND[c[1]][1]) + '</dd><dt>' + L('نقطة البدء', 'Entry point') + '</dt><dd>' + L(ENTRY[c[2]][0], ENTRY[c[2]][1]) + '</dd><dt>' + L('المرحلة', 'Stage') + '</dt><dd><span class="chip ' + st[2] + '">' + L(st[0], st[1]) + '</span></dd><dt>' + L('أقارب مدعوّون / فُحصوا', 'Relatives invited / tested') + '</dt><dd>' + c[5] + ' / ' + c[6] + '</dd></dl>' +
        '<p class="t-cap">' + L('شجرة الأسرة الكاملة والخط الزمني معروضان في هذا النموذج للحالة FAM-0427 فقط.', 'In this demo the full pedigree and timeline are shown for case FAM-0427 only.') + '</p><button type="button" class="cbtn sm" data-case="FAM-0427">' + L('فتح FAM-0427', 'Open FAM-0427') + '</button>';
    }
    return head('الأسر (سجلات غير معرِّفة)', 'Families (de-identified records)', 'كل حالة أسرة من النتيجة الأولى إلى آخر قريب فُحص', 'Every family case from the first result to the last relative tested', ILLUS) +
      '<div class="cx-grid">' + panel('قائمة الحالات', 'Case list', filters + tbl, { cls: 'span-12', subAr: list.length + ' حالة معروضة', subEn: list.length + ' cases shown' }) +
      panel('الحالة ' + c[0], 'Case ' + c[0], detail, { cls: 'span-12' }) + '</div>';
  };

  /* ---------- family record (restricted: authority case team) ----------
     Full, identified pedigree with each member's status and history. Only the authority's authorised case team
     sees this view; the person and their relatives never see each other's records. */
  var FREC = {
    'FAM-0427': { w: 900, h: 450, cond: ['الثلاسيميا بيتا', 'β-thalassaemia'], region: ['مكة المكرمة · جدة · التجمع B', 'Makkah · Jeddah · Cluster B'], entry: ['فحص ما قبل الزواج · حامل واحد', 'Premarital · single carrier'],
      n: {
        gf: { s: 'm', x: 470, y: 60, st: 'unk', nm: ['الجد', 'Grandfather'], age: 78, rel: ['جد يوسف لأبيه', 'Paternal grandfather'], hx: [['لا يوجد فحص هيموغلوبين مسجّل', 'No haemoglobin test on record']], inv: 0, s0: 'na' },
        gm: { s: 'f', x: 570, y: 60, st: 'unk', nm: ['الجدة', 'Grandmother'], age: 74, rel: ['جدة يوسف لأبيه', 'Paternal grandmother'], hx: [['لا يوجد فحص هيموغلوبين مسجّل', 'No haemoglobin test on record']], inv: 0, s0: 'na' },
        fa: { s: 'm', x: 230, y: 190, st: 'car', nm: ['سعيد', 'Saeed'], age: 52, rel: ['الأب', 'Father'], sb: ['حامل حتمًا', 'obligate carrier'], hx: [['أب لابنة مصابة: حامل حتمًا للصفة', 'Father of an affected daughter: obligate carrier'], ['لا يوجد فحص هيموغلوبين مسجّل', 'No haemoglobin test on record'], ['ارتفاع ضغط الدم (مُعالَج)', 'Hypertension (treated)']], inv: 1, s0: 'none' },
        mo: { s: 'f', x: 350, y: 190, st: 'car', nm: ['منى', 'Mona'], age: 47, rel: ['الأم', 'Mother'], sb: ['حاملة حتمًا', 'obligate carrier'], hx: [['أم لابنة مصابة: حاملة حتمًا للصفة', 'Mother of an affected daughter: obligate carrier'], ['لا يوجد فحص هيموغلوبين مسجّل', 'No haemoglobin test on record']], inv: 1, s0: 'none' },
        un: { s: 'm', x: 690, y: 190, st: 'car', nm: ['ناصر', 'Nasser'], age: 49, rel: ['العم', 'Uncle'], sb: ['حامل للصفة', 'carrier'], hx: [['فُحص بعد الدعوة (اليوم 21): حامل للصفة · HbA2 5.6%', 'Tested after invitation (day 21): carrier · HbA2 5.6%'], ['السكري من النوع الثاني', 'Type 2 diabetes']], inv: 1, s0: 'tested' },
        au: { s: 'f', x: 810, y: 190, st: 'unk', nm: ['هدى', 'Huda'], age: 45, rel: ['زوجة العم', 'Uncle’s wife'], sb: ['من خارج العائلة', 'not related'], hx: [['من خارج العائلة: غير معنيّة بالدعوة', 'Not a blood relative: not in scope']], inv: 0, s0: 'na' },
        br: { s: 'm', x: 110, y: 340, st: 'clear', nm: ['خالد', 'Khalid'], age: 17, rel: ['الأخ', 'Brother'], sb: ['غير حامل', 'not a carrier'], hx: [['فُحص 2025: غير حامل · HbA2 2.7%', 'Tested 2025: not a carrier · HbA2 2.7%']], inv: 0, s0: 'tested' },
        no: { s: 'f', x: 210, y: 340, st: 'aff', nm: ['نورة', 'Noura'], age: 15, rel: ['الأخت', 'Sister'], sb: ['مصابة', 'affected'], hx: [['ثلاسيميا بيتا معتمدة على نقل الدم', 'Transfusion-dependent β-thalassaemia'], ['نقل دم كل 3 إلى 4 أسابيع · مركز أمراض الدم، جدة', 'Transfusion every 3–4 weeks · haematology centre, Jeddah'], ['خالب الحديد: ديفيراسيروكس · فيريتين 1,850 ng/mL', 'Iron chelation: deferasirox · ferritin 1,850 ng/mL'], ['مرشّحة لزراعة الخلايا الجذعية عند توفر متبرع متوافق', 'Candidate for stem-cell transplant if a matched donor is found']], inv: 0, s0: 'care' },
        la: { s: 'f', x: 310, y: 340, st: 'unk', nm: ['لما', 'Lama'], age: 6, rel: ['الأخت', 'Sister'], sb: ['لم تُفحص', 'untested'], ch: ['احتمال 2 من 3', '2 in 3 chance'], hx: [['لم تُفحص', 'Not tested'], ['متبرعة محتملة لنورة: تحليل HLA مقترح مع الفحص', 'Possible donor for Noura: HLA typing suggested with the test']], inv: 1, minor: 1, s0: 'guardian' },
        yo: { s: 'm', x: 420, y: 340, st: 'car', pb: 1, nm: ['يوسف', 'Yousef'], age: 20, rel: ['صاحب النتيجة الأولى', 'Index person'], sb: ['حامل للصفة', 'carrier'], hx: [['صفة الثلاسيميا بيتا · HbA2 5.2% (فحص ما قبل الزواج)', 'β-thalassaemia trait · HbA2 5.2% (premarital screening)'], ['أكمل جلسة الاستشارة (اليوم 2)', 'Completed counselling (day 2)']], inv: 0, s0: 'index' },
        re: { s: 'f', x: 530, y: 340, st: 'unk', nm: ['ريم', 'Reem'], age: 19, rel: ['الخطيبة', 'Fiancée'], sb: ['النتيجة قيد الإصدار', 'result pending'], hx: [['مشمولة في طلب فحص ما قبل الزواج نفسه', 'Covered by the same premarital screening request'], ['النتيجة قيد الإصدار', 'Result pending']], inv: 0, s0: 'premarital' },
        co: { s: 'm', x: 750, y: 340, st: 'car', nm: ['عبدالله', 'Abdullah'], age: 24, rel: ['ابن العم', 'Cousin'], sb: ['حامل للصفة', 'carrier'], hx: [['فُحص بعد الدعوة: حامل للصفة', 'Tested after invitation: carrier'], ['بدأ مساره الخاص: جلسة استشارة مجدولة', 'Own pathway started: counselling scheduled']], inv: 1, s0: 'tested' }
      },
      cp: [['gf', 'gm'], ['fa', 'mo', 1], ['un', 'au'], ['yo', 're']],
      sib: [{ p: ['gf', 'gm'], y: 125, c: ['fa', 'un'] }, { p: ['fa', 'mo'], y: 285, c: ['br', 'no', 'la', 'yo'] }, { p: ['un', 'au'], y: 285, c: ['co'] }] },
    'FAM-0533': { w: 760, h: 340, cond: ['الثلاسيميا بيتا', 'β-thalassaemia'], region: ['الرياض · التجمع الأول', 'Riyadh · First Cluster'], entry: ['فحص حديثي الولادة · صفة لدى المولود', 'Newborn screening · trait in the baby'],
      n: {
        fs: { s: 'm', x: 320, y: 70, st: 'unk', nm: ['فيصل', 'Faisal'], age: 31, rel: ['الأب', 'Father'], sb: ['موعد الفحص محجوز', 'test booked'], hx: [['لا يوجد فحص هيموغلوبين مسجّل', 'No haemoglobin test on record']], inv: 1, s0: 'booked' },
        hi: { s: 'f', x: 460, y: 70, st: 'unk', nm: ['هند', 'Hind'], age: 29, rel: ['الأم', 'Mother'], sb: ['موعد الفحص محجوز', 'test booked'], hx: [['فقر دم بنقص الحديد أثناء الحمل (2025)', 'Iron-deficiency anaemia in pregnancy (2025)'], ['لا يوجد فصل هيموغلوبين مسجّل', 'No haemoglobin HPLC on record']], inv: 1, s0: 'booked' },
        om: { s: 'm', x: 320, y: 230, st: 'unk', nm: ['عمر', 'Omar'], age: 4, rel: ['الأخ', 'Brother'], sb: ['لم يُفحص', 'untested'], ch: ['يتضح بعد فحص الوالدين', 'clearer after the parents’ tests'], hx: [['لم يُفحص', 'Not tested'], ['نمو طبيعي حسب سجل طب الأطفال', 'Normal growth per paediatric record']], inv: 1, minor: 1, s0: 'none' },
        sa: { s: 'f', x: 460, y: 230, st: 'car', pb: 1, nm: ['سارة', 'Sara'], age: [9, 'd'], rel: ['صاحبة النتيجة الأولى', 'Index person'], sb: ['حاملة للصفة', 'carrier'], hx: [['فحص حديثي الولادة: صفة الثلاسيميا بيتا', 'Newborn screening: β-thalassaemia trait']], inv: 0, s0: 'index' },
        fsib: { s: 'grp', x: 130, y: 70, st: 'unk', nm: ['إخوة فيصل (3)', 'Faisal’s siblings (3)'], rel: ['أعمام سارة وعماتها', 'Sara’s paternal aunts and uncles'], sb: ['لم يُفحصوا', 'untested'], ch: ['1 من 2 إن كان فيصل حاملًا', '1 in 2 if Faisal carries it'], hx: [['ثلاثة أفراد · لا فحوص مسجّلة', 'Three people · no tests on record'], ['الدعوة مؤجَّلة حتى تظهر نتيجة فيصل', 'Invitation held until Faisal’s result is known']], inv: 1, s0: 'held' },
        hsib: { s: 'grp', x: 650, y: 70, st: 'unk', nm: ['إخوة هند (2)', 'Hind’s siblings (2)'], rel: ['أخوال سارة وخالاتها', 'Sara’s maternal aunts and uncles'], sb: ['لم يُفحصوا', 'untested'], ch: ['1 من 2 إن كانت هند حاملة', '1 in 2 if Hind carries it'], hx: [['شخصان · لا فحوص مسجّلة', 'Two people · no tests on record'], ['الدعوة مؤجَّلة حتى تظهر نتيجة هند', 'Invitation held until Hind’s result is known']], inv: 1, s0: 'held' }
      },
      cp: [['fs', 'hi']], sib: [{ p: ['fs', 'hi'], y: 160, c: ['om', 'sa'] }] }
  };
  var RST = {
    none: ['لم تُرسَل دعوة', 'No invitation sent', 'neu'], invited: ['دُعي · بانتظار الحجز', 'Invited · awaiting booking', 'teal'], booked: ['حجز موعدًا', 'Booked', 'teal'],
    tested: ['فُحص', 'Tested', 'ok'], held: ['مؤجَّلة بقرار الجهة', 'Held by the authority', 'warn'], guardian: ['بانتظار موافقة وليّ الأمر', 'Awaiting guardian consent', 'warn'],
    premarital: ['مشمولة بفحص ما قبل الزواج', 'Covered by premarital screening', 'neu'], index: ['صاحب النتيجة الأولى', 'Index person', 'teal'], care: ['في خطة رعاية', 'In a care plan', 'ok'], na: ['خارج نطاق الدعوة', 'Out of scope', 'neu']
  };
  var MSGS = {
    remind: ['تذكير بالموعد', 'Appointment reminder'], counsel: ['عرض جلسة استشارة وراثية', 'Offer of a genetic counselling session'],
    result: ['إشعار بأن النتيجة جاهزة في البوابة', 'Notice that a result is ready in the portal'], follow: ['متابعة بعد عدم الحجز', 'Follow-up after no booking']
  };
  state.recCase = 'FAM-0427'; state.recSel = 'la'; state.recSt = {}; state.recMsg = null; state.audit = [];
  function rst(cid, id) { var m = state.recSt[cid] || (state.recSt[cid] = {}); return m[id] || FREC[cid].n[id].s0; }
  function recAge(n) { return n.age == null ? '—' : (n.age.length ? L(n.age[0] + ' أيام', n.age[0] + ' days') : String(n.age)); }
  function fpedigree(cid) {
    var d = FREC[cid], N = d.n, g = '', nodes = '';
    function ln(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
    function tx(x, y, cls, a) { return '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="middle">' + S.esc(T(a[0], a[1])) + '</text>'; }
    d.cp.forEach(function (c) {
      var a = N[c[0]], b = N[c[1]], x1 = a.x + 22, x2 = b.x - 22;
      if (c[2]) { g += ln(x1, a.y - 3, x2, a.y - 3) + ln(x1, a.y + 3, x2, a.y + 3); nodes += tx((a.x + b.x) / 2, a.y - 12, 'sb', ['أبناء عمومة', '1st cousins']); }
      else g += ln(x1, a.y, x2, a.y);
    });
    d.sib.forEach(function (sb) {
      var a = N[sb.p[0]], b = N[sb.p[1]], mx = (a.x + b.x) / 2, xs = sb.c.map(function (id) { return N[id].x; });
      g += ln(mx, a.y + 3, mx, sb.y) + ln(Math.min.apply(null, xs.concat(mx)), sb.y, Math.max.apply(null, xs.concat(mx)), sb.y);
      xs.forEach(function (x, i) { g += ln(x, sb.y, x, N[sb.c[i]].y - 20); });
    });
    Object.keys(N).forEach(function (id) {
      var n = N[id], x = n.x, y = n.y, fill = n.st === 'aff' ? 'var(--genome-green)' : 'var(--surface-raised)', sym;
      if (n.s === 'm') sym = '<rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="40" height="40" style="fill:' + fill + '"/>';
      else if (n.s === 'f') sym = '<circle cx="' + x + '" cy="' + y + '" r="20" style="fill:' + fill + '"/>';
      else sym = '<path d="M' + x + ' ' + (y - 22) + ' L' + (x + 22) + ' ' + y + ' L' + x + ' ' + (y + 22) + ' L' + (x - 22) + ' ' + y + 'Z" style="fill:' + fill + '"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" class="sb" style="fill:var(--ink)">n</text>';
      var dot = n.st === 'car' ? '<circle cx="' + x + '" cy="' + y + '" r="5.5" style="fill:var(--genome-green);stroke:none"/>' : '';
      var pb = n.pb ? '<g style="stroke:var(--teal-ink);fill:var(--teal-ink)"><line x1="' + (x - 48) + '" y1="' + (y + 36) + '" x2="' + (x - 27) + '" y2="' + (y + 17) + '"/><path d="M' + (x - 24) + ' ' + (y + 14) + ' l-11 2 l7 7z" style="stroke:none"/><text x="' + (x - 52) + '" y="' + (y + 36) + '" style="stroke:none;font-size:12px;font-weight:600" text-anchor="end">P</text></g>' : '';
      var stt = RST[rst(cid, id)], sel = state.recSel === id;
      var ring = n.s === 'f' ? '<circle class="sel" cx="' + x + '" cy="' + y + '" r="28"/>' : '<rect class="sel" x="' + (x - 28) + '" y="' + (y - 28) + '" width="56" height="56" rx="6"/>';
      var nm = n.nm.slice(); if (n.age != null) nm = [nm[0] + ' · ' + (n.age.length ? n.age[0] + ' أيام' : n.age), nm[1] + ' · ' + (n.age.length ? n.age[0] + ' d' : n.age)];
      var lbl = tx(x, y + 40, 'nm', nm) + tx(x, y + 56, 'sb', n.sb || n.rel) + (n.ch && n.st === 'unk' ? tx(x, y + 72, 'ch', n.ch) : '');
      nodes += '<g class="node' + (sel ? ' selected' : '') + '" tabindex="0" role="button" data-mem="' + id + '" aria-label="' + S.esc(T(n.nm[0], n.nm[1])) + '"><rect x="' + (x - 58) + '" y="' + (y - 30) + '" width="116" height="112" style="fill:transparent;stroke:none"/>' + ring + '<g style="stroke:var(--ink);stroke-width:2.5">' + sym + '</g>' + dot + pb + lbl + '</g>';
    });
    return '<div class="fped-wrap"><svg class="fped" viewBox="0 0 ' + d.w + ' ' + d.h + '" role="img" aria-label="' + T('شجرة الأسرة الكاملة', 'Full family pedigree') + '"><g style="stroke:var(--ink);stroke-width:2.5;stroke-linecap:round;fill:none">' + g + '</g>' + nodes + '</svg></div>';
  }
  function fpedKey() {
    var k = function (svg, a, e) { return '<span><svg viewBox="0 0 20 20" aria-hidden="true">' + svg + '</svg>' + L(a, e) + '</span>'; };
    return '<div class="ped-key">' + k('<rect x="3" y="3" width="14" height="14" style="fill:none;stroke:var(--ink);stroke-width:2"/>', 'ذكر', 'Male') + k('<circle cx="10" cy="10" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/>', 'أنثى', 'Female') +
      k('<circle cx="10" cy="10" r="7" style="fill:var(--genome-green);stroke:var(--ink);stroke-width:2"/>', 'مصاب', 'Affected') + k('<circle cx="10" cy="10" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/><circle cx="10" cy="10" r="2.5" style="fill:var(--genome-green)"/>', 'حامل للصفة', 'Carrier') +
      k('<path d="M10 2 L18 10 L10 18 L2 10Z" style="fill:none;stroke:var(--ink);stroke-width:2"/>', 'مجموعة أفراد', 'Group of people') +
      k('<line x1="2" y1="7" x2="18" y2="7" style="stroke:var(--ink);stroke-width:2"/><line x1="2" y1="13" x2="18" y2="13" style="stroke:var(--ink);stroke-width:2"/>', 'زواج أقارب', 'Consanguinity') + k('<line x1="3" y1="17" x2="14" y2="6" style="stroke:var(--teal-ink);stroke-width:2"/><path d="M16 4 l-6 1 l4 4z" style="fill:var(--teal-ink)"/>', 'صاحب النتيجة الأولى', 'Index person') + '</div>';
  }
  function recDetail(cid) {
    var d = FREC[cid], id = state.recSel in d.n ? state.recSel : Object.keys(d.n)[0], n = d.n[id], s = rst(cid, id), stt = RST[s];
    var hx = '<ul class="rec-hx">' + n.hx.map(function (h) { return '<li>' + L(h[0], h[1]) + '</li>'; }).join('') + '</ul>';
    var to = n.minor ? L('تُرسَل إلى وليّ الأمر', 'Sent to the guardian') : n.s === 'grp' ? L('تُرسَل إلى كل فرد على حدة', 'Sent to each person separately') : L('تُرسَل إلى الشخص نفسه', 'Sent to the person');
    var acts = '';
    if (s === 'premarital') acts = '<p class="t-cap">' + L('مشمولة في طلب فحص ما قبل الزواج نفسه، فلا تحتاج إلى دعوة منفصلة لهذه الحالة.', 'Covered by the same premarital screening request, so no separate invitation is needed for this condition.') + '</p>';
    else if (n.inv && (s === 'none' || s === 'held' || s === 'guardian')) acts = '<div class="row" style="gap:8px"><button type="button" class="cbtn primary sm" data-act="rec-invite">' + ic('send') + L('إرسال دعوة رسمية', 'Send official invitation') + '</button>' + (s !== 'held' ? '<button type="button" class="cbtn sm" data-act="rec-hold">' + ic('clock') + L('تأجيل', 'Hold') + '</button>' : '') + '</div><p class="t-cap">' + to + ' · ' + L('لا تذكر الدعوة اسم أي فرد من الأسرة.', 'The invitation names no family member.') + '</p>';
    var msg = '';
    if (s !== 'na' && n.s !== 'grp') {
      msg = '<div class="rec-msg"><label>' + L('إرسال رسالة', 'Send a message') + '<select class="cx-select" id="rec-msg">' + Object.keys(MSGS).map(function (k) { return '<option value="' + k + '">' + T(MSGS[k][0], MSGS[k][1]) + '</option>'; }).join('') + '</select></label><button type="button" class="cbtn sm" data-act="rec-send">' + ic('message') + L('إرسال', 'Send') + '</button></div>';
    }
    return '<div class="rec-who"><h3>' + L(n.nm[0], n.nm[1]) + '</h3><span class="chip ' + stt[2] + '">' + L(stt[0], stt[1]) + '</span></div>' +
      '<dl class="kv"><dt>' + L('صلة القرابة', 'Relationship') + '</dt><dd>' + L(n.rel[0], n.rel[1]) + '</dd><dt>' + L('العمر', 'Age') + '</dt><dd>' + recAge(n) + '</dd><dt>' + L('الحالة الوراثية', 'Genetic status') + '</dt><dd>' + L((n.sb || ['—'])[0], (n.sb || ['—', '—'])[1]) + '</dd>' + (n.ch ? '<dt>' + L('الاحتمال', 'Chance') + '</dt><dd>' + L(n.ch[0], n.ch[1]) + '</dd>' : '') + '</dl>' +
      '<h4 class="rec-h">' + L('السجل الطبي ذو الصلة', 'Relevant medical history') + '</h4>' + hx +
      (acts || msg ? '<h4 class="rec-h">' + L('الإجراء', 'Action') + '</h4>' + acts + msg : '');
  }
  V.record = function () {
    var cid = state.recCase, d = FREC[cid];
    if (!(state.recSel in d.n)) state.recSel = cid === 'FAM-0427' ? 'la' : 'fsib';
    var banner = '<div class="rec-banner">' + ic('key') + '<div><b>' + L('وصول مقيّد', 'Restricted access') + '</b> · ' + L('هذا الملف متاح لفريق الحالات المخوَّل في الجهة الصحية فقط، ويُسجَّل كل فتح وكل إجراء في سجل التدقيق. لا يرى صاحب النتيجة ولا أقاربه سجلات بعضهم.', 'This record is available only to the authority’s authorised case team, and every opening and action is written to the audit log. Neither the index person nor relatives see each other’s records.') + '</div></div>';
    var tabs = '<div class="rec-tabs" role="tablist">' + Object.keys(FREC).map(function (k) { return '<button type="button" role="tab" class="cbtn sm' + (k === cid ? ' primary' : '') + '" aria-selected="' + (k === cid) + '" data-act="rec-case" data-v="' + k + '"><span class="mono">' + k + '</span> · ' + L(FREC[k].entry[0], FREC[k].entry[1]) + '</button>'; }).join('') + '</div>';
    var meta = '<dl class="kv rec-meta"><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + L(d.cond[0], d.cond[1]) + '</dd><dt>' + L('المنطقة', 'Region') + '</dt><dd>' + L(d.region[0], d.region[1]) + '</dd><dt>' + L('نقطة البدء', 'Entry point') + '</dt><dd>' + L(d.entry[0], d.entry[1]) + '</dd></dl>';
    var rows = Object.keys(d.n).map(function (id) {
      var n = d.n[id], stt = RST[rst(cid, id)];
      return '<tr class="click' + (id === state.recSel ? ' sel' : '') + '" data-mem="' + id + '" tabindex="0"><td><b>' + L(n.nm[0], n.nm[1]) + '</b></td><td>' + L(n.rel[0], n.rel[1]) + '</td><td class="n">' + recAge(n) + '</td><td>' + L((n.sb || ['—'])[0], (n.sb || ['—', '—'])[1]) + '</td><td><span class="chip ' + stt[2] + '">' + L(stt[0], stt[1]) + '</span></td></tr>';
    }).join('');
    var tbl = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الفرد', 'Person') + '</th><th>' + L('صلة القرابة', 'Relationship') + '</th><th class="n">' + L('العمر', 'Age') + '</th><th>' + L('الحالة الوراثية', 'Genetic status') + '</th><th>' + L('الدعوة', 'Invitation') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    return head('ملف الأسرة', 'Family record', 'الشجرة الكاملة بالأسماء والنتائج، وقرار الجهة في الدعوات والرسائل', 'The full pedigree with names and results, and the authority’s decisions on invitations and messages', ILLUS) +
      banner + tabs + '<div class="cx-grid">' +
      panel('شجرة الأسرة · ' + cid, 'Family pedigree · ' + cid, meta + fpedigree(cid) + fpedKey(), { cls: 'span-8', subAr: 'انقر أي فرد لعرض سجله', subEn: 'Select anyone to see their record' }) +
      panel('سجل الفرد', 'Person’s record', recDetail(cid), { cls: 'span-4 rec-side' }) +
      panel('أفراد الأسرة', 'Family members', tbl, { cls: 'span-12' }) + '</div>';
  };
  function recLog(actAr, actEn) {
    var d = new Date(), t = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2), n = FREC[state.recCase].n[state.recSel];
    state.audit.unshift([t, 'فريق الحالات · الجهة الصحية', 'Authority case team', actAr + ' · ' + n.nm[0], actEn + ' · ' + n.nm[1], state.recCase, 'متابعة فحص الأسرة', 'Family testing follow-up']);
  }

  /* ---------- counselling ---------- */
  var QUEUE = [
    ['FAM-0431', 'couple', 'زوجان كلاهما حامل · طلبا مستشارًا', 'Both partners carriers · asked for a counsellor', 'high', -3, 'C-07'],
    ['FAM-0458', 'distress', 'علامات ضيق نفسي أثناء الجلسة', 'Signs of distress during the session', 'high', -1, 'C-02'],
    ['FAM-0475', 'religious', 'سؤال شرعي · يُحال إلى جهة شرعية مختصة', 'Religious question · referred to qualified scholars', 'med', -6, '—'],
    ['FAM-0477', 'newborn', 'نتيجة مولود · الوالدان يطلبان شرحًا', 'Newborn result · parents ask for an explanation', 'med', 9, 'C-11'],
    ['FAM-0479', 'couple', 'زوجان معرّضان للخطر · خيارات الحمل', 'At-risk couple · pregnancy options', 'high', 14, 'C-07'],
    ['FAM-0480', 'language', 'يحتاج مترجمًا (الأردية)', 'Needs an interpreter (Urdu)', 'low', 30, '—'],
    ['FAM-0482', 'complex', 'نتيجة غير معتادة (HbS/β-thal)', 'Unusual result (HbS/β-thal)', 'high', 20, 'C-04'],
    ['FAM-0485', 'question', 'سؤال طبي يتجاوز محتوى الجلسة', 'Medical question beyond the session content', 'low', 42, 'C-09']
  ];
  var COUNS = [['C-02', 14, 18], ['C-04', 17, 18], ['C-07', 21, 18], ['C-09', 9, 18], ['C-11', 12, 18], ['C-13', 16, 18], ['C-15', 6, 12], ['C-18', 11, 18]];
  V.counselling = function () {
    var q = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الحالة', 'Case') + '</th><th>' + L('السبب', 'Reason') + '</th><th>' + L('الأولوية', 'Priority') + '</th><th>' + L('مهلة الاستجابة', 'Response target') + '</th><th>' + L('المستشار', 'Counsellor') + '</th><th>' + L('إجراء', 'Action') + '</th></tr></thead><tbody>' +
      QUEUE.map(function (r, i) {
        var pr = r[4] === 'high' ? ['crit', 'عالية', 'High'] : r[4] === 'med' ? ['warn', 'متوسطة', 'Medium'] : ['neu', 'عادية', 'Routine'];
        var sla = r[5] < 0 ? '<span class="chip crit">' + ic('clock') + L('متأخرة ' + (-r[5]) + ' س', (-r[5]) + ' h overdue') + '</span>' : '<span class="chip ' + (r[5] < 12 ? 'warn' : 'ok') + '">' + ic('clock') + L('متبقٍّ ' + r[5] + ' س', r[5] + ' h left') + '</span>';
        var act = r[1] === 'religious' ? '<button type="button" class="cbtn sm" data-act="scholar" data-i="' + i + '">' + ic('mosque') + L('إحالة لجهة شرعية', 'Refer to scholars') + '</button>' :
          '<button type="button" class="cbtn sm" data-act="handoff" data-i="' + i + '">' + ic('phone') + L('تحويل لمستشفى صحة الافتراضي', 'Hand off to Seha Virtual Hospital') + '</button>';
        return '<tr><td class="id">' + r[0] + '</td><td class="wrap">' + L(r[2], r[3]) + '</td><td><span class="chip ' + pr[0] + '">' + L(pr[1], pr[2]) + '</span></td><td>' + sla + '</td><td class="id">' + r[6] + '</td><td>' + act + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="t-cap">' + L('التحويل إلى مستشفى صحة الافتراضي محاكاة في هذا النموذج.', 'The handoff to Seha Virtual Hospital is simulated in this demo.') + '</p>';
    var load = '<div class="legend"><span><i style="background:var(--chart-1)"></i>' + L('حالات مفتوحة', 'Open cases') + '</span><span><i style="background:var(--crit)"></i>' + L('فوق السعة', 'Over capacity') + '</span></div><div class="funnel">' + COUNS.map(function (c) {
      var over = c[1] > c[2];
      return '<div class="f-row"><span class="id" style="font-family:var(--font-mono)">' + c[0] + '</span><span class="f-bar" data-tip="' + S.esc(c[0] + ': ' + c[1] + ' / ' + c[2]) + '"><span style="width:' + Math.min(100, c[1] / 22 * 100) + '%;' + (over ? 'background:var(--crit)' : '') + '"></span></span><span class="f-v">' + c[1] + '/' + c[2] + '</span></div>';
    }).join('') + '</div><p class="t-cap">' + L('السعة = الحالات المفتوحة المسموح بها لكل مستشار.', 'Capacity = open cases allowed per counsellor.') + '</p>';
    var esc = '<div class="stat-row"><div><span class="v">37</span><span class="k">' + L('تصعيدات مفتوحة', 'Open escalations') + '</span></div><div><span class="v">22 ' + T('د', 'min') + '</span><span class="k">' + L('وسيط الاستجابة للضيق النفسي', 'Median response to distress') + '</span></div><div><span class="v">14</span><span class="k">' + L('أسئلة شرعية أُحيلت هذا الشهر', 'Religious questions referred this month') + '</span></div><div><span class="v">4.6%</span><span class="k">' + L('جلسات طُلب فيها مستشار بشري', 'Sessions where a human was requested') + '</span></div></div>' +
      '<ul class="alerts"><li class="info">' + ic('scale') + '<div><div class="t">' + L('لا يجيب النظام عن الأسئلة الشرعية', 'The system does not answer religious questions') + '</div><div class="s">' + L('تُحال إلى الجهات الشرعية المختصة، ويُبلَّغ الشخص بذلك.', 'They are referred to qualified scholars, and the person is told so.') + '</div></div><span></span></li><li class="info">' + ic('phone') + '<div><div class="t">' + L('زر «تحدث مع مستشار» في كل شاشة', '“Talk to a counsellor” on every screen') + '</div><div class="s">' + L('يصل الطلب إلى هذه القائمة مع مهلة استجابة حسب الأولوية.', 'Requests arrive in this queue with a response target by priority.') + '</div></div><span></span></li></ul>';
    return head('الاستشارة والكوادر', 'Counselling and workforce', 'المستشارون البشريون يتولّون الحالات المعقدة؛ الجلسات الروتينية تتم ذاتيًا بمحتوى مُراجَع', 'Human counsellors take the complex cases; routine sessions run on reviewed content', ILLUS) +
      '<div class="cx-grid">' + panel('قائمة الفرز', 'Triage queue', q, { cls: 'span-12', subAr: 'الحالات المعقدة والمُصعَّدة مرتبة حسب المهلة', subEn: 'Complex and escalated cases, ordered by response target' }) +
      panel('حمل العمل لكل مستشار', 'Counsellor load', load, { cls: 'span-6' }) + panel('التصعيدات', 'Escalations', esc, { cls: 'span-6' }) + '</div>';
  };

  /* ---------- rulebooks ---------- */
  function initRB() {
    if (state.rbs) return;
    state.rbs = [
      { id: 'RB-BT', ar: 'الثلاسيميا بيتا', en: 'β-thalassaemia', status: 'live', ver: 'v2.2', inh: 'ar', entry: ['premarital', 'newborn', 'relative'],
        testAr: 'رحلان كهربائي للهيموغلوبين / HPLC', testEn: 'Haemoglobin electrophoresis / HPLC', critAr: 'حامل: HbA2 ≥ 3.5% مع صغر حجم الكريات · مصاب: معتمد على نقل الدم', critEn: 'Carrier: HbA2 ≥ 3.5% with microcytosis · Affected: transfusion-dependent', scope: 2,
        modAr: 'نتيجة حامل لصفة متنحية · v3.1', modEn: 'Recessive carrier result · v3.1', careAr: 'إرشادات TIF 2021', careEn: 'TIF 2021 guidelines', hist: [['v2.2', '2026-09', 'نص الخيارات', 'Options text'], ['v2.1', '2026-06', 'نطاق الأقارب حتى الدرجة الثانية', 'Cascade to 2nd degree'], ['v2.0', '2026-03', 'الإصدار الأول المعتمد', 'First approved release']] },
      { id: 'RB-SCD', ar: 'فقر الدم المنجلي', en: 'Sickle cell disease', status: 'live', ver: 'v1.4', inh: 'ar', entry: ['premarital', 'newborn', 'relative'],
        testAr: 'رحلان كهربائي للهيموغلوبين / HPLC', testEn: 'Haemoglobin electrophoresis / HPLC', critAr: 'حامل: HbAS · مصاب: HbSS أو HbS/β-thal', critEn: 'Carrier: HbAS · Affected: HbSS or HbS/β-thal', scope: 2,
        modAr: 'نتيجة حامل لصفة متنحية · v3.1', modEn: 'Recessive carrier result · v3.1', careAr: 'ASH 2020 · NHLBI 2014', careEn: 'ASH 2020 · NHLBI 2014', hist: [['v1.4', '2026-08', 'فحص دوبلر عبر الجمجمة', 'Transcranial Doppler checks'], ['v1.3', '2026-05', 'مسار المولود', 'Newborn pathway'], ['v1.0', '2026-02', 'الإصدار الأول المعتمد', 'First approved release']] }
    ];
  }
  var INH = { ar: ['جسمي متنحٍّ', 'Autosomal recessive'], ad: ['جسمي سائد', 'Autosomal dominant'], xl: ['مرتبط بالكروموسوم X', 'X-linked'] };
  var ENTRIES = { premarital: ['الفحص قبل الزواج', 'Premarital screening'], newborn: ['فحص حديثي الولادة', 'Newborn screening'], clinic: ['إحالة من عيادة', 'Clinic referral'], relative: ['دعوة قريب', 'Relative invitation'] };
  var SCOPES = { 1: ['الدرجة الأولى', '1st degree'], 2: ['الأولى والثانية', '1st and 2nd degree'], 3: ['حتى الدرجة الثالثة', 'Up to 3rd degree'] };
  function rbCard(rb) {
    var draft = rb.status === 'draft';
    var stChip = draft ? '<span class="chip draft">' + ic('edit') + L('مسودة · بانتظار الاعتماد السريري', 'Draft · pending clinical approval') + '</span>' : '<span class="chip ok">' + ic('check') + L('مفعّل', 'Live') + '</span>';
    var chain = '<div class="chain">' + [['المراجعة السريرية', 'Clinical review'], ['لجنة الأخلاقيات', 'Ethics'], ['مالك البرنامج', 'Programme owner']].map(function (s, i) {
      var cls = draft ? (i === 0 ? 'now' : '') : 'done';
      return (i ? '<span class="sep">›</span>' : '') + '<span class="st ' + cls + '">' + (cls === 'done' ? ic('check').replace('<svg', '<svg style="width:12px;height:12px"') : '') + L(s[0], s[1]) + '</span>';
    }).join('') + '</div>';
    return '<article class="rb' + (draft ? ' draft' : '') + '"><div class="rb-top"><div class="row1"><span class="code">' + rb.id + ' · ' + rb.ver + '</span>' + stChip + '</div><h3>' + L(S.esc(rb.ar), S.esc(rb.en)) + '</h3></div>' +
      '<div class="rb-body"><dl class="kv"><dt>' + L('نمط الوراثة', 'Inheritance') + '</dt><dd>' + L(INH[rb.inh][0], INH[rb.inh][1]) + '</dd>' +
      '<dt>' + L('نقاط البدء', 'Entry programmes') + '</dt><dd>' + rb.entry.map(function (e) { return L(ENTRIES[e][0], ENTRIES[e][1]); }).join(' · ') + '</dd>' +
      '<dt>' + L('الفحص التأكيدي', 'Confirmatory test') + '</dt><dd>' + L(S.esc(rb.testAr), S.esc(rb.testEn)) + '</dd>' +
      '<dt>' + L('معايير الحامل / المصاب', 'Carrier / affected criteria') + '</dt><dd>' + L(S.esc(rb.critAr), S.esc(rb.critEn)) + '</dd>' +
      '<dt>' + L('نطاق دعوة الأقارب', 'Cascade scope') + '</dt><dd>' + L(SCOPES[rb.scope][0], SCOPES[rb.scope][1]) + '</dd>' +
      '<dt>' + L('وحدة الاستشارة', 'Counselling module') + '</dt><dd>' + L(S.esc(rb.modAr), S.esc(rb.modEn)) + '</dd>' +
      '<dt>' + L('معيار الرعاية', 'Care standard') + '</dt><dd>' + L(S.esc(rb.careAr), S.esc(rb.careEn)) + '</dd>' +
      '<dt>' + L('المراجعون السريريون', 'Clinical reviewers') + '</dt><dd>[' + L('مراجع', 'reviewer') + '] · [' + L('مراجع', 'reviewer') + ']</dd></dl>' + chain +
      '<ul class="ver">' + rb.hist.map(function (h) { return '<li><b>' + h[0] + '</b> · ' + h[1] + ' · ' + L(h[2], h[3]) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="rb-foot"><button type="button" class="cbtn sm" data-act="rb-view" data-id="' + rb.id + '">' + ic('eye') + L('عرض الدليل', 'View rulebook') + '</button>' + (draft ? '<button type="button" class="cbtn sm" data-act="rb-submit" data-id="' + rb.id + '">' + ic('send') + L('إرسال للمراجعة', 'Submit for review') + '</button>' : '<button type="button" class="cbtn sm" data-act="rb-version" data-id="' + rb.id + '">' + ic('edit') + L('نسخة جديدة', 'New version') + '</button>') + '</div></article>';
  }
  V.rulebooks = function () {
    initRB();
    var live = state.rbs.filter(function (r) { return r.status === 'live'; }).length, drafts = state.rbs.length - live;
    return head('الحالات والأدلة السريرية', 'Conditions and rulebooks', 'كل حالة في سمات تُدار بدليل سريري مُراجَع يحدّد الفحص والوراثة ونطاق دعوة الأقارب والاستشارة والرعاية', 'Each condition in SIMAT runs on a reviewed clinical rulebook that sets testing, inheritance, cascade scope, counselling and care',
      '<button type="button" class="cbtn primary" data-act="rb-new" id="rb-new">' + ic('plus') + L('دليل حالة جديد', 'New condition rulebook') + '</button>') +
      '<div class="stat-row" style="max-width:640px"><div><span class="v">' + live + '</span><span class="k">' + L('أدلة مفعّلة', 'Live rulebooks') + '</span></div><div><span class="v">' + drafts + '</span><span class="k">' + L('مسودات', 'Drafts') + '</span></div><div><span class="v">3</span><span class="k">' + L('مراحل الاعتماد', 'Approval stages') + '</span></div></div>' +
      '<div class="rb-grid" id="rb-grid">' + state.rbs.map(rbCard).join('') + '</div>';
  };

  /* rulebook builder */
  var STEPS = [['الحالة', 'Condition'], ['الوراثة ونقاط البدء', 'Inheritance & entry'], ['الفحص والمعايير', 'Testing & criteria'], ['دعوة الأقارب', 'Family cascade'], ['الاستشارة والرعاية', 'Counselling & care'], ['المراجعة والاعتماد', 'Review & approval']];
  function newBuilder() { return { step: 0, nameAr: '', nameEn: '', inh: 'ar', entry: ['premarital'], test: '', carrier: '', affected: '', scope: 2, module: 'rec', care: '' }; }
  function riskRows(inh, scope) {
    var rows = inh === 'ad' ? [
      [1, 'الوالدان', 'Parents', '1/2 ' + T('لكل منهما', 'each')], [1, 'الإخوة', 'Siblings', '1/2'], [1, 'الأبناء', 'Children', '1/2'],
      [2, 'الأعمام والأخوال والعمات والخالات', 'Aunts and uncles', '1/4'], [2, 'أبناء الإخوة', 'Nieces and nephews', '1/4'], [3, 'أبناء العم والخال', 'First cousins', '1/8']] : [
      [1, 'الوالدان', 'Parents', '1/2 ' + T('لكل منهما (أحدهما على الأقل حامل)', 'each (at least one is a carrier)')], [1, 'الإخوة', 'Siblings', '1/2'], [1, 'الأبناء', 'Children', '1/2'],
      [2, 'الأعمام والأخوال والعمات والخالات', 'Aunts and uncles', '1/4'], [2, 'أبناء الإخوة', 'Nieces and nephews', '1/4'], [3, 'أبناء العم والخال', 'First cousins', '1/8']];
    if (inh === 'xl') return '<div class="note-box">' + ic('help') + '<div>' + L('في الوراثة المرتبطة بالكروموسوم X يعتمد الاحتمال على جنس الشخص الأول وجهة القرابة، ويُعرَّف لكل قريب داخل الدليل بعد المراجعة السريرية.', 'For X-linked inheritance the probability depends on the index person’s sex and which side of the family the relative is on; it is defined per relative inside the rulebook after clinical review.') + '</div></div>';
    return '<table class="risk"><thead><tr><th>' + L('القريب', 'Relative') + '</th><th>' + L('الدرجة', 'Degree') + '</th><th style="text-align:end">' + L(inh === 'ad' ? 'احتمال حمل المتغيّر' : 'احتمال حمل الصفة', inh === 'ad' ? 'Chance of carrying the variant' : 'Chance of being a carrier') + '</th><th>' + L('ضمن النطاق', 'In scope') + '</th></tr></thead><tbody>' +
      rows.map(function (r) { var inS = r[0] <= scope; return '<tr style="' + (inS ? '' : 'opacity:.45') + '"><td>' + L(r[1], r[2]) + '</td><td>' + r[0] + '</td><td class="n">' + r[3] + '</td><td>' + (inS ? '<span class="acc y">' + ic('check') + L('نعم', 'Yes') + '</span>' : '<span class="acc n">' + ic('x') + L('لا', 'No') + '</span>') + '</td></tr>'; }).join('') +
      '</tbody></table><p class="t-cap">' + L('احتمالات قبلية بافتراض أن الشخص الأول ' + (inh === 'ad' ? 'يحمل المتغيّر' : 'حامل للصفة') + '، قبل أي فحص. تُراجَع سريريًا قبل التفعيل.', 'Prior probabilities assuming the index person ' + (inh === 'ad' ? 'has the variant' : 'is a carrier') + ', before any testing. Clinically reviewed before activation.') + '</p>';
  }
  function builderBody(b) {
    var s = b.step, o = '';
    function radio(name, val, cur, t, sub) { return '<label class="opt"><input type="radio" name="' + name + '" value="' + val + '"' + (val == cur ? ' checked' : '') + '><span><span class="ot">' + t + '</span>' + (sub ? '<span class="os">' + sub + '</span>' : '') + '</span></label>'; }
    if (s === 0) o = '<div class="fld"><label for="b-name-ar">' + L('اسم الحالة بالعربية', 'Condition name (Arabic)') + '</label><input class="cinput" id="b-name-ar" dir="rtl" value="' + S.esc(b.nameAr) + '" placeholder="اسم الحالة"></div>' +
      '<div class="fld"><label for="b-name-en">' + L('اسم الحالة بالإنجليزية', 'Condition name (English)') + '</label><input class="cinput" id="b-name-en" dir="ltr" value="' + S.esc(b.nameEn) + '" placeholder="Condition name"></div>' +
      '<div class="note-box">' + ic('layers') + '<div>' + L('يُنشأ الدليل كمسودة، ولا يظهر لأي مستفيد قبل اكتمال مراحل الاعتماد الثلاث.', 'The rulebook is created as a draft and is not shown to anyone until all three approval stages are complete.') + '</div></div>';
    if (s === 1) o = '<div class="fld"><span class="lab">' + L('نمط الوراثة', 'Inheritance pattern') + '</span><div class="opts">' + Object.keys(INH).map(function (k) { return radio('b-inh', k, b.inh, L(INH[k][0], INH[k][1])); }).join('') + '</div></div>' +
      '<div class="fld"><span class="lab">' + L('نقاط البدء', 'Entry programmes') + '</span><div class="opts">' + Object.keys(ENTRIES).map(function (k) { return '<label class="opt"><input type="checkbox" name="b-entry" value="' + k + '"' + (b.entry.indexOf(k) > -1 ? ' checked' : '') + '><span><span class="ot">' + L(ENTRIES[k][0], ENTRIES[k][1]) + '</span></span></label>'; }).join('') + '</div></div>';
    if (s === 2) o = '<div class="fld"><label for="b-test">' + L('الفحص التأكيدي', 'Confirmatory test') + '</label><input class="cinput" id="b-test" value="' + S.esc(b.test) + '" data-ph-ar="اسم الفحص التأكيدي" data-ph-en="Confirmatory test" placeholder="' + T('اسم الفحص التأكيدي', 'Confirmatory test') + '"></div>' +
      '<div class="fld"><label for="b-carrier">' + L('معيار الحامل / من يحمل المتغيّر', 'Carrier / variant criteria') + '</label><textarea class="cinput" id="b-carrier" placeholder="' + T('القيم أو النتائج التي تحدد الحامل', 'Values or findings that define a carrier') + '">' + S.esc(b.carrier) + '</textarea></div>' +
      '<div class="fld"><label for="b-affected">' + L('معيار المصاب', 'Affected criteria') + '</label><textarea class="cinput" id="b-affected" placeholder="' + T('القيم أو النتائج التي تحدد الإصابة', 'Values or findings that define an affected person') + '">' + S.esc(b.affected) + '</textarea></div>';
    if (s === 3) o = '<div class="fld"><span class="lab">' + L('نطاق دعوة الأقارب', 'Cascade scope') + '</span><div class="opts">' + Object.keys(SCOPES).map(function (k) { return radio('b-scope', k, b.scope, L(SCOPES[k][0], SCOPES[k][1])); }).join('') + '</div></div>' +
      '<div class="fld"><span class="lab">' + L('من يُدعى، وباحتمال كم', 'Who is invited, and at what probability') + '</span><span class="hint">' + L('يُحسب من نمط الوراثة الذي اخترته', 'Calculated from the inheritance pattern you chose') + '</span><div id="b-risk">' + riskRows(b.inh, +b.scope) + '</div></div>' +
      '<div class="note-box">' + ic('family') + '<div>' + L('لا يتواصل النظام مع أي قريب. الشخص يقرّر من يُدعى وكيف، والدعوة الرسمية لا تذكر اسمه.', 'The system never contacts a relative by itself. The person decides who is invited and how; the official invitation never names them.') + '</div></div>';
    if (s === 4) o = '<div class="fld"><span class="lab">' + L('قالب وحدة الاستشارة', 'Counselling module template') + '</span><div class="opts">' +
      radio('b-mod', 'rec', b.module, L('نتيجة حامل لصفة متنحية', 'Recessive carrier result'), L('v3.1 · معتمد', 'v3.1 · approved')) +
      radio('b-mod', 'dom', b.module, L('نتيجة وراثة سائدة', 'Dominant result'), L('قالب · يحتاج محتوى', 'Template · needs content')) +
      radio('b-mod', 'xl', b.module, L('نتيجة مرتبطة بالكروموسوم X', 'X-linked result'), L('قالب · يحتاج محتوى', 'Template · needs content')) +
      radio('b-mod', 'blank', b.module, L('وحدة فارغة', 'Blank module'), '') + '</div><span class="hint">' + L('كل القوالب غير توجيهية: الخيارات تُعرض بالوزن نفسه، وزر المستشار البشري ثابت.', 'All templates are non-directive: options are shown with equal weight, and the human-counsellor button is fixed.') + '</span></div>' +
      '<div class="fld"><label for="b-care">' + L('مرجع معيار الرعاية', 'Care standard reference') + '</label><input class="cinput" id="b-care" value="' + S.esc(b.care) + '" placeholder="' + T('الدليل الإرشادي ورقم الإصدار', 'Guideline and edition') + '"></div>';
    if (s === 5) {
      var nm = (b.nameAr || b.nameEn) ? L(S.esc(b.nameAr || b.nameEn), S.esc(b.nameEn || b.nameAr)) : L('حالة بلا اسم', 'Untitled condition');
      o = '<dl class="kv"><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + nm + '</dd><dt>' + L('نمط الوراثة', 'Inheritance') + '</dt><dd>' + L(INH[b.inh][0], INH[b.inh][1]) + '</dd><dt>' + L('نقاط البدء', 'Entry programmes') + '</dt><dd>' + (b.entry.length ? b.entry.map(function (e) { return L(ENTRIES[e][0], ENTRIES[e][1]); }).join(' · ') : '—') + '</dd><dt>' + L('الفحص التأكيدي', 'Confirmatory test') + '</dt><dd>' + (S.esc(b.test) || '—') + '</dd><dt>' + L('نطاق الأقارب', 'Cascade scope') + '</dt><dd>' + L(SCOPES[b.scope][0], SCOPES[b.scope][1]) + '</dd></dl>' +
        '<div class="fld"><span class="lab">' + L('مسار الاعتماد', 'Approval workflow') + '</span><div class="chain"><span class="st now">' + L('المراجعة السريرية', 'Clinical review') + ' · [' + L('مراجع', 'reviewer') + ']</span><span class="sep">›</span><span class="st">' + L('لجنة الأخلاقيات', 'Ethics') + ' · [' + L('مراجع', 'reviewer') + ']</span><span class="sep">›</span><span class="st">' + L('مالك البرنامج', 'Programme owner') + '</span></div></div>' +
        '<div class="note-box">' + ic('privacy') + '<div>' + L('تبقى الحراسات نفسها لكل حالة: صفة الحمل فقط دون بيانات جينومية، واستضافة داخل المملكة، ولا تواصل مع الأقارب دون قرار الشخص.', 'The same guardrails apply to every condition: carrier status only with no genomic data, hosting inside the Kingdom, and no contact with relatives without the person’s decision.') + '</div></div>';
    }
    return o;
  }
  function readBuilder() {
    var b = state.builder, q = function (id) { return document.getElementById(id); };
    if (q('b-name-ar')) { b.nameAr = q('b-name-ar').value.trim(); b.nameEn = q('b-name-en').value.trim(); }
    var inh = document.querySelector('input[name="b-inh"]:checked'); if (inh) b.inh = inh.value;
    if (document.querySelector('input[name="b-entry"]')) b.entry = Array.prototype.map.call(document.querySelectorAll('input[name="b-entry"]:checked'), function (x) { return x.value; });
    if (q('b-test')) { b.test = q('b-test').value.trim(); b.carrier = q('b-carrier').value.trim(); b.affected = q('b-affected').value.trim(); }
    var sc = document.querySelector('input[name="b-scope"]:checked'); if (sc) b.scope = +sc.value;
    var md = document.querySelector('input[name="b-mod"]:checked'); if (md) b.module = md.value;
    if (q('b-care')) b.care = q('b-care').value.trim();
  }
  function renderBuilder() {
    var b = state.builder, m = document.getElementById('cx-modal');
    if (!b) { if (m) m.remove(); return; }
    if (!m) { m = document.createElement('div'); m.className = 'cx-modal'; m.id = 'cx-modal'; document.body.appendChild(m); }
    m.innerHTML = '<div class="cx-dialog" role="dialog" aria-modal="true" aria-labelledby="b-title"><div class="dh"><h2 id="b-title">' + L('دليل حالة جديد', 'New condition rulebook') + '</h2><button type="button" class="x" data-act="b-close" data-aria-ar="إغلاق" data-aria-en="Close" aria-label="' + T('إغلاق', 'Close') + '">' + ic('x') + '</button></div>' +
      '<div class="steps">' + STEPS.map(function (s, i) { return '<span class="s' + (i === b.step ? ' cur' : i < b.step ? ' done' : '') + '"><b>' + (i + 1) + '</b>' + L(s[0], s[1]) + '</span>'; }).join('') + '</div>' +
      '<div class="db" id="b-body">' + builderBody(b) + '</div>' +
      '<div class="df"><button type="button" class="cbtn" data-act="b-back"' + (b.step === 0 ? ' disabled' : '') + '>' + L('السابق', 'Back') + '</button>' +
      (b.step < STEPS.length - 1 ? '<button type="button" class="cbtn primary" data-act="b-next" id="b-next">' + L('التالي', 'Next') + '</button>' : '<button type="button" class="cbtn primary" data-act="b-save" id="b-save">' + ic('check') + L('حفظ كمسودة', 'Save as draft') + '</button>') + '</div></div>';
    var f = m.querySelector('#b-body input, #b-body textarea'); if (f) f.focus(); else m.querySelector('.x').focus();
  }
  function saveBuilder() {
    var b = state.builder, n = state.rbs.filter(function (r) { return r.status === 'draft'; }).length + 1;
    var nmAr = b.nameAr || b.nameEn || 'حالة بلا اسم', nmEn = b.nameEn || b.nameAr || 'Untitled condition';
    var modMap = { rec: ['نتيجة حامل لصفة متنحية · v3.1', 'Recessive carrier result · v3.1'], dom: ['نتيجة وراثة سائدة · قالب', 'Dominant result · template'], xl: ['نتيجة مرتبطة بالكروموسوم X · قالب', 'X-linked result · template'], blank: ['وحدة فارغة', 'Blank module'] };
    state.rbs.push({ id: 'RB-D' + String(n).padStart(2, '0'), ar: nmAr, en: nmEn, status: 'draft', ver: 'v0.1', inh: b.inh, entry: b.entry.length ? b.entry : ['clinic'],
      testAr: b.test || '[يُحدَّد]', testEn: b.test || '[to be defined]', critAr: (b.carrier || b.affected) ? [b.carrier, b.affected].filter(Boolean).join(' · ') : '[يُحدَّد]', critEn: (b.carrier || b.affected) ? [b.carrier, b.affected].filter(Boolean).join(' · ') : '[to be defined]',
      scope: b.scope, modAr: modMap[b.module][0], modEn: modMap[b.module][1], careAr: b.care || '[يُحدَّد]', careEn: b.care || '[to be defined]', hist: [['v0.1', '2026-10', 'مسودة أولى', 'First draft']] });
    state.builder = null; renderBuilder(); render();
    S.toast(L('حُفظ الدليل كمسودة · بانتظار المراجعة السريرية', 'Rulebook saved as a draft · pending clinical review'), 'layers');
    var g = document.getElementById('rb-grid'); if (g && g.lastElementChild) g.lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---------- content ---------- */
  var MODS = [
    ['M-01', 'فهم نتيجة الحامل للصفة', 'Understanding a carrier result', 'module', 'v3.1', 'ok', 'معتمد', 'Approved'],
    ['M-02', 'كيف تُورَّث الصفة (المربعات الأربعة)', 'How the trait is inherited (four boxes)', 'module', 'v2.0', 'ok', 'معتمد', 'Approved'],
    ['M-03', 'خياراتك (غير توجيهي)', 'Your options (non-directive)', 'module', 'v2.3', 'warn', 'قيد المراجعة', 'In review'],
    ['M-04', 'نتيجة المولود · للوالدين', 'A newborn’s result · for parents', 'module', 'v1.0', 'ok', 'معتمد', 'Approved'],
    ['M-05', 'الحديث مع الأقارب', 'Talking with relatives', 'module', 'v1.4', 'ok', 'معتمد', 'Approved'],
    ['T-01', 'دعوة رسمية · رسمي', 'Official invitation · formal', 'template', 'v1.2', 'ok', 'معتمد', 'Approved'],
    ['T-02', 'دعوة رسمية · مطمئن', 'Official invitation · reassuring', 'template', 'v1.2', 'ok', 'معتمد', 'Approved'],
    ['T-03', 'بداية رسالة شخصية (يحرّرها الشخص)', 'Personal message starter (edited by the person)', 'template', 'v1.1', 'ok', 'معتمد', 'Approved']
  ];
  function letter() {
    var reass = state.letterTone === 'reassuring';
    return '<div class="letters"><div class="letter" dir="rtl" lang="ar"><div class="lh"><span class="ph">[الجهة الصحية المُصدِرة]</span><span>رقم الدعوة: <span class="mono">INV-7F3K-29</span></span></div>' +
      '<p><b>' + (reass ? 'مرحبًا،' : 'السلام عليكم ورحمة الله،') + '</b></p>' +
      '<p>' + (reass ? 'نود أن نطمئن على صحتك وصحة أسرتك. ظهرت مؤخرًا في عائلتك الممتدة نتيجة فحص لاضطراب وراثي شائع في الدم، وكثير من الناس يحملون هذه الصفة دون أن يشعروا بأي أعراض.' : 'بناءً على نتيجة فحص حديثة في عائلتك الممتدة، ندعوك لإجراء فحص دم مجاني وسري لاضطرابات الدم الوراثية الشائعة (الثلاسيميا وفقر الدم المنجلي).') + '</p>' +
      '<p>' + 'الفحص سريع، ونتيجته خاصة بك وحدك، ولا تُشارَك مع أي فرد من العائلة. يمكنك حجز موعد عبر تطبيق صحتي باستخدام رقم الدعوة أعلاه.' + '</p>' +
      '<p>هذه الدعوة لا تذكر اسم أي فرد من عائلتك، ولا تعني أنك مصاب بأي مرض.</p>' +
      '<p class="t-cap">المهلة المقترحة للفحص: 90 يومًا · للاستفسار: [رقم التواصل]</p></div>' +
      '<div class="letter" dir="ltr" lang="en" style="margin-top:12px"><div class="lh"><span class="ph">[Issuing health authority]</span><span>Invitation no. <span class="mono">INV-7F3K-29</span></span></div>' +
      '<p>' + (reass ? 'We would like to look after your health and your family’s. A screening result for a common inherited blood condition recently appeared in your extended family. Many people carry this trait without any symptoms.' : 'Following a recent screening result in your extended family, you are invited for a free, confidential blood test for common inherited blood disorders (thalassaemia and sickle cell disease).') + '</p>' +
      '<p>The test is quick and the result is yours alone; it is not shared with any family member. Book through Sehhaty with the invitation number above.</p><p>This invitation names no one in your family and does not mean you have any condition.</p></div></div>';
  }
  V.content = function () {
    var tbl = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الرمز', 'Code') + '</th><th>' + L('العنوان', 'Title') + '</th><th>' + L('النوع', 'Type') + '</th><th>' + L('اللغات', 'Languages') + '</th><th>' + L('الإصدار', 'Version') + '</th><th>' + L('المراجع', 'Reviewer') + '</th><th>' + L('الحالة', 'Status') + '</th></tr></thead><tbody>' +
      MODS.map(function (m) { return '<tr><td class="id">' + m[0] + '</td><td class="wrap">' + L(m[1], m[2]) + '</td><td>' + (m[3] === 'module' ? L('وحدة استشارة', 'Counselling module') : L('قالب دعوة', 'Invitation template')) + '</td><td>AR · EN</td><td class="id">' + m[4] + '</td><td>[' + L('مراجع', 'reviewer') + ']</td><td><span class="chip ' + m[5] + '">' + L(m[6], m[7]) + '</span></td></tr>'; }).join('') + '</tbody></table></div>';
    var tone = '<div class="frow"><button type="button" class="cbtn sm' + (state.letterTone === 'formal' ? ' primary' : '') + '" data-act="tone" data-v="formal">' + L('رسمي', 'Formal') + '</button><button type="button" class="cbtn sm' + (state.letterTone === 'reassuring' ? ' primary' : '') + '" data-act="tone" data-v="reassuring">' + L('مطمئن', 'Reassuring') + '</button></div>';
    return head('مكتبة المحتوى', 'Content library', 'محتوى الاستشارة وقوالب الدعوات بالعربية والإنجليزية، مُراجَع ومُصدَّر بإصدارات', 'Counselling content and invitation templates in Arabic and English, reviewed and versioned', '') +
      '<div class="cx-grid">' + panel('الوحدات والقوالب', 'Modules and templates', tbl, { cls: 'span-12', noIllus: true }) +
      panel('معاينة الدعوة الرسمية', 'Official invitation preview', tone + letter() + '<div class="note-box">' + ic('privacy') + '<div>' + L('الدعوة لا تذكر اسم الشخص الأول ولا أي فرد من العائلة، ولا تذكر نتيجة أحد.', 'The invitation never names the index person or any family member, and states no one’s result.') + '</div></div>', { cls: 'span-12', noIllus: true, subAr: 'القالبان T-01 و T-02', subEn: 'Templates T-01 and T-02' }) + '</div>';
  };

  /* ---------- reports ---------- */
  var REPS = [
    ['RPT-Q', 'تقرير النتائج الربعي لمالك البرنامج', 'Quarterly outcomes report to the programme owner', 'ربعي', 'Quarterly', '2026-10-01', 'وزارة الصحة · مالك البرنامج', 'Ministry of Health · programme owner'],
    ['RPT-G', 'نتائج صفة الحمل المُجمَّعة لبرامج الجينوم الوطنية (وفق اتفاقية مشاركة بيانات)', 'Aggregated carrier-status outcomes for national genomic programmes (subject to data-sharing agreement)', 'نصف سنوي', 'Half-yearly', '2026-07-01', 'بحسب الاتفاقية [قيد الإعداد]', 'Per agreement [to be drafted]'],
    ['RPT-C', 'أداء التجمعات الصحية الشهري', 'Monthly health-cluster performance', 'شهري', 'Monthly', '2026-10-01', 'منسقو التجمعات', 'Cluster coordinators']
  ];
  function reportPreview(id) {
    var r = REPS.filter(function (x) { return x[0] === id; })[0];
    var rows = R.slice().sort(function (a, b) { return b.results - a.results; });
    var body = id === 'RPT-G' ?
      '<table class="ct"><thead><tr><th>' + L('المنطقة', 'Region') + '</th><th class="n">' + L('نتائج حمل صفة', 'Carrier results') + '</th><th class="n">' + L('أقارب فُحصوا', 'Relatives tested') + '</th><th class="n">' + L('حاملون بين الأقارب', 'Carriers among relatives') + '</th></tr></thead><tbody>' + rows.map(function (g) { var t = NAT.tested * g.results / NAT.received / 2, fnd = NAT.found * g.results / NAT.received / 2; return '<tr><td>' + L(g.ar, g.en) + '</td><td class="n">' + fmt(g.results / 2) + '</td><td class="n">' + (t < 10 ? '<10' : fmt(t)) + '</td><td class="n">' + (fnd < 10 ? '<10' : fmt(fnd)) + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="t-cap">' + L('صفة الحمل فقط (حامل / غير حامل / غير معروف). لا بيانات جينومية ولا معرّفات. الخلايا الأقل من 10 مُخفاة.', 'Carrier status only (carrier / not a carrier / unknown). No genomic data and no identifiers. Cells under 10 are suppressed.') + '</p>' :
      '<table class="ct"><thead><tr><th>' + L('المؤشر', 'Indicator') + '</th><th class="n">' + L('القيمة', 'Value') + '</th></tr></thead><tbody>' +
      [['نتائج حمل صفة مستلمة', 'Carrier results received', fmt(NAT.received / 4)], ['استشارة خلال 14 يومًا', 'Counselled within 14 days', Math.round(NAT.c14) + '%'], ['معدل القرار المستنير (ذاتي)', 'Informed-decision rate (self-reported)', pct(NAT.decision)], ['أقارب دُعوا', 'Relatives invited', fmt(NAT.invited / 4)], ['أقارب فُحصوا خلال 90 يومًا', 'Relatives tested within 90 days', Math.round(NAT.t90) + '%'], ['تصعيدات أُغلقت في المهلة', 'Escalations closed on target', '92%']].map(function (k) { return '<tr><td>' + L(k[0], k[1]) + '</td><td class="n">' + k[2] + '</td></tr>'; }).join('') + '</tbody></table>' +
      '<p class="t-cap">' + L('بيانات مُجمَّعة غير معرِّفة. لا يتضمن التقرير عدد الزيجات الملغاة ولا يعدّه مؤشرًا.', 'Aggregated, de-identified data. The report does not include, or treat as an indicator, the number of cancelled marriages.') + '</p>';
    return '<div class="report"><div class="rh"><div><div class="t-cap mono">' + r[0] + '</div><h3 class="t-h3" style="font-size:18px">' + L(r[1], r[2]) + '</h3></div><img src="assets/logo/simat-lockup-horizontal-light.svg" alt="SIMAT" width="150" height="43" style="height:auto"></div><div class="tbl-wrap" style="border:0">' + body + '</div><p class="t-cap">' + L('معاينة داخل الصفحة · بيانات توضيحية · لا يُرسَل التقرير في هذا النموذج', 'In-page preview · illustrative data · the report is not sent in this demo') + '</p></div>';
  }
  V.reports = function () {
    var tbl = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('التقرير', 'Report') + '</th><th>' + L('الدورية', 'Schedule') + '</th><th>' + L('آخر إصدار', 'Last run') + '</th><th>' + L('المستلمون', 'Recipients') + '</th><th></th></tr></thead><tbody>' +
      REPS.map(function (r) { return '<tr' + (state.report === r[0] ? ' class="sel"' : '') + '><td class="wrap"><span class="id" style="display:block;font-size:12px;color:var(--ink-muted)">' + r[0] + '</span>' + L(r[1], r[2]) + '</td><td>' + L(r[3], r[4]) + '</td><td class="id">' + r[5] + '</td><td class="wrap">' + L(r[6], r[7]) + '</td><td><button type="button" class="cbtn sm" data-act="report" data-id="' + r[0] + '">' + ic('report') + L('إنشاء معاينة', 'Generate preview') + '</button></td></tr>'; }).join('') + '</tbody></table></div>';
    return head('التقارير', 'Reports', 'تقارير مُجمَّعة غير معرِّفة بجدول زمني', 'Scheduled, aggregated, de-identified reports', ILLUS) +
      '<div class="cx-grid">' + panel('التقارير المجدولة', 'Scheduled reports', tbl, { cls: 'span-12', noIllus: true }) +
      (state.report ? panel('معاينة التقرير', 'Report preview', reportPreview(state.report), { cls: 'span-12' }) : '') + '</div>';
  };

  /* ---------- privacy ---------- */
  V.privacy = function () {
    var res = '<div class="stat-row"><div><span class="k">' + L('مكان الاستضافة', 'Hosting') + '</span><span class="v" style="font-size:16px">' + L('داخل المملكة', 'Inside Saudi Arabia') + '</span><span class="k">[' + L('مزود الخدمة', 'provider') + ']</span></div><div><span class="k">' + L('ما يُحفظ', 'What is stored') + '</span><span class="v" style="font-size:16px">' + L('صفة الحمل فقط', 'Carrier status only') + '</span><span class="k">' + L('لا بيانات جينومية خام', 'No raw genomic data') + '</span></div><div><span class="k">' + L('الإطار النظامي', 'Legal basis') + '</span><span class="v" style="font-size:16px">PDPL</span><span class="k">' + L('نظام حماية البيانات الشخصية', 'Personal Data Protection Law') + '</span></div><div><span class="k">' + L('تقييم أثر حماية البيانات', 'DPIA') + '</span><span class="v" style="font-size:16px">[' + L('قيد الإعداد', 'to be completed') + ']</span><span class="k">' + L('مدة الاحتفاظ', 'Retention') + ': [' + L('تُحدَّد', 'to be set') + ']</span></div></div>';
    var cons = '<div class="funnel">' + [['وافقوا على مسار سمات', 'Consented to the SIMAT pathway', 96.8], ['وافقوا على مشاركة بيانات مُجمَّعة غير معرِّفة', 'Consented to share aggregated, de-identified data', 91.2], ['سحبوا الموافقة', 'Withdrew consent', 0.6]].map(function (c) { return '<div class="f-row"><span>' + L(c[0], c[1]) + '</span><span class="f-bar"><span style="width:' + c[2] + '%"></span></span><span class="f-v">' + c[2] + '%</span></div>'; }).join('') + '</div><p class="t-cap">' + L('طلبات حذف مكتملة هذا العام: 42', 'Deletion requests completed this year: 42') + '</p>';
    var Y = '<span class="acc y">' + ic('check') + '</span>', P = function (a, e) { return '<span class="acc p">' + ic('eye') + L(a, e) + '</span>'; }, N = '<span class="acc n">' + ic('x') + '</span>';
    var roles = [
      ['الشخص نفسه', 'The person', Y, Y, Y, Y, N],
      ['القريب المدعو', 'Invited relative', P('نفسه فقط', 'own only'), P('نفسه فقط', 'own only'), N, P('دعوته فقط', 'own invitation'), N],
      ['المستشار الوراثي المكلّف', 'Assigned genetic counsellor', Y, Y, Y, Y, N],
      ['الطبيب المعالج', 'Treating clinician', Y, Y, P('عند الإحالة', 'on referral'), N, N],
      ['منسق التجمع', 'Cluster coordinator', N, P('غير معرِّف', 'de-identified'), P('غير معرِّف', 'de-identified'), N, Y],
      ['فريق الحالات في الجهة الصحية', 'Authority case team', Y, Y, Y, Y, Y],
      ['مدير البرنامج', 'Programme manager', N, P('غير معرِّف', 'de-identified'), P('غير معرِّف', 'de-identified'), N, Y],
      ['المدقق', 'Auditor', N, N, N, N, P('سجل الوصول', 'access log')]
    ];
    var mx = '<div class="tbl-wrap"><table class="ct mx"><thead><tr><th>' + L('الدور', 'Role') + '</th><th class="c">' + L('الهوية', 'Identity') + '</th><th class="c">' + L('صفة الحمل', 'Carrier status') + '</th><th class="c">' + L('شجرة الأسرة', 'Family tree') + '</th><th class="c">' + L('الرسائل والدعوات', 'Messages & invitations') + '</th><th class="c">' + L('بيانات مُجمَّعة', 'Aggregates') + '</th></tr></thead><tbody>' +
      roles.map(function (r) { return '<tr><td>' + L(r[0], r[1]) + '</td>' + r.slice(2).map(function (c) { return '<td class="c">' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    var log = [['10:42', 'مستشار وراثي C-07', 'Genetic counsellor C-07', 'فتح الحالة', 'Opened case', 'FAM-0431', 'تصعيد', 'Escalation'], ['10:31', 'مدير البرنامج', 'Programme manager', 'عرض مُجمَّع إقليمي', 'Viewed regional aggregate', 'REG-MKK', 'متابعة', 'Monitoring'], ['10:12', 'منسق التجمع B', 'Cluster B coordinator', 'تصدير تقرير', 'Exported report', 'RPT-C', 'تقرير شهري', 'Monthly report'], ['09:58', 'الطبيب المعالج', 'Treating clinician', 'عرض نتيجة', 'Viewed result', 'FAM-0427', 'رعاية', 'Care'], ['09:40', 'المدقق', 'Auditor', 'مراجعة سجل الوصول', 'Reviewed access log', '—', 'تدقيق', 'Audit']];
    log = state.audit.concat(log);
    var lg = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الوقت', 'Time') + '</th><th>' + L('الدور', 'Role') + '</th><th>' + L('الإجراء', 'Action') + '</th><th>' + L('السجل', 'Record') + '</th><th>' + L('الغرض', 'Purpose') + '</th></tr></thead><tbody>' +
      log.map(function (l) { return '<tr><td class="id">' + l[0] + '</td><td>' + L(l[1], l[2]) + '</td><td>' + L(l[3], l[4]) + '</td><td class="id">' + l[5] + '</td><td>' + L(l[6], l[7]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    return head('الخصوصية والتدقيق', 'Privacy and audit', 'من يرى ماذا، وأين تُحفظ البيانات، وسجل كل وصول', 'Who sees what, where data lives, and a log of every access', ILLUS) +
      '<div class="cx-grid">' + panel('إقامة البيانات وما يُحفظ', 'Data residency and what is stored', res, { cls: 'span-12', noIllus: true }) +
      panel('مصفوفة الوصول حسب الدور', 'Access by role', mx, { cls: 'span-12', noIllus: true }) + panel('الموافقات', 'Consent', cons, { cls: 'span-5' }) +
      panel('سجل الوصول', 'Access log', lg, { cls: 'span-7', subAr: 'اليوم', subEn: 'Today' }) + '</div>';
  };

  /* ---------- integrations ---------- */
  V.integrations = function () {
    var ints = [
      ['appointment', 'صحتي', 'Sehhaty', 'حجز مواعيد الفحص التأكيدي والاستشارة، والتذكيرات', 'Booking confirmatory tests and counselling, and reminders', 'FHIR R4 · Appointment, Slot'],
      ['key', 'نفاذ', 'Nafath', 'تسجيل الدخول والتحقق من الهوية', 'Sign-in and identity verification', 'OIDC'],
      ['building', 'نفيس', 'NPHIES', 'الإحالات والأهلية بين المنشآت', 'Referrals and eligibility between facilities', 'FHIR R4 · ServiceRequest, Coverage'],
      ['sample', 'أنظمة معلومات المختبرات', 'Laboratory information systems', 'استقبال نتائج الفحص قبل الزواج وفحص المواليد', 'Receiving premarital and newborn screening results', 'HL7 v2 ORU · FHIR DiagnosticReport'],
      ['phone', 'مستشفى صحة الافتراضي', 'Seha Virtual Hospital', 'تحويل الشخص إلى مستشار وراثي بشري', 'Handing the person to a human genetic counsellor', 'FHIR R4 · ServiceRequest'],
      ['message', 'بوابة الرسائل النصية', 'SMS gateway', 'إشعار الدعوة دون ذكر أي حالة أو اسم', 'Invitation notices that name no condition and no person', 'REST'],
      ['database', 'برامج الجينوم الوطنية', 'National genomic programmes', 'تقارير نتائج مُجمَّعة غير معرِّفة فقط، وفق اتفاقية مشاركة بيانات', 'Aggregated, de-identified outcome reports only, under a data-sharing agreement', 'FHIR R4 · MeasureReport'],
      ['family', 'التحقق من صلة القرابة', 'Family-relationship verification', 'ربط شجرة الأسرة من السجلات الوطنية لتحديد الأقارب المعنيّين', 'Linking the family tree from national records to identify the relatives concerned', 'REST']
    ];
    return head('الربط بالأنظمة', 'Integrations', 'كل الروابط في هذا النموذج محاكاة. هذه ما سيُتبادل عند التشغيل الفعلي.', 'Every connection in this demo is simulated. This is what would be exchanged in production.', '') +
      '<div class="int-grid">' + ints.map(function (i) { return '<article class="int"><div class="ih"><span class="ic">' + ic(i[0]) + '</span><div><h3>' + L(i[1], i[2]) + '</h3><div class="std">' + i[5] + '</div></div></div><p class="muted" style="font-size:14px">' + L(i[3], i[4]) + '</p><div class="row" style="gap:8px">' + SIM + '<span class="t-cap">' + L('آخر مزامنة: —', 'Last sync: —') + '</span></div></article>'; }).join('') + '</div>' +
      '<div class="note-box">' + ic('privacy') + '<div>' + L('تقليل البيانات: لا يُرسَل إلى أي نظام خارجي إلا الحد الأدنى اللازم للخطوة، ولا تُرسَل نتيجة أي شخص إلى أقاربه.', 'Data minimisation: each external system receives only what its step needs, and no one’s result is ever sent to their relatives.') + '</div></div>';
  };

  /* ---------- users ---------- */
  V.users = function () {
    var roles = [
      ['مدير البرنامج', 'Programme manager', 'وطني', 'National', 'المؤشرات والتقارير والأدلة (اعتماد نهائي)', 'Indicators, reports, rulebooks (final approval)', 4],
      ['فريق الحالات', 'Case team', 'الجهة الصحية', 'Health authority', 'ملف الأسرة الكامل، والسجل الطبي ذو الصلة، وقرار الدعوات والرسائل', 'Full family record, relevant medical history, decisions on invitations and messages', 12],
      ['منسق التجمع', 'Cluster coordinator', 'تجمع واحد', 'One cluster', 'مؤشرات التجمع والسعة والإحالات', 'Cluster indicators, capacity, referrals', 20],
      ['مستشار وراثي', 'Genetic counsellor', 'الحالات المكلّف بها', 'Assigned cases', 'الحالات المعرِّفة المكلّف بها، قائمة الفرز', 'Identified assigned cases, triage queue', 41],
      ['طبيب', 'Clinician', 'مرضاه', 'Own patients', 'النتائج ومعايير الرعاية والإحالات', 'Results, care checks, referrals', 310],
      ['مراجع سريري', 'Clinical reviewer', 'الأدلة', 'Rulebooks', 'مراجعة الأدلة ووحدات المحتوى', 'Review rulebooks and content modules', 6],
      ['مدقق', 'Auditor', 'سجلات الوصول', 'Access logs', 'قراءة سجل الوصول فقط', 'Read-only access log', 3]
    ];
    var t = '<div class="tbl-wrap"><table class="ct"><thead><tr><th>' + L('الدور', 'Role') + '</th><th>' + L('النطاق', 'Scope') + '</th><th>' + L('الصلاحيات', 'Permissions') + '</th><th class="n">' + L('المستخدمون', 'Users') + '</th><th>' + L('الدخول', 'Sign-in') + '</th></tr></thead><tbody>' +
      roles.map(function (r) { return '<tr><td><b>' + L(r[0], r[1]) + '</b></td><td>' + L(r[2], r[3]) + '</td><td class="wrap">' + L(r[4], r[5]) + '</td><td class="n">' + r[6] + '</td><td>' + L('نفاذ', 'Nafath') + ' ' + SIM + '</td></tr>'; }).join('') + '</tbody></table></div>';
    return head('المستخدمون والصلاحيات', 'Users and roles', 'الصلاحيات حسب الدور، بأقل قدر لازم من الوصول', 'Role-based permissions with least-privilege access', ILLUS) +
      '<div class="cx-grid">' + panel('الأدوار', 'Roles', t, { cls: 'span-12' }) + '</div>';
  };

  /* ======================= RENDER + EVENTS ======================= */
  function render() {
    renderNav(); renderFilters();
    var r = route(), v = document.getElementById('cx-view');
    v.innerHTML = V[r]();
    var fw = v.querySelector('.fped-wrap'), fn = fw && (fw.querySelector('.node.selected') || fw.querySelector('.node'));
    if (fn && fw.scrollWidth > fw.clientWidth + 4) { var ra = fn.getBoundingClientRect(), rb = fw.getBoundingClientRect(); fw.scrollLeft += (ra.left + ra.width / 2) - (rb.left + rb.width / 2); }
    var t = document.querySelector('meta[name="simat-title-' + lang() + '"]');
    if (t) document.title = t.getAttribute('content');
  }
  function closeNav() { var sh = document.getElementById('cx-shell'); sh.setAttribute('data-nav', 'closed'); document.getElementById('cx-menu').setAttribute('aria-expanded', 'false'); }

  function boot() {
    render();
    var lastNarrow = window.innerWidth < 700; window.addEventListener('resize', function () { var n = window.innerWidth < 700; if (n !== lastNarrow) { lastNarrow = n; render(); } });
    window.addEventListener('hashchange', function () { closeNav(); render(); document.getElementById('cx-view').focus({ preventScroll: true }); window.scrollTo(0, 0); });
    document.addEventListener('simat:lang', function () { render(); if (state.builder) { readBuilderSafe(); renderBuilder(); } });
    document.getElementById('f-period').addEventListener('change', function (e) { state.period = e.target.value; render(); });
    document.getElementById('f-region').addEventListener('change', function (e) { state.region = e.target.value; if (e.target.value !== 'all') state.selRegion = e.target.value; render(); });
    document.getElementById('cx-menu').addEventListener('click', function () { var sh = document.getElementById('cx-shell'), open = sh.getAttribute('data-nav') !== 'open'; sh.setAttribute('data-nav', open ? 'open' : 'closed'); this.setAttribute('aria-expanded', open); });
    document.getElementById('cx-scrim').addEventListener('click', closeNav);
    document.addEventListener('change', function (e) {
      var id = e.target.id;
      if (id === 'map-ind') { state.mapInd = e.target.value; render(); }
      if (id && id.indexOf('ff-') === 0) { state.famFilter[id.slice(3)] = e.target.value; render(); }
      if (e.target.name === 'b-inh' || e.target.name === 'b-scope') { readBuilder(); }
      if (e.target.name === 'b-scope' || e.target.name === 'b-inh') { var rk = document.getElementById('b-risk'); if (rk) rk.innerHTML = riskRows(state.builder.inh, +state.builder.scope); }
    });
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-region]');
      if (el && el.closest('#cx-view')) { state.selRegion = el.getAttribute('data-region'); if (route() !== 'regions') location.hash = 'regions'; else render(); return; }
      var mb = e.target.closest('[data-mem]');
      if (mb && mb.closest('#cx-view')) { state.recSel = mb.getAttribute('data-mem'); render(); if (window.innerWidth < 1180) { var sd = document.querySelector('.rec-side'); if (sd) sd.scrollIntoView({ block: 'start', behavior: 'smooth' }); } return; }
      var cs = e.target.closest('[data-case]');
      if (cs) { state.caseId = cs.getAttribute('data-case'); render(); var p = document.querySelectorAll('.panel')[1]; if (p && window.innerWidth < 1200) p.scrollIntoView({ block: 'start' }); return; }
      var a = e.target.closest('[data-act]'); if (!a) return;
      var act = a.getAttribute('data-act');
      if (act === 'rb-new') { state.builder = newBuilder(); renderBuilder(); }
      else if (act === 'b-close') { state.builder = null; renderBuilder(); document.getElementById('rb-new') && document.getElementById('rb-new').focus(); }
      else if (act === 'b-next') { readBuilder(); state.builder.step++; renderBuilder(); }
      else if (act === 'b-back') { readBuilder(); state.builder.step = Math.max(0, state.builder.step - 1); renderBuilder(); }
      else if (act === 'b-save') { readBuilder(); saveBuilder(); }
      else if (act === 'rb-submit') { S.toast(L('أُرسلت المسودة إلى المراجعة السريرية', 'Draft sent to clinical review'), 'send'); }
      else if (act === 'rb-view' || act === 'rb-version') { S.toast(L('عرض توضيحي · غير متاح في هذا النموذج', 'Demo view · not available in this prototype'), 'layers'); }
      else if (act === 'handoff') { S.toast(L('حُوّلت الحالة إلى مستشفى صحة الافتراضي (محاكاة)', 'Case handed off to Seha Virtual Hospital (simulated)'), 'phone'); a.disabled = true; }
      else if (act === 'scholar') { S.toast(L('أُحيل السؤال إلى جهة شرعية مختصة، وأُبلغ الشخص', 'Question referred to qualified scholars; the person was told'), 'mosque'); a.disabled = true; }
      else if (act === 'report') { state.report = a.getAttribute('data-id'); render(); var rp = document.querySelector('.report'); if (rp) rp.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      else if (act === 'rec-case') { state.recCase = a.getAttribute('data-v'); state.recSel = null; render(); }
      else if (act === 'rec-invite') { var m = state.recSt[state.recCase] || (state.recSt[state.recCase] = {}); m[state.recSel] = 'invited'; recLog('أرسل دعوة رسمية', 'Sent official invitation'); render(); S.toast(L('أُرسلت الدعوة الرسمية (محاكاة)', 'Official invitation sent (simulated)'), 'send'); }
      else if (act === 'rec-hold') { var m2 = state.recSt[state.recCase] || (state.recSt[state.recCase] = {}); m2[state.recSel] = 'held'; recLog('أجّل الدعوة', 'Held the invitation'); render(); S.toast(L('أُجّلت الدعوة بقرار الجهة', 'Invitation held by the authority'), 'clock'); }
      else if (act === 'rec-send') { var k = (document.getElementById('rec-msg') || {}).value || 'counsel'; recLog('أرسل رسالة: ' + MSGS[k][0], 'Sent message: ' + MSGS[k][1]); S.toast(L('أُرسلت الرسالة (محاكاة): ' + MSGS[k][0], 'Message sent (simulated): ' + MSGS[k][1]), 'message'); }
      else if (act === 'tone') { state.letterTone = a.getAttribute('data-v'); render(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (state.builder) { state.builder = null; renderBuilder(); } else closeNav(); }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-region], tr[data-case], [data-mem]')) { e.preventDefault(); e.target.click(); }
    });
    // tooltip
    var tip = document.getElementById('cx-tip');
    document.addEventListener('mousemove', function (e) {
      var t = e.target.closest && e.target.closest('[data-tip]');
      var xh = document.querySelector('.trend .xh');
      if (!t) { tip.hidden = true; if (xh) xh.setAttribute('opacity', 0); return; }
      tip.innerHTML = t.getAttribute('data-tip'); tip.hidden = false;
      var x = e.clientX + 14, y = e.clientY + 14, w = tip.offsetWidth, h = tip.offsetHeight;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 14; if (y + h > window.innerHeight - 8) y = e.clientY - h - 14;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
      if (xh && t.hasAttribute('data-x')) { xh.setAttribute('x1', t.getAttribute('data-x')); xh.setAttribute('x2', t.getAttribute('data-x')); xh.setAttribute('opacity', 1); }
    });
    document.addEventListener('scroll', function () { tip.hidden = true; }, true);
  }
  function readBuilderSafe() { try { readBuilder(); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
