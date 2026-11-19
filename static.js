(function () {
  var ids = {}; (window.BMN.articles || []).forEach(function (a) { ids[a.id] = 1; });
  function fix() {
    var q = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    q('a[href*="claude.ai/artifact"], a[href*="betmeisters.com"]').forEach(function (a) {
      if (a.closest('.bx, .pp-tease, .bm-link, .tipwall, .tw-item')) return;
      var t = document.createTextNode(a.textContent); a.parentNode.replaceChild(t, a);
    });
    q('.bx, .pp-tease, .bm-link, .record, .firewall, .tipwall, .tw-item').forEach(function (e) { e.remove(); });
    q('.sec-h').forEach(function (h) {
      var a = h.querySelector('a'), t = h.textContent;
      if (/Tips from BetMeisters|Reviews|Bonuses/.test(t) || (a && /reviews\.html|bonuses\.html|#tip$/.test(a.getAttribute('href') || ''))) {
        var n = h.nextElementSibling; while (n && !n.classList.contains('sec-h') && !n.classList.contains('firewall') && !n.classList.contains('signup')) { var x = n.nextElementSibling; n.remove(); n = x; }
        h.remove();
      }
    });
    q('nav.sections a[href^="reviews.html"], nav.sections a[href^="bonuses.html"], .foot a[href^="reviews.html"], .foot a[href^="bonuses.html"], .foot a[href="how-we-score.html"], .foot a[href="disclosure.html"]').forEach(function (a) { var d = a.closest('.dd') || a; d.remove(); });
    q('a[href$="#tip"], a[href$="#acca"], a[href$="#combo"]').forEach(function (a) { a.remove(); });
    q('.foot-cols > div').forEach(function (d) { var h = d.querySelector('h4'); if (h && h.textContent === 'Reviews') { h.textContent = 'Sections'; } });
    var fp = 0; q('.foot p').forEach(function (p) { if (/commission or fees|Tips come from|real chances behind/.test(p.textContent)) { if (fp++) p.remove(); else p.textContent = 'News, previews and guides on sport and betting, with the real chances behind the prices. We are not a bookmaker and take no bets.'; } });
    q('.foot a[href$="#accas-combos"], .chips a[href$="#accas-combos"]').forEach(function (a) { a.remove(); });
    var td = document.querySelector('aside.today');
    if (td) { q('aside.today .today-tile[hidden]').forEach(function (t) { t.hidden = false; }); if (!td.querySelector('.today-tile, a.card, .card')) { var fr = td.closest('.front'); td.remove(); if (fr) fr.style.gridTemplateColumns = '1fr'; } }
    var nt = document.querySelector('.notice'); if (nt) nt.innerHTML = '18+ only · Please gamble responsibly · <a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a>';
    q('a[href]').forEach(function (a) {
      var h = a.getAttribute('href'), m;
      if ((m = /^article\.html#(.+)$/.exec(h)) && ids[m[1]]) a.setAttribute('href', '/' + m[1] + '.html');
      else if (h === 'section.html#guides') a.setAttribute('href', '/guides.html');
      else if (h === 'index.html') a.setAttribute('href', '/');
      else if (/^(news|previews|fpl|about|safer-gambling|privacy)\.html/.test(h)) a.setAttribute('href', '/' + h);
    });
    q('a[href^="article.html#"]').forEach(function (a) { var c = a.closest('.card, .today-tile, li, .also a, .tw-item'); (c || a).remove(); });
  }
  fix();
  new MutationObserver(function (m) { fix(); }).observe(document.getElementById('main') || document.body, { childList: true });
})();
