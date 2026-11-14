/* My SIMAT — citizen portal (demo). One store, one render, delegated events. Nothing leaves the page. */
(function () {
  'use strict';
  var S = window.SIMAT, L = S.L, icon = S.icon, esc = S.esc;
  Object.assign(window.SIMAT_ICONS, {
    play: '<path d="M8 5v14l11-7z"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    dots: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
    letter: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 7l9 6 9-6"/>',
    pause: '<path d="M9 5v14M15 5v14"/>',
    fastfwd: '<path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/>'
  });

  /* ---------------- reference data ---------------- */
  var COND = {
    bthal: { name: ['الثلاسيميا بيتا', 'β-thalassaemia'], gene: 'HBB', rulebook: 'β-thal · v1.2', premarital: true,
      trait: ['صفة الثلاسيميا بيتا', 'β-thalassaemia trait'], disease: ['الثلاسيميا بيتا (المرض)', 'β-thalassaemia (the disease)'] },
    scd: { name: ['فقر الدم المنجلي', 'Sickle cell disease'], gene: 'HBB (HbS)', rulebook: 'SCD · v1.1', premarital: true,
      trait: ['صفة الخلايا المنجلية', 'Sickle cell trait'], disease: ['فقر الدم المنجلي (المرض)', 'Sickle cell disease (the disease)'] }
  };
  var P = {
    single: { code: 'FAM-0427', cond: 'bthal', entry: 'premarital', init: ['ي', 'Y'], me: ['يوسف', 'Yousef'], age: 20,
      pick: ['يوسف · حامل للصفة، والخطيبة لم تُفحص', 'Yousef · carrier, fiancée not yet tested'],
      role: ['حامل للصفة · نتيجة ريم لم تصل بعد', 'Carrier · Reem’s result not in yet'], partner: 'unknown', ped: 'fam0427' },
    couple: { code: 'FAM-0427', cond: 'bthal', entry: 'premarital', init: ['ي ر', 'Y R'], me: ['يوسف وريم', 'Yousef & Reem'], age: 20,
      pick: ['يوسف وريم · كلاهما حامل للصفة', 'Yousef & Reem · both carriers'],
      role: ['كلاكما يحمل الصفة', 'You both carry the trait'], partner: 'carrier', ped: 'fam0427' },
    newborn: { code: 'FAM-0533', cond: 'scd', entry: 'newborn', init: ['هـ ف', 'H F'], me: ['هند وفيصل', 'Hind & Faisal'],
      pick: ['هند وفيصل · نتيجة مولودتهما سارة', 'Hind & Faisal · baby Sara’s result'],
      role: ['والدا المولودة سارة (9 أيام)', 'Parents of baby Sara (9 days)'], partner: 'unknown', ped: 'fam0533' },
    relative: { code: 'CASE-1182', cond: 'bthal', entry: 'invite', init: ['ع', 'A'], me: ['عبدالله', 'Abdullah'], age: 24,
      pick: ['عبدالله · قريب وصلته دعوة رسمية', 'Abdullah · relative who received an invitation'],
      role: ['وصلتك دعوة لفحص مجاني', 'You received a free-test invitation'], partner: 'unknown', ped: 'relfam' }
  };
  var ORDER = ['single', 'couple', 'newborn', 'relative'];
  var FAC = [['مركز صحي الصفا · جدة (افتراضي)', 'Al-Safa health centre · Jeddah (fictional)'], ['عيادة الفحص قبل الزواج · المستشفى العام (افتراضي)', 'Premarital clinic · General Hospital (fictional)'], ['عن بُعد · مستشفى صحة الافتراضي (محاكاة)', 'Remote · Seha Virtual Hospital (simulated)']];
  var SLOTS = [['الثلاثاء 21 أكتوبر', 'Tue 21 Oct', '09:30'], ['الأربعاء 22 أكتوبر', 'Wed 22 Oct', '11:00'], ['الخميس 23 أكتوبر', 'Thu 23 Oct', '08:15'], ['الأحد 26 أكتوبر', 'Sun 26 Oct', '10:00'], ['الاثنين 27 أكتوبر', 'Mon 27 Oct', '13:30']];
  var ATYPES = {
    partner: { ic: 'sample', t: ['فحص ريم (تعداد دم + فصل الهيموغلوبين)', 'Reem’s test (CBC + haemoglobin HPLC)'], d: ['يحسم نتيجة الشريكة', 'Settles your partner’s status'] },
    counsel: { ic: 'chat', t: ['جلسة استشارة وراثية', 'Genetic counselling session'], d: ['حضوريًا أو عن بُعد، مع مستشار وراثي', 'In person or remote, with a genetic counsellor'] },
    couple: { ic: 'users', t: ['جلسة استشارة مشتركة لكما', 'Joint counselling for you both'], d: ['لمناقشة الخيارات معًا', 'To go through the options together'] },
    lama: { ic: 'sample', t: ['فحص لما (عبر والديك)', 'Lama’s test (through your parents)'], d: ['يحجزه وليّ أمرها', 'Booked by her guardian'] },
    parents: { ic: 'sample', t: ['فحص الوالدين (هند وفيصل)', 'Parents’ test (Hind & Faisal)'], d: ['لمعرفة أيّكما يحمل الصفة', 'To learn which of you carries the trait'] },
    omar: { ic: 'sample', t: ['فحص عمر (4 سنوات)', 'Omar’s test (4 years)'], d: ['اختياري، يُناقش مع طبيب الأطفال', 'Optional, discussed with the paediatrician'] },
    confirm: { ic: 'sample', t: ['فحص الدعوة المجاني (تعداد دم + فصل الهيموغلوبين)', 'Your free invitation test (CBC + haemoglobin HPLC)'], d: ['يستغرق دقائق، والنتيجة لك وحدك', 'Takes minutes; the result is yours alone'] }
  };
  /* premarital conditions: the partner is already tested in the same premarital request, so no separate booking or invitation */
  var APPT_FOR = { single: ['counsel'], couple: ['couple', 'counsel'], newborn: ['parents', 'counsel', 'omar'], relative: ['confirm', 'counsel'] };

  /* pedigrees: x,y centre; st = car | aff | clear | unk; inv = can be invited */
  var PED = {
    fam0427: { w: 900, h: 430,
      n: {
        gf: { s: 'm', x: 470, y: 60, st: 'unk', nm: ['الجد', 'Grandfather'], sb: ['لأبيك', 'paternal'] },
        gm: { s: 'f', x: 570, y: 60, st: 'unk', nm: ['الجدة', 'Grandmother'], sb: ['لأبيك', 'paternal'] },
        fa: { s: 'm', x: 230, y: 190, st: 'car', nm: ['الأب', 'Father'], sb: ['حامل حتمًا', 'obligate carrier'] },
        mo: { s: 'f', x: 350, y: 190, st: 'car', nm: ['الأم', 'Mother'], sb: ['حاملة حتمًا', 'obligate carrier'] },
        un: { s: 'm', x: 690, y: 190, st: 'unk', nm: ['العم', 'Uncle'], sb: ['لم يُفحص', 'untested'], ch: ['احتمال 1 من 2', '1 in 2 chance'], inv: 1 },
        au: { s: 'f', x: 810, y: 190, st: 'unk', nm: ['زوجة العم', 'Uncle’s wife'], sb: ['من خارج العائلة', 'not related'] },
        br: { s: 'm', x: 110, y: 330, st: 'clear', nm: ['خالد', 'Khalid'], sb: ['فُحص · غير حامل', 'tested · not a carrier'] },
        no: { s: 'f', x: 210, y: 330, st: 'aff', nm: ['نورة · 15', 'Noura · 15'], sb: ['مصابة', 'affected'] },
        la: { s: 'f', x: 310, y: 330, st: 'unk', nm: ['لما · 6', 'Lama · 6'], sb: ['لم تُفحص', 'untested'], ch: ['احتمال 2 من 3', '2 in 3 chance'], inv: 1 },
        yo: { s: 'm', x: 420, y: 330, st: 'car', pb: 1, nm: ['يوسف · 20', 'Yousef · 20'], sb: ['حامل للصفة', 'carrier'] },
        re: { s: 'f', x: 530, y: 330, st: 'unk', nm: ['ريم', 'Reem'], sb: ['الخطيبة · لم تُعرف', 'fiancée · unknown'], inv: 1 },
        co: { s: 'm', x: 750, y: 330, st: 'unk', nm: ['عبدالله · 24', 'Abdullah · 24'], sb: ['ابن العم · لم يُفحص', 'cousin · untested'], ch: ['احتمال 1 من 4', '1 in 4 chance'], inv: 1 }
      },
      cp: [['gf', 'gm'], ['fa', 'mo', 1], ['un', 'au'], ['yo', 're']],
      sib: [{ p: ['gf', 'gm'], y: 125, c: ['fa', 'un'] }, { p: ['fa', 'mo'], y: 280, c: ['br', 'no', 'la', 'yo'] }, { p: ['un', 'au'], y: 280, c: ['co'] }],
      inv: ['re', 'la', 'un', 'co'] },
    fam0533: { w: 760, h: 330,
      n: {
        fs: { s: 'm', x: 320, y: 70, st: 'unk', nm: ['فيصل · 31', 'Faisal · 31'], sb: ['لم يُفحص بعد', 'not yet tested'] },
        hi: { s: 'f', x: 460, y: 70, st: 'unk', nm: ['هند · 29', 'Hind · 29'], sb: ['لم تُفحص بعد', 'not yet tested'] },
        om: { s: 'm', x: 320, y: 220, st: 'unk', nm: ['عمر · 4', 'Omar · 4'], sb: ['لم يُفحص', 'untested'], ch: ['يتضح بعد فحص الوالدين', 'clearer after your tests'] },
        sa: { s: 'f', x: 460, y: 220, st: 'car', pb: 1, nm: ['سارة · 9 أيام', 'Sara · 9 days'], sb: ['حاملة للصفة', 'carrier (trait)'] },
        fsib: { s: 'grp', x: 130, y: 70, st: 'unk', nm: ['إخوة فيصل', 'Faisal’s siblings'], sb: ['لم يُفحصوا', 'untested'], ch: ['1 من 2 إن كان فيصل حاملًا', '1 in 2 if Faisal carries it'], inv: 1 },
        hsib: { s: 'grp', x: 650, y: 70, st: 'unk', nm: ['إخوة هند', 'Hind’s siblings'], sb: ['لم يُفحصوا', 'untested'], ch: ['1 من 2 إن كانت هند حاملة', '1 in 2 if Hind carries it'], inv: 1 }
      },
      cp: [['fs', 'hi']], sib: [{ p: ['fs', 'hi'], y: 160, c: ['om', 'sa'] }], inv: ['fsib', 'hsib'] },
    relfam: { w: 760, h: 330,
      n: {
        rf: { s: 'm', x: 300, y: 70, st: 'unk', nm: ['الأب', 'Father'], sb: ['لم يُفحص', 'untested'] },
        rm: { s: 'f', x: 460, y: 70, st: 'unk', nm: ['الأم', 'Mother'], sb: ['لم تُفحص', 'untested'], inv: 0 },
        ab: { s: 'm', x: 300, y: 220, st: 'car', pb: 1, nm: ['عبدالله · 24', 'Abdullah · 24'], sb: ['حامل للصفة', 'carrier'] },
        ma: { s: 'f', x: 460, y: 220, st: 'unk', nm: ['مها · 19', 'Maha · 19'], sb: ['الأخت · لم تُفحص', 'sister · untested'], ch: ['احتمال 1 من 2', '1 in 2 chance'], inv: 1 },
        par: { s: 'grp', x: 620, y: 70, st: 'unk', nm: ['والداك', 'Your parents'], sb: ['لمعرفة من نقلها', 'to learn who passed it on'], inv: 1, hide: 1 }
      },
      cp: [['rf', 'rm']], sib: [{ p: ['rf', 'rm'], y: 160, c: ['ab', 'ma'] }], inv: ['ma', 'par'] }
  };
  /* patient-facing family view: roles only. Relatives' names, ages and results are never shown here;
     the full pedigree lives in the clinician and authority views. */
  var FAMV = {
    fam0427: { me: ['أنت', 'You'],
      top: [['الأب', 'Father', 1], ['الأم', 'Mother', 1]],
      mid: [['الإخوة والأخوات', 'Brothers and sisters', 1]],
      partner: ['خطيبتك', 'Your fiancée'],
      low: [['الأعمام والعمات وأبناؤهم', 'Paternal aunts, uncles and cousins', 1], ['الأخوال والخالات وأبناؤهم', 'Maternal aunts, uncles and cousins', 1]],
      groups: [
        ['family', 'والداك', 'Your parents', 'ورثتَ الصفة من أحدهما على الأقل.', 'You inherited the trait from at least one of them.'],
        ['users', 'إخوتك وأخواتك', 'Your brothers and sisters', 'قد يحمل بعضهم الصفة. ومن كان دون 18 عامًا تصل دعوته إلى وليّ أمره.', 'Some of them may carry the trait. For anyone under 18, the invitation goes to their guardian.'],
        ['layers', 'العائلة الممتدة', 'Your wider family', 'الأعمام والعمات والأخوال والخالات وأبناؤهم: قد يحمل بعضهم الصفة أيضًا.', 'Aunts, uncles and cousins on both sides may also carry the trait.']] },
    fam0533: { me: ['أنتما', 'You (both parents)'],
      top: [],
      mid: [['سارة', 'Sara', 0, 'car'], ['أبناؤكما الآخرون', 'Your other children', 1]],
      partner: null,
      low: [['إخوة الأب وأخواته', 'Father’s brothers and sisters', 1], ['إخوة الأم وأخواتها', 'Mother’s brothers and sisters', 1]],
      groups: [
        ['family', 'أنتما', 'The two of you', 'أحدكما على الأقل يحمل الصفة. فحصكما هو الخطوة الأولى.', 'At least one of you carries the trait. Testing both of you is the first step.', 'book'],
        ['users', 'أبناؤكما الآخرون', 'Your other children', 'قد يحملون الصفة. فحصهم قرار يعود إليكما.', 'They may carry the trait. Testing them is your decision.', 'none'],
        ['layers', 'إخوتكما وأخواتكما', 'Your brothers and sisters', 'من جهة الأب ومن جهة الأم: قد يحمل بعضهم الصفة.', 'On both sides of the family, some may carry the trait.']] },
    relfam: { me: ['أنت', 'You'],
      top: [['الأب', 'Father', 1], ['الأم', 'Mother', 1]],
      mid: [['الإخوة والأخوات', 'Brothers and sisters', 1]],
      partner: null,
      low: [['العائلة الممتدة', 'Wider family', 1]],
      groups: [
        ['family', 'والداك', 'Your parents', 'ورثتَ الصفة من أحدهما. فحصهما يوضّح من أي جهة جاءت.', 'You inherited the trait from one of them. Testing them shows which side it came from.'],
        ['users', 'إخوتك وأخواتك', 'Your brothers and sisters', 'قد يحمل بعضهم الصفة.', 'Some of them may carry the trait.'],
        ['layers', 'العائلة الممتدة', 'Your wider family', 'من جهة الصفة: قد يحمل بعضهم الصفة أيضًا.', 'On the side the trait came from, some may carry it too.']] }
  };
  var REL_INFO = {
    re: { rel: ['خطيبتك', 'Your fiancée'], to: ['ريم', 'Reem'] },
    la: { rel: ['أختك (6 سنوات) · عبر والديك', 'Your sister (6) · through your parents'], to: ['وليّ أمر لما', 'Lama’s guardian'] },
    un: { rel: ['عمّك', 'Your uncle'], to: ['العم', 'Uncle'] },
    co: { rel: ['ابن عمّك', 'Your cousin'], to: ['عبدالله', 'Abdullah'] },
    fsib: { rel: ['إخوة فيصل وأخواته', 'Faisal’s brothers and sisters'], to: ['إخوة فيصل', 'Faisal’s siblings'] },
    hsib: { rel: ['إخوة هند وأخواتها', 'Hind’s brothers and sisters'], to: ['إخوة هند', 'Hind’s siblings'] },
    ma: { rel: ['أختك', 'Your sister'], to: ['مها', 'Maha'] },
    par: { rel: ['والداك', 'Your parents'], to: ['الوالدان', 'Your parents'] }
  };

  /* ---------------- state ---------------- */
  function freshPersona(p) {
    return { resultSeen: false, sess: { step: 0, partner: P[p].partner, done: false, informed: null, q: null },
      choices: {}, drafts: {}, sel: null, appts: p === 'couple' ? [{ t: 'couple', f: 0, s: 2, rem: true }] : [],
      book: { t: null, f: 0, s: null }, cons: { share: true, stats: true, remind: true, contact: true }, confirm: null, reqs: {},
      chat: null, chatDraft: '', stage: 0 };
  }
  var st;
  function reset() { st = { signed: false, nafath: 0, persona: 'single', view: 'home', sheet: null, sheetTab: 'chat', ps: {} }; }
  reset();
  function ps() { if (!st.ps[st.persona]) st.ps[st.persona] = freshPersona(st.persona); return st.ps[st.persona]; }
  function per() { return P[st.persona]; }
  function cond() { return COND[per().cond]; }
  function T(a) { return L(a[0], a[1]); }
  function isRel() { return st.persona === 'relative'; }
  function hasResult() { return !isRel() || ps().stage >= 2; }

  /* ---------------- shell ---------------- */
  var NAV = [
    ['home', 'home', 'الرئيسية', 'Home'], ['result', 'report', 'نتيجتي', 'My result'], ['session', 'chat', 'جلسة الاستشارة', 'Counselling'],
    ['family', 'family', 'أسرتي', 'My family'], ['appts', 'calendar', 'المواعيد', 'Appointments'], ['docs', 'book', 'المستندات', 'Documents'], ['privacy', 'privacy', 'الخصوصية والموافقات', 'Privacy & consent']
  ];
  function topbar() {
    return '<header class="p-top" data-theme="dark"><div class="in">' +
      '<a class="p-brand" href="index.html"><img src="assets/logo/simat-symbol-small-primary.svg" alt="SIMAT · سمات" width="16" height="36">' +
      '<span class="t"><b>' + L('بوابة المستفيد', 'My SIMAT') + '</b><small>' + L('سمات · منصة الاستشارة الوراثية', 'SIMAT · genetic counselling platform') + '</small></span></a>' +
      '<span class="sp"></span>' +
      '<a class="lnk" href="index.html">' + icon('home') + '<span class="lt">' + L('الموقع', 'Website') + '</span></a>' +
      '<button type="button" class="lang-btn" data-lang-toggle>' + icon('globe') + L('English', 'العربية') + '</button>' +
      (st.signed ? '<button type="button" class="btn btn-sm btn-primary ask-top hide-p" data-a="ask">' + icon('phone') + L('تحدّث مع مستشار', 'Talk to a counsellor') + '</button>' : '') +
      '</div></header>';
  }
  function demoStrip() {
    var opts = ORDER.map(function (k) {
      return '<option value="' + k + '"' + (k === st.persona ? ' selected' : '') + '>' + esc(P[k].pick[S.lang() === 'en' ? 1 : 0]) + '</option>';
    }).join('');
    return '<div class="p-demo"><div class="in"><span class="honest">' + icon('alert') + L('<b>نموذج عرض</b> · أسرة افتراضية · لا يُرسل شيء', '<b>Demo</b> · fictional family · nothing is sent') + '</span>' +
      '<span class="ctl"><label class="sr-only" for="persona">' + L('الشخصية', 'Persona') + '</label><select id="persona" data-a="persona">' + opts + '</select>' +
      '<button type="button" data-a="reset">' + icon('refresh') + L('إعادة ضبط', 'Reset') + '</button><button type="button" data-tour-start="here">' + icon('play') + L('جولة إرشادية', 'Guided tour') + '</button></span></div></div>';
  }
  function sideNav() {
    var p = per();
    return '<aside class="p-side"><div class="p-who"><span class="hex">' + T(p.init) + '</span><div><div class="nm">' + T(p.me) + '</div><div class="rl">' + T(p.role) + '</div></div></div>' +
      '<nav class="p-nav" aria-label="Portal">' + NAV.map(function (n) {
        return '<button type="button" data-a="go" data-v="' + n[0] + '"' + (st.view === n[0] ? ' aria-current="page"' : '') + '>' + icon(n[1]) + L(n[2], n[3]) + (dotFor(n[0]) ? '<span class="dot" aria-hidden="true"></span>' : '') + '</button>';
      }).join('') + '</nav>' +
      '<div class="p-side-help"><p>' + L('لديك سؤال؟ مستشار وراثي بشري متاح في كل خطوة.', 'A question? A human genetic counsellor is available at every step.') + '</p>' +
      '<button type="button" class="btn btn-sm btn-primary" data-a="ask">' + icon('phone') + L('تحدّث مع مستشار', 'Talk to a counsellor') + '</button>' +
      '<button type="button" class="btn btn-sm" data-a="signout">' + icon('logout') + L('تسجيل الخروج', 'Sign out') + '</button></div></aside>';
  }
  function dotFor(v) {
    var s = ps();
    if (v === 'result') return hasResult() && !s.resultSeen;
    if (v === 'session') return hasResult() && !s.sess.done;
    if (v === 'appts') return isRel() && s.stage === 0;
    return false;
  }
  function tabbar() {
    var items = [['home', 'home', 'الرئيسية', 'Home'], ['result', 'report', 'نتيجتي', 'Result'], ['session', 'chat', 'الاستشارة', 'Session'], ['family', 'family', 'أسرتي', 'Family'], ['more', 'dots', 'المزيد', 'More']];
    var moreViews = { appts: 1, docs: 1, privacy: 1, more: 1 };
    return '<nav class="tabbar" aria-label="Portal">' + items.map(function (n) {
      var cur = n[0] === 'more' ? moreViews[st.view] : st.view === n[0];
      return '<button type="button" data-a="go" data-v="' + n[0] + '"' + (cur ? ' aria-current="page"' : '') + '>' + icon(n[1]) + L(n[2], n[3]) + '</button>';
    }).join('') + '</nav>' +
      '<button type="button" class="fab" data-a="ask">' + icon('phone') + L('تحدّث مع مستشار', 'Talk to a counsellor') + '</button>';
  }
  function head(ar, en, subAr, subEn) {
    return '<div class="p-h"><span class="cond">' + L('الحالة:', 'Condition:') + ' <b>' + T(cond().name) + '</b> · <span class="mono">' + per().code + '</span></span>' +
      '<h1>' + L(ar, en) + '</h1>' + (subAr ? '<p>' + L(subAr, subEn) + '</p>' : '') + '</div>';
  }

  /* ---------------- sign-in ---------------- */
  function signin() {
    var pers = ORDER.map(function (k) {
      return '<button type="button" data-a="pickp" data-v="' + k + '" aria-pressed="' + (st.persona === k) + '"><b>' + T(P[k].me) + '</b><small>' + T(P[k].role) + '</small></button>';
    }).join('');
    var form;
    if (st.nafath === 0) {
      form = '<div class="field"><label for="nid">' + L('رقم الهوية الوطنية / الإقامة', 'National ID / Iqama number') + '</label>' +
        '<input class="input ltr" id="nid" inputmode="numeric" autocomplete="off" data-ph-ar="1xxxxxxxxx (للعرض فقط)" data-ph-en="1xxxxxxxxx (demo only)"></div>' +
        '<button type="button" class="btn btn-primary" data-a="nafath">' + icon('lock') + L('الدخول عبر نفاذ (محاكاة)', 'Sign in with Nafath (simulated)') + '</button>';
    } else {
      form = '<div class="nafath"><span class="hex">47</span><div><b>' + L('افتح تطبيق نفاذ واختر الرقم 47', 'Open the Nafath app and choose 47') + '</b><p class="t-small muted">' + L('هذه خطوة محاكاة، لا اتصال بنفاذ.', 'This step is simulated; there is no connection to Nafath.') + '</p></div></div>' +
        '<button type="button" class="btn btn-primary" data-a="approve">' + icon('check') + L('تمت الموافقة (محاكاة)', 'Approved (simulated)') + '</button>' +
        '<button type="button" class="btn btn-link" data-a="nafathback">' + L('رجوع', 'Back') + '</button>';
    }
    return '<main id="main" class="signin"><div class="card2">' +
      '<div class="art"><img src="assets/img/hero-cluster-light.webp" alt="" class="float slow"><p class="cap">' + L('نتيجتك، بلغتك، وقرارك لك.', 'Your result, in your language. Your decision stays yours.') + '</p></div>' +
      '<div class="form"><img class="logo" src="assets/logo/simat-ar-light.svg" alt="سمات" width="140" height="79" data-l lang="ar"><img class="logo" src="assets/logo/simat-lockup-horizontal-light.svg" alt="SIMAT" width="220" height="63" data-l lang="en" style="width:220px">' +
      '<div class="stack-sm"><h1 class="t-h2">' + L('الدخول إلى بوابة المستفيد', 'Sign in to My SIMAT') + '</h1><p class="muted">' + L('اختر الشخصية التي تريد استعراض المنصة بها، ثم ادخل.', 'Choose whose experience to explore, then sign in.') + '</p></div>' +
      '<div class="personas" role="group" aria-label="Persona">' + pers + '</div>' + form + '</div></div></main>';
  }

  /* ---------------- views ---------------- */
  function resultCard() {
    var p = st.persona, c = cond();
    if (isRel() && ps().stage < 2) {
      return '<div class="res-card" data-theme="dark"><span class="lbl">' + icon('letter').replace('<svg', '<svg style="width:16px;height:16px"') + L('دعوة رسمية · الجهة الصحية في منطقتك (محاكاة)', 'Official invitation · your regional health authority (simulated)') + '</span>' +
        '<div class="verdict">' + L('دعوة لفحص دم <em>مجاني</em>', 'An invitation for a <em>free</em> blood test') + '</div>' +
        '<p>' + L('تبيّن أن صفة وراثية في الدم موجودة في عائلتك الممتدة. الدعوة لا تذكر اسم أحد، ونتيجتك ستكون لك وحدك.', 'A blood trait that runs in families has been found in your extended family. The invitation names no one, and your result will be yours alone.') + '</p>' +
        '<div class="row">' + (ps().stage === 0 ? '<button type="button" class="btn btn-primary" data-a="go" data-v="appts">' + icon('calendar') + L('احجز فحصك', 'Book your test') + '</button>' :
          '<span class="tag">' + icon('clock').replace('<svg', '<svg style="width:14px;height:14px"') + L('الفحص محجوز', 'Test booked') + '</span><button type="button" class="btn" data-a="advance">' + icon('fastfwd') + L('تقديم الوقت 18 يومًا (للعرض)', 'Advance 18 days (demo)') + '</button>') +
        '<button type="button" class="btn" data-a="go" data-v="docs">' + L('اقرأ الدعوة', 'Read the invitation') + '</button></div></div>';
    }
    var verdict = p === 'couple' ? L('كلاكما <em>حامل</em> ل' + c.trait[0], 'You both <em>carry</em> the ' + c.trait[1].replace(' trait', '') + ' trait')
      : p === 'newborn' ? L('سارة <em>حاملة</em> ل' + c.trait[0], 'Sara <em>carries</em> the ' + c.trait[1].toLowerCase())
      : L('أنت <em>حامل</em> ل' + c.trait[0], 'You <em>carry</em> the ' + c.trait[1]);
    var src = p === 'newborn' ? L('فحص حديثي الولادة · 10 أكتوبر 2026', 'Newborn screening · 10 Oct 2026') : isRel() ? L('فحص الدعوة · 8 نوفمبر 2026', 'Invitation test · 8 Nov 2026') : L('الفحص قبل الزواج · 12 أكتوبر 2026', 'Premarital screening · 12 Oct 2026');
    return '<div class="res-card" data-theme="dark"><span class="lbl">' + src + ' · <span class="tag">' + L('ليست مرضًا', 'Not a disease') + '</span></span>' +
      '<div class="verdict">' + verdict + '</div>' +
      '<p>' + (p === 'newborn' ? L('سارة سليمة. ورثت نسخة واحدة متغيّرة من أحدكما على الأقل، وهذا يفتح سؤالًا مهمًا لكما ولعائلتيكما.', 'Sara is healthy. She inherited one changed copy from at least one of you, which raises an important question for you and your families.')
        : p === 'couple' ? L('كلاكما سليم. لكن لأن كليكما يحمل الصفة، فهناك احتمال في كل حمل أن يرث الطفل نسختين. جلسة الاستشارة تشرح ذلك وتعرض كل الخيارات.', 'You are both healthy. Because you both carry it, each pregnancy has a chance of the child inheriting two copies. The counselling session explains this and lays out every option.')
          : L('أنت سليم، والصفة لا تتحول إلى مرض. معرفتها مهمة لأبنائك في المستقبل ولأقاربك.', 'You are healthy, and the trait does not turn into disease. Knowing it matters for your future children and for your relatives.')) + '</p>' +
      '<div class="row"><button type="button" class="btn btn-primary" data-a="go" data-v="result">' + L('افهم نتيجتك', 'Understand your result') + '</button><button type="button" class="btn" data-a="go" data-v="session">' + L('ابدأ جلسة الاستشارة', 'Start the counselling session') + '</button></div></div>';
  }
  function checklist() {
    var s = ps(), p = st.persona, anyChoice = !!s.famSeen;
    var booked = function (t) { return s.appts.some(function (a) { return a.t === t; }); };
    var items;
    if (p === 'relative') items = [
      [true, 'وصلتك الدعوة', 'Invitation received'], [s.stage >= 1, 'احجز الفحص المجاني', 'Book the free test'], [s.stage >= 2, 'استلم نتيجتك الخاصة', 'Receive your private result'],
      [s.sess.done, 'جلسة الاستشارة', 'Counselling session'], [anyChoice, 'اعرف من يُدعى من أسرتك', 'See who in your family is invited']];
    else if (p === 'newborn') items = [
      [true, 'وصلت نتيجة سارة', 'Sara’s result received'], [s.resultSeen, 'افهم النتيجة', 'Understand the result'], [s.sess.done, 'جلسة الاستشارة', 'Counselling session'],
      [booked('parents'), 'فحص الوالدين', 'Test both parents'], [anyChoice, 'اعرفا من يُدعى من العائلتين', 'See who in both families is invited']];
    else items = [
      [true, 'وصلت النتيجة', 'Result received'], [s.resultSeen, 'افهم نتيجتك', 'Understand your result'], [s.sess.done, 'جلسة الاستشارة', 'Counselling session'],
      [p === 'couple' || s.sess.partner !== 'unknown', p === 'couple' ? 'نتيجتا الطرفين معروفتان' : 'نتيجة ريم (ضمن فحص ما قبل الزواج)', p === 'couple' ? 'Both results known' : 'Reem’s result (from the premarital screening)'],
      [anyChoice, 'اعرف من يُدعى من أسرتك', 'See who in your family is invited'], [s.appts.length > 0, 'موعد متابعة', 'A follow-up appointment']];
    var done = items.filter(function (i) { return i[0]; }).length;
    return '<section class="panel"><h2>' + icon('flow') + L('خطواتك التالية', 'Your next steps') + '<span class="chip ok" style="margin-inline-start:auto">' + done + ' / ' + items.length + '</span></h2><ol class="steps">' +
      items.map(function (i, k) { return '<li class="' + (i[0] ? 'done' : '') + '"><span class="mk">' + (i[0] ? icon('check') : (k + 1)) + '</span><span class="tx"><b>' + L(i[1], i[2]) + '</b></span>' + (i[0] ? '<span class="chip ok">' + L('تم', 'Done') + '</span>' : '') + '</li>'; }).join('') + '</ol></section>';
  }
  function famSummary() {
    var s = ps();
    if (isRel() && s.stage < 2) return '<section class="panel"><h2>' + icon('family') + L('أسرتي', 'My family') + '</h2><p class="empty">' + L('تظهر هنا بعد نتيجتك.', 'This appears after your result.') + '</p></section>';
    return '<section class="panel"><h2>' + icon('family') + L('أسرتي', 'My family') + '</h2><p class="sub">' + L('أقاربك المعنيّون تصلهم دعوة رسمية لفحص مجاني، لا تذكر اسمك ولا أنك أجريت فحصًا.', 'Relatives who are concerned receive an official invitation for a free test that never mentions you or that you were tested.') + '</p>' +
      '<div class="row"><button type="button" class="btn btn-sm" data-a="go" data-v="family">' + L('اعرف من يُدعى', 'See who is invited') + icon('arrow', 'flip-rtl') + '</button></div></section>';
  }
  function apptList(compact) {
    var s = ps();
    if (!s.appts.length) return '<p class="empty">' + L('لا مواعيد بعد.', 'No appointments yet.') + '</p>';
    return s.appts.map(function (a, i) {
      var t = ATYPES[a.t], sl = SLOTS[a.s];
      return '<div class="lrow"><span class="ic2">' + icon(t.ic) + '</span><span class="tx"><b>' + T(t.t) + '</b><small>' + L(sl[0], sl[1]) + ' · <span class="ltr">' + sl[2] + '</span> · ' + T(FAC[a.f]) + '</small></span>' +
        (compact ? '<span class="chip ok">' + L('محجوز', 'Booked') + '</span>' : '<span class="row" style="gap:8px"><span class="t-cap">' + L('تذكير', 'Reminder') + '</span><button type="button" class="toggle" role="switch" aria-checked="' + a.rem + '" data-a="rem" data-v="' + i + '" data-aria-ar="تذكير" data-aria-en="Reminder" aria-label="Reminder"></button><button type="button" class="btn btn-sm btn-link" data-a="cancel" data-v="' + i + '">' + L('إلغاء', 'Cancel') + '</button></span>') + '</div>';
    }).join('');
  }
  function notes() {
    var p = st.persona, n;
    if (p === 'relative') n = [['letter', 'وصلتك دعوة رسمية لفحص مجاني', 'You received an official free-test invitation', 'قبل 3 أيام', '3 days ago']];
    else if (p === 'newborn') n = [['report', 'نتيجة فحص حديثي الولادة لسارة جاهزة', 'Sara’s newborn screening result is ready', 'قبل يومين', '2 days ago'], ['chat', 'جلسة الاستشارة متاحة لكما بالعربية', 'Your counselling session is available in Arabic', 'قبل يومين', '2 days ago']];
    else n = [['report', 'نتيجة الفحص قبل الزواج جاهزة', 'Your premarital screening result is ready', 'قبل 7 أيام', '7 days ago'],
      p === 'couple' ? ['users', 'نتيجة ريم جاهزة وشاركتها معك', 'Reem’s result is ready and she shared it with you', 'قبل 5 أيام', '5 days ago'] : ['clock', 'نتيجة ريم قيد المعالجة', 'Reem’s result is in progress', 'اليوم', 'today']];
    return n.map(function (x) { return '<div class="lrow"><span class="ic2">' + icon(x[0]) + '</span><span class="tx"><b>' + L(x[1], x[2]) + '</b><small>' + L(x[3], x[4]) + '</small></span></div>'; }).join('');
  }
  function vHome() {
    var greet = L('أهلًا ' + per().me[0], 'Welcome, ' + per().me[1]);
    return '<div class="p-h"><span class="cond">' + L('الحالة:', 'Condition:') + ' <b>' + T(cond().name) + '</b> · <span class="mono">' + per().code + '</span></span><h1>' + greet + '</h1></div>' +
      resultCard() + '<div class="p-grid">' + checklist() + '<div class="stack" style="gap:20px">' + famSummary() +
      '<section class="panel"><h2>' + icon('calendar') + L('مواعيدي', 'My appointments') + '</h2>' + apptList(true) + '<div class="row"><button type="button" class="btn btn-sm" data-a="go" data-v="appts">' + L('احجز موعدًا', 'Book an appointment') + '</button></div></section></div>' +
      '<section class="panel span-2"><h2>' + icon('bell') + L('الإشعارات', 'Notifications') + '</h2>' + notes() + '</section></div>';
  }

  function labRows() {
    var p = st.persona;
    if (p === 'newborn') return [['Newborn Hb pattern (HPLC)', 'FAS', 'FA', 'H']];
    if (p === 'couple') return [['Yousef · HbA2', '5.2 %', '2.0–3.5', 'H'], ['Yousef · MCV', '64.2 fL', '80–100', 'L'], ['Yousef · HbS', '0 %', '0', ''], ['Reem · HbA2', '4.9 %', '2.0–3.5', 'H'], ['Reem · MCV', '67 fL', '80–100', 'L'], ['Reem · HbS', '0 %', '0', '']];
    if (p === 'relative') return [['HbA2', '5.0 %', '2.0–3.5', 'H'], ['HbF', '0.6 %', '< 2.0', ''], ['MCV', '66 fL', '80–100', 'L'], ['MCH', '21.0 pg', '27–32', 'L'], ['HbS', 'not detected', '—', '']];
    return [['Hb', '11.8 g/dL', '13.5–17.5', 'L'], ['RBC', '6.00 ×10¹²/L', '4.5–5.9', 'H'], ['MCV', '64.2 fL', '80–100', 'L'], ['MCH', '19.8 pg', '27–32', 'L'], ['Ferritin', '88 ng/mL', '30–400', ''], ['HbA2', '5.2 %', '2.0–3.5', 'H'], ['HbF', '1.4 %', '< 2.0', ''], ['HbS', '0 %', '0', '']];
  }
  function vResult() {
    if (!hasResult()) return head('نتيجتي', 'My result', 'لا توجد نتيجة بعد. احجز فحص الدعوة المجاني، وستظهر نتيجتك هنا لك وحدك.', 'No result yet. Book your free invitation test and your result will appear here, for you alone.') +
      '<section class="panel"><div class="row"><button type="button" class="btn btn-primary" data-a="go" data-v="appts">' + icon('calendar') + L('احجز فحصك', 'Book your test') + '</button>' + (ps().stage === 1 ? '<button type="button" class="btn" data-a="advance">' + icon('fastfwd') + L('تقديم الوقت 18 يومًا (للعرض)', 'Advance 18 days (demo)') + '</button>' : '') + '</div></section>';
    var c = cond(), nb = st.persona === 'newborn';
    /* plain language first: one-line summary, then short, single-idea lines; gene names stay in the lab details */
    var sum = nb ? ['سارة سليمة. هي تحمل الصفة فقط، وهذا يعني أن أحدكما على الأقل يحملها.', 'Sara is healthy. She only carries the trait, which means at least one of you carries it too.']
      : ['أنت سليم. تحمل صفة وراثية لا تؤثر في صحتك، لكنها قد تنتقل إلى أبنائك.', 'You are healthy. You carry a genetic trait that does not affect your health, but it can pass to your children.'];
    var means = nb ? [['سارة سليمة، ولا تحتاج إلى أي علاج بسبب الصفة.', 'Sara is healthy and needs no treatment for the trait.'], ['ورثت الصفة من أحدكما على الأقل.', 'She inherited the trait from at least one of you.'], ['فحصكما يوضّح الاحتمالات في أي حمل قادم.', 'Testing both of you shows the chances for any future pregnancy.']]
      : [['ورثت نسخة متغيّرة من جين واحد من أحد والديك، ونسخة سليمة من الآخر.', 'You inherited one changed copy of a gene from one parent and a typical copy from the other.'], ['صحتك طبيعية، ولا تحتاج إلى أي علاج.', 'Your health is normal and you need no treatment.'], ['يمكن أن تنقل النسخة المتغيّرة إلى أبنائك.', 'You can pass the changed copy to your children.']]
        .concat(per().cond === 'scd' ? [] : [['قد تظهر كريات دمك أصغر من المعتاد في التحاليل. هذا طبيعي مع الصفة، وقد يُظن خطأً أنه نقص حديد.', 'Your red blood cells may look smaller than usual on tests. This is normal with the trait, and can be mistaken for iron deficiency.']]);
    var not = nb ? [['ليست فقر الدم المنجلي (المرض).', 'It is not sickle cell disease.'], ['لن تتحول إلى مرض مع العمر.', 'It will not turn into a disease as she grows.'], ['مضاعفاتها نادرة جدًا، ويمكن مناقشتها مع طبيب الأطفال.', 'Complications are very rare and can be discussed with her paediatrician.']]
      : [['ليست مرضًا، ولن تصبح مرضًا مع الوقت.', 'It is not a disease and will not become one.'], ['لا تنتقل بالعدوى.', 'It is not contagious.'], ['لا تعني أن أبناءك سيمرضون. يحدث ذلك فقط إذا كان الطرف الآخر حاملًا أيضًا، وحتى حينها يكون الاحتمال 1 من 4 في كل حمل.', 'It does not mean your children will be ill. That can only happen if the other parent also carries a trait, and even then the chance is 1 in 4 in each pregnancy.']]
        .concat(per().cond === 'scd' ? [] : [['لا تحتاج إلى حبوب الحديد إلا إذا أثبت التحليل نقصه.', 'You do not need iron tablets unless a test shows you are low.']]);
    var rows = labRows().map(function (r) { return '<tr><td>' + r[0] + '</td><td class="mono' + (r[3] ? ' flag' : '') + '">' + r[1] + (r[3] ? ' (' + r[3] + ')' : '') + '</td><td class="mono">' + r[2] + '</td></tr>'; }).join('');
    return head('نتيجتي', 'My result', nb ? 'نتيجة فحص حديثي الولادة لسارة، مشروحة بلغة بسيطة.' : 'نتيجتك مشروحة بلغة بسيطة، والتفاصيل المخبرية متاحة إن أردتها.', nb ? 'Sara’s newborn screening result, explained in plain language.' : 'Your result in plain language, with the lab details if you want them.') +
      '<section class="panel"><dl class="kv"><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + T(c.name) + '</dd><dt>' + L('النتيجة', 'Result') + '</dt><dd>' + L('حامل ل' + c.trait[0], c.trait[1] + ' (carrier)') + '</dd>' +
      '<dt>' + L('المصدر', 'Source') + '</dt><dd>' + (nb ? L('برنامج فحص حديثي الولادة', 'Newborn Screening Program') : isRel() ? L('فحص الدعوة', 'Invitation test') : L('برنامج الزواج الصحي', 'Healthy Marriage Program')) + '</dd>' +
      '<dt>' + L('الدليل السريري', 'Clinical rulebook') + '</dt><dd class="mono">' + c.rulebook + '</dd></dl>' +
      '<p class="mean-sum">' + L(sum[0], sum[1]) + '</p>' +
      '<div class="mean"><div><h3>' + icon('check') + L('ما يعنيه هذا', 'What this means') + '</h3><ul class="bp">' + means.map(function (m) { return '<li>' + L(m[0], m[1]) + '</li>'; }).join('') + '</ul></div>' +
      '<div><h3>' + icon('x') + L('ما لا يعنيه', 'What it does not mean') + '</h3><ul class="bp">' + not.map(function (m) { return '<li>' + L(m[0], m[1]) + '</li>'; }).join('') + '</ul></div></div>' +
      '<details class="more"><summary>' + L('التفاصيل المخبرية', 'Lab details') + icon('chev') + '</summary><div class="body"><div class="table-wrap" style="border-radius:0"><table class="labtbl"><thead><tr><th>Test</th><th>Result</th><th>Reference</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="t-cap">' + L('قيم توضيحية لأسرة افتراضية. المرجع المخبري الفعلي يحدده مختبر الفحص.', 'Illustrative values for a fictional family. The real reference ranges come from the screening lab.') + '</p></div></details>' +
      '<div class="row"><button type="button" class="btn btn-primary" data-a="go" data-v="session">' + L('ابدأ جلسة الاستشارة', 'Start the counselling session') + icon('arrow', 'flip-rtl') + '</button></div></section>';
  }

  /* ---------- counselling session ---------- */
  var STEPS = [['ما تعنيه النتيجة', 'What it means'], ['كيف تُورَّث', 'How it is inherited'], ['خياراتك', 'Your options'], ['أسئلتك', 'Your questions'], ['الملخص', 'Summary']];
  function names() {
    var p = st.persona;
    if (p === 'newborn') return { a: ['الوالد الحامل', 'Carrier parent'], b: ['الوالد الآخر', 'Other parent'], opts: [['لم يُفحص بعد', 'Not tested yet'], ['حامل أيضًا', 'Also a carrier'], ['غير حامل', 'Not a carrier']] };
    if (p === 'relative') return { a: ['أنت', 'You'], b: ['شريكة المستقبل', 'Future partner'], opts: [['غير معروفة', 'Unknown'], ['حاملة للصفة', 'A carrier'], ['غير حاملة', 'Not a carrier']] };
    return { a: ['يوسف', 'Yousef'], b: ['ريم', 'Reem'], opts: [['لم تُعرف بعد', 'Not known yet'], ['حاملة للصفة', 'A carrier'], ['غير حاملة', 'Not a carrier']] };
  }
  function allele(k) { return k === 'c' ? '<i class="c"></i>' : k === 'q' ? '<i class="q"></i>' : '<i></i>'; }
  function punnettGrid() {
    var s = ps(), pt = s.sess.partner, nm = names(), A = ['t', 'c'], B = pt === 'carrier' ? ['t', 'c'] : pt === 'non' ? ['t', 't'] : ['q', 'q'];
    var hdr = function (k) { return '<div class="hd"><span class="alle">' + allele(k) + '</span>' + (k === 'c' ? L('متغيّرة', 'changed') : k === 'q' ? L('؟', '?') : L('سليمة', 'typical')) + '</div>'; };
    var cells = '';
    A.forEach(function (a) {
      cells += hdr(a);
      B.forEach(function (b) {
        var cls, lab;
        if (b === 'q') { cls = 'unk'; lab = L('غير معروف', 'unknown'); }
        else { var n = (a === 'c') + (b === 'c'); cls = n === 2 ? 'aff' : n === 1 ? 'car' : ''; lab = n === 2 ? L('مصاب', 'affected') : n === 1 ? L('حامل سليم', 'healthy carrier') : L('غير حامل', 'not a carrier'); }
        cells += '<div class="cell ' + cls + '"><span class="alle">' + allele(a) + allele(b) + '</span><span class="lab">' + lab + '</span></div>';
      });
    });
    var grid = '<div class="punnett" role="img" aria-label="Punnett square"><div class="corner">' + T(nm.a) + ' ↓<br>' + T(nm.b) + ' →</div>' + hdr(B[0]) + hdr(B[1]) + cells + '</div>';
    return '<div class="punnett-detail">' + grid + '<div class="legend"><span><span class="alle"><i></i></span>' + L('نسخة سليمة', 'typical copy') + '</span><span><span class="alle"><i class="c"></i></span>' + L('نسخة متغيّرة', 'changed copy') + '</span><span><span class="alle"><i class="q"></i></span>' + L('غير معروفة', 'unknown') + '</span></div></div>';
  }
  /* plain-language view: four equally likely children, then one sentence that answers "will my child be ill?" */
  function kid(kind) {
    var col = kind === 'aff' ? '#B4532A' : kind === 'unk' ? '#A9B8A3' : '#2E6B1F';
    var dot = kind === 'car' ? '<circle cx="36" cy="18" r="7" fill="#EFBF04" stroke="#fff" stroke-width="2"/>' : '';
    var q = kind === 'unk' ? '<text x="24" y="54" text-anchor="middle" font-size="20" font-weight="700" fill="#fff" font-family="IBM Plex Sans, sans-serif">?</text>' : '';
    var lab = { non: L('سليم ولا يحمل الصفة', 'Healthy, does not carry it'), car: L('سليم ويحمل الصفة', 'Healthy, carries the trait'), aff: L('مصاب بالمرض', 'Has the disease'), unk: L('غير معروف بعد', 'Not known yet') }[kind];
    return '<div class="kid ' + kind + '"><svg viewBox="0 0 48 60" width="58" height="72" aria-hidden="true"><circle cx="24" cy="15" r="10" fill="' + col + '"/><path d="M8 58c0-14 7-24 16-24s16 10 16 24z" fill="' + col + '"/>' + q + dot + '</svg><span>' + lab + '</span></div>';
  }
  function punnett() {
    var s = ps(), pt = s.sess.partner, nm = names(), other = nm.b[0], otherEn = nm.b[1];
    var kids = pt === 'carrier' ? ['non', 'car', 'car', 'aff'] : pt === 'non' ? ['non', 'non', 'car', 'car'] : ['unk', 'unk', 'unk', 'unk'];
    var answer, sub;
    if (pt === 'carrier') { answer = L('في كل حمل: احتمال واحد من كل 4 أن يُصاب الطفل بالمرض.', 'In each pregnancy: a 1 in 4 chance that the child has the disease.'); sub = L('واحتمالان من 4 أن يكون سليمًا ويحمل الصفة، واحتمال واحد من 4 أن يكون سليمًا ولا يحملها.', 'A 2 in 4 chance the child is healthy but carries the trait, and a 1 in 4 chance the child is healthy and does not carry it.'); }
    else if (pt === 'non') { answer = L('لن يُصاب أي طفل بالمرض.', 'No child will have the disease.'); sub = L('قد يحمل بعض الأطفال الصفة مثل الوالد الحامل، وهم أصحاء تمامًا.', 'Some children may carry the trait like the carrier parent, and they are completely healthy.'); }
    else { answer = L('لا يمكن أن نعرف بعد. الجواب يعتمد على نتيجة ' + other + '.', 'We cannot know yet. The answer depends on ' + otherEn + '’s result.'); sub = ''; }
    var unknownBox = pt === 'unknown' ? '<div class="ifs"><div class="if"><b>' + L('إذا كانت النتيجة: يحمل الصفة', 'If the result is: carries the trait') + '</b><span>' + L('احتمال واحد من 4 في كل حمل أن يُصاب الطفل.', 'A 1 in 4 chance in each pregnancy that the child has the disease.') + '</span></div><div class="if"><b>' + L('إذا كانت النتيجة: لا يحمل الصفة', 'If the result is: does not carry it') + '</b><span>' + L('لن يُصاب أي طفل بالمرض.', 'No child will have the disease.') + '</span></div></div>' +
      (st.persona === 'single' && cond().premarital ? '<p class="t-small" style="margin:0">' + icon('check') + ' ' + L('نتيجة ' + other + ' تصل ضمن فحص ما قبل الزواج نفسه، فلا حاجة إلى حجز أو دعوة منفصلة.', otherEn + '’s result comes from the same premarital screening, so no separate booking or invitation is needed.') + '</p>'
        : '<button type="button" class="btn btn-sm" data-a="bookt" data-v="' + (st.persona === 'newborn' ? 'parents' : 'counsel') + '">' + icon('calendar') + (st.persona === 'relative' ? L('ناقشه مع مستشار', 'Discuss with a counsellor') : L('احجز فحص الوالدين', 'Book the parents’ tests')) + '</button>') : '';
    return '<div class="stack-sm"><p class="muted">' + L('كل إنسان يحمل نسختين من الجين، ويعطي طفله نسخة واحدة منهما بالصدفة. لذلك تعتمد النتيجة على الوالدين معًا.', 'Everyone has two copies of the gene and passes one of them to each child, by chance. So the outcome depends on both parents.') + '</p>' +
      '<div class="row"><span class="t-small" style="font-weight:600">' + L('نتيجة ' + other + ':', otherEn + '’s result:') + '</span><div class="seg" role="group" aria-label="Partner status">' + ['unknown', 'carrier', 'non'].map(function (k, i) { return '<button type="button" data-a="partner" data-v="' + k + '" aria-pressed="' + (pt === k) + '">' + T(nm.opts[i]) + '</button>'; }).join('') + '</div></div></div>' +
      '<div class="punnett-wrap kidsview"><div class="answer ' + pt + '"><p class="big">' + answer + '</p>' + (sub ? '<p class="sub">' + sub + '</p>' : '') + unknownBox + '</div>' +
      '<div class="kids-box"><p class="t-small" style="font-weight:600">' + (pt === 'unknown' ? L('في كل حمل:', 'In each pregnancy:') : L('في كل حمل، 4 احتمالات متساوية:', 'In each pregnancy, 4 equally likely outcomes:')) + '</p><div class="kids">' + kids.map(kid).join('') + '</div>' +
      '<p class="t-cap">' + L('الاحتمال نفسه في كل حمل، ولا يتأثر بالأطفال السابقين.', 'The chance is the same in every pregnancy and does not depend on earlier children.') + '</p></div></div>' +
      '<details class="more"><summary>' + L('لمن يريد التفاصيل: كيف تنتقل نسخ الجين', 'For the curious: how the gene copies are passed on') + icon('chev') + '</summary><div class="body">' + punnettGrid() + '</div></details>';
  }
  function options() {
    var pt = ps().sess.partner, pre = st.persona === 'single' || st.persona === 'couple' || st.persona === 'relative', o;
    if (pt === 'carrier') {
      o = [['heart', 'المتابعة الطبية للحمل', 'Medical follow-up in pregnancy', 'متابعة الحمل مع الطبيب، وفحص المولود بعد الولادة ضمن برنامج حديثي الولادة.', 'Pregnancy care with your doctor, and testing the baby after birth through newborn screening.'],
        ['sample', 'الفحص الوراثي للأجنة مع أطفال الأنابيب', 'Embryo testing with IVF (PGT)', 'فحص الأجنة قبل إرجاعها إلى الرحم. يُناقش مع طبيب الإخصاب: الإجراءات والتكلفة والنتائج المتوقعة.', 'Testing embryos before transfer. Discuss the process, cost and expected results with a fertility physician.'],
        ['search', 'التشخيص أثناء الحمل', 'Diagnosis during pregnancy', 'فحص يُجرى في مرحلة مبكرة من الحمل لمعرفة حالة الجنين. ما يترتب عليه يُناقش مع الطبيب وفق الأنظمة المعمول بها في المملكة.', 'A test early in pregnancy to learn the baby’s status. What follows is discussed with your physician within Saudi regulations.'],
        ['book', 'التعرّف على العلاج والرعاية', 'Learning about treatment and care', 'نقل الدم المنتظم، وإزالة الحديد، وزراعة الخلايا الجذعية في حالات مختارة، والعلاج الجيني لمن هم 12 عامًا فأكثر.', 'Regular transfusion, iron chelation, stem-cell transplant in selected cases, and gene therapy from age 12.']];
      if (pre) o.push(['scale', 'إعادة النظر في إتمام الزواج', 'Reconsidering the marriage', 'بعض الأزواج يختارون ذلك وبعضهم لا. هو خيار من بين الخيارات، وليس توصية.', 'Some couples choose this and others do not. It is one option among several, not a recommendation.']);
      o.push(['clock', 'أخذ وقت قبل أي قرار', 'Taking time before deciding', 'لا يلزمك قرار الآن. يمكنك العودة إلى الجلسة أو التحدث مع مستشار متى أردت.', 'You do not need to decide now. Come back to the session or talk to a counsellor whenever you like.']);
    } else if (pt === 'non') {
      o = [['check', 'لا خطوات إضافية لصحة أطفالكما', 'No extra steps needed for your children’s health', 'لن يُصاب أي طفل بهذه الحالة من هذين الوالدين، وقد يحمل نصفهم الصفة تقريبًا.', 'No child of these parents will have this condition; about half may carry the trait.'],
        ['family', 'إبلاغ أقارب قد يحملون الصفة', 'Telling relatives who may carry it', 'أنت تقرّر من يُبلَّغ وكيف، أو لا أحد.', 'You decide who is told and how, or no one.'],
        ['chat', 'التحدث مع مستشار', 'Talking to a counsellor', 'لأي سؤال لم تجد له إجابة هنا.', 'For any question not answered here.']];
    } else {
      o = [['sample', st.persona === 'newborn' ? 'فحص الوالدين' : 'انتظار نتيجة الطرف الآخر أو حجز فحصه', st.persona === 'newborn' ? 'Testing both parents' : 'Waiting for, or booking, the other test', 'نتيجة الطرف الآخر تحسم الاحتمالات.', 'The other result settles the chances.'],
        ['users', 'مشاركة نتيجتك مع الطرف الآخر', 'Sharing your result with the other person', 'قرارك. يمكن لسمات أن تعدّ ملخصًا يمكنك مشاركته.', 'Your call. SIMAT can prepare a summary you can share.'],
        ['family', 'إبلاغ أقارب قد يحملون الصفة', 'Telling relatives who may carry it', 'أنت تقرّر من يُبلَّغ وكيف، أو لا أحد.', 'You decide who is told and how, or no one.'],
        ['chat', 'التحدث مع مستشار', 'Talking to a counsellor', 'قبل أي خطوة، إن أردت.', 'Before any step, if you wish.']];
    }
    return '<p class="muted">' + L('الخيارات مرتبة دون أفضلية. لا نوصي بأي منها، والقرار لك.', 'Options are listed in no order of preference. We recommend none of them; the decision is yours.') + '</p>' +
      '<div class="opts">' + o.map(function (x) { return '<div class="opt"><h3>' + icon(x[0]) + L(x[1], x[2]) + '</h3><p>' + L(x[3], x[4]) + '</p></div>'; }).join('') + '</div>' +
      '<div class="note">' + icon('mosque') + '<p>' + L('ناقش الجوانب الطبية مع طبيبك. أما أسئلة الأحكام الشرعية فتُعرض على العلماء وجهات الفتوى المعتمدة.', 'Discuss the medical side with your physician. Questions about religious rulings go to qualified scholars and recognised fatwa bodies.') + '</p></div>';
  }
  var QS = {
    bthal: [
      ['ill', 'هل سأمرض؟', 'Will I become ill?', 'لا. صفة الحمل لا تتحول إلى مرض، ولا تحتاج إلى علاج. يعيش حاملو الصفة حياة طبيعية.', 'No. Carrying the trait does not turn into disease and needs no treatment. Carriers live normal lives.'],
      ['odds', 'ماذا يعني «1 من 4»؟', 'What does “1 in 4” mean?', 'إذا كان الوالدان حاملين، ففي كل حمل احتمال 1 من 4 أن يُصاب الطفل. لا يعني ذلك أن طفلًا من كل أربعة سيُصاب بالضرورة.', 'If both parents are carriers, each pregnancy has a 1 in 4 chance of an affected child. It does not mean exactly one child in four will be affected.'],
      ['tell', 'هل يجب أن أخبر أحدًا؟', 'Do I have to tell anyone?', 'لا يلزمك ذلك. أسرتك قد تستفيد من المعرفة، وسمات تتيح لك طرقًا آمنة لا تكشف اسمك إن أردت.', 'You do not have to. Your family may benefit from knowing, and SIMAT gives you safe ways that need not reveal your name.'],
      ['iron', 'هل أحتاج إلى حبوب الحديد؟', 'Do I need iron tablets?', 'ليس بسبب الصفة. صِغر كريات الدم عند الحامل لا يعني نقص الحديد، فلا تتناوله إلا إذا أكّد الطبيب نقصه.', 'Not because of the trait. Small red cells in a carrier do not mean low iron, so take it only if a doctor confirms you are low.'],
      ['treat', 'هل يمكن علاج الثلاسيميا؟', 'Can thalassaemia be treated?', 'تُعالج بنقل الدم المنتظم وأدوية إزالة الحديد، وبزراعة الخلايا الجذعية في حالات مختارة، وبالعلاج الجيني لمن هم 12 عامًا فأكثر وفق شروط. يشرح ذلك طبيب أمراض الدم.', 'It is treated with regular transfusion and iron chelation, stem-cell transplant in selected cases, and gene therapy from age 12 under set criteria. A haematologist explains the details.'],
      ['rel', 'ما الحكم الشرعي في …؟', 'What is the religious ruling on…?', '', '']],
    scd: [
      ['ill', 'هل ابنتنا مريضة؟', 'Is our daughter ill?', 'لا. سارة تحمل الصفة فقط، وهي سليمة ولا تحتاج إلى علاج بسببها.', 'No. Sara only carries the trait; she is healthy and needs no treatment for it.'],
      ['follow', 'هل تحتاج إلى متابعة؟', 'Does she need follow-up?', 'لا تحتاج الصفة إلى متابعة خاصة. أخبروا طبيب الأطفال، واحتفظوا بالنتيجة في سجلها، فستفيدها مستقبلًا.', 'The trait needs no special follow-up. Tell her paediatrician and keep the result in her record; it will matter to her later in life.'],
      ['next', 'ماذا عن حمل قادم؟', 'What about a future pregnancy?', 'يعتمد على نتيجتي فحصكما. إن كنتما حاملين فاحتمال إصابة كل حمل 1 من 4.', 'It depends on both your results. If you both carry it, each pregnancy has a 1 in 4 chance of an affected child.'],
      ['who', 'أيّنا يحمل الصفة؟', 'Which of us carries it?', 'لا يمكن معرفة ذلك إلا بفحص بسيط لكل منكما.', 'Only a simple blood test for each of you can tell.'],
      ['rel', 'ما الحكم الشرعي في …؟', 'What is the religious ruling on…?', '', '']]
  };
  function questions() {
    var s = ps(), qs = QS[per().cond], cur = qs.filter(function (q) { return q[0] === s.sess.q; })[0], ans = '';
    if (cur && cur[0] === 'rel') ans = '<div class="answer scholar"><span class="who">' + icon('mosque') + L('إحالة إلى أهل العلم', 'Referral to scholars') + '</span><p>' + L('هذا سؤال شرعي، ولا تجيب عنه سمات. نقترح عرضه على عالم موثوق أو جهة فتوى معتمدة. يمكن للمستشار الوراثي أن يشرح لك الجوانب الطبية التي يحتاجها العالِم لفهم سؤالك.', 'This is a religious question, and SIMAT does not answer it. We suggest asking a trusted scholar or a recognised fatwa body. A genetic counsellor can explain the medical facts the scholar may need.') + '</p></div>';
    else if (cur) ans = '<div class="answer"><span class="who">' + icon('book') + L('محتوى الجلسة', 'Session content') + '</span><p>' + L(cur[3], cur[4]) + '</p></div>';
    return '<p class="muted">' + L('اختر سؤالًا، أو تحدّث مع مستشار بشري.', 'Pick a question, or talk to a human counsellor.') + '</p>' +
      '<div class="qchips" role="group" aria-label="Questions">' + qs.map(function (q) { return '<button type="button" data-a="q" data-v="' + q[0] + '" aria-pressed="' + (s.sess.q === q[0]) + '">' + L(q[1], q[2]) + '</button>'; }).join('') + '</div>' + ans +
      '<div class="row"><button type="button" class="btn btn-sm" data-a="ask">' + icon('phone') + L('سؤالي ليس هنا · تحدّث مع مستشار', 'My question is not here · talk to a counsellor') + '</button></div>';
  }
  function summary() {
    var s = ps(), pt = s.sess.partner, nm = names(), c = cond();
    var pts = [
      st.persona === 'newborn' ? ['سارة تحمل ' + c.trait[0] + '، وهي سليمة.', 'Sara carries the ' + c.trait[1].toLowerCase() + ' and is healthy.'] : ['أنت تحمل ' + c.trait[0] + '، وأنت سليم.', 'You carry the ' + c.trait[1] + ' and you are healthy.'],
      pt === 'carrier' ? ['الطرفان حاملان: في كل حمل احتمال 1 من 4 للإصابة.', 'Both are carriers: each pregnancy has a 1 in 4 chance of an affected child.'] : pt === 'non' ? ['الطرف الآخر غير حامل: لن يُصاب أي طفل بهذه الحالة.', 'The other parent is not a carrier: no child will have this condition.'] : ['حالة ' + nm.b[0] + ' غير معروفة بعد، والفحص يحسمها.', nm.b[1] + '’s status is not known yet; a test will settle it.'],
      ['اطّلعت على الخيارات المتاحة، والقرار لك.', 'You have seen the available options, and the decision is yours.'],
      ['يمكنك التحدث مع مستشار وراثي بشري في أي وقت.', 'You can talk to a human genetic counsellor at any time.']];
    var inf = [['ready', 'فهمت، وأشعر أني مستعد للتفكير في قراري', 'I understand and feel ready to think about my decision'], ['some', 'فهمت بعض الأمور، وأود الحديث مع مستشار', 'I understand some of it and would like to talk to a counsellor'], ['time', 'أحتاج إلى وقت أكثر', 'I need more time']];
    return '<ul class="bp">' + pts.map(function (p) { return '<li>' + L(p[0], p[1]) + '</li>'; }).join('') + '</ul>' +
      '<div class="stack-sm"><h3 class="t-h3" style="font-size:18px">' + L('إلى أي مدى تشعر أنك فهمت؟', 'How informed do you feel?') + '</h3><p class="t-small muted">' + L('نسجّل مستوى فهمك فقط، ولا نسجّل قرارك أبدًا إلا إن اخترت مشاركته.', 'We record only how informed you feel, never your decision unless you choose to share it.') + '</p>' +
      '<div class="radio-cards" role="radiogroup">' + inf.map(function (x) { return '<button type="button" role="radio" data-a="informed" data-v="' + x[0] + '" aria-checked="' + (s.sess.informed === x[0]) + '"><span class="r"></span>' + L(x[1], x[2]) + '</button>'; }).join('') + '</div></div>';
  }
  function vSession() {
    if (!hasResult()) return head('جلسة الاستشارة', 'Counselling session', 'تبدأ الجلسة بعد صدور نتيجتك.', 'The session opens once your result is in.') + '<section class="panel"><button type="button" class="btn btn-primary" data-a="go" data-v="appts">' + L('احجز فحصك', 'Book your test') + '</button></section>';
    var s = ps(), k = s.sess.step;
    var stepper = '<div class="stepper" role="tablist">' + STEPS.map(function (x, i) {
      var cls = i === k ? 'cur' : (i < k || s.sess.done) ? 'done' : '';
      return '<button type="button" role="tab" aria-selected="' + (i === k) + '" class="' + cls + '" data-a="step" data-v="' + i + '"><span class="hx">' + (cls === 'done' ? icon('check') : (i + 1)) + '</span><span class="lbl">' + T(x) + '</span></button>';
    }).join('') + '</div>';
    var body = [vMeans, punnett, options, questions, summary][k]();
    var prev = k > 0 ? '<button type="button" class="btn" data-a="step" data-v="' + (k - 1) + '">' + icon('arrow', 'flip-rtl').replace('<svg', '<svg style="transform:scaleX(-1)"') + L('السابق', 'Back') + '</button>' : '<span></span>';
    var next = k < 4 ? '<button type="button" class="btn btn-primary" data-a="step" data-v="' + (k + 1) + '">' + L('التالي', 'Next') + icon('arrow', 'flip-rtl') + '</button>'
      : '<button type="button" class="btn btn-primary" data-a="finish"' + (s.sess.informed ? '' : ' disabled') + '>' + icon('check') + L('إنهاء الجلسة', 'Finish the session') + '</button>';
    return head('جلسة الاستشارة الوراثية', 'Genetic counselling session', 'جلسة بالعربية في خمس خطوات. يمكنك التوقف والعودة متى شئت، ومستشار بشري متاح في كل خطوة.', 'A five-step session. Stop and come back whenever you like; a human counsellor is available at every step.') +
      '<section class="panel">' + stepper + '<h2 style="margin-top:6px">' + T(STEPS[k]) + '</h2>' + body + '<div class="sess-foot">' + prev + next + '</div>' +
      '<p class="review-note">' + icon('alert') + L('محتوى توضيحي للعرض، بانتظار مراجعة مستشار وراثي معتمد.', 'Demonstration content, pending review by a certified genetic counsellor.') + '</p></section>';
  }
  function vMeans() {
    var c = cond(), p = st.persona;
    var lead = p === 'newborn' ? L('لدى سارة نسخة واحدة متغيّرة من جين الهيموغلوبين ونسخة سليمة. هذا ما يُسمّى «' + c.trait[0] + '».', 'Sara has one changed copy of the haemoglobin gene and one typical copy. This is called the “' + c.trait[1].toLowerCase() + '”.')
      : p === 'couple' ? L('لدى كل منكما نسخة واحدة متغيّرة من جين ' + c.gene + ' ونسخة سليمة. كلاكما سليم، لكن كلًّا منكما قد يمرّر النسخة المتغيّرة.', 'Each of you has one changed copy of the ' + c.gene + ' gene and one typical copy. You are both healthy, but each of you can pass the changed copy on.')
        : L('لديك نسخة واحدة متغيّرة من جين ' + c.gene + ' ونسخة سليمة. هذا ما يُسمّى «' + c.trait[0] + '» أو «حامل للصفة».', 'You have one changed copy of the ' + c.gene + ' gene and one typical copy. This is called the “' + c.trait[1] + '” or being a carrier.');
    return '<p>' + lead + '</p><div class="mean"><div><h3>' + icon('check') + L('الحامل للصفة', 'A carrier') + '</h3><ul class="bp"><li>' + L('سليم ولا يحتاج إلى علاج', 'Is healthy and needs no treatment') + '</li><li>' + L('لديه نسخة متغيّرة واحدة', 'Has one changed copy') + '</li><li>' + L('قد يمرّر النسخة لأبنائه', 'May pass the copy to children') + '</li></ul></div>' +
      '<div><h3>' + icon('alert') + L('المصاب بالمرض', 'Someone with the disease') + '</h3><ul class="bp"><li>' + L('لديه نسختان متغيّرتان، واحدة من كل والد', 'Has two changed copies, one from each parent') + '</li><li>' + L('يحتاج إلى رعاية طبية منتظمة', 'Needs regular medical care') + '</li><li>' + L('يحدث فقط إذا كان الوالدان حاملين', 'Happens only when both parents are carriers') + '</li></ul></div></div>';
  }

  /* ---------- family ---------- */
  function ln(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; }
  function txt(x, y, cls, a) { return '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="middle" direction="rtl" data-l lang="ar">' + esc(a[0]) + '</text><text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="middle" data-l lang="en">' + esc(a[1]) + '</text>'; }
  function nodeState(id, n) {
    var s = ps();
    if (id === 're' && st.persona === 'couple') return { st: 'car', sb: ['الخطيبة · حاملة للصفة', 'fiancée · carrier'] };
    return { st: n.st, sb: n.sb };
  }
  function pedigree() {
    var d = PED[per().ped], N = d.n, g = '', nodes = '', s = ps();
    d.cp.forEach(function (c) {
      var a = N[c[0]], b = N[c[1]], x1 = a.x + 22, x2 = b.x - 22;
      if (c[2]) { g += ln(x1, a.y - 3, x2, a.y - 3) + ln(x1, a.y + 3, x2, a.y + 3); nodes += txt((a.x + b.x) / 2, a.y - 12, 'sb', ['أبناء عمومة', '1st cousins']); }
      else g += ln(x1, a.y, x2, a.y);
    });
    d.sib.forEach(function (sb) {
      var a = N[sb.p[0]], b = N[sb.p[1]], mx = (a.x + b.x) / 2, xs = sb.c.map(function (id) { return N[id].x; });
      g += ln(mx, a.y + 3, mx, sb.y) + ln(Math.min.apply(null, xs.concat(mx)), sb.y, Math.max.apply(null, xs.concat(mx)), sb.y);
      xs.forEach(function (x, i) { g += ln(x, sb.y, x, N[sb.c[i]].y - 20); });
    });
    Object.keys(N).forEach(function (id) {
      var n = N[id]; if (n.hide) return;
      var ns = nodeState(id, n), x = n.x, y = n.y, fill = ns.st === 'aff' ? 'var(--genome-green)' : 'var(--surface-raised)', sym;
      if (n.s === 'm') sym = '<rect x="' + (x - 20) + '" y="' + (y - 20) + '" width="40" height="40" style="fill:' + fill + '"/>';
      else if (n.s === 'f') sym = '<circle cx="' + x + '" cy="' + y + '" r="20" style="fill:' + fill + '"/>';
      else sym = '<path d="M' + x + ' ' + (y - 22) + ' L' + (x + 22) + ' ' + y + ' L' + x + ' ' + (y + 22) + ' L' + (x - 22) + ' ' + y + 'Z" style="fill:' + fill + '"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" class="sb" style="fill:var(--ink)">n</text>';
      var dot = ns.st === 'car' ? '<circle cx="' + x + '" cy="' + y + '" r="5.5" style="fill:var(--genome-green);stroke:none"/>' : '';
      var pb = n.pb ? '<g style="stroke:var(--teal-ink);fill:var(--teal-ink)"><line x1="' + (x - 48) + '" y1="' + (y + 36) + '" x2="' + (x - 27) + '" y2="' + (y + 17) + '"/><path d="M' + (x - 24) + ' ' + (y + 14) + ' l-11 2 l7 7z" style="stroke:none"/><text x="' + (x - 52) + '" y="' + (y + 36) + '" style="stroke:none;font-size:12px;font-weight:600" text-anchor="end">P</text></g>' : '';
      var inv = d.inv.indexOf(id) >= 0, sel = s.sel === id;
      var ring = n.s === 'f' ? '<circle class="sel" cx="' + x + '" cy="' + y + '" r="28" style="fill:none;stroke:none"/>' : '<rect class="sel" x="' + (x - 28) + '" y="' + (y - 28) + '" width="56" height="56" rx="6" style="fill:none;stroke:none"/>';
      var lbl = txt(x, y + 40, 'nm', n.nm) + txt(x, y + 57, 'sb', ns.sb) + (n.ch && ns.st === 'unk' ? txt(x, y + 74, 'ch', n.ch) : '');
      var open = inv ? '<g class="node' + (sel ? ' selected' : '') + '" tabindex="0" role="button" data-a="sel" data-v="' + id + '" aria-label="' + esc(n.nm[1]) + '">' : '<g>';
      nodes += open + (inv ? '<rect x="' + (x - 56) + '" y="' + (y - 30) + '" width="112" height="112" style="fill:transparent;stroke:none"/>' : '') + ring + '<g style="stroke:var(--ink);stroke-width:2.5">' + sym + '</g>' + dot + pb + lbl + '</g>';
    });
    return '<div class="ped-wrap" dir="ltr"><svg class="ped" viewBox="0 0 ' + d.w + ' ' + d.h + '" role="img" aria-label="Family pedigree"><g style="stroke:var(--ink);stroke-width:2.5;stroke-linecap:round;fill:none">' + g + '</g>' + nodes + '</svg></div>';
  }
  function pedKey() {
    var k = function (svg, a, e) { return '<span><svg viewBox="0 0 20 20" aria-hidden="true">' + svg + '</svg>' + L(a, e) + '</span>'; };
    return '<div class="ped-key">' + k('<rect x="3" y="3" width="14" height="14" style="fill:none;stroke:var(--ink);stroke-width:2"/>', 'ذكر', 'male') + k('<circle cx="10" cy="10" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/>', 'أنثى', 'female') +
      k('<circle cx="10" cy="10" r="7" style="fill:var(--genome-green);stroke:var(--ink);stroke-width:2"/>', 'مصاب', 'affected') + k('<circle cx="10" cy="10" r="7" style="fill:none;stroke:var(--ink);stroke-width:2"/><circle cx="10" cy="10" r="2.5" style="fill:var(--genome-green)"/>', 'حامل للصفة', 'carrier') +
      k('<line x1="2" y1="7" x2="18" y2="7" style="stroke:var(--ink);stroke-width:2"/><line x1="2" y1="13" x2="18" y2="13" style="stroke:var(--ink);stroke-width:2"/>', 'زواج أقارب', 'consanguineous') + k('<line x1="3" y1="17" x2="14" y2="6" style="stroke:var(--teal-ink);stroke-width:2"/><path d="M16 4 l-6 1 l4 4z" style="fill:var(--teal-ink)"/>', 'صاحب النتيجة', 'person tested first (proband)') + '</div>';
  }
  function letter(id) {
    var c = cond(), info = REL_INFO[id], minor = id === 'la', partner = id === 're';
    var to = minor ? L('إلى وليّ أمر الطفلة', 'To the child’s guardian') : partner ? L('إلى المستفيدة الكريمة', 'Dear recipient') : L('إلى المستفيد الكريم', 'Dear recipient');
    var body = partner ? L('يُتاح لكِ إجراء فحص دم بسيط ومجاني لمعرفة ما إذا كنتِ تحملين ' + c.trait[0] + '. معرفة ذلك تساعدكِ في اتخاذ قراراتك الصحية بوعي.', 'You can take a simple, free blood test to learn whether you carry the ' + c.trait[1] + '. Knowing helps you make informed health decisions.')
      : L('تبيّن من فحوصات حديثة أن صفة وراثية في الدم (' + c.trait[0] + ') موجودة في العائلة الممتدة. هذه الصفة لا تسبب مرضًا لمن يحملها، لكن معرفتها مهمة ' + (minor ? 'للطفلة ولمستقبلها' : 'لك ولأسرتك في المستقبل') + '. ندعو' + (minor ? 'كم لإجراء فحص بسيط ومجاني للطفلة' : 'ك لإجراء فحص دم بسيط ومجاني') + '، ويمكن الحجز عبر تطبيق صحتي.',
        'Recent tests show that a blood trait (' + c.trait[1] + ') runs in the extended family. It causes no illness in carriers, but knowing about it matters for ' + (minor ? 'the child’s future' : 'you and your family') + '. You are invited to a simple, free blood test' + (minor ? ' for the child' : '') + ', bookable through the Sehhaty app.');
    return '<div class="letter" dir="auto"><div class="lh"><b>' + L('دعوة لفحص دم مجاني', 'Invitation for a free blood test') + '</b><small>' + L('الجهة الصحية في منطقتك (محاكاة)', 'Your regional health authority (simulated)') + ' · <span class="mono">INV-' + (4100 + id.charCodeAt(0) * 7 % 900) + '</span></small></div>' +
      '<p>' + to + '،</p><p>' + body + '</p><p>' + L('لا تذكر هذه الرسالة اسم أي فرد من العائلة، وستكون النتيجة خاصة ب' + (minor ? 'الطفلة ووليّ أمرها' : (partner ? 'كِ' : 'ك')) + ' وحد' + (minor ? 'هما' : (partner ? 'كِ' : 'ك')) + '.', 'This letter does not name anyone in the family, and the result will be private to ' + (minor ? 'the child and guardian' : 'you') + ' alone.') + '</p>' +
      '<p class="ft">' + L('معاينة فقط. في النموذج التجريبي لا تُرسل أي دعوة.', 'Preview only. In this demo no invitation is sent.') + ' · ' + T(info.to) + '</p></div>';
  }
  function defaultDraft(id) {
    var c = cond();
    var d = {
      re: ['ريم، أرجو أن تكوني بخير. ظهرت نتيجة فحصي قبل الزواج، وتبيّن أنني أحمل ' + c.trait[0] + '. هي صفة لا تسبب مرضًا لي، لكن من المهم أن نعرف نتيجتك أيضًا لنفهم الاحتمالات معًا. يمكننا أن نتحدث مع مستشار وراثي معًا إن أردتِ.', 'Reem, I hope you are well. My premarital result shows I carry the ' + c.trait[1] + '. It does not make me ill, but it matters that we know your result too so we understand the chances together. We can talk to a genetic counsellor together if you like.'],
      la: ['أبي وأمي، قرأت عن نتيجتي وفهمت أن لما قد تحمل الصفة أيضًا. الفحص بسيط ومجاني، ومعرفته تفيدها مستقبلًا. القرار لكما، وأحببت أن أشارككما ما عرفت.', 'Dad, Mum, I learned from my result that Lama may carry the trait too. The test is simple and free, and knowing could help her later. It is your decision; I wanted to share what I learned.'],
      un: ['السلام عليكم يا عمي، أرجو أن تكون بخير. أجريت مؤخرًا فحص ما قبل الزواج، وتبيّن أنني أحمل ' + c.trait[0] + '. هي صفة وراثية لا تسبب مرضًا لمن يحملها، لكنها قد تكون موجودة لدى آخرين في العائلة. الفحص بسيط ومجاني عبر تطبيق صحتي. أحببت أن أخبرك لأن صحتك وصحة أبنائك تهمني.', 'Peace be upon you, Uncle. I recently had my premarital test and found I carry the ' + c.trait[1] + '. It is inherited and causes no illness in carriers, but others in the family may have it too. The test is simple and free through the Sehhaty app. I wanted you to know because your health and your children’s matter to me.'],
      co: ['أهلًا عبدالله، أتمنى أن تكون بخير. عرفت من فحص ما قبل الزواج أنني أحمل ' + c.trait[0] + '، وهي صفة وراثية قد تكون في العائلة. الفحص سهل ومجاني عبر صحتي، وأحببت أن تعرف قبل أن تُقدم على الزواج.', 'Hi Abdullah, hope you are well. My premarital test showed I carry the ' + c.trait[1] + ', which may run in the family. The test is easy and free through Sehhaty, and I wanted you to know before you marry.'],
      fsib: ['السلام عليكم، رُزقنا بسارة والحمد لله، وأظهر فحص المواليد أنها تحمل ' + c.trait[0] + '. هذا يعني أن أحدنا يحملها، وقد تكون موجودة لدى آخرين في العائلة. الفحص بسيط ومجاني.', 'Peace be upon you. We were blessed with Sara, and her newborn screening shows she carries the ' + c.trait[1].toLowerCase() + '. One of us carries it, and others in the family may too. The test is simple and free.'],
      hsib: ['السلام عليكم، رُزقنا بسارة والحمد لله، وأظهر فحص المواليد أنها تحمل ' + c.trait[0] + '. هذا يعني أن أحدنا يحملها، وقد تكون موجودة لدى آخرين في العائلة. الفحص بسيط ومجاني.', 'Peace be upon you. We were blessed with Sara, and her newborn screening shows she carries the ' + c.trait[1].toLowerCase() + '. One of us carries it, and others in the family may too. The test is simple and free.'],
      ma: ['مها، ظهرت نتيجة فحصي وتبيّن أنني أحمل ' + c.trait[0] + '. قد تحملينها أنتِ أيضًا، والفحص بسيط ومجاني. أخبرتك لأن ذلك يهمك قبل الزواج.', 'Maha, my test shows I carry the ' + c.trait[1] + '. You may carry it too, and the test is simple and free. I am telling you because it matters before marriage.'],
      par: ['أبي وأمي، تبيّن من فحصي أنني أحمل ' + c.trait[0] + '، وغالبًا ورثتها من أحدكما. الفحص بسيط ومجاني إن أحببتما أن تعرفا.', 'Dad, Mum, my test shows I carry the ' + c.trait[1] + ', most likely from one of you. The test is simple and free if you would like to know.']
    };
    return d[id];
  }
  function relCard(id) {
    var s = ps(), d = PED[per().ped], n = d.n[id], info = REL_INFO[id], ch = s.choices[id] || null, ns = nodeState(id, n);
    var chip = ch === 'official' ? '<span class="chip ok">' + icon('check') + L('دعوة رسمية مُعدّة', 'Official invitation prepared') + '</span>' : ch === 'own' ? '<span class="chip ok">' + icon('check') + L('رسالتك مُعدّة', 'Your message prepared') + '</span>' : ch === 'none' ? '<span class="chip">' + L('ليس الآن', 'Not now') + '</span>' : '<span class="chip dash">' + L('لم يُقرَّر', 'Undecided') + '</span>';
    var chance = n.ch && ns.st === 'unk' ? '<span class="chance">' + T(n.ch) + '</span>' : '<span class="chance">' + T(ns.sb) + '</span>';
    var m = function (k, ic, a, e, sa, se) { return '<button type="button" data-a="method" data-v="' + id + ':' + k + '" aria-pressed="' + (ch === k) + '">' + icon(ic) + '<span>' + L(a, e) + '</span><small>' + L(sa, se) + '</small></button>'; };
    var extra = '';
    if (ch === 'official') extra = letter(id);
    if (ch === 'own') {
      var dr = s.drafts[id] || defaultDraft(id);
      extra = '<div class="draft"><label class="t-small" style="font-weight:600" for="dr-' + id + '-' + S.lang() + '">' + L('رسالتك (عدّلها كما تشاء)', 'Your message (edit freely)') + '</label>' +
        '<div data-l lang="ar"><textarea dir="rtl" id="dr-' + id + '-ar" data-a="draft" data-v="' + id + ':0">' + esc(dr[0]) + '</textarea></div><div data-l lang="en"><textarea dir="ltr" id="dr-' + id + '-en" data-a="draft" data-v="' + id + ':1">' + esc(dr[1]) + '</textarea></div>' +
        '<div class="row"><button type="button" class="btn btn-sm" data-a="copy" data-v="' + id + '">' + icon('copy') + L('نسخ الرسالة', 'Copy message') + '</button><button type="button" class="btn btn-sm" data-a="wa" data-v="' + id + '">' + icon('send') + L('فتح واتساب (محاكاة)', 'Open WhatsApp (simulated)') + '</button></div>' +
        '<p class="t-cap">' + L('أنت من يرسل الرسالة. سمات لا تتواصل مع أقاربك نيابة عنك.', 'You send the message yourself. SIMAT never contacts your relatives for you.') + '</p></div>';
    }
    return '<article class="rel' + (s.sel === id ? ' selected' : '') + '" id="rel-' + id + '"><div class="rel-head"><div class="who"><b>' + T(n.nm) + '</b><small>' + T(info.rel) + '</small></div>' + chip + '</div>' + chance +
      '<div class="methods" role="group">' + m('official', 'letter', 'دعوة رسمية', 'Official invitation', 'من الجهة الصحية ولا تذكر اسمك', 'From the health authority; never names you') +
      m('own', 'message', 'رسالة منك', 'Your own message', 'تكتبها وترسلها بنفسك', 'You write and send it') + m('none', 'clock', 'ليس الآن', 'Not now', 'يمكنك العودة لاحقًا', 'You can come back later') + '</div>' + extra + '</article>';
  }
  /* patient-facing family tree: three generations, roles only (no names, ages or results of relatives).
     kinds: me = the person, inv = concerned and invited, base = shown for structure, partner = fiancée */
  var FTREE = {
    fam0427: { w: 1100, h: 400,
      n: [
        ['gp', 835, 50, 'أجدادك لأبيك', 'Father’s parents', '', '', 'base'],
        ['gm', 265, 50, 'أجدادك لأمك', 'Mother’s parents', '', '', 'base'],
        ['un', 990, 190, 'الأعمام والعمات', 'Aunts & uncles', 'إخوة أبيك', 'father’s side', 'inv'],
        ['fa', 680, 190, 'الأب', 'Father', '', '', 'inv'],
        ['mo', 420, 190, 'الأم', 'Mother', '', '', 'inv'],
        ['ma', 110, 190, 'الأخوال والخالات', 'Aunts & uncles', 'إخوة أمك', 'mother’s side', 'inv'],
        ['c1', 990, 335, 'أبناؤهم', 'Their children', 'أبناء عمومتك', 'your cousins', 'inv'],
        ['me', 640, 335, 'أنت', 'You', 'حامل للصفة', 'carrier', 'me'],
        ['sb', 460, 335, 'إخوتك وأخواتك', 'Your siblings', '', '', 'inv'],
        ['pt', 820, 335, 'خطيبتك', 'Your fiancée', 'ضمن فحص الزواج', 'premarital screening', 'partner'],
        ['c2', 110, 335, 'أبناؤهم', 'Their children', 'أبناء خؤولتك', 'your cousins', 'inv']],
      fam: [['gp', ['un', 'fa'], 120], ['gm', ['mo', 'ma'], 120], ['fa|mo', ['me', 'sb'], 265], ['un', ['c1'], 265], ['ma', ['c2'], 265]],
      mar: [['fa', 'mo'], ['me', 'pt']] },
    fam0533: { w: 1100, h: 400,
      n: [
        ['gp', 835, 50, 'أجداد سارة لأبيها', 'Father’s parents', '', '', 'base'],
        ['gm', 265, 50, 'أجداد سارة لأمها', 'Mother’s parents', '', '', 'base'],
        ['un', 990, 190, 'إخوة الأب وأخواته', 'Father’s siblings', '', '', 'inv'],
        ['fa', 680, 190, 'الأب', 'Father', 'أنتما', 'you', 'me'],
        ['mo', 420, 190, 'الأم', 'Mother', 'أنتما', 'you', 'me'],
        ['ma', 110, 190, 'إخوة الأم وأخواتها', 'Mother’s siblings', '', '', 'inv'],
        ['sa', 640, 335, 'سارة', 'Sara', 'تحمل الصفة', 'carries the trait', 'car'],
        ['sb', 460, 335, 'أبناؤكما الآخرون', 'Your other children', 'القرار لكما', 'your decision', 'inv']],
      fam: [['gp', ['un', 'fa'], 120], ['gm', ['mo', 'ma'], 120], ['fa|mo', ['sa', 'sb'], 265]],
      mar: [['fa', 'mo']] },
    relfam: { w: 1100, h: 400,
      n: [
        ['gp', 835, 50, 'أجدادك لأبيك', 'Father’s parents', '', '', 'base'],
        ['gm', 265, 50, 'أجدادك لأمك', 'Mother’s parents', '', '', 'base'],
        ['un', 990, 190, 'الأعمام والعمات', 'Aunts & uncles', 'إخوة أبيك', 'father’s side', 'inv'],
        ['fa', 680, 190, 'الأب', 'Father', '', '', 'inv'],
        ['mo', 420, 190, 'الأم', 'Mother', '', '', 'inv'],
        ['ma', 110, 190, 'الأخوال والخالات', 'Aunts & uncles', 'إخوة أمك', 'mother’s side', 'inv'],
        ['c1', 990, 335, 'أبناؤهم', 'Their children', 'أبناء عمومتك', 'your cousins', 'inv'],
        ['me', 640, 335, 'أنت', 'You', 'حامل للصفة', 'carrier', 'me'],
        ['sb', 460, 335, 'إخوتك وأخواتك', 'Your siblings', '', '', 'inv'],
        ['c2', 110, 335, 'أبناؤهم', 'Their children', 'أبناء خؤولتك', 'your cousins', 'inv']],
      fam: [['gp', ['un', 'fa'], 120], ['gm', ['mo', 'ma'], 120], ['fa|mo', ['me', 'sb'], 265], ['un', ['c1'], 265], ['ma', ['c2'], 265]],
      mar: [['fa', 'mo']] }
  };
  function famTree() {
    var d = FTREE[per().ped], ar = S.lang() === 'ar', W = 150, H = 62, N = {}, g = '', nodes = '';
    d.n.forEach(function (n) { N[n[0]] = { x: n[1], y: n[2] }; });
    var ln = function (x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>'; };
    d.mar.forEach(function (m) { var a = N[m[0]], b = N[m[1]], l = Math.min(a.x, b.x) + W / 2, r = Math.max(a.x, b.x) - W / 2; g += ln(l, a.y, r, a.y); });
    d.fam.forEach(function (f) {
      var src = f[0].split('|'), sx = src.length > 1 ? (N[src[0]].x + N[src[1]].x) / 2 : N[src[0]].x, sy = N[src[0]].y + (src.length > 1 ? 0 : H / 2), by = f[2];
      var xs = f[1].map(function (id) { return N[id].x; });
      g += ln(sx, sy, sx, by) + ln(Math.min.apply(null, xs.concat(sx)), by, Math.max.apply(null, xs.concat(sx)), by);
      f[1].forEach(function (id) { g += ln(N[id].x, by, N[id].x, N[id].y - H / 2); });
    });
    d.n.forEach(function (n) {
      var x = n[1] - W / 2, y = n[2] - H / 2, kind = n[7], t = ar ? n[3] : n[4], sub = ar ? n[5] : n[6];
      var fill = kind === 'me' ? '#103500' : kind === 'inv' ? '#FFFBEA' : kind === 'car' ? '#E3F4F2' : '#FFFFFF';
      var stroke = kind === 'me' ? '#103500' : kind === 'inv' ? '#E0BE3A' : kind === 'car' ? '#00717A' : '#C9D6C4';
      var tc = kind === 'me' ? '#FFFFFF' : '#103500', sc = kind === 'me' ? '#CFE3C7' : '#58714F';
      var glow = kind === 'me' ? '<rect x="' + (x - 7) + '" y="' + (y - 7) + '" width="' + (W + 14) + '" height="' + (H + 14) + '" rx="18" fill="#10350022"/>' : '';
      var dot = kind === 'inv' ? '<circle cx="' + (x + (ar ? 14 : W - 14)) + '" cy="' + (y + 14) + '" r="6" fill="#EFBF04" stroke="#fff" stroke-width="2"/>' : '';
      var dash = kind === 'partner' || kind === 'base' ? ' stroke-dasharray="6 5"' : '';
      nodes += glow + '<rect' + (kind === 'me' && !N._me ? (N._me = 1, ' class="fme"') : '') + ' x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="12" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"' + dash + '/>' + dot +
        '<text x="' + n[1] + '" y="' + (n[2] + (sub ? -4 : 6)) + '" text-anchor="middle" font-size="' + Math.min(17, Math.floor((W - 18) / (String(t).length * (ar ? 0.5 : 0.56)))) + '" font-weight="700" fill="' + tc + '">' + esc(t) + '</text>' +
        (sub ? '<text x="' + n[1] + '" y="' + (n[2] + 18) + '" text-anchor="middle" font-size="13" fill="' + sc + '">' + esc(sub) + '</text>' : '');
    });
    var gen = function (y, a, e) { return '<text x="' + (ar ? d.w - 8 : 8) + '" y="' + y + '" text-anchor="' + (ar ? 'end' : 'start') + '" font-size="12" fill="#7A8F72">' + esc(ar ? a : e) + '</text>'; };
    return '<div class="ftree-wrap"><svg class="ftree" viewBox="0 0 ' + d.w + ' ' + d.h + '" role="img" aria-label="' + esc(ar ? 'شجرة الأسرة بالأدوار فقط' : 'Family tree, roles only') + '" style="font-family:inherit"><g stroke="#8FA588" stroke-width="2.5" stroke-linecap="round">' + g + '</g>' + nodes + '</svg></div><p class="ftree-hint">' + L('اسحب أفقيًا لرؤية بقية الشجرة', 'Swipe sideways to see the rest of the tree') + '</p>';
  }
  function famChip(c, me) {
    var cls = me ? 'me' : c[3] === 'car' ? 'car' : c[2] ? 'inv' : '';
    return '<span class="fchip ' + cls + '">' + (me ? icon('user') : '') + L(c[0], c[1]) + (c[2] ? '<i class="dot" aria-hidden="true"></i>' : '') + '</span>';
  }
  function vFamily() {
    if (!hasResult()) return head('أسرتي', 'My family', 'تظهر هنا بعد نتيجتك.', 'This appears after your result.') + '<section class="panel"><p class="empty">' + L('لا شيء هنا بعد. نتيجتك أولًا.', 'Nothing here yet. Your result comes first.') + '</p></section>';
    var f = FAMV[per().ped], s = ps(); s.famSeen = true;
    var tiers = famTree() +
      '<div class="fam-key"><span><i class="k me"></i>' + L('أنت', 'You') + '</span><span><i class="k inv"></i>' + L('معنيّ بالفحص، وتصله دعوة رسمية', 'Concerned, receives an official invitation') + '</span><span><i class="k base"></i>' + L('للتوضيح فقط', 'Shown for context') + '</span></div>';
    var groups = '<div class="fam-groups">' + f.groups.map(function (g) {
      return '<article class="fgroup"><span class="ic2">' + icon(g[0]) + '</span><div><b>' + L(g[1], g[2]) + '</b><p>' + L(g[3], g[4]) + '</p>' + (g[5] === 'book' ? '<button type="button" class="btn btn-sm" data-a="bookt" data-v="parents">' + icon('calendar') + L('احجزا فحصكما', 'Book your tests') + '</button>' : g[5] === 'none' ? '' : '<span class="chip ok">' + icon('letter') + L('تصلهم دعوة رسمية لفحص مجاني', 'They receive an official invitation for a free test') + '</span>') + '</div></article>';
    }).join('') + '</div>';
    var partner = f.partner && st.persona === 'single' ? '<section class="panel"><h2>' + icon('heart') + L('خطيبتك', 'Your fiancée') + '</h2><p class="sub">' + (cond().premarital
        ? L('فحص ما قبل الزواج يشملكما معًا، ونتيجتها لهذه الحالة تصل ضمن الطلب نفسه. لا تحتاج إلى دعوتها.', 'The premarital screening covers you both, and her result for this condition comes from the same request. You do not need to invite her.')
        : L('هذه الحالة لا يشملها فحص ما قبل الزواج. يمكنك دعوتها إلى فحص مجاني لها، ونتيجتها تصلها وحدها.', 'This condition is not part of the premarital screening. You can invite her to a free test for it, and the result goes to her alone.')) + '</p>' +
      (cond().premarital ? '<p class="t-cap">' + L('إن ظهرت لديك يومًا صفة لحالة لا يشملها فحص ما قبل الزواج، يمكنك دعوتها إلى فحص تلك الحالة من هنا.', 'If you ever carry a trait for a condition the premarital screening does not cover, you can invite her to be tested for it from here.') + '</p>'
        : '<div class="row"><button type="button" class="btn btn-sm" data-a="toast" data-v="invite">' + icon('letter') + L('أرسل لها دعوة للفحص', 'Send her a test invitation') + '</button></div>') + '</section>' : '';
    return head('أسرتي', 'My family', 'الصفة الوراثية تنتقل في العائلة. هنا ترى من يهمّه الأمر من أقاربك، دون أسمائهم أو نتائجهم.', 'A genetic trait runs in families. Here you see which relatives it concerns, without their names or results.') +
      '<section class="panel">' + tiers + '</section>' +
      '<section class="panel"><h2>' + icon('family') + L('من يُدعى إلى الفحص', 'Who is invited to be tested') + '</h2>' + groups +
      '<div class="note-priv">' + icon('lock') + '<p>' + (st.persona === 'newborn' ? L('تُرسل الجهة الصحية الدعوات مباشرة. لا تذكر الدعوة اسميكما ولا اسم سارة. ولن تريا أسماء أقاربكما أو نتائجهم، كما لن يروا نتائجكما.', 'The health authority sends the invitations directly. They never mention your names or Sara’s. You will not see your relatives’ names or results, and they will not see yours.') : L('تُرسل الجهة الصحية الدعوات مباشرة. لا تذكر الدعوة اسمك، ولا أنك أجريت فحصًا. ولن ترى أسماء أقاربك أو نتائجهم، كما لن يروا نتيجتك.', 'The health authority sends the invitations directly. They never mention your name or that you were tested. You will not see your relatives’ names or results, and they will not see yours.')) + '</p></div>' +
      '<div class="row"><button type="button" class="btn btn-sm" data-a="ask">' + icon('phone') + L('تريد أن تخبر أحدًا بنفسك؟ تحدّث مع مستشار', 'Want to tell someone yourself? Talk to a counsellor') + '</button></div></section>' + partner;
  }

  /* ---------- appointments ---------- */
  function vAppts() {
    var s = ps(), b = s.book, types = APPT_FOR[st.persona];
    if (isRel() && s.stage < 2) types = ['confirm'];
    var form = '<div class="types" role="group" aria-label="Type">' + types.map(function (t) { var a = ATYPES[t]; return '<button type="button" data-a="btype" data-v="' + t + '" aria-pressed="' + (b.t === t) + '">' + icon(a.ic) + '<b>' + T(a.t) + '</b><small>' + T(a.d) + '</small></button>'; }).join('') + '</div>';
    if (b.t) {
      form += '<div class="stack-sm"><span class="t-small" style="font-weight:600">' + L('المكان', 'Where') + '</span><div class="seg" role="group">' + FAC.map(function (f, i) { return '<button type="button" data-a="bfac" data-v="' + i + '" aria-pressed="' + (b.f === i) + '">' + T(f) + '</button>'; }).join('') + '</div></div>' +
        '<div class="stack-sm"><span class="t-small" style="font-weight:600">' + L('الموعد', 'When') + '</span><div class="slots" role="group">' + SLOTS.map(function (sl, i) { return '<button type="button" data-a="bslot" data-v="' + i + '" aria-pressed="' + (b.s === i) + '">' + L(sl[0], sl[1]) + '<small class="ltr">' + sl[2] + '</small></button>'; }).join('') + '</div></div>' +
        '<div class="row"><button type="button" class="btn btn-primary" data-a="bconfirm"' + (b.s == null ? ' disabled' : '') + '>' + icon('check') + L('تأكيد الحجز عبر صحتي (محاكاة)', 'Confirm through Sehhaty (simulated)') + '</button></div>';
    }
    return head('المواعيد', 'Appointments', 'احجز الفحوص والاستشارات. الحجز يمر عبر صحتي في التشغيل الفعلي، وهنا هو محاكاة.', 'Book tests and counselling. In production booking runs through Sehhaty; here it is simulated.') +
      '<section class="panel"><h2>' + icon('calendar') + L('مواعيدي القادمة', 'Upcoming') + '</h2>' + apptList(false) + '</section>' +
      '<section class="panel"><h2>' + icon('plus') + L('حجز موعد جديد', 'Book a new appointment') + '</h2>' + form + '</section>';
  }

  /* ---------- documents ---------- */
  function docHead(titleAr, titleEn) {
    return '<div class="dh"><img src="assets/logo/simat-lockup-horizontal-light.svg" alt="SIMAT · سمات" width="160" height="46" style="height:40px;width:auto"><span class="mono">' + per().code + ' · 2026-10</span></div><h3>' + L(titleAr, titleEn) + '</h3>';
  }
  function vDocs() {
    var s = ps(), c = cond(), out = '';
    if (isRel()) out += '<section class="stack-sm"><h2 class="t-h3">' + L('الدعوة الرسمية', 'The official invitation') + '</h2>' + letter('co') + '</section>';
    if (hasResult()) {
      out += '<section class="stack-sm"><h2 class="t-h3">' + L('ملخص النتيجة', 'Result summary') + '</h2><div class="doc">' + docHead('ملخص نتيجة الفحص', 'Screening result summary') +
        '<dl class="kv"><dt>' + L('الاسم', 'Name') + '</dt><dd>' + T(per().me) + '</dd><dt>' + L('الحالة', 'Condition') + '</dt><dd>' + T(c.name) + '</dd><dt>' + L('النتيجة', 'Result') + '</dt><dd>' + T(c.trait) + ' · ' + L('حامل', 'carrier') + '</dd><dt>' + L('الدليل السريري', 'Rulebook') + '</dt><dd class="mono">' + c.rulebook + '</dd></dl>' +
        '<p class="t-small muted">' + L('هذا الملخص لا يحتوي على بيانات جينومية، فقط صفة الحمل.', 'This summary holds no genomic data, only carrier status.') + '</p></div></section>';
      out += '<section class="stack-sm"><h2 class="t-h3">' + L('ملخص جلسة الاستشارة', 'Counselling summary') + '</h2>' + (s.sess.done ? '<div class="doc">' + docHead('ملخص جلسة الاستشارة الوراثية', 'Genetic counselling summary') + summaryStatic() + '</div>' : '<div class="panel"><p class="empty">' + L('يتوفر بعد إنهاء جلسة الاستشارة.', 'Available after you finish the counselling session.') + '</p><div class="row"><button type="button" class="btn btn-sm" data-a="go" data-v="session">' + L('اذهب إلى الجلسة', 'Go to the session') + '</button></div></div>') + '</section>';
    }
    return head('المستندات', 'Documents', 'للاطلاع فقط. لا تُصدَّر الملفات في النموذج التجريبي.', 'View only. Files are not exported in this demo.') + out;
  }
  function summaryStatic() {
    var s = ps(), inf = { ready: ['فهمت، ومستعد للتفكير في قراري', 'Understands and feels ready to think about the decision'], some: ['فهم جزئي، ويرغب في الحديث مع مستشار', 'Partly understands; wants a counsellor'], time: ['يحتاج إلى وقت أكثر', 'Needs more time'] }[s.sess.informed];
    var pt = { carrier: ['حامل', 'carrier'], non: ['غير حامل', 'not a carrier'], unknown: ['غير معروف', 'unknown'] }[s.sess.partner];
    return '<dl class="kv"><dt>' + L('حالة الطرف الآخر', 'Other parent') + '</dt><dd>' + T(pt) + '</dd><dt>' + L('مستوى الفهم (تقييم ذاتي)', 'Understanding (self-reported)') + '</dt><dd>' + T(inf) + '</dd><dt>' + L('القرار', 'Decision') + '</dt><dd>' + L('غير مسجّل · خاص بك', 'Not recorded · yours') + '</dd></dl>';
  }

  /* ---------- privacy ---------- */
  function vPrivacy() {
    var s = ps(), c = s.cons;
    var row = function (k, a, e, sa, se) { return '<div class="c"><span class="tx"><b>' + L(a, e) + '</b><small>' + L(sa, se) + '</small></span><button type="button" class="toggle" role="switch" aria-checked="' + c[k] + '" data-a="cons" data-v="' + k + '" aria-label="' + esc(e) + '"></button></div>'; };
    var vis = [['أنت', 'You', 'نتيجتك، والجلسة، وخياراتك، ومواعيدك', 'Your result, session, choices and appointments'],
      ['مستشارك الوراثي', 'Your genetic counsellor', 'نتيجتك وتقييمك الذاتي للفهم، إن وافقت', 'Your result and self-reported understanding, if you consent'],
      ['طبيبك', 'Your physician', 'صفة الحمل فقط، إن وافقت', 'Carrier status only, if you consent'],
      ['الجهة الصحية', 'Health authority', 'أرقام مُجمَّعة غير معرِّفة فقط', 'Aggregated, de-identified numbers only'],
      ['أقاربك', 'Your relatives', 'لا شيء، إلا ما ترسله أنت', 'Nothing, unless you send it']];
    var req = function (k, a, e) { return s.reqs[k] ? '<span class="chip ok">' + icon('check') + L('سُجّل الطلب (محاكاة)', 'Request recorded (simulated)') + '</span>' : '<button type="button" class="btn btn-sm btn-danger" data-a="confirm" data-v="' + k + '">' + L(a, e) + '</button>'; };
    var conf = s.confirm ? '<div class="confirm"><b>' + (s.confirm === 'delete' ? L('هل تريد حذف بياناتك؟', 'Delete your data?') : L('هل تريد سحب كل الموافقات؟', 'Withdraw all consents?')) + '</b><p class="t-small">' + L('في التشغيل الفعلي يُعالَج الطلب وفق نظام حماية البيانات الشخصية خلال [مدة تُحدد]. هنا لا يحدث شيء.', 'In production the request is handled under the PDPL within [period to be set]. Nothing happens here.') + '</p>' +
      '<div class="row"><button type="button" class="btn btn-sm btn-danger" data-a="doconfirm">' + L('نعم، تابع', 'Yes, continue') + '</button><button type="button" class="btn btn-sm" data-a="noconfirm">' + L('تراجع', 'Cancel') + '</button></div></div>' : '';
    return head('الخصوصية والموافقات', 'Privacy & consent', 'أنت تتحكم في من يرى ماذا. نحفظ صفة الحمل فقط، والبيانات مستضافة داخل المملكة.', 'You control who sees what. We store carrier status only, and data stays inside Saudi Arabia.') +
      '<section class="panel"><h2>' + icon('sliders') + L('موافقاتك', 'Your consents') + '</h2><div class="cons">' +
      row('share', 'مشاركة صفة الحمل مع طبيبي', 'Share my carrier status with my physician', 'تساعد طبيبك عند أي حمل قادم', 'Helps your doctor in any future pregnancy') +
      row('stats', 'إدراجي في إحصاءات وطنية مُجمَّعة غير معرِّفة', 'Include me in aggregated, de-identified national statistics', 'لا يظهر اسمك أو أي معرّف', 'Your name and identifiers never appear') +
      row('remind', 'تذكيرات المواعيد', 'Appointment reminders', 'عبر الإشعارات والرسائل النصية (محاكاة)', 'Via notifications and SMS (simulated)') +
      row('contact', 'السماح للمستشار بالتواصل معي', 'Let a counsellor contact me', 'للمتابعة بعد الجلسة', 'For follow-up after the session') + '</div></section>' +
      '<section class="panel"><h2>' + icon('eye') + L('من يرى ماذا', 'Who sees what') + '</h2><div class="table-wrap"><table class="vis"><thead><tr><th>' + L('الطرف', 'Who') + '</th><th>' + L('ما يراه', 'What they see') + '</th></tr></thead><tbody>' +
      vis.map(function (v) { return '<tr><td><b>' + L(v[0], v[1]) + '</b></td><td>' + L(v[2], v[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<ul class="bp"><li>' + L('نحفظ «حامل / غير حامل / غير معروف» فقط، ولا نحفظ بيانات جينومية خام.', 'We store “carrier / not a carrier / unknown” only, never raw genomic data.') + '</li><li>' + L('البيانات مستضافة داخل المملكة وفق نظام حماية البيانات الشخصية.', 'Data is hosted inside Saudi Arabia under the Personal Data Protection Law.') + '</li></ul></section>' +
      '<section class="panel danger"><h2>' + icon('trash') + L('بياناتك', 'Your data') + '</h2><div class="row">' + req('withdraw', 'سحب كل الموافقات', 'Withdraw all consents') + req('delete', 'حذف بياناتي', 'Delete my data') + '</div>' + conf + '</section>';
  }
  function vMore() {
    return head('المزيد', 'More', '', '') + '<section class="panel more-menu">' + [['appts', 'calendar', 'المواعيد', 'Appointments'], ['docs', 'book', 'المستندات', 'Documents'], ['privacy', 'privacy', 'الخصوصية والموافقات', 'Privacy & consent']].map(function (n) {
      return '<button type="button" class="btn" style="justify-content:flex-start" data-a="go" data-v="' + n[0] + '">' + icon(n[1]) + L(n[2], n[3]) + '</button>'; }).join('') +
      '<a class="btn" style="justify-content:flex-start" href="index.html">' + icon('home') + L('العودة إلى الموقع', 'Back to the website') + '</a><button type="button" class="btn" style="justify-content:flex-start" data-a="signout">' + icon('logout') + L('تسجيل الخروج', 'Sign out') + '</button></section>';
  }

  /* ---------- counsellor sheet ---------- */
  function sheet() {
    if (!st.sheet) return '';
    var s = ps(), tab = st.sheetTab, body;
    if (!s.chat) s.chat = [['them', 'مرحبًا، أنا سلمى، مستشارة وراثية. كيف أساعدك اليوم؟', 'Hello, I am Salma, a genetic counsellor. How can I help today?']];
    if (tab === 'chat') body = '<div class="chat">' + s.chat.map(function (m) { return '<div class="msg ' + m[0] + '">' + (m[0] === 'me' ? esc(m[1]) : L(m[1], m[2])) + '</div>'; }).join('') + '</div>' +
      '<form class="chat-in" data-a="chatform"><label class="sr-only" for="chatin">Message</label><input id="chatin" autocomplete="off" value="' + esc(s.chatDraft) + '" data-ph-ar="اكتب سؤالك…" data-ph-en="Type your question…"><button type="submit" class="btn btn-sm btn-primary">' + icon('send') + '</button></form>' +
      '<p class="t-cap">' + L('محادثة محاكاة. الردود مكتوبة مسبقًا للعرض.', 'Simulated chat. Replies are scripted for the demo.') + '</p>';
    else if (tab === 'call') body = '<div class="stack-sm"><p>' + L('اتصل بمركز الاستشارة الوراثية:', 'Call the genetic counselling centre:') + '</p><p class="t-h3 ltr">[' + L('رقم المركز', 'centre number') + ']</p><p class="t-cap">' + L('الرقم يُحدد عند التشغيل الفعلي. أوقات العمل: [تُحدد].', 'The number is set at launch. Hours: [to be set].') + '</p></div>';
    else body = '<div class="stack-sm"><p>' + L('موعد مرئي مع مستشار عبر مستشفى صحة الافتراضي.', 'A video appointment with a counsellor through Seha Virtual Hospital.') + '</p><div class="row"><button type="button" class="btn btn-primary" data-a="video">' + icon('video') + L('اطلب موعدًا مرئيًا (محاكاة)', 'Request a video slot (simulated)') + '</button></div></div>';
    var tb = function (k, ic, a, e) { return '<button type="button" role="tab" aria-selected="' + (tab === k) + '" data-a="stab" data-v="' + k + '">' + icon(ic) + L(a, e) + '</button>'; };
    return '<div class="scrim" data-a="closebg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-t"><div class="sh"><h2 id="sh-t">' + L('تحدّث مع مستشار وراثي', 'Talk to a genetic counsellor') + '</h2><button type="button" data-a="close" data-aria-ar="إغلاق" data-aria-en="Close" aria-label="Close">' + icon('x') + '</button></div>' +
      '<div class="tabs" role="tablist">' + tb('chat', 'chat', 'محادثة', 'Chat') + tb('call', 'phone', 'اتصال', 'Call') + tb('video', 'video', 'مرئي', 'Video') + '</div><div class="sb">' + body + '</div></div></div>';
  }

  /* ---------------- render ---------------- */
  var VIEWS = { home: vHome, result: vResult, session: vSession, family: vFamily, appts: vAppts, docs: vDocs, privacy: vPrivacy, more: vMore };
  var app = document.getElementById('app'), focusSel = null;
  function render() {
    var html = topbar() + demoStrip();
    if (!st.signed) html += signin();
    else html += '<div class="p-shell">' + sideNav() + '<main id="main" class="p-main" tabindex="-1">' + (VIEWS[st.view] || vHome)() + '</main></div>' + tabbar() + sheet();
    app.innerHTML = html;
    var lang = S.lang();
    app.querySelectorAll('[data-ph-ar]').forEach(function (el) { el.setAttribute('placeholder', el.getAttribute('data-ph-' + lang)); });
    app.querySelectorAll('[data-aria-ar]').forEach(function (el) { el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang)); });
    var fw = app.querySelector('.ftree-wrap'), fm = fw && fw.querySelector('.fme');
    if (fm && fw.scrollWidth > fw.clientWidth + 4) { var a = fm.getBoundingClientRect(), b = fw.getBoundingClientRect(); fw.scrollLeft += (a.left + a.width / 2) - (b.left + b.width / 2); }
    if (focusSel) { var f = app.querySelector(focusSel); if (f) f.focus({ preventScroll: true }); focusSel = null; }
  }
  function go(v) {
    st.view = v;
    if (v === 'result' && hasResult()) ps().resultSeen = true;
    try { history.replaceState(null, '', '#' + v); } catch (e) {}
    render(); window.scrollTo({ top: 0, behavior: 'instant' }); focusSel = null;
  }

  /* ---------------- events ---------------- */
  function bookType(t) { var s = ps(); s.book = { t: t, f: t === 'counsel' || t === 'couple' ? 2 : 0, s: null }; go('appts'); }
  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-a]'); if (!el || !app.contains(el)) return;
    var a = el.getAttribute('data-a'), v = el.getAttribute('data-v'), s = st.signed ? ps() : null;
    if (a === 'closebg') { if (e.target === el) { st.sheet = null; render(); } return; }
    if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'FORM' || el.tagName === 'INPUT') return;
    switch (a) {
      case 'go': go(v); break;
      case 'pickp': st.persona = v; render(); break;
      case 'nafath': st.nafath = 1; render(); break;
      case 'nafathback': st.nafath = 0; render(); break;
      case 'approve': st.signed = true; st.nafath = 0; st.view = 'home'; S.toast(L('تم الدخول (محاكاة)', 'Signed in (simulated)')); render(); window.scrollTo({ top: 0, behavior: 'instant' }); break;
      case 'signout': st.signed = false; st.sheet = null; render(); window.scrollTo({ top: 0, behavior: 'instant' }); break;
      case 'reset': reset(); S.toast(L('أُعيد ضبط النموذج', 'Demo reset'), 'refresh'); render(); window.scrollTo({ top: 0, behavior: 'instant' }); break;
      case 'ask': st.sheet = true; st.sheetTab = 'chat'; render(); focusSel = null; var c = app.querySelector('.sheet .sh button'); if (c) c.focus(); break;
      case 'close': st.sheet = null; render(); break;
      case 'stab': st.sheetTab = v; render(); break;
      case 'video': S.toast(L('سُجّل طلب الموعد المرئي (محاكاة)', 'Video slot requested (simulated)')); break;
      case 'step': s.sess.step = +v; render(); var p = app.querySelector('.stepper .cur'); if (p) p.focus({ preventScroll: true }); app.querySelector('.panel').scrollIntoView({ block: 'start' }); break;
      case 'partner': s.sess.partner = v; render(); break;
      case 'q': s.sess.q = s.sess.q === v ? null : v; render(); break;
      case 'informed': s.sess.informed = v; render(); break;
      case 'finish': s.sess.done = true; S.toast(L('سُجّل مستوى فهمك. قرارك لا يُسجَّل.', 'Your understanding was recorded. Your decision is not.')); go('home'); break;
      case 'bookt': bookType(v); break;
      case 'sel': s.sel = v; render(); var rc = document.getElementById('rel-' + v); if (rc) rc.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'method': var parts = v.split(':'); s.choices[parts[0]] = parts[1]; s.sel = parts[0]; render();
        if (parts[1] !== 'none') S.toast(parts[1] === 'official' ? L('أُعدّت الدعوة · لا يُرسل شيء في النموذج', 'Invitation prepared · nothing is sent in the demo') : L('أُعدّت مسودة رسالتك', 'Your draft is ready'), 'check'); break;
      case 'copy': var t = app.querySelector('#dr-' + v + '-' + S.lang()); if (t) { var txt = t.value; var done = function () { S.toast(L('نُسخت الرسالة', 'Message copied'), 'copy'); };
        try { navigator.clipboard.writeText(txt).then(done, function () { t.select(); done(); }); } catch (er) { t.select(); done(); } } break;
      case 'wa': S.toast(L('محاكاة: في التشغيل الفعلي يفتح واتساب برسالتك، وأنت من يضغط إرسال', 'Simulated: in production WhatsApp opens with your message, and you press send'), 'send'); break;
      case 'btype': s.book.t = v; s.book.s = null; s.book.f = v === 'counsel' || v === 'couple' ? 2 : 0; render(); break;
      case 'bfac': s.book.f = +v; render(); break;
      case 'bslot': s.book.s = +v; render(); break;
      case 'bconfirm': if (s.book.s == null) return; s.appts.push({ t: s.book.t, f: s.book.f, s: s.book.s, rem: true });
        if (s.book.t === 'confirm' && s.stage === 0) s.stage = 1;
        s.book = { t: null, f: 0, s: null }; S.toast(L('تم الحجز عبر صحتي (محاكاة)', 'Booked through Sehhaty (simulated)'), 'calendar'); render(); break;
      case 'rem': s.appts[+v].rem = !s.appts[+v].rem; render(); break;
      case 'cancel': s.appts.splice(+v, 1); S.toast(L('أُلغي الموعد', 'Appointment cancelled'), 'x'); render(); break;
      case 'advance': if (s.stage === 1) { s.stage = 2; S.toast(L('بعد 18 يومًا: نتيجتك جاهزة، وهي لك وحدك', '18 days later: your result is ready, and it is yours alone'), 'report'); go('result'); } break;
      case 'cons': s.cons[v] = !s.cons[v]; render(); break;
      case 'confirm': s.confirm = v; render(); break;
      case 'noconfirm': s.confirm = null; render(); break;
      case 'doconfirm': s.reqs[s.confirm] = true; if (s.confirm === 'withdraw') Object.keys(s.cons).forEach(function (k) { s.cons[k] = false; }); s.confirm = null; S.toast(L('سُجّل الطلب (محاكاة)', 'Request recorded (simulated)')); render(); break;
    }
  });
  app.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('g.node')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.sheet) { st.sheet = null; render(); } });
  app.addEventListener('change', function (e) {
    if (e.target.matches('select[data-a="persona"]')) { st.persona = e.target.value; if (st.signed) { st.view = 'home'; } render(); S.toast(L('تغيّرت الشخصية', 'Persona changed'), 'users'); }
  });
  app.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('textarea[data-a="draft"]')) { var p = t.getAttribute('data-v').split(':'), s = ps(); var d = (s.drafts[p[0]] || defaultDraft(p[0])).slice(); d[+p[1]] = t.value; s.drafts[p[0]] = d; }
    if (t.id === 'chatin') ps().chatDraft = t.value;
  });
  var REPLIES = [['شكرًا لسؤالك. سأراجع نتيجتك وأعود إليك خلال دقائق.', 'Thank you. I will look at your result and get back to you in a few minutes.'], ['سؤال مهم. يمكننا مناقشته بالتفصيل في موعد مرئي إن أحببت.', 'Good question. We can go through it in detail in a video appointment if you like.']];
  app.addEventListener('submit', function (e) {
    if (!e.target.matches('form[data-a="chatform"]')) return;
    e.preventDefault(); var s = ps(), v = (s.chatDraft || '').trim(); if (!v) return;
    s.chat.push(['me', v]); s.chatDraft = ''; var r = REPLIES[(s.chat.length / 2 | 0) % 2]; s.chat.push(['them', r[0], r[1]]);
    render(); var i = app.querySelector('#chatin'); if (i) i.focus(); var sb = app.querySelector('.sheet .sb'); if (sb) sb.scrollTop = sb.scrollHeight;
  });
  document.addEventListener('simat:lang', function () { if (app.childNodes.length) render(); });

  var h = (location.hash || '').replace('#', '');
  if (VIEWS[h]) st.view = h;
  window.__portal = { st: function () { return st; }, render: render };
  render();
})();
