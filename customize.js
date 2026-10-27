/* បណ្តុំកូដអានតម្លៃពី config.js ហើយដាក់ចូលទំព័រ  (មិនចាំបាច់កែឯកសារនេះ) */
(function () {
  'use strict';
  var S = window.SITE || {};

  // [key ក្នុង config, អត្ថបទដើមក្នុងគេហទំព័រ, exact=ត្រូវគ្នាទាំងមូល | sub=ជំនួសតែផ្នែក]
  var RULES = [
    ['heroSubtitle', 'ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយសក្នុងពិធីរៀបអាពាហ៍ពិពាហ៍', 'exact'],
    ['groomName', 'វាសនា', 'exact'],
    ['groomLabel', 'កូនប្រុស', 'exact'],
    ['brideName', 'សុជីវ៉ា', 'exact'],
    ['brideLabel', 'កូនស្រី', 'exact'],
    ['countdownTitle', 'រាប់ថយក្រោយទៅដល់ថ្ងៃកម្មវិធី', 'exact'],
    ['heroDates', 'ថ្ងៃសៅរ៍ ទី១៤ ខែវិច្ឆិកា ឆ្នាំ២០២៦ & ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦', 'exact'],
    ['groomFather', 'សរ ហេង', 'exact'],
    ['groomMother', 'ហូវ នុយ', 'exact'],
    ['brideFather', 'ប៉ាង ប៊ុនណ្ណារិទ្ធិ', 'exact'],
    ['brideMother', 'ជេត ប៊ុនចន្ធី', 'exact'],
    ['groomFullName', 'សរ វាសនា', 'exact'],
    ['brideFullName', 'រិទ្ធធី សុជីវ៉ា', 'exact'],
    ['lunarDate', 'អាទិត្យ ៦កើត ខែកត្តិក ឆ្នាំមមី អដ្ឋស័ក', 'exact'],
    ['buddhistYear', '២៥៧០', 'exact'],
    ['dateText', '១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦', 'exact'],
    ['timeText', '០៥:០០ ល្ងាច', 'exact'],
    ['day1Title', 'ថ្ងៃសៅរ៍ ទី១៤ ខែវិច្ឆិកា ឆ្នាំ២០២៦', 'exact'],
    ['day2Title', 'ថ្ងៃអាទិត្យ ទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦', 'exact'],
    ['khrNumber', '004 074 601', 'exact'],
    ['usdNumber', '012 918 795', 'exact'],
    ['footerText', 'រៀបចំ និងរចនាដោយក្តីស្រឡាញ់ © ២០២៦ វាសនា & សុជីវ៉ា', 'exact'],
    ['venueName', 'ភោជនីយដ្ឋាន ហេង លាភ', 'sub'],
    ['venueAddress', 'ភូមិប្រក់ក្តារ ឃុំវិហារលួង ស្រុកពញាឮ ខេត្តកណ្តាល', 'sub'],
    ['accountName', 'SOCHIVA RITHY', 'sub']
  ];
  var ORIG_FALLBACK = {};
  RULES = RULES.filter(function (r) { return typeof S[r[0]] === 'string' && S[r[0]] !== r[1]; });

  var done = new WeakMap();
  function fixText(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (node) {
      var cur = node.nodeValue;
      if (done.get(node) === cur) return;
      var t = cur.trim(), out = cur, i, r;
      for (i = 0; i < RULES.length; i++) {
        r = RULES[i];
        if (r[2] === 'exact' && t === r[1]) { out = cur.replace(r[1], S[r[0]]); break; }
        if (r[2] === 'sub' && out.indexOf(r[1]) > -1) out = out.split(r[1]).join(S[r[0]]);
      }
      if (out !== cur) node.nodeValue = out;
      done.set(node, out);
    });
  }

  function fixSchedule() {
    var sec = document.querySelector('.wedding-program-section');
    if (!sec || sec.getAttribute('data-sched') === '1') return;
    var lines = sec.querySelectorAll('.v-timeline');
    if (lines.length < 2) return;
    [S.day1, S.day2].forEach(function (items, d) {
      if (!Array.isArray(items)) return;
      var tl = lines[d];
      var rows = tl.querySelectorAll(':scope > .v-timeline-item');
      if (!rows.length) return;
      while (rows.length > items.length) { rows[rows.length - 1].remove(); rows = tl.querySelectorAll(':scope > .v-timeline-item'); }
      while (rows.length < items.length) { tl.appendChild(rows[rows.length - 1].cloneNode(true)); rows = tl.querySelectorAll(':scope > .v-timeline-item'); }
      items.forEach(function (it, i) {
        var sp = rows[i].querySelectorAll('.timeline-event-card span');
        if (sp[0]) sp[0].textContent = it[0];
        if (sp[1]) sp[1].textContent = it[1];
      });
    });
    sec.setAttribute('data-sched', '1');
  }

  function fixLinks() {
    if (S.mapLink) document.querySelectorAll('a[href*="maps.app.goo.gl"]').forEach(function (a) { a.href = S.mapLink; });
    if (S.mapEmbed) document.querySelectorAll('iframe.map-iframe').forEach(function (f) { if (f.src !== S.mapEmbed) f.src = S.mapEmbed; });
    if (S.mapQrImage) setImg('img[alt="Location QR Code"]', S.mapQrImage);
    if (S.khqrImage) setImg('img[alt^="ABA KHQR"]', S.khqrImage);
  }
  function setImg(sel, url) {
    document.querySelectorAll(sel).forEach(function (img) {
      if (img.getAttribute('src') !== url) img.setAttribute('src', url);
      var p = img.parentElement;
      if (p) p.querySelectorAll('.v-img__img,.v-img__picture img').forEach(function (e) { e.setAttribute('src', url); });
    });
  }

  var timer = null;
  function run() {
    timer = null;
    if (S.pageTitle) document.title = S.pageTitle;
    var app = document.getElementById('app');
    if (!app) return;
    fixText(app);
    fixSchedule();
    fixLinks();
    // ប្រអប់ QR (dialog) បង្ហាញក្រៅ #app
    var ov = document.querySelector('.v-overlay-container');
    if (ov) { fixText(ov); fixLinks(); }
  }
  function schedule() { if (!timer) timer = setTimeout(run, 30); }

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
