// Sutta Saath client — talks to the real WebSocket backend.
// No randomised numbers anywhere; everything shown comes from the server,
// which derives it from actual connected sockets and real messages.

const $ = (id) => document.getElementById(id);
const wall = $("wall");
const empty = $("empty");

let me = null;
let smoking = false;

// connect to the same host the page is served from
const proto = location.protocol === "https:" ? "wss" : "ws";
let ws;
let reconnectTimer = null;

function setConn(on) {
  $("cdot").classList.toggle("on", on);
  $("connText").textContent = on ? "connected" : "reconnecting…";
}

function connect() {
  ws = new WebSocket(`${proto}://${location.host}`);

  ws.onopen = () => setConn(true);

  ws.onmessage = (ev) => {
    let m;
    try { m = JSON.parse(ev.data); } catch { return; }

    if (m.type === "init") {
      me = m.you;
      $("whoami").textContent = me.name;
      renderPresence(m.inRoom, m.smoking);
      wall.querySelectorAll(".msg").forEach((n) => n.remove());
      (m.messages || []).forEach((msg) => addMsg(msg, false));
      toggleEmpty();
    }

    if (m.type === "presence") renderPresence(m.inRoom, m.smoking);

    if (m.type === "you") {
      const wasSmoking = smoking;
      smoking = m.smoking;
      reflectSmoking();
      if (smoking && !wasSmoking && window.onLitUp) window.onLitUp();
    }

    if (m.type === "chat") {
      addMsg(m.msg, true);
      toggleEmpty();
    }
  };

  ws.onclose = () => {
    setConn(false);
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connect, 1200);
  };
  ws.onerror = () => ws.close();
}

function renderPresence(inRoom, smk) {
  $("inRoom").textContent = inRoom;
  $("smoking").textContent = smk;
}

function reflectSmoking() {
  $("ciggy").classList.toggle("lit", smoking);
  const btn = $("lightBtn");
  btn.classList.toggle("on", smoking);
  btn.textContent = smoking ? "Stub it out" : "Light up 🔥";
  $("hint").textContent = smoking
    ? "You're on a sutta. The count includes you now."
    : "Tap to light up. You'll show up in the count below.";
  if (smoking) startBurn();
  else stopBurn(true);
}

// ── the cigarette physically burns down while lit ──────────────
const BURN = { full: 180, stub: 48, ms: 75000 }; // ~75s for a full sutta
let burnTimer = null, burnStart = 0;
function stickEl() { return document.querySelector(".stick"); }
function startBurn() {
  stopBurn(false);
  burnStart = Date.now();
  burnTimer = setInterval(() => {
    const frac = Math.min(1, (Date.now() - burnStart) / BURN.ms);
    const w = BURN.full - (BURN.full - BURN.stub) * frac;
    const s = stickEl();
    if (s) s.style.width = w + "px";
    if (frac >= 1) {
      stopBurn(false);
      if (window.Sticky) Sticky.toast("Sutta khatam 🚬 light another?");
      send({ type: "toggleSmoke" }); // burnt out → stub out for real, count drops
    }
  }, 250);
}
function stopBurn(reset) {
  if (burnTimer) { clearInterval(burnTimer); burnTimer = null; }
  if (reset) { const s = stickEl(); if (s) s.style.width = ""; }
}

function fmtTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function addMsg(msg, animate) {
  const el = document.createElement("div");
  const mine = me && msg.name === me.name;
  el.className = "msg" + (mine ? " mine" : "");
  if (!animate) el.style.animation = "none";
  el.innerHTML =
    `<span class="who">${mine ? "you" : escapeHtml(msg.name)}</span>` +
    `<span class="time">${fmtTime(msg.ts)}</span><br>${escapeHtml(msg.text)}`;
  wall.appendChild(el);
  wall.scrollTop = wall.scrollHeight;
}

function toggleEmpty() {
  empty.style.display = wall.querySelector(".msg") ? "none" : "block";
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function send(obj) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

// interactions
const toggle = () => { if (window.Sticky) Sticky.buzz(); send({ type: "toggleSmoke" }); };
$("lightBtn").addEventListener("click", toggle);
$("ciggy").addEventListener("click", toggle);

$("say").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("input");
  const text = input.value.trim();
  if (!text) return;
  send({ type: "chat", text });
  input.value = "";
});

// ── stickiness: return streak + breaks taken + invite/share ──
function refreshStreakChip() {
  if (!window.Sticky) return;
  const breaks = Sticky.get("sutta_breaks");
  const st = JSON.parse(localStorage.getItem("dd_streak_sutta") || '{"count":1}');
  const chip = $("suttaStreak");
  chip.hidden = false;
  chip.innerHTML = `🔥 <b>${st.count}-day</b>${breaks ? ` · ${breaks} break${breaks > 1 ? "s" : ""} taken` : ""}`;
}
if (window.Sticky) {
  Sticky.streak("sutta");
  refreshStreakChip();
  $("suttaShare").addEventListener("click", () => {
    Sticky.buzz();
    Sticky.share({
      title: "Sutta Saath",
      text: "Come sit in the Sutta Saath with me — real people, taking a break together at odd hours. 🚬",
    });
  });
}
// called from the ws 'you' handler when you light up
window.onLitUp = function () {
  if (!window.Sticky) return;
  Sticky.bump("sutta_breaks");
  Sticky.celebrate(["🚬", "💨", "✨"]);
  refreshStreakChip();
};

connect();
