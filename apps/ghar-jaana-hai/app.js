// Ghar Jaana Hai — a Tatkal-rush simulator for the homesick. You pick a route,
// feel the 10AM scramble, get a CONFIRMED seat… then remember it isn't real.
// No ticket is booked, no payment taken. Your "trips" are saved in localStorage.

const ROUTES = window.ROUTES, CLASS_NAMES = window.CLASS_NAMES, COACHES = window.COACHES, BERTHS = window.BERTHS;
const LS_TRIPS = "gjh_trips";
const app = document.getElementById("app");
const backBtn = document.getElementById("backBtn");
let screen = "routes", ctx = {};
let rushTimer = null;

function loadJSON(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } }
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

function go(s, c) {
  if (rushTimer) { clearInterval(rushTimer); rushTimer = null; }
  window.scrollTo(0, 0);
  screen = s; ctx = c || ctx;
  backBtn.hidden = s === "routes";
  if (s === "routes") renderRoutes();
  else if (s === "trains") renderTrains();
  else if (s === "rush") runRush();
  else if (s === "ticket") renderTicket();
  else if (s === "trips") renderTrips();
}

// ── ROUTES ─────────────────────────────────────────────────────
function renderRoutes() {
  app.innerHTML = `
    <h1 class="h-title">Where's home? 🏡</h1>
    <p class="h-sub">Pick the route you keep meaning to take. We'll get you a confirmed seat in 90 seconds — and not a kilometre further.</p>
    ${ROUTES.map(routeCard).join("")}
  `;
  app.querySelectorAll("[data-route]").forEach((el) => el.addEventListener("click", () => {
    go("trains", { route: ROUTES.find((r) => r.id === el.dataset.route) });
  }));
}
function routeCard(r) {
  return `
    <div class="route" data-route="${r.id}">
      <div class="ends">
        <div class="stn"><b>${r.from}</b><small>${r.fromCity}</small></div>
        <div class="track"></div>
        <div class="stn"><b>${r.to}</b><small>${r.toCity}</small></div>
      </div>
      <div class="km">${r.km} km<br>${r.trains.length} trains</div>
    </div>`;
}

// ── TRAINS ─────────────────────────────────────────────────────
function renderTrains() {
  const r = ctx.route;
  app.innerHTML = `
    <div class="summary-bar">${r.fromCity} <small>${r.from}</small> → ${r.toCity} <small>${r.to}</small></div>
    ${r.trains.map((t, i) => trainCard(t, i)).join("")}
  `;
  r.trains.forEach((t, i) => wireTrain(t, i));
}
function trainCard(t, i) {
  return `
    <div class="train" data-train="${i}">
      <div class="t-head"><span class="t-name">${t.name}</span><span class="t-no">#${t.no}</span></div>
      <div class="t-time">
        <div class="pt"><b>${t.dep}</b><small>${ctx.route.from}</small></div>
        <div class="t-line">${t.dur}<div class="bar"></div>daily</div>
        <div class="pt"><b>${t.arr}</b><small>${ctx.route.to}</small></div>
      </div>
      <div class="classes">
        ${t.classes.map((c, ci) => {
          const tatkal = Math.random() < 0.5;
          const n = randInt(2, 38);
          return `<div class="cls${ci === 0 ? " sel" : ""}" data-cls="${c}">
            ${c} · ${CLASS_NAMES[c]}
            <span class="avail ${tatkal ? "tatkal" : ""}">${tatkal ? "TATKAL " + n : "AVAIL " + n}</span>
          </div>`;
        }).join("")}
      </div>
      <button class="book-btn" data-book="${i}">⚡ Book Tatkal — pay ₹0</button>
    </div>`;
}
function wireTrain(t, i) {
  const card = app.querySelector(`[data-train="${i}"]`);
  let selected = t.classes[0];
  card.querySelectorAll("[data-cls]").forEach((c) => c.addEventListener("click", () => {
    card.querySelectorAll("[data-cls]").forEach((x) => x.classList.remove("sel"));
    c.classList.add("sel"); selected = c.dataset.cls;
  }));
  card.querySelector("[data-book]").addEventListener("click", () => go("rush", { route: ctx.route, train: t, cls: selected }));
}

// ── TATKAL RUSH ────────────────────────────────────────────────
function runRush() {
  const { train } = ctx;
  let queue = randInt(2800, 6200);
  app.innerHTML = `
    <div class="rush">
      <div class="pulse">⚡</div>
      <h2>Tatkal window is OPEN</h2>
      <div class="queue-num mono" id="q">${queue.toLocaleString("en-IN")}</div>
      <div class="step" id="step">people ahead of you in the queue…</div>
      <div class="bar"><i id="bar"></i></div>
      <p class="warn" id="warn">Don't refresh. Don't blink. (You can't lose this one.)</p>
    </div>`;
  const qEl = document.getElementById("q"), stepEl = document.getElementById("step"), bar = document.getElementById("bar"), warn = document.getElementById("warn");
  const steps = [
    [40, "Auto-filling passenger details…"],
    [60, "Captcha cracked ✓"],
    [78, "Payment processing… ₹0 debited 😌"],
    [92, "Allocating your berth…"],
  ];
  let p = 0;
  rushTimer = setInterval(() => {
    p += 4;
    bar.style.width = p + "%";
    queue = Math.max(0, Math.round(queue * 0.78) - randInt(20, 90));
    qEl.textContent = queue.toLocaleString("en-IN");
    const s = steps.find((s) => s[0] === p);
    if (s) { stepEl.textContent = s[1]; }
    if (p >= 60) warn.textContent = "Holding your seat… stay with it.";
    if (p >= 100) {
      clearInterval(rushTimer); rushTimer = null;
      qEl.textContent = "0";
      confirmBooking();
    }
  }, 160);
}

function confirmBooking() {
  const { route, train, cls } = ctx;
  const coach = pick(COACHES[cls] || ["B2"]);
  const seat = randInt(1, 72);
  const berth = pick(BERTHS);
  const pnr = String(randInt(2, 8)) + Array.from({ length: 9 }, () => randInt(0, 9)).join("");
  const trip = {
    pnr, routeId: route.id, fromCity: route.fromCity, from: route.from, toCity: route.toCity, to: route.to,
    trainName: train.name, trainNo: train.no, dep: train.dep, arr: train.arr, dur: train.dur,
    cls, coach, seat, berth, ts: Date.now(),
  };
  const trips = loadJSON(LS_TRIPS, []);
  trips.unshift(trip);
  localStorage.setItem(LS_TRIPS, JSON.stringify(trips.slice(0, 30)));
  ctx.trip = trip;
  go("ticket", ctx);
}

// ── TICKET + REVEAL ────────────────────────────────────────────
function renderTicket() {
  const t = ctx.trip || loadJSON(LS_TRIPS, [])[0];
  if (!t) return go("routes");
  app.innerHTML = ticketHTML(t) + `
    <div class="reveal">
      <h2>CONFIRMED — and you're not going anywhere. 🫥</h2>
      <p>There's no train. The seat is imaginary. But that knot of <em>"will I get a ticket home?"</em>
      just loosened, didn't it? You got the relief — for ₹0, in 90 seconds.</p>
      <div class="btns">
        <button class="btn-primary" id="again">Book another seat home</button>
        <button class="btn-ghost" id="trips">My trips 🎫</button>
      </div>
    </div>`;
  document.getElementById("again").addEventListener("click", () => go("routes"));
  document.getElementById("trips").addEventListener("click", () => go("trips"));
}
function ticketHTML(t) {
  return `
    <div class="ticket">
      <div class="tk-top"><span>🚆 ${t.trainName}</span><span class="tk-conf">CNF · ${t.coach}/${t.seat} ${t.berth}</span></div>
      <div class="tk-body">
        <div class="tk-route">
          <div class="pt"><b>${t.dep}</b><small>${t.from} · ${t.fromCity}</small></div>
          <div class="mid">${t.dur}<br>— • —</div>
          <div class="pt"><b>${t.arr}</b><small>${t.to} · ${t.toCity}</small></div>
        </div>
        <div class="tk-grid">
          <div><small>Train No.</small><b>#${t.trainNo}</b></div>
          <div><small>Class</small><b>${t.cls} · ${CLASS_NAMES[t.cls]}</b></div>
          <div><small>Seat</small><b>${t.coach}/${t.seat}</b></div>
        </div>
        <div class="tk-pnr"><span>PNR: ${t.pnr}</span><span>Fare paid: ₹0</span></div>
      </div>
    </div>`;
}

// ── TRIPS ──────────────────────────────────────────────────────
function renderTrips() {
  const trips = loadJSON(LS_TRIPS, []);
  if (!trips.length) {
    app.innerHTML = `<div class="empty-screen"><div class="big">🎫</div><h2>No trips home yet</h2><p>Every confirmed seat lands here — a little stack of journeys you almost took.</p><button id="start">Book one now</button></div>`;
    document.getElementById("start").addEventListener("click", () => go("routes"));
    return;
  }
  app.innerHTML = `
    <h1 class="h-title">Your trips home 🎫</h1>
    <p class="h-sub">${trips.length} confirmed seat${trips.length > 1 ? "s" : ""} · 0 journeys taken · ₹0 spent.</p>
    ${trips.map(tripRow).join("")}
  `;
}
function tripRow(t) {
  const d = new Date(t.ts);
  const when = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", " +
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return `
    <div class="trip">
      <div class="tr-top"><span class="tr-route">${t.fromCity} → ${t.toCity}</span><span class="tr-when">${when}</span></div>
      <div class="tr-det">${t.trainName} #${t.trainNo} · ${t.dep}→${t.arr} · <span class="tr-seat">${t.coach}/${t.seat} ${t.berth}</span></div>
      <div class="tr-det">PNR ${t.pnr} · ${t.cls} ${CLASS_NAMES[t.cls]} · paid ₹0</div>
    </div>`;
}

// ── wiring ─────────────────────────────────────────────────────
backBtn.addEventListener("click", () => {
  if (screen === "trains") go("routes");
  else if (screen === "rush") go("trains");
  else go("routes");
});
document.getElementById("tripsBtn").addEventListener("click", () => go("trips"));

go("routes");
