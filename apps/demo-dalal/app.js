// Demo Dalal — paper-trading toy. Prices are a SIMULATED random walk (the
// app's core mechanic, clearly labelled). Your cash & holdings are YOUR real
// choices, saved in localStorage. No real money, no fake social-proof numbers.

const STARTING_CASH = 100000;
const LS_CASH = "pp_cash";
const LS_HOLD = "pp_hold";
const app = document.getElementById("app");
const I = window.INSTRUMENTS;

// give each instrument a live state + price history seeded from base price
I.forEach((x) => { x.base = x.price; x.prevClose = x.price; x.history = [x.price]; });

let cash = num(localStorage.getItem(LS_CASH), STARTING_CASH);
let holdings = loadJSON(LS_HOLD, {}); // { sym: { qty, avg } }
let screen = { name: "market", filter: "all", sym: null };

function num(v, d) { const n = parseFloat(v); return isFinite(n) ? n : d; }
function loadJSON(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } }
function saveCash() { localStorage.setItem(LS_CASH, String(cash)); }
function saveHold() { localStorage.setItem(LS_HOLD, JSON.stringify(holdings)); }
function find(sym) { return I.find((x) => x.sym === sym); }

function inr(n, dp) {
  const d = dp == null ? (Math.abs(n) >= 1000 ? 0 : 2) : dp;
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
}
function signed(n) { return (n >= 0 ? "+" : "−") + inr(Math.abs(n)); }
function pct(a, b) { return b ? ((a - b) / b) * 100 : 0; }

// ── market simulation ──────────────────────────────────────────
function tick() {
  for (const x of I) {
    // gaussian-ish step scaled by the instrument's volatility
    const shock = (Math.random() + Math.random() + Math.random() - 1.5) * x.vol;
    // gentle pull back toward base so it wanders but doesn't run away
    const drift = (x.base - x.price) * 0.002;
    x.price = Math.max(x.price * (1 + shock) + drift, x.base * 0.4);
    x.history.push(x.price);
    if (x.history.length > 60) x.history.shift();
  }
  updateLive();
}

// ── render dispatch ────────────────────────────────────────────
function render() {
  if (screen.name === "market") renderMarket();
  else if (screen.name === "detail") renderDetail(screen.sym);
  else if (screen.name === "portfolio") renderPortfolio();
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === (screen.name === "detail" ? "market" : screen.name)));
  document.getElementById("cash").textContent = inr(cash);
}

// live update without full re-render (keeps things smooth)
function updateLive() {
  document.getElementById("cash").textContent = inr(cash);
  if (screen.name === "market") {
    for (const x of I) {
      const row = document.querySelector(`[data-sym="${x.sym}"]`);
      if (!row) continue;
      const p = row.querySelector(".price"), c = row.querySelector(".chg");
      const prev = parseFloat(p.dataset.v || x.price);
      p.textContent = inr(x.price);
      p.dataset.v = x.price;
      p.classList.remove("flash-up", "flash-down");
      void p.offsetWidth;
      p.classList.add(x.price >= prev ? "flash-up" : "flash-down");
      const ch = pct(x.price, x.prevClose);
      c.textContent = (ch >= 0 ? "▲ " : "▼ ") + ch.toFixed(2) + "%";
      c.className = "chg " + (ch >= 0 ? "up" : "down");
    }
  } else if (screen.name === "detail") {
    const x = find(screen.sym);
    const dp = document.querySelector(".d-price");
    if (dp) { dp.textContent = inr(x.price); }
    const dc = document.querySelector(".d-chg");
    if (dc) { const ch = pct(x.price, x.prevClose); dc.textContent = `${ch >= 0 ? "▲" : "▼"} ${ch.toFixed(2)}% today`; dc.className = "d-chg " + (ch >= 0 ? "up" : "down"); }
    drawChart(x);
    refreshCost();
    const hb = document.getElementById("holdVal");
    if (hb && holdings[x.sym]) hb.textContent = inr(holdings[x.sym].qty * x.price);
  } else if (screen.name === "portfolio") {
    renderPortfolio(); // cheap enough
  }
}

// ── MARKET ─────────────────────────────────────────────────────
function renderMarket() {
  const items = I.filter((x) => screen.filter === "all" || x.kind === screen.filter);
  app.innerHTML = `
    <div class="list-head">
      <h2>Markets</h2>
      <div class="filter">
        ${["all", "stock", "crypto"].map((f) => `<button data-f="${f}" class="${screen.filter === f ? "on" : ""}">${f === "all" ? "All" : f === "stock" ? "Stocks" : "Crypto"}</button>`).join("")}
      </div>
    </div>
    ${items.map(instRow).join("")}
  `;
  app.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { screen.filter = b.dataset.f; renderMarket(); }));
  app.querySelectorAll("[data-sym]").forEach((r) => r.addEventListener("click", () => go("detail", r.dataset.sym)));
  updateLive();
}
function instRow(x) {
  const ch = pct(x.price, x.prevClose);
  return `
    <div class="inst" data-sym="${x.sym}">
      <div class="ic">${x.emoji}</div>
      <div class="nm"><b>${x.sym}</b><small>${x.name} · ${x.kind}</small></div>
      <div class="pr">
        <div class="price mono" data-v="${x.price}">${inr(x.price)}</div>
        <div class="chg ${ch >= 0 ? "up" : "down"}">${ch >= 0 ? "▲" : "▼"} ${ch.toFixed(2)}%</div>
      </div>
    </div>`;
}

// ── DETAIL ─────────────────────────────────────────────────────
let tradeQty = 1;
function renderDetail(sym) {
  const x = find(sym);
  if (!x) return go("market");
  tradeQty = 1;
  const h = holdings[sym];
  const ch = pct(x.price, x.prevClose);
  app.innerHTML = `
    <button class="back" id="back">←</button>
    <div class="d-top">
      <div>
        <h1>${x.emoji} ${x.sym}</h1>
        <div class="sub">${x.name} · ${x.kind}</div>
      </div>
      <div style="text-align:right">
        <div class="d-price mono">${inr(x.price)}</div>
        <div class="d-chg ${ch >= 0 ? "up" : "down"}">${ch >= 0 ? "▲" : "▼"} ${ch.toFixed(2)}% today</div>
      </div>
    </div>
    <div class="chart" id="chart"></div>
    ${h ? `<div class="holding-box">
        <span><span class="muted">You hold</span> ${trimQty(h.qty)} @ avg ${inr(h.avg)}</span>
        <span><span class="muted">Value</span> <b id="holdVal">${inr(h.qty * x.price)}</b></span>
      </div>` : ""}
    <div class="trade">
      <div class="qty-row">
        <label>Quantity</label>
        <div class="stepper">
          <button id="dec">−</button>
          <input id="qty" value="1" inputmode="decimal" />
          <button id="inc">+</button>
        </div>
      </div>
      <div class="cost-row"><span>Order value</span><b id="cost">${inr(x.price)}</b></div>
      <div class="cost-row"><span>Paper wallet</span><span>${inr(cash)}</span></div>
      <div class="trade-btns">
        <button class="buy" id="buy">Buy</button>
        <button class="sell" id="sell" ${h ? "" : "disabled"}>Sell</button>
      </div>
      <div class="t-msg" id="tmsg"></div>
    </div>`;
  document.getElementById("back").addEventListener("click", () => go("market"));
  const qtyEl = document.getElementById("qty");
  const setQ = (v) => { tradeQty = Math.max(0, isFinite(v) ? v : 0); qtyEl.value = trimQty(tradeQty); refreshCost(); };
  document.getElementById("inc").addEventListener("click", () => setQ(tradeQty + stepFor(x)));
  document.getElementById("dec").addEventListener("click", () => setQ(tradeQty - stepFor(x)));
  qtyEl.addEventListener("input", () => { tradeQty = Math.max(0, parseFloat(qtyEl.value) || 0); refreshCost(); });
  document.getElementById("buy").addEventListener("click", () => trade(x, "buy"));
  document.getElementById("sell").addEventListener("click", () => trade(x, "sell"));
  drawChart(x);
}
function stepFor(x) { return x.kind === "crypto" && x.price > 5000 ? 0.01 : 1; }
function trimQty(q) { return Number.isInteger(q) ? q : parseFloat(q.toFixed(4)); }

function refreshCost() {
  const x = find(screen.sym);
  const cEl = document.getElementById("cost");
  if (cEl) cEl.textContent = inr(tradeQty * x.price);
  const buy = document.getElementById("buy");
  if (buy) buy.disabled = tradeQty <= 0 || tradeQty * x.price > cash;
  const sell = document.getElementById("sell");
  const h = holdings[x.sym];
  if (sell) sell.disabled = !h || tradeQty <= 0 || tradeQty > h.qty;
}

function trade(x, side) {
  const msg = document.getElementById("tmsg");
  const value = tradeQty * x.price;
  if (tradeQty <= 0) return;
  if (side === "buy") {
    if (value > cash) { msg.textContent = "Not enough paper paisa."; msg.className = "t-msg down"; return; }
    cash -= value;
    const h = holdings[x.sym] || { qty: 0, avg: 0 };
    h.avg = (h.avg * h.qty + value) / (h.qty + tradeQty);
    h.qty += tradeQty;
    holdings[x.sym] = h;
    msg.textContent = `Bought ${trimQty(tradeQty)} ${x.sym} for ${inr(value)} 🟢`;
    msg.className = "t-msg up";
  } else {
    const h = holdings[x.sym];
    if (!h || tradeQty > h.qty) { msg.textContent = "You don't hold that many."; msg.className = "t-msg down"; return; }
    cash += value;
    h.qty = trimQty(h.qty - tradeQty);
    const realized = (x.price - h.avg) * tradeQty;
    if (h.qty <= 0) delete holdings[x.sym];
    msg.textContent = `Sold for ${inr(value)} · ${realized >= 0 ? "booked" : "took a loss of"} ${signed(realized)} ${realized >= 0 ? "🤑" : "😬"}`;
    msg.className = "t-msg " + (realized >= 0 ? "up" : "down");
    if (window.Sticky) { Sticky.buzz(); if (realized >= 0) Sticky.celebrate(["🤑", "💸", "📈", "🎉"]); }
  }
  saveCash(); saveHold();
  renderDetail(x.sym);
  // re-show the message after re-render
  const m2 = document.getElementById("tmsg"); if (m2) { m2.textContent = msg.textContent; m2.className = msg.className; }
}

// ── chart (SVG sparkline from real price history) ──────────────
function drawChart(x) {
  const el = document.getElementById("chart");
  if (!el) return;
  const h = x.history, W = el.clientWidth || 660, H = 180, pad = 10;
  const min = Math.min(...h), max = Math.max(...h), span = max - min || 1;
  const pts = h.map((v, i) => {
    const px = pad + (i / (h.length - 1 || 1)) * (W - pad * 2);
    const py = pad + (1 - (v - min) / span) * (H - pad * 2);
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  });
  const rising = h[h.length - 1] >= h[0];
  const col = rising ? "#2ebd85" : "#f6465d";
  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" width="100%" height="100%">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${col}" stop-opacity=".28"/>
        <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
      </linearGradient></defs>
      <polygon points="${pad},${H - pad} ${pts.join(" ")} ${W - pad},${H - pad}" fill="url(#g)"/>
      <polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
}

// ── PORTFOLIO ──────────────────────────────────────────────────
function renderPortfolio() {
  const syms = Object.keys(holdings);
  const holdValue = syms.reduce((a, s) => a + holdings[s].qty * find(s).price, 0);
  const invested = syms.reduce((a, s) => a + holdings[s].qty * holdings[s].avg, 0);
  const net = cash + holdValue;
  const totalPnl = net - STARTING_CASH;
  const unreal = holdValue - invested;
  const st = window.Sticky ? Sticky.streak("paper") : { count: 1 };
  app.innerHTML = `
    <div class="pf-summary">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="lbl">Net worth (cash + holdings)</div>
        <span class="dd-streak">🔥 <b>${st.count}-day</b></span>
      </div>
      <div class="net mono">${inr(net)}</div>
      <div class="pf-pnl ${totalPnl >= 0 ? "up" : "down"}">${signed(totalPnl)} all-time (${pct(net, STARTING_CASH).toFixed(2)}%)</div>
      <div class="pf-split">
        <span>Cash<b class="mono">${inr(cash)}</b></span>
        <span>Holdings<b class="mono">${inr(holdValue)}</b></span>
        <span>Unrealised P&L<b class="mono ${unreal >= 0 ? "up" : "down"}">${signed(unreal)}</b></span>
      </div>
    </div>
    <div style="text-align:center;margin:-4px 0 18px"><button class="dd-share" id="shareP">📲 Share my paper P&L</button></div>
    ${syms.length ? `<div class="list-head"><h2>Your holdings</h2></div>${syms.map(holdRow).join("")}` : emptyPortfolio()}
    ${net !== STARTING_CASH || syms.length ? `<button class="reset-link" id="reset">↺ Reset paper wallet to ${inr(STARTING_CASH)}</button>` : ""}
  `;
  app.querySelectorAll("[data-hsym]").forEach((r) => r.addEventListener("click", () => go("detail", r.dataset.hsym)));
  const shareP = document.getElementById("shareP");
  if (shareP) shareP.addEventListener("click", () => {
    if (!window.Sticky) return;
    Sticky.buzz();
    const verb = totalPnl >= 0 ? "up" : "down";
    Sticky.share({
      title: "Demo Dalal",
      text: `My paper portfolio is ${verb} ${signed(totalPnl)} (${pct(net, STARTING_CASH).toFixed(1)}%) on Demo Dalal 📈 fake money, real dopamine. Try it —`,
    });
  });
  const reset = document.getElementById("reset");
  if (reset) reset.addEventListener("click", () => { if (confirm("Reset to ₹1,00,000 and clear all holdings?")) { cash = STARTING_CASH; holdings = {}; saveCash(); saveHold(); renderPortfolio(); } });
}
function holdRow(s) {
  const x = find(s), h = holdings[s];
  const val = h.qty * x.price, pnl = (x.price - h.avg) * h.qty;
  return `
    <div class="hold" data-hsym="${s}">
      <div class="ic">${x.emoji}</div>
      <div class="nm"><b>${s}</b><small>${trimQty(h.qty)} @ avg ${inr(h.avg)}</small></div>
      <div class="val"><div class="mono">${inr(val)}</div><small class="${pnl >= 0 ? "up" : "down"} mono">${signed(pnl)}</small></div>
    </div>`;
}
function emptyPortfolio() {
  return `<div class="empty-screen"><div class="big">💼</div><h2>No holdings yet</h2><p>Go to the market and buy something. It's not real money — chase the green.</p><button id="toMarket">Open market</button></div>`;
}

// ── nav ────────────────────────────────────────────────────────
function go(name, sym) { window.scrollTo(0, 0); screen.name = name; screen.sym = sym || null; render(); }
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => go(t.dataset.tab)));
app.addEventListener("click", (e) => { if (e.target.id === "toMarket") go("market"); });

render();
setInterval(tick, 1500);
