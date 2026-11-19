(function () {
  var D = window.BMN, page = document.body.getAttribute("data-page") || "home";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var BM_URL = "https://claude.ai/artifact/4QVWLzE8WXNnR4J2dm4wEa";
  var tz = function (iso, zone, opt) { return new Intl.DateTimeFormat("en-GB", Object.assign({ timeZone: zone }, opt)).format(new Date(iso)); };
  var when = function (iso) { return tz(iso, "Africa/Kampala", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }) + " EAT · " + tz(iso, "Europe/London", { hour: "2-digit", minute: "2-digit", hour12: false }) + " UK"; };
  var dateOnly = function (iso) { return tz(iso, "Africa/Kampala", { day: "numeric", month: "long", year: "numeric" }); };
  var secName = function (k) { var s = D.sections.filter(function (x) { return x[0] === k; })[0]; return s ? s[1] : k; };
  var byDate = function (a, b) { return new Date(b.date) - new Date(a.date); };
  var TOPICS = [["general", "General news"], ["sports-betting", "Sports betting"], ["online-casino", "Online casino"], ["bonuses", "Bonuses, rewards and VIP"], ["sweeps-markets", "Sweepstakes and prediction markets"], ["crypto", "Crypto"], ["licensing", "Licensing and regulation"], ["enforcement", "Enforcement"], ["safer-gambling", "Safer gambling"], ["accas-combos", "Accas and combos"]];
  /* Keith 16 Nov 16:56: sport tags for Meister previews (and any article): filter, search and a record of what we produce */
  var SPORTS = [["football", "Football"], ["horse-racing", "Horse racing"], ["tennis", "Tennis"], ["basketball", "Basketball"], ["nfl", "NFL"], ["ice-hockey", "Ice hockey"], ["handball", "Handball"], ["cricket", "Cricket"], ["rugby", "Rugby"], ["golf", "Golf"], ["darts", "Darts"], ["snooker", "Snooker"], ["boxing-mma", "Boxing and MMA"], ["baseball", "Baseball"], ["volleyball", "Volleyball"], ["motor-sport", "Motor sport"], ["esports", "eSports"]];
  /* Keith 16 Nov 17:34: preview types (daily racing card, daily football, other sports roundup, event previews, weekend football from Thursday) and an FPL section */
  var PTYPES = [["tip", "Tip previews"], ["racing-card", "Racing card"], ["daily-football", "Daily football"], ["other-sports", "Other sports roundup"], ["event", "Event previews"], ["weekend-football", "Weekend football"], ["acca", "Acca previews"], ["combo", "Combo previews"]];
  var ptOf = function (a) { return a.previewType || "tip"; };
  var FPLT = [["deadline", "Deadline previews"], ["review", "Weekly reviews"], ["guide", "FPL guides"]];
  var bmBox = function () { return '<a class="tip bm-link" href="' + BM_URL + '" rel="noopener"><span><span class="t-who">BetMeisters.com</span><br><span class="t-sel">See today\'s tips, chances and the full public record</span><br><span class="t-ev">Every tip, win or lose · no affiliate deals, adverts or sponsorship</span></span><span class="t-px">→</span></a>'; };
  var sportSlug = function (name) { var t = SPORTS.filter(function (x) { return x[1] === name; })[0]; return t ? t[0] : ""; };
  var topicSlug = function (name) { var t = TOPICS.filter(function (x) { return x[1] === name; })[0]; return t ? t[0] : ""; };
  /* Keith 16 Nov 16:51: one tag list for articles AND reviews (same tags as the tips' sport tags); most items carry more than one */
  var REVCATS = [["bookies", "Bookie reviews", "Sports betting"], ["casino", "Online casino reviews", "Online casino"], ["sweeps-markets", "Sweepstakes and prediction reviews", "Sweepstakes and prediction markets"], ["crypto", "Crypto site reviews", "Crypto"]];
  var opTags = function (o) { return o.tags || []; };
  var revCatOf = function (o) { var t = opTags(o)[0]; return REVCATS.filter(function (c) { return c[2] === t; })[0] || REVCATS[0]; };
  var hashId = function () { return window.BMN_ID || decodeURIComponent((location.hash || "").slice(1)); };

  /* links like <site>#bet365 or #<article-id> open on the home page: send them to the right page */
  if (page === "home" && location.hash.length > 1) {
    var hh = hashId();
    if ((D.operators || []).some(function (o) { return o.id === hh; })) { location.replace("review.html#" + hh); return; }
    if (D.articles.some(function (a) { return a.id === hh; })) { location.replace("article.html#" + hh); return; }
    if (D.sections.some(function (s) { return s[0] === hh; })) { location.replace("section.html#" + hh); return; }
    if (TOPICS.some(function (t) { return t[0] === hh; })) { location.replace("news.html#" + hh); return; }
    if (REVCATS.some(function (t) { return t[0] === hh; })) { location.replace("reviews.html#" + hh); return; }
  }
  /* ---------- header and footer ---------- */
  var art0 = page === "article" ? (D.articles.filter(function (a) { return a.id === hashId(); })[0] || {}) : {};
  var sec = page === "section" ? hashId() : page === "article" ? ((D.articles.filter(function (a) { return a.id === hashId(); })[0] || {}).section) : page;
  var NAV = [["index.html", "Home", page === "home"],
    ["reviews.html", "Reviews", page === "reviews" || page === "review", REVCATS.map(function (c) { return ["reviews.html#" + c[0], c[1]]; })],
    ["news.html", "News", page === "news" || (page === "article" && art0.section !== "guides" && art0.section !== "previews"), [["news.html", "All news"]].concat(TOPICS.map(function (t) { return ["news.html#" + t[0], t[1]]; }))],
    ["bonuses.html", "Bonuses", page === "bonuses", [["bonuses.html", "All bonuses"], ["bonuses.html#sports-betting", "Sports betting offers"], ["bonuses.html#online-casino", "Online casino offers"], ["bonuses.html#how-it-works", "How offers are chosen"]]],
    ["previews.html", "Previews", sec === "previews" || page === "previews" || (page === "article" && art0.section === "previews"), [["previews.html", "All previews"]].concat(PTYPES.map(function (t) { return ["previews.html#" + t[0], t[1]]; })).concat(SPORTS.slice(0, 8).map(function (t) { return ["previews.html#" + t[0], t[1]]; }))],
    ["fpl.html", "FPL", page === "fpl" || (page === "article" && art0.section === "fpl"), [["fpl.html", "All FPL"]].concat(FPLT.map(function (t) { return ["fpl.html#" + t[0], t[1]]; }))],
    ["section.html#guides", "Guides", sec === "guides"]];
  $("#hdr").innerHTML =
    '<div class="notice">18+ only · This site contains affiliate links · We list licensed operators only and show where each is allowed · <a href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a></div>' +
    '<div class="wrap"><div class="edition"><span>' + tz(new Date().toISOString(), "Africa/Kampala", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + '</span><span>Kampala · London</span></div>' +
    '<a class="mast" href="index.html"><span class="shield" aria-hidden="true">BM</span><span><span class="wm" style="display:block">BetMeisters<span>.news</span></span><span class="tg" style="display:block">Betting · Casino · Markets</span></span></a>' +
    '<nav class="sections" aria-label="Sections">' + NAV.map(function (n) { var a = '<a href="' + n[0] + '"' + (n[2] ? ' class="on"' : "") + ">" + n[1] + (n[3] ? ' <span class="caret" aria-hidden="true">▾</span>' : "") + "</a>"; return n[3] ? '<span class="dd">' + a + '<span class="dd-menu">' + n[3].map(function (m) { return '<a href="' + m[0] + '">' + m[1] + "</a>"; }).join("") + "</span></span>" : a; }).join("") + "</nav></div>";
  $("#ftr").innerHTML = '<footer class="foot"><div class="wrap"><div class="foot-cols">' +
    '<div><h4>BetMeisters.news</h4><p>News, previews and reviews for English-speaking readers worldwide. Some operators pay us commission or fees (placement or flat monthly fees). That never changes a score, a ranking or a tip.</p><p>Tips come from <a href="' + BM_URL + '" style="display:inline;text-decoration:underline">BetMeisters.com</a>, which takes no affiliate deals, adverts or sponsorship.</p></div>' +
    '<div><h4>News</h4><a href="news.html">All news</a>' + TOPICS.map(function (t) { return '<a href="news.html#' + t[0] + '">' + t[1] + "</a>"; }).join("") + '</div>' +
    '<div><h4>Reviews</h4>' + REVCATS.map(function (t) { return '<a href="reviews.html#' + t[0] + '">' + t[1] + "</a>"; }).join("") + '<a href="bonuses.html">Bonuses and promotions</a><a href="previews.html">Previews</a><a href="fpl.html">FPL</a><a href="section.html#guides">Guides</a></div>' +
    '<div><h4>About</h4><a href="how-we-score.html">How we score</a><a href="disclosure.html">Affiliate disclosure</a><a href="safer-gambling.html">Safer gambling</a><a href="about.html">About us</a></div></div>' +
    '<p class="rg">18+ only. Gambling can be addictive; please play responsibly. UK: <a style="display:inline" href="https://www.begambleaware.org" rel="noopener">BeGambleAware.org</a>, National Gambling Helpline 0808 8020 133. US: 1-800-GAMBLER. We only list operators licensed by a regulator and show the countries each one accepts. Nothing here is financial advice.</p></div></footer>';
  if (page === "section" || page === "article" || page === "news" || page === "reviews" || page === "previews" || page === "bonuses" || page === "fpl") window.addEventListener("hashchange", function () { location.reload(); });

  /* ---------- pieces ---------- */
  /* Keith 17 Nov 09:02: smaller, clearer bet boxes. One compact layout for singles and multiples: label row, selection, event, then a stats line; legs as a tight list */
  var shortWhen = function (iso) { return tz(iso, "Africa/Kampala", { weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }) + " EAT"; };
  var shortWho = function (w) { return { "Number Cruncher Meister": "Number Cruncher", "The Original Meister": "Original Meister" }[w] || String(w || ""); };
  /* Keith 17 Nov 10:20: Pro Picks teaser. Never names a pick, an event or a price: counts, sports, average edge and the record only */
  function ppTeaser(art) {
    var P = D.proPicks, today = tz(new Date().toISOString(), "Africa/Kampala", { year: "numeric", month: "2-digit", day: "2-digit" });
    if (!P || !P.n) return "";
    var isToday = tz(P.date + "T12:00:00+03:00", "Africa/Kampala", { year: "numeric", month: "2-digit", day: "2-digit" }) === today;
    if (!isToday) return "";
    var sp = Object.keys(P.sports).map(function (k) { return P.sports[k] + " " + k.toLowerCase(); }).join(", ");
    var mine = art && (art.sports || []).filter(function (x) { return P.sports[x]; }).map(function (x) { return P.sports[x]; }).reduce(function (a, b) { return a + b; }, 0);
    var lead = art && mine ? (mine === 1 ? "One" : mine === 2 ? "Two" : mine === 3 ? "Three" : String(mine)) + " of today\u2019s Pro Picks " + (mine === 1 ? "is a " : "are ") + esc((art.sports || []).filter(function (x) { return P.sports[x]; }).join(" and ").toLowerCase()) + (mine === 1 ? " tip." : " tips.") : "Today\u2019s " + P.n + " Pro Picks: " + esc(sp) + ".";
    var rec = P.since && P.since.settled ? " Record since 14 Nov: " + P.since.settled + " settled, " + P.since.won + " won, " + (P.since.pts >= 0 ? "+" : "\u2212") + Math.abs(P.since.pts).toFixed(2) + " pts." : "";
    return '<a class="pp-tease" href="' + BM_URL + '" rel="noopener"><span class="pp-tag">Pro Picks</span><span class="pp-tx"><b>' + lead + "</b> Average edge " + (P.avgEdge >= 0 ? "+" : "") + (Math.round(P.avgEdge * 1000) / 10) + "%. Selections for BetMeisters.com subscribers only." + rec + '</span><span class="pp-go">BetMeisters.com \u2192</span></a>';
  }
  /* Keith 17 Nov 09:35: every bet box is the same default size and lines up: header row (label, Meister, price), body, then a stats row and footer pinned to the bottom */
  /* Keith 17 Nov 11:56: boxes follow BetMeisters.com live (D.bmLive from news/sync_record.js): result, start time, legs; a tip that is now Pro shows no selection */
  function liveOf(id) { return (D.bmLive || {})[id] || null; }
  var RES_TXT = { won: "Won", lost: "Lost", void: "Void", "half-won": "Half won", "half-lost": "Half lost", placed: "Placed" };
  function tipBox(t) {
    if (!t) return "";
    var L = liveOf(t.id);
    if (L) { t = Object.assign({}, t, { start: L.st || t.start, special: L.sp }); }
    if (L && L.pro) return '<a class="bx single" href="' + BM_URL + '" rel="noopener"><span class="bx-h"><span class="bx-tag">Pro tip</span><span class="bx-who">' + esc(shortWho(t.who)) + '</span><span class="bx-px">Pro</span></span><span class="bx-body"><span class="bx-sel">Subscribers only</span><span class="bx-ev">' + esc(t.event) + '</span><span class="bx-cmp">' + esc(t.comp) + '</span></span><span class="bx-f">Now a Pro tip at BetMeisters.com · 18+</span></a>';
    var res = L && L.r && L.r !== "open" ? L.r : null;
    var started = new Date(t.start) <= new Date();
    return '<a class="bx single" href="' + BM_URL + '" rel="noopener">' +
      '<span class="bx-h"><span class="bx-tag">' + (t.special ? "Meister Special" : "Tip") + '</span><span class="bx-who">' + esc(shortWho(t.who)) + '</span><span class="bx-px">' + t.price.toFixed(2) + "</span></span>" +
      '<span class="bx-body"><span class="bx-sel">' + esc(t.sel) + '</span><span class="bx-ev">' + esc(t.event) + '</span><span class="bx-cmp">' + esc(t.comp) + '</span><span class="bx-bar" title="Our chance"><i style="width:' + Math.round(t.chance * 100) + '%"></i></span><span class="bx-edge">Fair price ' + (1 / t.chance).toFixed(2) + " · edge " + ((t.price * t.chance - 1) >= 0 ? "+" : "−") + Math.abs(Math.round((t.price * t.chance - 1) * 1000) / 10) + "%</span></span>" +
      '<span class="bx-st"><span><small>Chance</small><b>' + Math.round(t.chance * 1000) / 10 + '%</b></span><span><small>' + (res ? "Result" : started ? "Status" : "Starts (EAT)") + "</small><b" + (res ? ' class="res-' + res + '"' : "") + ">" + (res ? RES_TXT[res] || res : started ? "In play" : shortWhen(t.start).replace(" EAT", "")) + "</b></span><span><small>Stake</small><b>" + (t.stake || 1) + " pt</b></span></span>" +
      '<span class="bx-f">Record at BetMeisters.com · no affiliate deals · 18+</span></a>';
  }
  /* Keith 16 Nov 17:45: acca and combo previews carry the full multiple, every leg, with its chance and the long-odds warning */
  function multiBox(m, maxLegs) {
    if (!m) return "";
    var oneIn = Math.max(2, Math.round(1 / m.chance));
    var L = liveOf(m.id), LL = L && L.legs || [];
    var legs = m.legs.map(function (l) { var x = LL.filter(function (z) { return z.e === l.event && z.s.replace(/ to win$/, "") === l.sel.replace(/ to win$/, ""); })[0] || LL.filter(function (z) { return z.e === l.event; })[0]; return x ? Object.assign({}, l, { start: x.st || l.start, r: x.r }) : l; }).sort(function (x, y) { return String(x.start).localeCompare(String(y.start)); });
    var mres = L && L.r !== "open" ? L.r : null;
    var show = maxLegs && legs.length > maxLegs ? legs.slice(0, maxLegs - 1) : legs, more = legs.length - show.length;
    return '<a class="bx multi' + (maxLegs ? " fixed" : "") + '" href="' + BM_URL + '" rel="noopener">' +
      '<span class="bx-h"><span class="bx-tag">' + (m.kind === "acca" ? "Acca" : "Combo") + " · " + m.legs.length + '-fold</span><span class="bx-who">' + esc(shortWho(m.who)) + '</span><span class="bx-px">' + m.price.toFixed(2) + "</span></span>" +
      '<span class="bx-legs">' + show.map(function (l) { return '<span class="bx-leg"><span class="lg-s"><b>' + esc(l.sel) + '</b><span class="lg-e">' + esc(l.event) + " · " + shortWhen(l.start) + '</span></span><span class="lg-p">' + (l.r && l.r !== "open" ? '<em class="res-' + l.r + '">' + (RES_TXT[l.r] || l.r) + "</em> " : "") + l.price.toFixed(2) + "</span></span>"; }).join("") + (more ? '<span class="bx-more">+ ' + more + " more leg" + (more > 1 ? "s" : "") + " in the full preview</span>" : "") + "</span>" +
      '<span class="bx-st"><span><small>Chance</small><b>1 in ' + oneIn + '</b></span><span><small>' + (mres ? "Result" : "Legs") + "</small><b" + (mres ? ' class="res-' + mres + '"' : "") + ">" + (mres ? (mres === "won" ? "Landed" : "Lost") : m.legs.length) + '</b></span><span><small>Stake</small><b>' + m.stake + ' pt</b></span></span>' +
      '<span class="bx-f">Every leg must win · long odds lose most of the time · 18+</span></a>';
  }
  function card(a, big) {
    return '<div class="' + (big ? "st" : "card") + '"><div class="kick">' + esc(a.kicker) + "</div><h3><a href=\"article.html#" + a.id + '">' + esc(a.title) + "</a></h3>" + (big ? "" : "<p>" + esc(a.dek) + "</p>") +
      '<div class="meta">' + dateOnly(a.date) + " · " + a.read + " min read" + (a.section === "previews" && (a.sports || []).length ? " · " + a.sports.map(function (t) { return '<a href="previews.html#' + sportSlug(t) + '">' + esc(t) + "</a>"; }).join(", ") : (a.topics || []).length ? " · " + a.topics.map(function (t) { return '<a href="news.html#' + topicSlug(t) + '">' + esc(t) + "</a>"; }).join(", ") : "") + (a.legal ? ' · <span style="color:var(--gold);font-weight:700">Where it\'s legal: checked ' + esc(a.legal.checked) + "</span>" : "") + "</div></div>";
  }
  function recordStrip() {
    var r = D.record, cell = function (lab, x) { return '<div><div class="rk">' + lab + '</div><div class="rb ' + (x.pts >= 0 ? "pos" : "neg") + '">' + (x.pts >= 0 ? "+" : "−") + Math.abs(x.pts).toFixed(2) + ' pts</div><div class="rs">' + x.n + " settled · " + x.won + " won</div></div>"; };
    /* Keith 16 Nov 18:10: dark record box in the middle, three equal boxes */
    return '<div class="record">' + cell("Number Cruncher Meister", r.ncm) + '<div class="rec-lab"><div class="rk">The BetMeisters record</div><p>Every tip quoted here is on the public record at BetMeisters.com, win or lose. As of ' + esc(r.asOf) + ".</p></div>" + cell("The Original Meister", r.tom) + "</div>";
  }

  /* ---------- pages ---------- */
  var A = D.articles.slice().sort(byDate);
  if (page === "home") {
    /* Keith 16 Nov 17:59-18:00: home top = ONE lead (calendar pick: article.lead, else newest event / weekend / news), a 'Today' strip (racing card, football, other sports, today's tips), 'From the desk' (newest news, guide, review, acca/combo), then tip boxes; nothing shown twice */
    var shown = {}, take = function (a) { if (a) shown[a.id] = 1; return a; };
    var notShown = function (a) { return !shown[a.id]; };
    /* Keith 17 Nov 08:55: the home top rotates with each batch. A 'lead' flag only holds on the Kampala day it was published (or until leadUntil); after that the newest news, guide, event or weekend preview leads. Refreshed tiles say 'Updated HH:MM today'; a 'New today' line lists everything published or updated since midnight. */
    var kday = function (iso) { return tz(iso, "Africa/Kampala", { year: "numeric", month: "2-digit", day: "2-digit" }); };
    var todayK = kday(new Date().toISOString());
    var leadOk = function (a) { return a.lead && (a.leadUntil ? new Date(a.leadUntil) > new Date() : kday(a.date) === todayK); };
    var hm = function (iso) { return tz(iso, "Africa/Kampala", { hour: "2-digit", minute: "2-digit", hour12: false }); };
    var whenMeta = function (x) { return (x.updated && kday(x.updated) === todayK && kday(x.date) !== todayK ? "Updated " + hm(x.updated) + " today" : kday(x.date) === todayK ? "Today " + hm(x.date) : dateOnly(x.date)); };
    var lead = take(A.filter(leadOk)[0] || A.filter(function (a) { return a.section === "news" || a.section === "guides" || (a.section === "previews" && /event|weekend-football/.test(ptOf(a))); })[0] || A[0]);
    var TODAY = [["racing-card", "Racing card", "Tomorrow's card goes up at 19:00"], ["daily-football", "Football", "Tomorrow's preview goes up at 19:00"], ["other-sports", "Other sports", "Roundup at 12:15, US sports at 22:30"], ["tip", "Today's BetMeisters tips", "Tips roundup at 12:15 and 22:30"]];
    var tile = function (t) { var x = A.filter(function (a) { return a.section === "previews" && ptOf(a) === t[0] && notShown(a); })[0]; if (x) take(x);
      return '<a class="today-tile" href="' + (x ? "article.html#" + x.id : "previews.html#" + t[0]) + '"><span class="kick">' + esc(t[1]) + "</span><b>" + esc(x ? x.title : "Coming soon") + '</b><span class="meta">' + (x ? whenMeta(x) + " · " + x.read + " min read" : esc(t[2])) + "</span></a>"; };
    var todayH = TODAY.map(tile).join("");
    /* Keith 17 Nov 11:51: the Today column ended short of the lead; extra headlines (news, then non-tip previews) are added below, and only as many as fit beside the lead are shown */
    var XT = [];
    var OPN = (D.operators || []).filter(function (o) { return !o.example && !o.demo; });
    var revNew = OPN.slice().sort(function (x, y) { return String(y.addedAt || "").localeCompare(String(x.addedAt || "")); })[0];
    var desk = [["News", A.filter(function (a) { return a.section === "news" && notShown(a); })[0]], ["Guide", A.filter(function (a) { return a.section === "guides" && notShown(a); })[0]], ["Acca or combo", A.filter(function (a) { return a.section === "previews" && /acca|combo/.test(ptOf(a)) && notShown(a); })[0]]];
    desk.forEach(function (d) { take(d[1]); });
    var deskH = desk.filter(function (d) { return d[1]; }).map(function (d) { var x = d[1]; return '<div class="card"><div class="kick">' + esc(d[0]) + " · " + esc(x.kicker.split(" · ").slice(-1)[0]) + '</div><h3><a href="article.html#' + x.id + '">' + esc(x.title) + "</a></h3><p>" + esc(x.dek) + '</p><div class="meta">' + whenMeta(x) + " · " + x.read + " min read</div></div>"; }).join("") +
      /* Keith 17 Nov 11:53: two reviews in the desk card, title and a short line each */
      (revNew ? '<div class="card rev2"><div class="kick">Reviews · newest</div>' + OPN.slice().sort(function (x, y) { return String(y.addedAt || "").localeCompare(String(x.addedAt || "")); }).slice(0, 2).map(function (o) { return '<div class="rv"><span class="kick" style="color:var(--ink-3)">' + esc(revCatOf(o)[1]) + '</span><h3><a href="review.html#' + o.id + '">' + esc(o.name) + ' review</a></h3><p class="rv-ln">' + esc((o.verdict || "").split(". ")[0]) + '.</p><div class="meta">' + (o.score != null ? o.score.toFixed(1) + " out of 10" : o.provisional != null ? "Provisional " + o.provisional.toFixed(1) + " · in progress" : "In progress") + "</div></div>"; }).join("") + "</div>" : "");
    /* Keith 16 Nov 19:32: only tips that can still be backed (first start in the future); started tips drop off the home tip wall */
    var notStarted = function (a) { var o = a.tip || a.multi, L = o && liveOf(o.id); if (L && (L.r !== "open" || L.pro)) return false;
      var st = a.tip ? (L && L.st || a.tip.start) : (a.multi && a.multi.legs.length ? ((L && L.legs && L.legs.length ? L.legs : a.multi.legs).map(function (l) { return l.st || l.start; }).sort()[0]) : ""); return st && new Date(st) > new Date(); };
    var PV0 = A.filter(function (a) { return a.section === "previews" && (a.tip || a.multi) && notShown(a) && notStarted(a); });
    /* Keith 17 Nov 09:02: two multiples side by side, then up to three singles */
    var PVm = PV0.filter(function (a) { return a.multi; }).slice(0, 3), PVs = PV0.filter(function (a) { return !a.multi; });
    var PV = PVm.concat(PVs).slice(0, 6); if (PV.length > 3 && PV.length < 6) PV = PV.slice(0, 3);
    var OPS = OPN;
    var revCard = function (o) { return '<div class="card"><div class="kick">' + esc(revCatOf(o)[1]) + (o.draft ? " · in progress" : "") + '</div><h3><a href="review.html#' + o.id + '">' + esc(o.name) + ' review</a></h3><p>' + esc((o.verdict || "").split(". ")[0]) + '.</p><div class="meta">' + (o.score != null ? o.score.toFixed(1) + " out of 10" : o.provisional != null ? "Provisional " + o.provisional.toFixed(1) + " · not ranked yet" : "Score to come") + " · " + opTags(o).map(function (t) { return esc(t); }).join(", ") + "</div></div>"; };
    /* Keith 17 Nov 09:02: the lead box looked empty: an excerpt from the piece, then 'Also on the desk' headlines fill it */
    var leadEx = (function () { var t = (lead.body || []).join(" ").replace(/<h[23][^>]*>.*?<\/h[23]>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); var w = t.split(" "); return w.length > 70 ? w.slice(0, 70).join(" ") + "…" : t; })();
    var ALSO = A.filter(function (a) { return notShown(a) && !(a.section === "previews" && (a.tip || a.multi)); }).slice(0, 3); ALSO.forEach(take);
    var alsoH = ALSO.length ? '<div class="also"><div class="kick" style="color:var(--ink-3)">Also on the desk</div>' + ALSO.map(function (a) { return '<a href="article.html#' + a.id + '"><span class="kick">' + esc(a.kicker.split(" · ")[0]) + "</span><b>" + esc(a.title) + "</b></a>"; }).join("") + "</div>" : "";
    XT = A.filter(function (a) { return notShown(a) && (a.section === "news" || (a.section === "previews" && !a.tip && !a.multi)); }).slice(0, 4); XT.forEach(take);
    todayH += XT.map(function (x) { return '<a class="today-tile xt" hidden href="article.html#' + x.id + '"><span class="kick">' + esc(x.kicker.split(" · ")[0]) + "</span><b>" + esc(x.title) + '</b><span class="meta">' + whenMeta(x) + " · " + x.read + " min read</span></a>"; }).join("");
    var NEWT = A.filter(function (a) { return kday(a.date) === todayK || (a.updated && kday(a.updated) === todayK); });
    var newH = NEWT.length ? '<div class="newtoday"><b>New today</b>' + NEWT.map(function (a) { var up = kday(a.date) !== todayK; return '<a href="article.html#' + a.id + '">' + esc(a.multi ? (a.multi.kind === "combo" ? "Combo" : "Acca") + " preview at " + a.multi.price : a.title.split(":")[0]) + (up ? ' <span class="upd">updated</span>' : "") + "</a>"; }).join("") + "</div>" : "";
    $("#main").innerHTML = newH +
      '<div class="front" style="margin-top:22px"><article class="lead"><div class="kick">' + esc(lead.kicker) + '</div><h2><a href="article.html#' + lead.id + '">' + esc(lead.title) + '</a></h2><p class="dek">' + esc(lead.dek) + "</p>" + '<div class="meta">By the BetMeisters.news desk · ' + whenMeta(lead) + " · " + lead.read + " min read</div>" + (lead.multi ? multiBox(lead.multi) : lead.tip ? tipBox(lead.tip) : '<p class="lead-ex">' + esc(leadEx) + '</p><a class="lead-more" href="article.html#' + lead.id + '">Read the full ' + (lead.section === "guides" ? "guide" : lead.section === "previews" ? "preview" : "story") + " →</a>") + alsoH + "</article>" +
      '<aside class="today"><div class="sec-h" style="margin:0 0 6px"><h2 style="font-size:22px">Today</h2><a href="previews.html">All previews →</a></div>' + todayH + "</aside></div>" +
      '<div class="sec-h"><h2>From the desk</h2><a href="news.html">All news →</a></div><div class="cards desk4">' + deskH + "</div>" +
      /* Keith 16 Nov 19:23: no topic filter chips on the home page; filters live on News, Previews, Guides */
      (PV.length ? '<div class="sec-h"><h2>Tips from BetMeisters.com</h2><a href="previews.html#tip">All tip previews →</a></div><p class="meta" style="margin:-4px 0 12px">Copied exactly as published on BetMeisters.com, which takes no affiliate deals, adverts or sponsorship. Tap a box for its record on BetMeisters.com, or the headline for the full preview.</p>' + ppTeaser() +
        '<div class="tipwall grid3">' + PV.map(function (a) { return '<div class="tw-item"><div class="kick"><a href="article.html#' + a.id + '" style="text-decoration:none">' + esc(a.title) + "</a></div>" + (a.multi ? multiBox(a.multi, 4) : tipBox(a.tip)) + "</div>"; }).join("") + "</div>" : "") +
      recordStrip() +
      '<div class="sec-h"><h2>Reviews</h2><a href="reviews.html">All reviews →</a></div>' +
      '<div class="chips topic-menu">' + REVCATS.map(function (c) { var n = OPS.filter(function (o) { return opTags(o).indexOf(c[2]) >= 0; }).length; return '<a class="chip" href="reviews.html#' + c[0] + '">' + c[1] + (n ? " · " + n : "") + "</a>"; }).join("") + "</div>" +
      (OPS.length ? '<div class="cards">' + OPS.map(revCard).join("") + "</div>" : '<p class="empty">The first reviews are being written now.</p>') +
      '<div class="sec-h"><h2>Bonuses and promotions</h2><a href="bonuses.html">All offers →</a></div><div class="cards">' + (D.offers || []).slice().sort(function (x, y) { return (y.paid ? 1 : 0) - (x.paid ? 1 : 0); }).slice(0, 3).map(function (f) { var o = (D.operators || []).filter(function (z) { return z.id === f.op; })[0] || {}; return '<div class="card"><div class="kick">' + (f.paid ? "Paid placement" : "Offer") + " · " + esc(f.countries.join(", ")) + ' only</div><h3><a href="bonuses.html#' + (f.product === "Online casino" ? "online-casino" : "sports-betting") + '">' + esc((o.name || "") + ": " + f.title) + '</a></h3><div class="meta"><a href="review.html#' + esc(f.op) + '">Our review: ' + (o.score != null ? o.score.toFixed(1) : o.provisional != null ? "provisional " + o.provisional.toFixed(1) : "not yet scored") + "</a> · 18+ · T&amp;Cs apply</div></div>"; }).join("") + "</div>" +
      '<div class="sec-h"><h2>Guides</h2><a href="section.html#guides">All guides →</a></div><div class="cards">' + A.filter(function (a) { return a.section === "guides" && notShown(a); }).slice(0, 3).map(function (a) { return card(a); }).join("") + "</div>" +
      '<div class="firewall"><div class="kick" style="color:var(--ink)">The firewall</div><div class="fw-cols"><p><b>BetMeisters.com</b> publishes the tips: chance, price and result for every one, win or lose. It takes <b>no affiliate deals, no adverts and no sponsorship</b>. No tip is ever picked, priced, timed or kept because of a commercial deal.</p><p><b>BetMeisters.news</b> is where we earn: some operators pay us commission, a placement fee or a flat monthly fee, and every paid link or placement is labelled. We are a business and this is how we earn, openly. <b>No ranking or score can ever be bought.</b> <a href="disclosure.html">How we make money</a></p></div></div>';
  }
  if (page === "section" && hashId() === "previews") { location.replace("previews.html"); return; }
  if (page === "previews") {
    var sk = hashId(), sn = (SPORTS.filter(function (t) { return t[0] === sk; })[0] || [])[1], pn = (PTYPES.filter(function (t) { return t[0] === sk; })[0] || [])[1];
    var PA = A.filter(function (a) { return a.section === "previews"; }), PL = PA.filter(function (a) { return pn ? ptOf(a) === sk : !sn || (a.sports || []).indexOf(sn) >= 0; });
    if (pn) sn = null;
    var cnt = function (n) { return PA.filter(function (a) { return (a.sports || []).indexOf(n) >= 0; }).length; };
    document.title = (pn || (sn ? sn + " previews" : "Previews")) + " · BetMeisters.news";
    $("#main").innerHTML = '<div class="sec-h" style="margin-top:22px"><h2 style="font-size:40px">' + esc(pn || (sn ? sn + " previews" : "Previews")) + '</h2><span class="meta">' + PL.length + (PL.length === 1 ? " preview" : " previews") + "</span></div>" +
      '<p class="meta" style="margin:-6px 0 10px">Daily racing cards, football and other-sports previews, event previews and the weekend football preview. Every preview links to BetMeisters.com, and any tip in it is copied exactly as published there (no affiliate deals, adverts or sponsorship). The numbers show how many we have written.</p>' + ppTeaser() +
      '<nav class="chips topic-menu" aria-label="Preview types"><a class="chip' + (sk ? "" : " on") + '" href="previews.html">All · ' + PA.length + "</a>" + PTYPES.map(function (t) { var n = PA.filter(function (a) { return ptOf(a) === t[0]; }).length; return '<a class="chip' + (t[0] === sk ? " on" : "") + (n ? "" : " zero") + '" href="previews.html#' + t[0] + '">' + t[1] + " · " + n + "</a>"; }).join("") + "</nav>" +
      '<nav class="chips topic-menu" aria-label="Sports">' + SPORTS.map(function (t) { var n = cnt(t[1]); return '<a class="chip' + (t[0] === sk ? " on" : "") + (n ? "" : " zero") + '" href="previews.html#' + t[0] + '">' + t[1] + " · " + n + "</a>"; }).join("") + "</nav>" +
      (PL.length ? '<div class="tipwall">' + PL.map(function (a) { return '<div class="card"><div class="kick">' + esc(a.kicker) + '</div><h3><a href="article.html#' + a.id + '">' + esc(a.title) + "</a></h3><p>" + esc(a.dek) + "</p>" + (a.multi ? multiBox(a.multi) : a.tip ? tipBox(a.tip) : bmBox()) + '<div class="meta">' + dateOnly(a.date) + " · " + a.read + " min read · " + (a.sports || []).map(function (t) { return '<a href="previews.html#' + sportSlug(t) + '">' + esc(t) + "</a>"; }).join(", ") + "</div></div>"; }).join("") + "</div>" : '<p class="empty">No ' + esc(sn || "") + " previews yet. They are written when a BetMeisters tip on this sport goes up.</p>");
  }
  /* Keith 16 Nov 17:14: Bonuses and promotions. Operators can buy a highly placed spot, always labelled, always linked to the real review and score; every offer approved for the country it is shown to */
  if (page === "bonuses") {
    var bk = hashId(), bt = bk === "sports-betting" ? "Sports betting" : bk === "online-casino" ? "Online casino" : "";
    var OF = (D.offers || []).filter(function (f) { return !bt || f.product === bt; });
    var opOf = function (f) { return (D.operators || []).filter(function (o) { return o.id === f.op; })[0] || {}; };
    var sc = function (o) { return o.score != null ? o.score : o.provisional != null ? o.provisional : -1; };
    var paid = OF.filter(function (f) { return f.paid; }), unpaid = OF.filter(function (f) { return !f.paid; }).sort(function (x, y) { return sc(opOf(y)) - sc(opOf(x)); });
    var offCard = function (f) { var o = opOf(f);
      return '<div class="offer' + (f.paid ? " paid" : "") + (f.demo ? " demo" : "") + '"><div class="of-top"><span class="of-lab">' + (f.paid ? "Paid placement" : "Not a paid placement") + "</span>" + f.countries.map(function (c) { return '<span class="of-cty">' + esc(c) + " only</span>"; }).join("") + '</div><div class="of-op">' + esc(o.name || f.op) + ' · <span class="meta">' + esc(f.product) + '</span></div><h3>' + esc(f.title) + "</h3>" +
        '<ul class="of-terms">' + f.terms.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<p class="of-ok"><b>Approved for:</b> ' + esc(f.approved) + "</p>" +
        '<div class="of-foot"><a class="of-rev" href="review.html#' + esc(f.op) + '">Our review: ' + (o.score != null ? o.score.toFixed(1) + " / 10" : o.provisional != null ? "provisional " + o.provisional.toFixed(1) + " (not yet published)" : "not yet scored") + " →</a>" +
        '<span class="meta">Checked ' + esc(f.checked) + (f.source ? ' · <a href="' + esc(f.source) + '" rel="noopener">source</a>' : "") + "</span></div>" +
        '<p class="meta of-rg">18+ · T&amp;Cs apply · ' + esc(f.countries.join(", ")) + " only · BeGambleAware.org</p></div>"; };
    document.title = "Bonuses and promotions · BetMeisters.news";
    $("#main").innerHTML = '<div class="sec-h" style="margin-top:22px"><h2 style="font-size:40px">' + esc(bt ? bt + " offers" : "Bonuses and promotions") + "</h2></div>" +
      '<nav class="chips topic-menu"><a class="chip' + (bt ? "" : " on") + '" href="bonuses.html">All</a><a class="chip' + (bk === "sports-betting" ? " on" : "") + '" href="bonuses.html#sports-betting">Sports betting</a><a class="chip' + (bk === "online-casino" ? " on" : "") + '" href="bonuses.html#online-casino">Online casino</a></nav>' +
      '<div class="firewall" id="how-it-works"><div class="kick" style="color:var(--ink)">How offers are chosen</div><div class="fw-cols"><p><b>Every offer must be approved where it is shown:</b> the operator is licensed in that country and the offer meets its rules (in the UK, 10x wagering at most and no mixed sports and casino offers). Each card says which countries it is for, and we only show it there.</p><p><b>Operators can pay for a featured spot.</b> Paid placements are labelled, sit in their own block, and always show our real review score with a link to the review. Payment never changes a score, a review ranking or the order of the unpaid list, which follows our score. <a href="disclosure.html">How we make money</a></p></div></div>' +
      (paid.length ? '<div class="sec-h"><h2>Featured</h2><span class="meta">Paid placements</span></div><div class="offers">' + paid.map(offCard).join("") + "</div>" : "") +
      '<div class="sec-h"><h2>All offers</h2><span class="meta">Ordered by our review score</span></div>' + (unpaid.length ? '<div class="offers">' + unpaid.map(offCard).join("") + "</div>" : '<p class="empty">No offers in this category yet.</p>') +
      '<p class="meta" style="margin-top:18px">Offers change often. We re-check them at least weekly and show the date we last checked. Always read the operator\'s full terms before you sign up. 18+. <a href="safer-gambling.html">Safer gambling</a>.</p>';
  }
  if (page === "fpl") {
    var fk = hashId(), fn = (FPLT.filter(function (t) { return t[0] === fk; })[0] || [])[1];
    var FA = A.filter(function (a) { return a.section === "fpl"; }), FL = FA.filter(function (a) { return !fn || a.fplType === fk; });
    document.title = (fn || "Fantasy Premier League") + " · BetMeisters.news";
    $("#main").innerHTML = '<div class="sec-h" style="margin-top:22px"><h2 style="font-size:40px">' + esc(fn || "FPL") + '</h2><span class="meta">Fantasy Premier League</span></div>' +
      '<p class="meta" style="margin:-6px 0 10px">A deadline preview before every gameweek and a review after it, built on the official FPL data and our own match probabilities. FPL is free to play; nothing here is a bet.</p>' +
      '<nav class="chips topic-menu"><a class="chip' + (fn ? "" : " on") + '" href="fpl.html">All · ' + FA.length + "</a>" + FPLT.map(function (t) { var n = FA.filter(function (a) { return a.fplType === t[0]; }).length; return '<a class="chip' + (t[0] === fk ? " on" : "") + (n ? "" : " zero") + '" href="fpl.html#' + t[0] + '">' + t[1] + " · " + n + "</a>"; }).join("") + "</nav>" +
      (FL.length ? '<div class="cards">' + FL.map(function (a) { return card(a); }).join("") + "</div>" : '<p class="empty"><b>Coming this week:</b> the Gameweek 11 deadline preview (the Premier League returns after the November international break), then a review after every gameweek.</p>');
  }
  if (page === "news") {
    var tk = hashId(), tn = (TOPICS.filter(function (t) { return t[0] === tk; })[0] || [])[1];
    var NL = A.filter(function (a) { return a.section === "news"; }) /* Keith 17 Nov 11:56: News page = news only; previews, guides and FPL have their own pages */.filter(function (a) { return !tn || (a.topics || []).indexOf(tn) >= 0; });
    document.title = (tn || "News") + " · BetMeisters.news";
    $("#main").innerHTML = '<div class="sec-h" style="margin-top:22px"><h2 style="font-size:40px">' + esc(tn || "All news") + '</h2><span class="meta">' + NL.length + (NL.length === 1 ? " story" : " stories") + "</span></div>" +
      '<nav class="chips topic-menu" aria-label="Topics"><a class="chip' + (tn ? "" : " on") + '" href="news.html">All</a>' + TOPICS.map(function (t) { return '<a class="chip' + (t[0] === tk ? " on" : "") + '" href="news.html#' + t[0] + '">' + t[1] + "</a>"; }).join("") + "</nav>" +
      (NL.length ? '<div class="cards">' + NL.map(function (a) { return card(a); }).join("") + "</div>" : '<p class="empty">No stories in this topic yet. New ones are added every day.</p>');
  }
  if (page === "section") {
    var k = hashId() || "news", L = A.filter(function (a) { return a.section === k; });
    document.title = secName(k) + " · BetMeisters.news";
    $("#main").innerHTML = '<div class="sec-h" style="margin-top:22px"><h2 style="font-size:40px">' + esc(secName(k)) + "</h2><span class=\"meta\">" + L.length + " stories</span></div>" +
      (L.length ? '<div class="cards">' + L.map(function (a) { return card(a); }).join("") + "</div>" : '<p class="empty">No stories here yet. New ones are added every day.</p>');
  }
  if (page === "article") {
    var a = D.articles.filter(function (x) { return x.id === hashId(); })[0];
    if (!a) { $("#main").innerHTML = '<div class="page"><h1>Story not found</h1><p><a href="index.html">Back to the front page</a></p></div>'; return; }
    document.title = a.title + " · BetMeisters.news";
    $("#main").innerHTML = '<article class="art"><div class="kick"><a href="section.html#' + a.section + '" style="text-decoration:none">' + esc(secName(a.section)) + "</a> · " + esc(a.kicker.split(" · ").slice(1).join(" · ")) + "</div><h1>" + esc(a.title) + '</h1><p class="dek">' + esc(a.dek) + "</p>" +
      ((a.topics || []).length || (a.sports || []).length ? '<div class="chips topic-menu">' + (a.sports || []).map(function (t) { return '<a class="chip" href="previews.html#' + sportSlug(t) + '">' + esc(t) + "</a>"; }).join("") + (a.topics || []).map(function (t) { return '<a class="chip" href="news.html#' + topicSlug(t) + '">' + esc(t) + "</a>"; }).join("") + "</div>" : "") +
      '<div class="byline"><span>By the BetMeisters.news desk</span><span>' + dateOnly(a.date) + "</span><span>" + a.read + " min read</span></div>" +
      (a.legal ? '<div class="legal"><div class="kick">Where it\'s legal<span>Checked ' + esc(a.legal.checked) + "</span></div>" + esc(a.legal.text) + "</div>" : "") +
      (a.multi ? multiBox(a.multi) : a.tip ? tipBox(a.tip) : (a.section === "previews" ? bmBox() : "")) + (a.section === "previews" && /daily-football|racing-card|other-sports|event|weekend-football/.test(ptOf(a)) ? ppTeaser(a) : "") + '<div class="body">'  + a.body.join("") + "</div>" + (a.section === "previews" ? '<div style="margin-top:18px">' + bmBox() + "</div>" : "") +
      (a.sources && a.sources.length ? '<div class="sources"><div class="kick" style="color:var(--ink)">Sources</div><ol>' + a.sources.map(function (s) { return '<li><a href="' + esc(s[1]) + '" rel="noopener">' + esc(s[0]) + "</a></li>"; }).join("") + "</ol></div>" : "") +
      '<p class="meta" style="margin-top:22px">18+. This page may contain affiliate links; see our <a href="disclosure.html">disclosure</a>. Tips are copied from BetMeisters.com exactly as published.</p></article>' +
      '<div class="sec-h"><h2>More from the desk</h2></div><div class="cards">' + A.filter(function (x) { return x !== a; }).slice(0, 3).map(function (x) { return card(x); }).join("") + "</div>";
  }
  if (page === "reviews") {
    var rk = hashId() || "bookies", RC = REVCATS.filter(function (c) { return c[0] === rk; })[0] || REVCATS[0];
    document.title = RC[1] + " · BetMeisters.news";
    var inprog = (D.operators || []).filter(function (o) { return opTags(o).indexOf(RC[2]) >= 0 && !o.example && (o.draft || o.score == null); });
    var real = inprog.filter(function (o) { return !o.demo; }), demos = inprog.filter(function (o) { return o.demo; });
    $("#main").innerHTML = '<div class="page" style="max-width:none"><div class="kick">Reviews · scored, ranked, never for sale</div><h1>' + esc(RC[1]) + '</h1>' +
      '<nav class="chips topic-menu" aria-label="Review types">' + REVCATS.map(function (c) { return '<a class="chip' + (c[0] === RC[0] ? " on" : "") + '" href="reviews.html#' + c[0] + '">' + c[1] + "</a>"; }).join("") + "</nav>" +
      '<p style="max-width:720px">Every operator is scored out of 10 on the same <a href="how-we-score.html">published method</a>. The order follows the score, never commission or fees. Each line shows the licence and the countries the operator accepts.</p>' + rankBlock(false) +
      '<div class="sec-h"><h2>In progress</h2><span class="meta">Not ranked until the checks are done</span></div>' +
      (real.length ? '<div class="cards">' + real.map(function (o) { return '<div class="card"><div class="kick">Draft · ' + esc(opTags(o).join(" · ")) + '</div><h3><a href="review.html#' + o.id + '">' + esc(o.name) + ' review</a></h3><p>' + esc((o.verdict || "").split(". ")[0]) + '.</p><div class="meta">Provisional ' + (o.provisional != null ? o.provisional.toFixed(1) : "–") + " · " + Math.round((o.coverage || 0) * 100) + "% checked · not ranked" + (demos.filter(function (d) { return d.id === o.id + "-demo"; }).length ? ' · <a href="review.html#' + o.id + '-demo">full demo</a>' : "") + "</div></div>"; }).join("") + "</div>" : '<p class="empty">No ' + esc(RC[1].toLowerCase()) + " in progress yet.</p>") +
      "</div>";
    wireRank(RC[2]);
  }

  if (page === "review") {
    var o = (D.operators || []).filter(function (x) { return x.id === hashId(); })[0];
    if (!o) { $("#main").innerHTML = '<div class="page"><h1>Review not found</h1><p><a href="reviews.html">All reviews</a></p></div>'; return; }
    document.title = o.name + " review · BetMeisters.news";
    var CORE = ["Licence", "Safety", "Payments", "Terms", "Safer gambling", "Support", "Design and experience", "Reputation"];
    var mods = CORE.concat(o.products.filter(function (p) { return (o.modules || {})[p] !== undefined; }));
    var pct = Math.round((o.coverage || 0) * 100);
    var lvl = o.score == null ? "Score withheld" : o.level;
    var bar = function (m) { var v = (o.modules || {})[m]; var isMain = m === o.mainProduct;
      return '<div class="bar' + (v == null ? " na" : "") + '"><span class="bl">' + esc(m) + (isMain ? ' <small>main product</small>' : CORE.indexOf(m) < 0 ? ' <small>other product</small>' : "") + '</span><span class="bt"><i style="width:' + (v == null ? 0 : v * 10) + '%"></i></span><span class="bv">' + (v == null ? "not yet" : v.toFixed(1)) + "</span></div>"; };
    var ev = (o.evidence || []);
    var evRows = mods.map(function (m) { var R = ev.filter(function (e) { return e[2] === m; }); if (!R.length) return "";
      return '<tr class="evm"><td colspan="4">' + esc(m) + "</td></tr>" + R.map(function (e) { return "<tr><td>" + esc(e[0]) + "</td><td>" + esc(e[1]) + '</td><td class="sc">' + (e[3] == null ? "–" : (+e[3]).toFixed(1)) + "</td><td>" + esc(e[4]) + (e[5] ? ' <a href="' + esc(e[5]) + '" rel="noopener">source</a>' : "") + "</td></tr>"; }).join(""); }).join("");
    $("#main").innerHTML = (o.example ? '<div class="example-flag">EXAMPLE LAYOUT · fictional operator · not a review · not shown in any ranking</div>' : "") +
      (o.demo ? '<div class="example-flag">DEMO · internal test · every check filled in, placeholders marked · never published or ranked</div>' : o.draft ? '<div class="example-flag">DRAFT · internal preview · ' + pct + '% of the weight checked · not published or ranked until the desk review reaches 60%</div>' : "") +
      '<article class="art rev"><div class="kick"><a href="reviews.html#' + revCatOf(o)[0] + '" style="text-decoration:none">' + esc(revCatOf(o)[1]) + "</a></div>" + '<div class="chips topic-menu">' + opTags(o).map(function (t) { var c = REVCATS.filter(function (x) { return x[2] === t; })[0]; return '<a class="chip" href="' + (c ? "reviews.html#" + c[0] : "news.html#" + topicSlug(t)) + '">' + esc(t) + "</a>"; }).join("") + "</div><h1>" + esc(o.name) + ' review</h1><p class="dek">' + esc(o.verdict) + "</p>" +
      '<div class="rev-top"><div class="rev-score' + (o.score == null && o.provisional != null ? " prov" : "") + '"><span>' + (o.score != null ? o.score.toFixed(1) : o.provisional != null ? o.provisional.toFixed(1) : "–") + '</span><small>' + (o.score != null ? "out of 10" : o.provisional != null ? "provisional · " + pct + "% checked · terms not yet read" : pct + "% checked") + '</small><em class="lvl">' + esc(o.score == null && o.provisional != null ? "Not yet published" : lvl) + '</em></div><div class="rev-lic"><div class="kick" style="color:var(--ink)">Licence and countries<span class="meta" style="float:right;letter-spacing:0;text-transform:none">Checked ' + esc(o.checked) + "</span></div>" +
      o.licences.map(function (l) { return "<p><b>" + esc(l.reg) + "</b> · " + esc(l.num) + (l.url ? ' · <a href="' + esc(l.url) + '" rel="noopener">check on the register</a>' : "") + "</p>"; }).join("") +
      '<p><span class="ok">Accepts:</span> ' + esc(o.allowed) + '</p><p><span class="no">Not allowed:</span> ' + esc(o.excluded) + "</p></div></div>" +
      '<h3 class="rev-h">How the score is made</h3><p class="meta">Overall = 40% core + 45% main product + 15% the better of the main product and the other products, so a weaker second product never lowers the score. <a href="how-we-score.html">Full method</a></p><div class="bars">' + mods.map(bar).join("") + "</div>" +
      '<div class="pc"><div><h3 class="rev-h">Good</h3><ul>' + o.pros.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div><div><h3 class="rev-h">Not so good</h3><ul>' + o.cons.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
      '<div class="body">' + (o.body || []).join("") + "</div>" +
      (ev.length ? '<h3 class="rev-h">What we checked</h3><div class="evw"><table class="rank ev"><thead><tr><th>ID</th><th>Check</th><th>Score</th><th>What we found</th></tr></thead><tbody>' + evRows + "</tbody></table></div>" : "") +
      (o.example || o.draft || o.score == null ? "" : '<a class="cta" href="' + esc(o.link || "#") + '" rel="sponsored noopener">Visit ' + esc(o.name) + ' <small>18+ · paid link · ' + esc(o.allowed) + " only · T&amp;Cs apply</small></a>") +
      '<p class="meta" style="margin-top:18px">Scored on our <a href="how-we-score.html">published method</a>. Commission and fees never change a score. 18+. <a href="safer-gambling.html">Safer gambling</a>.</p></article>';
  }
  function rankBlock(short) {
    var LIC = ["All", "UKGC", "US states", "MGA", "Curaçao", "Other"], PROD = ["All", "Sportsbook", "Casino", "Sweepstakes", "Prediction market", "Crypto"];
    var chips = function (name, list) { return '<div class="chips" data-f="' + name + '">' + list.map(function (x, i) { return '<button type="button" class="chip' + (i ? "" : " on") + '" data-v="' + x + '">' + x + "</button>"; }).join("") + "</div>"; };
    return '<div class="rank-wrap"><div class="rank-head">' + chips("lic", LIC) + '</div><div class="rank-body"></div>' +
      '<p class="meta" style="margin-top:8px">Ranked by our score only. No ranking can be bought with commission or fees. <a href="how-we-score.html">How we score</a> · <a href="disclosure.html">Affiliate disclosure</a></p></div>';
  }
  function wireRank(cat) {
    var W = $(".rank-wrap"); if (!W) return; var F = { lic: "All", tag: cat || "All" };
    var draw = function () {
      var L = (D.operators || []).filter(function (o) { return !o.example && !o.draft && o.score != null; }).filter(function (o) { return (F.lic === "All" || (o.licTags || []).indexOf(F.lic) >= 0) && (F.tag === "All" || opTags(o).indexOf(F.tag) >= 0); }).sort(function (x, y) { return y.score - x.score; });
      W.querySelector(".rank-body").innerHTML = L.length ? '<table class="rank"><thead><tr><th>#</th><th>Operator</th><th>Licence</th><th>Accepts</th><th>Not allowed</th><th>Score</th></tr></thead><tbody>' + L.map(function (o, i) { return "<tr><td>" + (i + 1) + "</td><td><b>" + esc(o.name) + "</b><br><span class=meta>" + esc(o.products.join(", ")) + "</span></td><td>" + esc(o.licences.map(function (l) { return l.reg; }).join(", ")) + "</td><td>" + esc(o.allowed) + "</td><td>" + esc(o.excluded) + '</td><td class="sc">' + o.score.toFixed(1) + "</td></tr>"; }).join("") + "</tbody></table>" :
        '<div class="empty"><b>The first scored reviews are being written now.</b> Nothing goes in this table until the review is finished: licence checked on the regulator\'s own register, accepted and excluded countries recorded, margins measured from our own price data and every score part filled in. Until then this table stays empty rather than showing placeholder rankings.</div>';
    };
    Array.prototype.forEach.call(W.querySelectorAll(".chips"), function (g) { g.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (!b) return; F[g.getAttribute("data-f")] = b.getAttribute("data-v"); Array.prototype.forEach.call(g.querySelectorAll(".chip"), function (c) { c.classList.toggle("on", c === b); }); draw(); }); });
    draw();
  }
})();
/* Keith 17 Nov 11:51: Today column fills down to the bottom of the lead (desktop only) */
(function () {
  function fitToday() {
    var lead = document.querySelector(".front > .lead"), xs = document.querySelectorAll(".today .xt");
    if (!lead || !xs.length) return;
    xs.forEach(function (x) { x.hidden = true; });
    if (window.innerWidth <= 820) return;
    var bottom = lead.getBoundingClientRect().bottom;
    for (var i = 0; i < xs.length; i++) { xs[i].hidden = false; if (xs[i].getBoundingClientRect().bottom > bottom + 2) { xs[i].hidden = true; break; } }
  }
  window.addEventListener("load", fitToday); window.addEventListener("resize", fitToday); setTimeout(fitToday, 50); setTimeout(fitToday, 600);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitToday);
})();
