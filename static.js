(function () {
  var ids = {}; (window.BMN.articles || []).forEach(function (a) { ids[a.id] = 1; });
  var rids = {}; (window.BMN.operators || []).forEach(function (o) { rids[o.id] = 1; });
  function fix() {
    var q = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    q('a[href*="claude.ai/artifact"], a[href*="betmeisters.com"]').forEach(function (a) {
      if (a.closest('.bx, .pp-tease, .bm-link, .tipwall, .tw-item, #signup')) return;
      var t = document.createTextNode(a.textContent); a.parentNode.replaceChild(t, a);
    });
    q('.bx, .pp-tease, .bm-link, .record, .firewall, .tipwall, .tw-item').forEach(function (e) { e.remove(); });
    q('.sec-h').forEach(function (h) {
      var a = h.querySelector('a'), t = h.textContent;
      if (/Tips from BetMeisters|Bonuses/.test(t) || (a && /bonuses\.html|#tip$/.test(a.getAttribute('href') || ''))) {
        var n = h.nextElementSibling; while (n && !n.classList.contains('sec-h') && !n.classList.contains('firewall') && !n.classList.contains('signup')) { var x = n.nextElementSibling; n.remove(); n = x; }
        h.remove();
      }
    });
    q('nav.sections a[href^="bonuses.html"], .foot a[href^="bonuses.html"], .foot a[href="disclosure.html"]').forEach(function (a) { var d = a.closest('.dd') || a; d.remove(); });
    q('a[href$="#tip"], a[href$="#acca"], a[href$="#combo"]').forEach(function (a) { a.remove(); });
    q('a[href="disclosure.html"]').forEach(function (a) { a.parentNode.replaceChild(document.createTextNode(a.textContent), a); });
    var fp = 0; q('.foot p').forEach(function (p) { if (/commission or fees|Tips come from|real chances behind/.test(p.textContent)) { if (fp++) p.remove(); else p.textContent = 'News, previews and guides on sport and betting, with the real chances behind the prices. We are not a bookmaker and take no bets.'; } });
    q('.foot a[href$="#accas-combos"], .chips a[href$="#accas-combos"]').forEach(function (a) { a.remove(); });
    q('.edition span').forEach(function (x) { if (/Kampala/.test(x.textContent)) x.remove(); });
    if (document.body.getAttribute('data-page') === 'home') home();
    var nt = document.querySelector('.notice'); if (nt) nt.innerHTML = '18+ only · Please gamble responsibly · <a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a>';
    q('a[href]').forEach(function (a) {
      var h = a.getAttribute('href'), m;
      if ((m = /^article\.html#(.+)$/.exec(h)) && ids[m[1]]) a.setAttribute('href', '/' + m[1] + '.html');
      else if (h === 'section.html#guides') a.setAttribute('href', '/guides.html');
      else if (h === 'index.html') a.setAttribute('href', '/');
      else if ((m = /^review\.html#(.+)$/.exec(h)) && rids[m[1]]) a.setAttribute('href', '/review-' + m[1] + '.html');
      else if (/^(news|previews|fpl|about|safer-gambling|privacy|reviews|how-we-score)\.html/.test(h)) a.setAttribute('href', '/' + h);
    });
    q('a[href^="article.html#"]').forEach(function (a) { var c = a.closest('.card, .today-tile, li, .also a, .tw-item'); (c || a).remove(); });
  }
  function home() {
    var q = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    var A = (window.BMN.articles || []).slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var url = function (a) { return '/' + a.id + '.html'; };
    var day = function (a) { return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/London' }).format(new Date(a.date)); };
    var kick = function (a) { return a.section === 'guides' ? 'Guide' : a.section === 'fpl' ? 'FPL' : a.section === 'previews' ? 'Preview' : 'News'; };
    var front = document.querySelector('.front'); if (!front) return;
    var idOf = function (h) { var m = /^\/?([^\/#]+)\.html$/.exec(h || '') || /^article\.html#(.+)$/.exec(h || ''); return m ? m[1] : ''; };
    var shown = {}; q('.front .lead a[href], .front .also a[href], .cards.desk4 a[href]').forEach(function (a) { var i = idOf(a.getAttribute('href')); if (i) shown[i] = 1; });
    var leadId = '';
    /* 1. sidebar: rotating spotlight + latest list */
    var side = front.querySelector('aside.today');
    if (!side || !side.querySelector('.bm-latest')) {
      if (side) side.innerHTML = ''; else { side = document.createElement('aside'); side.className = 'today'; front.appendChild(side); }
      front.style.gridTemplateColumns = '';
      var spot = A.filter(function (a) { return !shown[a.id] && (a.section === 'guides' || a.section === 'news' || a.section === 'fpl'); }).slice(0, 5);
      spot.forEach(function (a) { shown[a.id] = 1; });
      var latest = A.filter(function (a) { return !shown[a.id]; }).slice(0, 5);
      side.innerHTML = '<div class="sec-h" style="margin:0 0 8px"><h2 style="font-size:22px">In focus</h2></div>' +
        '<div class="bm-spot">' + spot.map(function (a, i) { return '<a class="bm-spot-i' + (i ? '' : ' on') + '" href="' + url(a) + '"><span class="kick">' + esc(kick(a)) + '</span><b>' + esc(a.title) + '</b><span class="meta">' + esc(a.dek).slice(0, 150) + (a.dek && a.dek.length > 150 ? '…' : '') + '</span></a>'; }).join('') +
        '<div class="bm-dots">' + spot.map(function (a, i) { return '<button type="button" aria-label="Show story ' + (i + 1) + '"' + (i ? '' : ' class="on"') + ' data-i="' + i + '"></button>'; }).join('') + '</div></div>' +
        '<div class="sec-h bm-latest" style="margin:18px 0 4px"><h2 style="font-size:22px">Latest</h2><a href="/news.html">All →</a></div>' +
        latest.map(function (a) { return '<a class="today-tile" href="' + url(a) + '"><span class="kick">' + esc(kick(a)) + ' · ' + day(a) + '</span><b>' + esc(a.title) + '</b></a>'; }).join('');
      var items = side.querySelectorAll('.bm-spot-i'), dots = side.querySelectorAll('.bm-dots button'), cur = 0;
      var show = function (i) { cur = (i + items.length) % items.length; for (var k = 0; k < items.length; k++) { items[k].classList.toggle('on', k === cur); dots[k].classList.toggle('on', k === cur); } };
      side.querySelector('.bm-dots').addEventListener('click', function (e) { var d = e.target.getAttribute('data-i'); if (d != null) { show(+d); } });
      var spotEl = side.querySelector('.bm-spot'), hold = false; spotEl.addEventListener('mouseenter', function () { hold = true; }); spotEl.addEventListener('mouseleave', function () { hold = false; });
      if (items.length > 1 && !window.__bmSpot && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) window.__bmSpot = setInterval(function () { if (!document.hidden && !hold) show(cur + 1); }, 20000);
      latest.forEach(function (a) { shown[a.id] = 1; });
    }
    /* 2. 'From the desk' always four cards */
    var desk = document.querySelector('.cards.desk4');
    if (desk && desk.children.length < 4) {
      var pool = A.filter(function (a) { return !shown[a.id]; });
      while (desk.children.length < 4 && pool.length) { var a = pool.shift(); shown[a.id] = 1; var d = document.createElement('div'); d.className = 'card';
        d.innerHTML = '<div class="kick">' + esc(kick(a)) + '</div><h3><a href="' + url(a) + '">' + esc(a.title) + '</a></h3><p class="dek">' + esc(a.dek) + '</p><div class="meta">' + day(a) + ' · ' + (a.read || 3) + ' min read</div>'; desk.appendChild(d); }
    }
    /* 3. a previews row before Guides */
    if (!document.querySelector('.bm-prev')) {
      var pv = A.filter(function (a) { return a.section === 'previews' && !shown[a.id]; }).slice(0, 3);
      var g = q('.sec-h').filter(function (h) { return /Guides/.test(h.textContent); })[0];
      if (pv.length && g) { var w = document.createElement('div'); w.className = 'bm-prev';
        w.innerHTML = '<div class="sec-h"><h2>Previews</h2><a href="/previews.html">All previews →</a></div><div class="cards">' + pv.map(function (a) { shown[a.id] = 1; return '<div class="card"><div class="kick">' + esc(a.kicker || 'Preview') + '</div><h3><a href="' + url(a) + '">' + esc(a.title) + '</a></h3><p class="dek">' + esc(a.dek) + '</p><div class="meta">' + day(a) + ' · ' + (a.read || 3) + ' min read</div></div>'; }).join('') + '</div>';
        g.parentNode.insertBefore(w, g); }
    }
  }
  /* Owner 23 Nov 11:16: live tips from BetMeisters.com (tips_feed.json, updated every pass) */
  (function feed() {
    if (window.__bmFeed) return; window.__bmFeed = 1; var sg0 = document.getElementById('signup'); if (!sg0) return; var box = document.getElementById('bm-feed'); if (!box) { box = document.createElement('div'); box.id = 'bm-feed'; sg0.appendChild(box); } box.innerHTML = '';
    var U = 'https://betmeisters.com/?utm_source=news&utm_medium=referral&utm_campaign=tipbox';
    var e = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var hm = { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
    var when = function (iso) { var d = new Date(iso), uk = new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'Europe/London', weekday: 'short' }, hm)).format(d), lt = ''; try { var l = new Intl.DateTimeFormat('en-GB', hm).format(d), u = new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'Europe/London' }, hm)).format(d); if (l !== u) lt = ' · ' + l + ' your time'; } catch (x) {} return uk + ' UK' + lt; };
    fetch('https://betmeisters.com/tips_feed.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (f) {
      var rec = f.record || {}, sg = function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2); };
      var M = f.meisters || [];
      box.innerHTML = (M.length ? '<div class="bmf-ms">' + M.map(function (m) { return '<a href="' + U + '"><span class="bmf-mn">' + e(m.name) + '</span><b class="' + (m.pts >= 0 ? 'pos' : 'neg') + '">' + sg(m.pts) + ' pts</b><span class="bmf-ms-s">' + m.n + ' settled · ' + m.won + ' won</span></a>'; }).join('') + '</div>' : '') +
        '<p class="bmf-rec"><b>All Meisters since 5 November:</b> ' + sg(rec.pts) + ' pts from ' + rec.tips + ' settled tips (' + (rec.roi >= 0 ? '+' : '−') + Math.abs(rec.roi).toFixed(1) + '% return), every loser counted. <b>Every tip is free to read until 1 January.</b></p>' +
        ((f.next || []).length ? '<div class="bmf-h">Next tips, free to read</div><ul class="bmf">' + f.next.map(function (t) {
          return '<li><a href="' + U + '"><span class="bmf-t">' + e(when(t.start)) + ' · ' + e(t.tier) + ' · ' + e(t.who) + '</span><b>' + e(t.sel) + ' @ ' + (+t.price).toFixed(2) + '</b><span class="bmf-e">' + e(t.event) + (t.chance ? ' · chance ' + Math.round(t.chance * 100) + '%' : '') + '</span></a></li>'; }).join('') + '</ul>' : '<p>No open tips right now: new tips are published through the day.</p>') +
        '<p class="bmf-f">From BetMeisters.com, our sister tips site. Tips are opinions, not guarantees. 18+ only.</p>';
    }).catch(function () {});
  })();
  fix();
  new MutationObserver(function (m) { fix(); }).observe(document.getElementById('main') || document.body, { childList: true });
})();
