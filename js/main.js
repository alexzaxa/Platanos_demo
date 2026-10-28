/* Platanos Tavern: shared behaviour. Builds the header and footer, switches
   language, renders content from SITE (site-data.js), and draws the leaf light. */
(function () {
  var S = window.SITE, root = document.documentElement, page = document.body.getAttribute("data-page") || "home";

  /* ---------- helpers ---------- */
  function bi(o) { return '<span class="en">' + o.en + '</span><span class="el">' + o.el + "</span>"; }
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function todo(en, el) { return '<span class="todo-tag">' + bi({ en: "To add", el: "Προς συμπλήρωση" }) + "</span>" + bi({ en: en, el: el }); }
  var LEAF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.3 5.6 5.3-1.6-1.6 5.4 4.5 2.2-5.5 1.4.4 3.7-3.6-1.9-.3 4.7h-1.6l-.3-4.7-3.6 1.9.4-3.7-5.5-1.4 4.5-2.2-1.6-5.4 5.3 1.6z"/></svg>';

  var NAV = [
    ["index.html", "home", { en: "Home", el: "Αρχική" }],
    ["menu.html", "menu", { en: "Menu", el: "Μενού" }],
    ["story.html", "story", { en: "Our story", el: "Η ιστορία μας" }],
    ["gallery.html", "gallery", { en: "Gallery", el: "Φωτογραφίες" }],
    ["visit.html", "visit", { en: "Visit & reserve", el: "Επίσκεψη & κράτηση" }]
  ];

  /* ---------- header & footer ---------- */
  var h = $("#site-header");
  if (h) {
    h.className = "site-header";
    h.innerHTML = '<div class="wrap"><a class="logo" href="index.html">' + LEAF + S.name + "</a>" +
      '<nav class="nav" id="nav" aria-label="Main">' +
      NAV.map(function (n) { return '<a class="nl" href="' + n[0] + '"' + (n[1] === page ? ' aria-current="page"' : "") + ">" + bi(n[2]) + "</a>"; }).join("") +
      '</nav><div class="header-tools"><div class="lang" role="group" aria-label="Language">' +
      '<button type="button" data-l="en">EN</button><button type="button" data-l="el">ΕΛ</button></div>' +
      '<button class="burger" id="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><span></span></button></div></div>';
    $("#burger").onclick = function () {
      var o = $("#nav").classList.toggle("open"); this.setAttribute("aria-expanded", String(o));
    };
    var measure = function () { root.style.setProperty("--hdr", h.offsetHeight + "px"); };
    measure();
    window.addEventListener("resize", function () { measure(); if (window.innerWidth >= 900) closeNav(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    /* close the drawer after choosing a link, pressing Escape, or tapping outside it */
    var closeNav = function () { $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded", "false"); };
    $("#nav").addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    document.addEventListener("click", function (e) { if (!h.contains(e.target)) closeNav(); });
  }
  var f = $("#site-footer");
  if (f) {
    f.className = "site-footer";
    f.innerHTML = '<div class="wrap"><div class="foot-grid"><div><a class="logo" href="index.html">' + LEAF + S.name + "</a>" +
      '<p class="muted" style="margin-top:1rem;max-width:24rem">' + bi({ en: "A tavern under the plane tree in Chalkoutsi.", el: "Μια ταβέρνα κάτω από τον πλάτανο στο Χαλκούτσι." }) + "</p></div>" +
      "<div><h4>" + bi({ en: "Explore", el: "Εξερεύνηση" }) + "</h4><ul>" +
      NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + bi(n[2]) + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h4>" + bi({ en: "Find us", el: "Βρες μας" }) + "</h4><ul><li>" + bi(S.place) + "</li>" +
      "<li>" + (S.phone ? S.phone : todo("Phone", "Τηλέφωνο")) + "</li>" +
      (S.social.instagram ? '<li><a href="' + S.social.instagram + '" target="_blank" rel="noopener">Instagram</a></li>' : "") +
      (S.social.facebook ? '<li><a href="' + S.social.facebook + '" target="_blank" rel="noopener">Facebook</a></li>' : "") +
      '</ul></div></div><div class="foot-mark" aria-hidden="true">' + S.nameEl + '</div><div class="foot-base"><span>© ' + new Date().getFullYear() + " " + S.name + " · " + bi(S.place) + "</span></div></div>";
  }

  /* ---------- language ---------- */
  function setLang(l, save) {
    root.setAttribute("data-lang", l); root.lang = l;
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-l") === l)); });
    if (save) { try { localStorage.setItem("platanos-lang", l); } catch (e) {} }
    status();
  }
  $$(".lang button").forEach(function (b) { b.onclick = function () { setLang(b.getAttribute("data-l"), true); }; });

  /* ---------- opening hours ---------- */
  var DAYS = [["Mon", "Monday", "Δευτέρα"], ["Tue", "Tuesday", "Τρίτη"], ["Wed", "Wednesday", "Τετάρτη"], ["Thu", "Thursday", "Πέμπτη"],
              ["Fri", "Friday", "Παρασκευή"], ["Sat", "Saturday", "Σάββατο"], ["Sun", "Sunday", "Κυριακή"]];
  function athens() {
    var o = {};
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Athens", weekday: "short", hour: "2-digit", hour12: false }).formatToParts(new Date())
      .forEach(function (p) { o[p.type] = p.value; });
    return { day: o.weekday, hour: parseInt(o.hour, 10) % 24 };
  }
  function status() {
    var now = athens(), H = S.hours, open = now.day !== H.closedDay && now.hour >= H.openHour;
    $$("[data-status]").forEach(function (s) {
      s.setAttribute("data-open", open ? "1" : "0");
      s.innerHTML = '<span class="dot"></span>' + (open ? bi({ en: "Open now", el: "Ανοιχτά τώρα" }) : bi({ en: "Closed now", el: "Κλειστά τώρα" }));
    });
    $$("[data-today]").forEach(function (t) {
      var d = DAYS.filter(function (x) { return x[0] === now.day; })[0];
      t.innerHTML = now.day === H.closedDay ? bi({ en: "Closed today", el: "Κλειστά σήμερα" }) :
        "<b>" + bi({ en: "Today", el: "Σήμερα" }) + "</b> " + H.open + " – " + H.close;
    });
  }
  $$("[data-hours]").forEach(function (ul) {
    var now = athens(), H = S.hours;
    ul.innerHTML = DAYS.map(function (d) {
      var closed = d[0] === H.closedDay;
      return "<li" + (d[0] === now.day ? ' aria-current="date"' : "") + "><span>" + bi({ en: d[1], el: d[2] }) + "</span>" +
        (closed ? '<span class="closed">' + bi({ en: "Closed", el: "Κλειστά" }) + "</span>" : "<span>" + H.open + " – " + H.close + "</span>") + "</li>";
    }).join("");
  });
  $$("[data-sample-note]").forEach(function (n) {
    if (!S.hours.isSample) return;
    n.innerHTML = '<span class="todo-tag">' + bi({ en: "Sample", el: "Δείγμα" }) + "</span>" + bi({ en: "These hours are examples. Replace them in js/site-data.js.", el: "Το ωράριο είναι ενδεικτικό. Άλλαξέ το στο js/site-data.js." });
  });

  /* ---------- menu ---------- */
  function dish(d) {
    return '<li class="dish"><div class="dish-top"><span class="dish-name">' + bi({ en: d[0], el: d[1] }) + '</span><i class="leader"></i><span class="price">€' + d[2] +
      '</span></div><p class="dish-sub">' + bi({ en: d[1], el: d[0] }) + "</p></li>";
  }
  var full = $("[data-menu-full]");
  if (full) {
    full.innerHTML = S.menu.map(function (c) {
      return '<section class="menu-cat" id="' + c.id + '"><h2>' + bi(c) + "<small>" + bi({ en: c.el, el: c.en }) + '</small></h2><ul class="dishes">' + c.items.map(dish).join("") + "</ul></section>";
    }).join("");
    var chips = $("[data-chips]");
    chips.innerHTML = S.menu.map(function (c) { return '<a href="#' + c.id + '" data-id="' + c.id + '">' + bi(c) + "</a>"; }).join("");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) $$("a", chips).forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-id") === e.target.id); }); });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".menu-cat").forEach(function (s) { io.observe(s); });
    }
  }
  var tease = $("[data-menu-teaser]");
  if (tease) tease.innerHTML = S.menu.map(function (c) { return dish(c.items[0]); }).concat(S.menu.slice(0, 2).map(function (c) { return dish(c.items[1]); })).join("");
  $$("[data-menu-note]").forEach(function (n) {
    if (S.menuIsSample) n.innerHTML = '<span class="todo-tag">' + bi({ en: "Sample", el: "Δείγμα" }) + "</span>" + bi({ en: "Dishes and prices are examples. Replace them in js/site-data.js.", el: "Τα πιάτα και οι τιμές είναι ενδεικτικά. Άλλαξέ τα στο js/site-data.js." });
  });

  /* ---------- gallery ---------- */
  function shot(g, i) {
    var xs = [[28, 22, 72, 74], [66, 30, 24, 68], [40, 60, 80, 20], [20, 40, 62, 80]][i % 4];
    var st = "--r:" + g.r + ";--x1:" + xs[0] + "%;--y1:" + xs[1] + "%;--x2:" + xs[2] + "%;--y2:" + xs[3] + "%";
    /* the slot's aspect-ratio is fixed in CSS, so a photo of any shape is cropped to fit and nothing shifts while it loads */
    var inner = g.src ? '<img src="' + g.src + '"' + (g.srcset ? ' srcset="' + g.srcset + '" sizes="' + (g.sizes || "(min-width: 900px) 33vw, 50vw") + '"' : "") +
      ' alt="' + g.en + '" loading="lazy" decoding="async">' : LEAF;
    return '<figure class="shot" style="' + st + '">' + inner + "<figcaption>" + (g.src ? "" : '<span class="todo-tag">' + bi({ en: "Photo", el: "Φωτογραφία" }) + "</span>") + bi(g) + "</figcaption></figure>";
  }
  var gl = $("[data-gallery]");
  if (gl) gl.innerHTML = S.gallery.map(shot).join("");
  var gt = $("[data-gallery-teaser]");
  if (gt) gt.innerHTML = S.gallery.slice(0, 3).map(shot).join("");

  /* ---------- contact + people ---------- */
  var ct = $("[data-contact]");
  if (ct) {
    var addr = S.address.en ? bi(S.address) : todo("Street address", "Διεύθυνση");
    ct.innerHTML =
      "<li><span class=\"k\">" + bi({ en: "Where", el: "Πού" }) + '</span><span class="v">' + bi(S.place) + "</span></li>" +
      "<li><span class=\"k\">" + bi({ en: "Address", el: "Διεύθυνση" }) + '</span><span class="v">' + addr + "</span></li>" +
      "<li><span class=\"k\">" + bi({ en: "Phone", el: "Τηλέφωνο" }) + '</span><span class="v">' + (S.phone || todo("Phone number", "Αριθμός τηλεφώνου")) + "</span></li>" +
      "<li><span class=\"k\">Email</span><span class=\"v\">" + (S.email || todo("Email address", "Διεύθυνση email")) + "</span></li>";
  }
  $$("[data-maps]").forEach(function (a) { a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.mapsQuery); a.target = "_blank"; a.rel = "noopener"; });
  var pp = $("[data-people]");
  if (pp) pp.innerHTML = S.people.map(function (p) {
    return '<div class="person"><div class="avatar">' + LEAF + "</div><h3>" + (p.name || todo("Name", "Όνομα")) + '</h3><p class="muted">' + bi(p.role) + "</p></div>";
  }).join("");

  /* ---------- reservation form (preview only) ---------- */
  var form = $("#reserve");
  if (form) {
    var d = $("#r-date"), t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    d.min = t.toISOString().slice(0, 10);
    var tm = $("#r-time"), opts = "";
    for (var hr = S.hours.openHour; hr < 24; hr++) { [":00", ":30"].forEach(function (m) { var v = (hr < 10 ? "0" : "") + hr + m; opts += '<option value="' + v + '">' + v + "</option>"; }); }
    tm.innerHTML = opts; tm.value = "20:00";
    var g = $("#r-guests"), go = ""; for (var n = 1; n <= 12; n++) go += '<option value="' + n + '">' + n + "</option>"; g.innerHTML = go; g.value = "2";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      $("#form-msg").hidden = false;
      $("#form-msg").innerHTML = bi({ en: "Preview only. Online booking isn't connected yet, so nothing was sent.", el: "Μόνο προεπισκόπηση. Η online κράτηση δεν έχει συνδεθεί ακόμη, οπότε δεν στάλθηκε τίποτα." });
    });
  }

  /* ---------- dappled light on any .hero ---------- */
  var cv = $(".hero canvas"), hero = cv && cv.parentNode;
  if (cv) {
    var small = window.innerWidth < 700;  /* fewer, cheaper blobs on phones to save battery */
    var cx = cv.getContext("2d"), SCALE = small ? 0.4 : 0.5, W = 1, Hh = 1, rgb = "214,228,106", baseA = 0.2, blobs = [], raf = 0, running = false, mouse = { x: -1, y: -1 };
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var theme = function () { var s = getComputedStyle(root); rgb = s.getPropertyValue("--dapple-rgb").trim() || rgb; baseA = parseFloat(s.getPropertyValue("--dapple-a")) || baseA; };
    var rng = (function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })(7);
    for (var i = 0; i < (small ? 26 : 46); i++) blobs.push({ x: rng(), y: rng(), s: 0.05 + rng() * 0.13, a: 0.35 + rng() * 0.65, ph: rng() * 6.28, sp: 0.15 + rng() * 0.4, rot: rng() * 3.14, sq: 0.5 + rng() * 0.5 });
    var size = function () { var r = hero.getBoundingClientRect(); W = Math.max(1, Math.round(r.width * SCALE)); Hh = Math.max(1, Math.round(r.height * SCALE)); cv.width = W; cv.height = Hh; };
    var draw = function (t) {
      cx.clearRect(0, 0, W, Hh);
      var sway = Math.sin(t * 0.3) * 0.025;
      blobs.forEach(function (b) {
        var x = (b.x + sway + Math.sin(t * b.sp + b.ph) * 0.03) * W, y = (b.y + Math.cos(t * b.sp * 0.8 + b.ph) * 0.04) * Hh;
        var rad = b.s * W * 0.55, a = baseA * b.a * (0.75 + 0.25 * Math.sin(t * b.sp * 1.7 + b.ph));
        if (mouse.x >= 0) { var d = Math.hypot(x - mouse.x * W, y - mouse.y * Hh) / (W * 0.22); if (d < 1) { var k = 1 - d; a *= 1 + 2.4 * k; rad *= 1 + 0.5 * k; } }
        a = Math.min(a, 0.6);
        cx.save(); cx.translate(x, y); cx.rotate(b.rot + t * 0.02); cx.scale(1, b.sq);
        var g = cx.createRadialGradient(0, 0, 0, 0, 0, rad);
        g.addColorStop(0, "rgba(" + rgb + "," + a + ")"); g.addColorStop(0.55, "rgba(" + rgb + "," + a * 0.45 + ")"); g.addColorStop(1, "rgba(" + rgb + ",0)");
        cx.fillStyle = g; cx.beginPath(); cx.arc(0, 0, rad, 0, 6.2832); cx.fill(); cx.restore();
      });
    };
    var frame = function (ms) { draw(ms / 1000); raf = requestAnimationFrame(frame); };
    var start = function () { if (!running && !still) { running = true; raf = requestAnimationFrame(frame); } };
    var stop = function () { running = false; cancelAnimationFrame(raf); };
    theme(); size(); draw(3);
    window.addEventListener("resize", function () { size(); draw(3); });
    new MutationObserver(function () { theme(); if (still) draw(3); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { theme(); if (still) draw(3); });
    hero.addEventListener("pointermove", function (e) { var r = hero.getBoundingClientRect(); mouse.x = (e.clientX - r.left) / r.width; mouse.y = (e.clientY - r.top) / r.height; });
    hero.addEventListener("pointerleave", function () { mouse.x = mouse.y = -1; });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }).observe(hero); else start();
  }

  /* ---------- go ---------- */
  var saved = null; try { saved = localStorage.getItem("platanos-lang"); } catch (e) {}
  setLang(saved || ((navigator.language || "").toLowerCase().indexOf("el") === 0 ? "el" : "en"), false);
  setInterval(status, 60000);
})();
