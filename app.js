// ───────────────────────────────────────────────────────────
// Dopamine Desi — 10 fake-app ideas for India + 2 live demos
// ───────────────────────────────────────────────────────────

const IDEAS = [
  { ico: "🍔", name: "Bhook Bhagao", clone: "fake Swiggy / Zomato", live: true,
    desc: "Browse real-looking biryani, dosa & momos, fill a cart, hit “order”. A delivery boy named Rahul even starts moving on a map. Nothing arrives. ₹0 + 0 calories.",
    pressure: "₹120 delivery fees + 11pm cravings" },
  { ico: "☕", name: "Chai Pe Charcha", clone: "virtual smoke-break room", live: true,
    desc: "Tap a cup to ‘take a break’. See how many strangers are on a break with you and leave one tired line. The whole product is: you’re not alone at 2am.",
    pressure: "WFH isolation + hustle-culture burnout" },
  { ico: "📈", name: "Paper Paisa", clone: "fake Zerodha / Groww", live: false,
    desc: "Buy and sell stocks & crypto with fake money on a real-feeling ticker. Feel the rush of a 20% green candle without joining the 90% of F&O traders who lose real cash.",
    pressure: "finfluencer FOMO + gambling-grade dopamine" },
  { ico: "🚆", name: "Ghar Jaana Hai", clone: "fake IRCTC Tatkal", live: false,
    desc: "Run the 10am Tatkal adrenaline — pick the train home, race the timer, get ‘CONFIRMED, B2-43’. You never travel. The homesickness just eases for a minute.",
    pressure: "migrant homesickness + Tatkal anxiety" },
  { ico: "💍", name: "Sasti Shaadi", clone: "fake big-fat-wedding planner", live: false,
    desc: "Plan the whole shaadi — Udaipur palace, 600 guests, the lehenga, the menu — and ‘book’ it. The ₹40-lakh fantasy, the family pressure-free version.",
    pressure: "log kya kahenge + wedding inflation" },
  { ico: "🛒", name: "Big Billion Cart", clone: "fake Flipkart / Amazon sale", live: false,
    desc: "A sale that never ends. Watch fake price drops, fill the cart, ‘check out’. Retail therapy with the credit-card bill surgically removed.",
    pressure: "sale-season impulse + EMI guilt" },
  { ico: "📚", name: "Saath Mein Padho", clone: "virtual study room", live: false,
    desc: "‘1,243 aspirants studying now’. A silent co-study room with a Pomodoro timer for UPSC/JEE/NEET kids grinding alone in Kota and PG rooms.",
    pressure: "coaching-hub loneliness + exam dread" },
  { ico: "🍲", name: "Maa Ke Haath Ka", clone: "home-kitchen presence app", live: false,
    desc: "Open it and Maa is ‘cooking’ — the sound of a cooker whistle, a thali filling up, ‘khaana ready hai, aa ja’. Comfort food for hostelers who can’t go home.",
    pressure: "PG/hostel homesickness" },
  { ico: "🪔", name: "Online Darshan", clone: "fake temple / aarti break", live: false,
    desc: "Ring the bell, light a diya, get 30 seconds of aarti and ‘214 people praying now’. A tiny ritual pause, no queue, no travel, no donation box.",
    pressure: "anxiety + craving for stillness" },
  { ico: "💪", name: "Body Banaenge Kal", clone: "fake gym-streak app", live: false,
    desc: "Log the workout you didn’t do. Watch a fake streak and ‘gains’ climb. The dopamine of ‘kal se pakka’ — the resolution, minus the gym.",
    pressure: "fitness guilt + January energy in June" },
];

// ── render idea cards ───────────────────────────────────────
const grid = document.getElementById("ideaGrid");
grid.innerHTML = IDEAS.map((d, i) => `
  <article class="idea${d.live ? " live" : ""}">
    ${d.live ? '<span class="livetag">LIVE ↓</span>' : ""}
    <div class="num">app ${String(i + 1).padStart(2, "0")}</div>
    <div class="ico">${d.ico}</div>
    <h3>${d.name}</h3>
    <div class="clone">${d.clone}</div>
    <p>${d.desc}</p>
    <span class="pressure">🎯 ${d.pressure}</span>
  </article>
`).join("");

// ── live "people pretending" counter (hero) ─────────────────
const liveEl = document.getElementById("liveCount");
let live = 1200 + Math.floor(Math.random() * 800);
const renderLive = () => (liveEl.textContent = live.toLocaleString("en-IN"));
renderLive();
setInterval(() => {
  live += Math.floor(Math.random() * 11) - 4;
  if (live < 800) live = 800;
  renderLive();
}, 1800);

// phone clock
const ptime = document.getElementById("phoneTime");
const tick = () => {
  const d = new Date();
  ptime.textContent = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
tick(); setInterval(tick, 10000);

// ───────────────────────────────────────────────────────────
// DEMO 1 — Bhook Bhagao (fake food delivery)
// ───────────────────────────────────────────────────────────
const MENU = [
  { ico: "🍛", name: "Hyderabadi Dum Biryani", desc: "Meena's Kitchen · 35 min", price: 249, rate: "★ 4.5" },
  { ico: "🥞", name: "Masala Dosa (2 pc)", desc: "Udupi Express · 28 min", price: 129, rate: "★ 4.6" },
  { ico: "🥟", name: "Steamed Veg Momos", desc: "Momo Mia · 22 min", price: 99, rate: "★ 4.3" },
  { ico: "🍜", name: "Schezwan Hakka Noodles", desc: "Wok This Way · 30 min", price: 179, rate: "★ 4.2" },
  { ico: "🧁", name: "Gulab Jamun (4 pc)", desc: "Sweet Tooth · 25 min", price: 89, rate: "★ 4.7" },
  { ico: "☕", name: "Cutting Chai + Maska Bun", desc: "Irani Cafe · 18 min", price: 69, rate: "★ 4.8" },
];
const cart = {};
const menuEl = document.getElementById("menu");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

menuEl.innerHTML = MENU.map((m, i) => `
  <div class="item">
    <div class="pic">${m.ico}</div>
    <div class="meta">
      <b>${m.name}</b>
      <small>${m.desc} · <span class="rate">${m.rate}</span></small>
    </div>
    <div style="text-align:right">
      <div style="font-size:.85rem;margin-bottom:4px">₹${m.price}</div>
      <button class="add" data-i="${i}">ADD</button>
    </div>
  </div>
`).join("");

function renderCart() {
  const items = Object.values(cart);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const total = items.reduce((a, b) => a + b.qty * b.price, 0);
  cartCount.textContent = count;
  cartTotal.textContent = "₹" + total;
  cartBar.hidden = count === 0;
}

menuEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const i = btn.dataset.i;
  cart[i] = cart[i] ? { ...cart[i], qty: cart[i].qty + 1 } : { ...MENU[i], qty: 1 };
  btn.textContent = "ADDED ✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "ADD"; btn.classList.remove("added"); }, 900);
  renderCart();
});

const orderBtn = document.getElementById("orderBtn");
const overlay = document.getElementById("foodOverlay");
const RIDERS = ["Rahul", "Sandeep", "Imran", "Vicky", "Manoj"];

orderBtn.addEventListener("click", () => {
  const rider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
  overlay.hidden = false;
  overlay.innerHTML = `
    <div class="big">🛵</div>
    <h3>${rider} is on the way!</h3>
    <div class="track"><i id="trk"></i></div>
    <p id="trkmsg">${rider} picked up your order…</p>`;
  let p = 0;
  const bar = document.getElementById("trk");
  const msg = document.getElementById("trkmsg");
  const steps = [
    [30, `${rider} is 8 mins away 🛵`],
    [65, `${rider} is at your gate…`],
    [95, `${rider} is calling you ☎️`],
  ];
  const t = setInterval(() => {
    p += 5;
    bar.style.width = p + "%";
    const s = steps.find(s => s[0] === p);
    if (s) msg.textContent = s[1];
    if (p >= 100) {
      clearInterval(t);
      overlay.innerHTML = `
        <div class="big">🫥</div>
        <h3>...just kidding.</h3>
        <p>Nothing's coming. You spent <b>₹0</b>, ate <b>0 calories</b>,
        and the craving's gone anyway. That was the whole point.</p>
        <button class="btn btn-ghost sm" id="resetFood">Order nothing again</button>`;
      document.getElementById("resetFood").addEventListener("click", () => {
        overlay.hidden = true;
        for (const k in cart) delete cart[k];
        renderCart();
      });
    }
  }, 220);
});

// ───────────────────────────────────────────────────────────
// DEMO 2 — Chai Pe Charcha (virtual break room)
// ───────────────────────────────────────────────────────────
const cup = document.getElementById("cup");
const chaiStatus = document.getElementById("chaiStatus");
const chaiOnline = document.getElementById("chaiOnline");
const wall = document.getElementById("wall");
const chaiForm = document.getElementById("chaiForm");
const chaiInput = document.getElementById("chaiInput");

let onBreak = false;
let online = 9 + Math.floor(Math.random() * 30);
chaiOnline.textContent = online;

const SEED = [
  "ek aur din nikal gaya 😮‍💨",
  "deadline kal hai, chai pe hoon",
  "ghar jaana hai yaar",
  "5 min ka break, phir wapas grind",
  "koi online hai? bas feel aa rahi hai",
  "Monday se diet pakka 😂",
];
const NAMES = ["anon_blr", "tired_intern", "kota_kid", "night_owl", "chai_addict", "ctrl_alt_del", "9to9_zombie"];
const randName = () => NAMES[Math.floor(Math.random() * NAMES.length)] + "_" + Math.floor(Math.random() * 90 + 10);

function addMsg(text, who, mine = false) {
  const el = document.createElement("div");
  el.className = "msg" + (mine ? " me" : "");
  el.innerHTML = `<small>${mine ? "you" : who} · just now</small>${escapeHtml(text)}`;
  wall.appendChild(el);
  wall.scrollTop = wall.scrollHeight;
}
function escapeHtml(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

// seed the wall
SEED.slice(0, 3).forEach(t => addMsg(t, randName()));

cup.addEventListener("click", () => {
  onBreak = !onBreak;
  if (onBreak) {
    cup.classList.add("steaming");
    chaiStatus.textContent = "You're on a break. Breathe. ☕";
    online++;
  } else {
    cup.classList.remove("steaming");
    chaiStatus.textContent = "Break over. Tap the cup when it gets heavy again.";
    online--;
  }
  chaiOnline.textContent = online;
});

chaiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = chaiInput.value.trim();
  if (!v) return;
  addMsg(v, "you", true);
  chaiInput.value = "";
  // a stranger "replies" with presence
  setTimeout(() => addMsg(SEED[Math.floor(Math.random() * SEED.length)], randName()), 900 + Math.random() * 1200);
});

// ambient life: numbers drift, strangers occasionally post
setInterval(() => {
  online += Math.floor(Math.random() * 5) - 2;
  if (online < 4) online = 4;
  chaiOnline.textContent = online;
}, 2600);
setInterval(() => {
  if (Math.random() < 0.5) addMsg(SEED[Math.floor(Math.random() * SEED.length)], randName());
}, 6000);
