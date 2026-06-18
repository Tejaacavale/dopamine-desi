// Khaana Aaya Kya — a real, multi-screen food-delivery SPA.
// You do the whole ritual; you pay ₹0. The only "numbers" stored are YOUR
// own real actions (cart + order history in localStorage). No fake live activity.

const app = document.getElementById("app");
const RESTAURANTS = window.RESTAURANTS;

// ── state (cart persists; orders are your real history) ─────────
const LS_CART = "bb_cart";
const LS_ORDERS = "bb_orders";
let cart = loadJSON(LS_CART, {}); // { itemId: { ...item, restId, restName, qty } }
let currentRest = null;

function loadJSON(k, fallback) { try { return JSON.parse(localStorage.getItem(k)) || fallback; } catch { return fallback; } }
function saveCart() { localStorage.setItem(LS_CART, JSON.stringify(cart)); syncCartUI(); }
const rupee = (n) => "₹" + n.toLocaleString("en-IN");
const allItems = () => Object.values(cart);
const cartCount = () => allItems().reduce((a, b) => a + b.qty, 0);
const cartSubtotal = () => allItems().reduce((a, b) => a + b.qty * b.price, 0);

// ── tiny router ────────────────────────────────────────────────
function go(screen, arg) {
  window.scrollTo(0, 0);
  document.getElementById("backBtn").hidden = screen === "home";
  if (screen === "home") renderHome();
  else if (screen === "rest") renderRestaurant(arg);
  else if (screen === "cart") renderCart();
  else if (screen === "orders") renderOrders();
  syncCartUI();
}

// ── HOME ───────────────────────────────────────────────────────
function renderHome() {
  currentRest = null;
  app.innerHTML = `
    <div class="search">
      🔍 <input id="searchInput" placeholder="Search 'biryani', 'dosa', 'chai'…" />
    </div>
    <h2 class="section-h">${restGreeting()}</h2>
    <div class="rest-list" id="restList"></div>
  `;
  const list = document.getElementById("restList");
  const draw = (rs) => {
    list.innerHTML = rs.map(restCardHTML).join("") || `<p style="color:var(--muted)">Nothing matches that. Try 'momo' or 'naan'.</p>`;
    list.querySelectorAll("[data-rest]").forEach((el) =>
      el.addEventListener("click", () => go("rest", el.dataset.rest)));
  };
  draw(RESTAURANTS);
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return draw(RESTAURANTS);
    draw(RESTAURANTS.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisines.join(" ").toLowerCase().includes(q) ||
      r.menu.some((c) => c.items.some((i) => i.name.toLowerCase().includes(q)))));
  });
}

function restGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "Up at this hour? Feed the feeling 🌙";
  if (h < 11) return "Breakfast cravings near you";
  if (h < 16) return "Lunch spots near you";
  if (h < 19) return "Chai & snack o'clock";
  return "Late-night cravings near you";
}

function restCardHTML(r) {
  return `
    <div class="rest" data-rest="${r.id}">
      <div class="thumb" style="background:${r.grad}">${r.emoji}</div>
      <div class="info">
        <h3>${r.name}</h3>
        <div class="cui">${r.cuisines.join(", ")}</div>
        <div class="row">
          <span class="rating">★ ${r.rating}</span>
          <span class="dotsep">${r.eta} min</span>
          <span class="dotsep">${rupee(r.priceForTwo)} for two</span>
        </div>
        <span class="promo">🎟️ ${r.promo}</span>
      </div>
    </div>`;
}

// ── RESTAURANT ─────────────────────────────────────────────────
function renderRestaurant(id) {
  const r = RESTAURANTS.find((x) => x.id === id);
  if (!r) return go("home");
  currentRest = r;
  app.innerHTML = `
    <div class="rest-hero" style="background:${r.grad}">
      <h1>${r.emoji} ${r.name}</h1>
      <div class="meta">
        <span class="pill">★ ${r.rating}</span>
        <span class="pill">${r.eta} min</span>
        <span class="pill">${rupee(r.priceForTwo)} for two</span>
      </div>
      <div class="meta"><span>🎟️ ${r.promo}</span></div>
    </div>
    <div id="menu"></div>`;
  const menu = document.getElementById("menu");
  menu.innerHTML = r.menu.map((cat) => `
    <h3 class="menu-cat">${cat.cat}</h3>
    ${cat.items.map((it) => dishHTML(r, it)).join("")}
  `).join("");
  wireDishButtons(r);
}

function dishHTML(r, it) {
  const qty = cart[it.id]?.qty || 0;
  return `
    <div class="dish" data-dish="${it.id}">
      <div class="d-info">
        <span class="veg-mark ${it.veg ? "" : "non"}"></span>
        ${it.bestseller ? '<div class="bestseller">⭐ Bestseller</div>' : ""}
        <h4>${it.name}</h4>
        <div class="price">${rupee(it.price)}</div>
        <div class="desc">${it.desc}</div>
      </div>
      <div class="d-action">
        <div class="d-emoji">${it.emoji}</div>
        <div class="action-slot">${qty ? qtyHTML(qty) : '<button class="addbtn">ADD +</button>'}</div>
      </div>
    </div>`;
}
function qtyHTML(q) { return `<div class="qty"><button data-act="dec">−</button><span>${q}</span><button data-act="inc">+</button></div>`; }

function wireDishButtons(r) {
  document.querySelectorAll("[data-dish]").forEach((row) => {
    const id = row.dataset.dish;
    const item = r.menu.flatMap((c) => c.items).find((i) => i.id === id);
    const slot = row.querySelector(".action-slot");
    const refresh = () => { slot.innerHTML = cart[id]?.qty ? qtyHTML(cart[id].qty) : '<button class="addbtn">ADD +</button>'; bind(); };
    const bind = () => {
      const add = slot.querySelector(".addbtn");
      if (add) add.addEventListener("click", () => { changeQty(r, item, +1); refresh(); });
      slot.querySelectorAll("[data-act]").forEach((b) =>
        b.addEventListener("click", () => { changeQty(r, item, b.dataset.act === "inc" ? +1 : -1); refresh(); }));
    };
    bind();
  });
}

function changeQty(r, item, delta) {
  const existing = cart[item.id];
  // single-restaurant cart, like the real apps
  if (delta > 0 && !existing && allItems().length && allItems()[0].restId !== r.id) {
    if (!confirm("Your cart has items from another restaurant. Start fresh with this one?")) return;
    cart = {};
  }
  const q = (cart[item.id]?.qty || 0) + delta;
  if (q <= 0) delete cart[item.id];
  else cart[item.id] = { id: item.id, name: item.name, price: item.price, veg: item.veg, emoji: item.emoji, restId: r.id, restName: r.name, qty: q };
  saveCart();
}

// ── CART ───────────────────────────────────────────────────────
function renderCart() {
  if (!allItems().length) return renderEmptyCart();
  const sub = cartSubtotal();
  const deliveryReal = 49, taxesReal = Math.round(sub * 0.05);
  const restName = allItems()[0].restName;
  app.innerHTML = `
    <h2 class="section-h">Your cart</h2>
    <div class="cart-rest">
      <b>${restName}</b>
      <div id="cartItems"></div>
    </div>
    <div class="bill">
      <div class="bill-row"><span>Item total</span><span>${rupee(sub)}</span></div>
      <div class="bill-row"><span>Delivery fee</span><span><s style="color:var(--muted)">${rupee(deliveryReal)}</s> <span class="free">FREE</span></span></div>
      <div class="bill-row"><span>Taxes & charges</span><span><s style="color:var(--muted)">${rupee(taxesReal)}</s> <span class="free">FREE</span></span></div>
      <div class="bill-row total"><span>To pay</span><span class="free">₹0</span></div>
    </div>
    <button class="place-btn" id="placeBtn">Place order · pay nothing</button>
    <p class="cart-note">You'd have paid ${rupee(sub + deliveryReal + taxesReal)} on a real app. Here it's ₹0.</p>
  `;
  const wrap = document.getElementById("cartItems");
  const draw = () => {
    if (!allItems().length) return renderCart();
    wrap.innerHTML = allItems().map((it) => `
      <div class="cart-item" data-ci="${it.id}">
        <span>${it.emoji}</span>
        <div class="ci-name">${it.name}<small>${rupee(it.price)} each</small></div>
        ${qtyHTML(it.qty)}
        <b style="width:70px;text-align:right">${rupee(it.price * it.qty)}</b>
      </div>`).join("");
    wrap.querySelectorAll("[data-ci]").forEach((row) => {
      const it = cart[row.dataset.ci];
      row.querySelector('[data-act="inc"]').addEventListener("click", () => { it.qty++; saveCart(); draw(); refreshBill(); });
      row.querySelector('[data-act="dec"]').addEventListener("click", () => { it.qty--; if (it.qty <= 0) delete cart[row.dataset.ci]; saveCart(); draw(); refreshBill(); });
    });
  };
  const refreshBill = () => { if (allItems().length) renderCart(); };
  draw();
  document.getElementById("placeBtn").addEventListener("click", placeOrder);
}

function renderEmptyCart() {
  app.innerHTML = `
    <div class="empty-screen">
      <div class="big">🛒</div>
      <h2>Cart's empty</h2>
      <p>Go fill it up. You won't be charged — that's the whole idea.</p>
      <button id="browseBtn">Browse restaurants</button>
    </div>`;
  document.getElementById("browseBtn").addEventListener("click", () => go("home"));
}

// ── ORDER + FAKE TRACKING + REVEAL ─────────────────────────────
const RIDERS = ["Rahul", "Sandeep", "Imran", "Vicky", "Manoj", "Salman", "Deepak"];
function placeOrder() {
  const items = allItems();
  const sub = cartSubtotal();
  const wouldHavePaid = sub + 49 + Math.round(sub * 0.05); // item + delivery + taxes
  const rider = RIDERS[Math.floor(Math.random() * RIDERS.length)]; // picks a name, not a fake person count
  const restName = items[0].restName;

  // record the real order in history (your own action)
  const orders = loadJSON(LS_ORDERS, []);
  orders.unshift({
    id: "BB" + Date.now().toString().slice(-7),
    restName,
    items: items.map((i) => ({ name: i.name, qty: i.qty, emoji: i.emoji })),
    wouldHavePaid,
    ts: Date.now(),
  });
  localStorage.setItem(LS_ORDERS, JSON.stringify(orders.slice(0, 30)));

  document.getElementById("backBtn").hidden = true;
  app.innerHTML = `
    <div class="track-screen">
      <div class="track-emoji">🛵</div>
      <h2>${rider} is picking up your order</h2>
      <div class="track-bar"><i id="trk"></i></div>
      <p class="track-msg" id="trkMsg">Order placed at ${restName}…</p>
    </div>`;

  const bar = document.getElementById("trk");
  const msg = document.getElementById("trkMsg");
  const steps = [
    [25, `${rider} has collected your food 🍱`],
    [55, `${rider} is 6 mins away 🛵`],
    [80, `${rider} has reached your gate…`],
    [95, `${rider} is calling you ☎️`],
  ];
  let p = 0;
  const t = setInterval(() => {
    p += 5; bar.style.width = p + "%";
    const s = steps.find((s) => s[0] === p);
    if (s) msg.textContent = s[1];
    if (p >= 100) { clearInterval(t); revealTruth(wouldHavePaid); }
  }, 200);
}

function revealTruth(kept) {
  cart = {}; saveCart();
  document.getElementById("backBtn").hidden = false;

  // stickiness: streak + cumulative savings + celebrate
  const orders = loadJSON(LS_ORDERS, []);
  const totalKept = orders.reduce((a, o) => a + (o.wouldHavePaid || 0), 0);
  const st = window.Sticky ? Sticky.streak("bhook") : { count: 1 };
  if (window.Sticky) Sticky.celebrate(["🍔", "💸", "🤑", "🎉", "🛵"]);

  app.innerHTML = `
    <div class="track-screen reveal">
      <div class="track-emoji">🫥</div>
      <h2>…just kidding.</h2>
      <p>Nothing's coming. There's no Rahul. But the craving's quieter now, na?
      That little hit of "I ordered something" — you got it, and it cost you nothing.</p>
      <div>
        <div class="stat"><b>₹0</b><span>actually spent</span></div>
        <div class="stat"><b>${rupee(kept)}</b><span>money you kept</span></div>
        <div class="stat"><b>0</b><span>calories</span></div>
      </div>
      <div style="margin-top:16px">
        <span class="dd-streak">🔥 <b>${st.count}-day</b> streak · kept <b>${rupee(totalKept)}</b> total</span>
      </div>
      <div style="margin-top:22px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <button class="dd-share" id="shareBtn">📲 Flex my ₹0 order</button>
        <button class="place-btn" style="max-width:240px;margin-top:0" id="againBtn">Order nothing again</button>
      </div>
    </div>`;
  document.getElementById("againBtn").addEventListener("click", () => go("home"));
  document.getElementById("shareBtn").addEventListener("click", () => {
    if (!window.Sticky) return;
    Sticky.buzz();
    Sticky.share({
      title: "Khaana Aaya Kya",
      text: `I just "ordered" ${rupee(kept)} of food and paid ₹0 😌 craving's gone anyway. Khaana Aaya Kya —`,
    });
  });
}

// ── ORDERS HISTORY (real, yours) ───────────────────────────────
function renderOrders() {
  const orders = loadJSON(LS_ORDERS, []);
  if (!orders.length) {
    app.innerHTML = `
      <div class="empty-screen">
        <div class="big">🧾</div>
        <h2>No orders yet</h2>
        <p>Every time you "order", it lands here — with how much you didn't spend.</p>
        <button id="browseBtn">Start craving</button>
      </div>`;
    document.getElementById("browseBtn").addEventListener("click", () => go("home"));
    return;
  }
  const totalSaved = orders.reduce((a, o) => a + o.wouldHavePaid, 0);
  app.innerHTML = `
    <h2 class="section-h">Your orders</h2>
    <p style="color:var(--muted);margin-bottom:16px">You've "spent" ₹0 across ${orders.length} order(s) — and kept <b class="oc-saved">${rupee(totalSaved)}</b>.</p>
    ${orders.map(orderCardHTML).join("")}
  `;
}
function orderCardHTML(o) {
  const d = new Date(o.ts);
  const when = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ", " +
    `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  return `
    <div class="order-card">
      <div class="oc-top"><b>${o.restName}</b><span class="oc-when">${when}</span></div>
      <div class="oc-items">${o.items.map((i) => `${i.emoji} ${i.name} ×${i.qty}`).join(" · ")}</div>
      <div class="oc-foot"><span>Order ${o.id} · paid ₹0</span><span class="oc-saved">kept ${rupee(o.wouldHavePaid)}</span></div>
    </div>`;
}

// ── cart UI sync ───────────────────────────────────────────────
function syncCartUI() {
  const count = cartCount();
  const badge = document.getElementById("cartBadge");
  badge.hidden = count === 0; badge.textContent = count;
  const pill = document.getElementById("cartPill");
  const onCart = app.querySelector(".bill");
  pill.hidden = count === 0 || !!onCart;
  document.getElementById("pillCount").textContent = count;
  document.getElementById("pillTotal").textContent = rupee(cartSubtotal());
}

// ── wiring ─────────────────────────────────────────────────────
document.getElementById("backBtn").addEventListener("click", () => currentRest ? go("home") : go("home"));
document.getElementById("cartBtn").addEventListener("click", () => go("cart"));
document.getElementById("ordersBtn").addEventListener("click", () => go("orders"));
document.getElementById("pillView").addEventListener("click", () => go("cart"));

go("home");
syncCartUI();
