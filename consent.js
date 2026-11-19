(function () {
  var GA = "G-B5H2QLP7RB", KEY = "bmn_consent";
  window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } window.gtag = gtag;
  gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
  function load() { if (!GA || window.__ga) return; window.__ga = 1; var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA; document.head.appendChild(s); gtag("js", new Date()); gtag("config", GA, { anonymize_ip: true }); }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} if (v === "yes") { gtag("consent", "update", { analytics_storage: "granted" }); load(); } var b = document.getElementById("cc"); if (b) b.remove(); }
  var v = null; try { v = localStorage.getItem(KEY); } catch (e) {}
  if (v === "yes") { gtag("consent", "update", { analytics_storage: "granted" }); load(); return; }
  if (v === "no" || !GA) return;
  function show() {
    var d = document.createElement("div"); d.id = "cc"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Cookies");
    d.innerHTML = '<p>We would like to use Google Analytics cookies to count visits and see which pages people read. They are only set if you accept. <a href="/privacy.html">Privacy policy</a></p><div><button type="button" data-v="no">Reject</button><button type="button" data-v="yes">Accept</button></div>';
    d.addEventListener("click", function (e) { var x = e.target.getAttribute("data-v"); if (x) set(x); });
    document.body.appendChild(d);
  }
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
  window.bmnCookies = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };
})();
