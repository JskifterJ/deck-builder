/* ============================================================
   deck-builder · core.js  (inlined into the output, no deps)
   TOTAL is injected by the build script.
   ============================================================ */
(function () {
  "use strict";

  var deck = document.querySelector(".deck");
  var stage = document.querySelector(".stage");
  var SLIDES = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var TOTAL = SLIDES.length;

  var elCur = document.getElementById("num-cur");
  var elTot = document.getElementById("num-tot");
  var navCur = document.getElementById("nav-cur");
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var prog = document.getElementById("progress");

  var cur = 0;
  var step = 0; // index of next hidden .step on the current slide

  if (elTot) elTot.textContent = TOTAL;

  /* ── Fit the 1280×720 deck to the viewport ── */
  function fit() {
    if (!deck || !stage) return;
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var scale = Math.min(sw / 1280, sh / 720);
    deck.style.transform = "scale(" + scale + ")";
  }
  window.addEventListener("resize", fit);
  fit();

  function stepsOf(i) {
    return Array.prototype.slice.call(SLIDES[i].querySelectorAll(".step"));
  }

  function showSlide(n, fromStart) {
    if (n < 0 || n >= TOTAL) return;
    var old = cur;
    if (old !== n) {
      SLIDES[old].classList.remove("active");
      SLIDES[old].classList.add("exit");
      (function (o) { setTimeout(function () { SLIDES[o].classList.remove("exit"); }, 260); })(old);
    }
    cur = n;
    SLIDES[cur].classList.add("active");
    var st = stepsOf(cur);
    // Entering forward → all steps hidden; entering backward → all shown.
    if (fromStart === false) { st.forEach(function (e) { e.classList.add("shown"); }); step = st.length; }
    else { st.forEach(function (e) { e.classList.remove("shown"); }); step = 0; }
    update();
    if (presenterOpen) renderPresenter();
  }

  function next() {
    var st = stepsOf(cur);
    if (step < st.length) { st[step].classList.add("shown"); step++; if (presenterOpen) renderPresenter(); return; }
    showSlide(cur + 1, true);
  }
  function prev() {
    if (step > 0) { step--; stepsOf(cur)[step].classList.remove("shown"); if (presenterOpen) renderPresenter(); return; }
    showSlide(cur - 1, false);
  }

  function update() {
    if (elCur) elCur.textContent = cur + 1;
    if (navCur) navCur.textContent = cur + 1;
    if (btnPrev) btnPrev.disabled = (cur === 0 && step === 0);
    if (btnNext) btnNext.disabled = (cur === TOTAL - 1 && step >= stepsOf(cur).length);
    if (prog) prog.style.width = (TOTAL > 1 ? (cur / (TOTAL - 1) * 100) : 100) + "%";
  }

  /* ── Keyboard ── */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
    else if (e.key === "Home") { showSlide(0, true); }
    else if (e.key === "End") { showSlide(TOTAL - 1, false); }
    else if (e.key.toLowerCase() === "p") { togglePresenter(); }
    else if (e.key.toLowerCase() === "f") { toggleFullscreen(); }
  });
  window.deckGo = function (n) { showSlide(n, true); };
  window.deckNext = next;
  window.deckPrev = prev;

  function toggleFullscreen() {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(function () {}); }
    else { document.exitFullscreen(); }
  }
  window.deckFullscreen = toggleFullscreen;

  /* ── Presenter view (in-page overlay: notes + timer + next) ── */
  var presenterOpen = false;
  var pv = document.getElementById("presenter");
  var pvNote = document.getElementById("pv-note");
  var pvNext = document.getElementById("pv-next");
  var pvNow = document.getElementById("pv-now");
  var pvTimer = document.getElementById("pv-timer");
  var pvClock = document.getElementById("pv-clock");

  function noteOf(i) {
    var t = SLIDES[i].querySelector("template.note");
    return t ? t.innerHTML.trim() : "";
  }
  function titleOf(i) {
    var h = SLIDES[i].querySelector("h1, h2");
    return h ? h.textContent : "Slide " + (i + 1);
  }

  function renderPresenter() {
    if (pvNow) pvNow.innerHTML = SLIDES[cur].querySelector(".slide-inner").innerHTML;
    if (pvNote) pvNote.innerHTML = noteOf(cur) || "<span style='opacity:.4'>No speaker notes.</span>";
    if (pvNext) pvNext.textContent = (cur + 1 < TOTAL) ? ("Next → " + titleOf(cur + 1)) : "End of deck";
  }
  function togglePresenter() {
    presenterOpen = !presenterOpen;
    if (pv) pv.classList.toggle("open", presenterOpen);
    if (presenterOpen) { renderPresenter(); if (!timerStarted) startTimer(); }
  }
  window.deckPresenter = togglePresenter;

  /* Timer */
  var elapsed = 0, timerId = null, timerStarted = false;
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function tick() { elapsed++; if (pvTimer) pvTimer.textContent = fmt(elapsed); }
  function startTimer() { if (timerId) return; timerStarted = true; timerId = setInterval(tick, 1000); }
  function pauseTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function resetTimer() { pauseTimer(); elapsed = 0; if (pvTimer) pvTimer.textContent = fmt(0); }
  window.deckTimer = { start: startTimer, pause: pauseTimer, reset: resetTimer, toggle: function () { timerId ? pauseTimer() : startTimer(); } };

  /* Wall clock in presenter */
  setInterval(function () {
    if (!pvClock) return;
    var d = new Date();
    pvClock.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, 1000);

  /* ── Export: PDF (browser print) ── */
  window.deckPrint = function () { window.print(); };

  /* ── Export: PPTX via pptxgenjs (lazy-loaded from CDN) ── */
  window.deckPPTX = function () {
    function build() {
      var pptx = new PptxGenJS();
      pptx.defineLayout({ name: "D", width: 13.333, height: 7.5 });
      pptx.layout = "D";
      var css = getComputedStyle(document.documentElement);
      var bg = hex(css.getPropertyValue("--bg"));
      var text = hex(css.getPropertyValue("--text"));
      SLIDES.forEach(function (sl) {
        var s = pptx.addSlide();
        s.background = { color: bg };
        var h = sl.querySelector("h1, h2");
        var title = h ? h.textContent : "";
        if (title) s.addText(title, { x: 0.6, y: 0.5, w: 12, h: 1, fontSize: 30, bold: true, color: text, fontFace: "Arial" });
        var items = Array.prototype.slice.call(sl.querySelectorAll(".slide-inner > ul > li, .slide-inner > ol > li"))
          .map(function (li) { return { text: li.textContent.trim(), options: { bullet: true } }; });
        if (items.length) s.addText(items, { x: 0.6, y: 1.8, w: 12, h: 5, fontSize: 16, color: text, fontFace: "Arial", lineSpacingMultiple: 1.3 });
      });
      pptx.writeFile({ fileName: (document.title || "deck") + ".pptx" });
    }
    function hex(v) { v = (v || "").trim(); return v.charAt(0) === "#" ? v.slice(1) : "FFFFFF"; }
    if (window.PptxGenJS) return build();
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
    s.onload = build;
    s.onerror = function () { alert("Could not load the PPTX library (needs internet). Use Print → PDF instead."); };
    document.head.appendChild(s);
  };

  /* Init */
  showSlide(0, true);
})();
