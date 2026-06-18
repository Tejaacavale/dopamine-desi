// ───────────────────────────────────────────────────────────
// Dopamine Desi — shared "stickiness" module.
// Anonymous persistent identity, daily return streaks, share cards
// (the viral loop), toasts, a lightweight confetti burst, and haptics.
// Reused by every app and every clone. No tracking, no PII.
// ───────────────────────────────────────────────────────────
window.Sticky = (function () {
  // ── anonymous, persistent local identity ───────────────────
  function id() {
    let v = localStorage.getItem("dd_id");
    if (!v) { v = "dd_" + Math.random().toString(36).slice(2, 9); localStorage.setItem("dd_id", v); }
    return v;
  }

  // ── daily return streak, per app key ────────────────────────
  // returns { count: consecutive-day streak, total: total visit-days, isNewDay, isReturning }
  function streak(appKey) {
    const k = "dd_streak_" + appKey;
    const today = new Date().toDateString();
    let s = null;
    try { s = JSON.parse(localStorage.getItem(k)); } catch (e) {}
    let isNewDay = true, isReturning = false;
    if (!s) {
      s = { count: 1, last: today, total: 1 };
    } else {
      isReturning = true;
      if (s.last === today) { isNewDay = false; }
      else {
        const diff = Math.round((new Date(today) - new Date(s.last)) / 86400000);
        s.count = diff === 1 ? (s.count + 1) : 1;
        s.last = today;
        s.total = (s.total || 0) + 1;
      }
    }
    localStorage.setItem(k, JSON.stringify(s));
    return { count: s.count, total: s.total, isNewDay, isReturning };
  }

  // ── a counter you bump on a key action (orders placed, etc.) ─
  function bump(key, by) {
    const k = "dd_count_" + key;
    const n = (parseInt(localStorage.getItem(k), 10) || 0) + (by || 1);
    localStorage.setItem(k, String(n));
    return n;
  }
  function get(key) { return parseInt(localStorage.getItem("dd_count_" + key), 10) || 0; }

  // ── haptics ─────────────────────────────────────────────────
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (e) {} }

  // ── toast ───────────────────────────────────────────────────
  function toast(msg, ms) {
    let t = document.getElementById("dd-toast");
    if (!t) { t = document.createElement("div"); t.id = "dd-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), ms || 2400);
  }

  // ── confetti / emoji burst ──────────────────────────────────
  function celebrate(emojis) {
    const set = emojis || ["🎉", "✨", "🥳", "💸"];
    const layer = document.createElement("div");
    layer.className = "dd-confetti";
    for (let i = 0; i < 28; i++) {
      const s = document.createElement("span");
      s.textContent = set[Math.floor(Math.random() * set.length)];
      s.style.left = Math.random() * 100 + "vw";
      s.style.fontSize = 14 + Math.random() * 20 + "px";
      s.style.animationDelay = Math.random() * 0.25 + "s";
      s.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    buzz(18);
    setTimeout(() => layer.remove(), 3200);
  }

  // ── share (Web Share API → clipboard fallback) ──────────────
  async function share({ title, text, url }) {
    url = url || location.href;
    const data = { title: title || document.title, text: text || "", url };
    try {
      if (navigator.share) { await navigator.share(data); return "shared"; }
    } catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
    try {
      await navigator.clipboard.writeText((text ? text + "\n" : "") + url);
      toast("Copied! Paste it in your group chat 📋");
      return "copied";
    } catch (e) {
      toast("Couldn't copy — long-press the link to share");
      return "failed";
    }
  }

  return { id, streak, bump, get, buzz, toast, celebrate, share };
})();
