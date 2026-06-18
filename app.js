// ───────────────────────────────────────────────────────────
// Dopamine Desi — landing page. Four real, separate apps, each
// linking to its own folder under /apps. No fake numbers here.
// ───────────────────────────────────────────────────────────

const IDEAS = [
  { ico: "🍔", name: "Bhook Bhagao", clone: "fake Swiggy / Zomato", url: "apps/bhook-bhagao/",
    desc: "Browse real menus of biryani, dosa & momos, fill a cart, check out at ₹0, watch a rider head over… then “just kidding”. Your order history tracks how much you didn’t spend.",
    pressure: "₹120 delivery fees + 11pm cravings" },
  { ico: "🚬", name: "Sutta Room", clone: "virtual smoke-break room", url: "http://localhost:5051/",
    desc: "Light up and take a break with whoever’s actually online. The head-count is real connected people; the wall is real messages. If one person’s here, it says one. Nothing’s faked.",
    pressure: "WFH isolation + hustle-culture burnout" },
  { ico: "📈", name: "Paper Paisa", clone: "fake Zerodha / Groww", url: "apps/paper-paisa/",
    desc: "Buy and sell stocks & crypto with ₹1,00,000 of paper money on a live simulated ticker. Feel the rush of a green candle without joining the traders who lose real cash.",
    pressure: "finfluencer FOMO + gambling-grade dopamine" },
  { ico: "🚆", name: "Ghar Jaana Hai", clone: "fake IRCTC Tatkal", url: "apps/ghar-jaana-hai/",
    desc: "Run the 10am Tatkal adrenaline — pick the train home, race the queue, get ‘CONFIRMED, S7/63’. You never travel. The homesickness just eases for 90 seconds.",
    pressure: "migrant homesickness + Tatkal anxiety" },
];

const grid = document.getElementById("ideaGrid");
grid.innerHTML = IDEAS.map((d, i) => `
  <article class="idea live">
    <span class="livetag">LIVE</span>
    <div class="num">app ${String(i + 1).padStart(2, "0")}</div>
    <div class="ico">${d.ico}</div>
    <h3>${d.name}</h3>
    <div class="clone">${d.clone}</div>
    <p>${d.desc}</p>
    <span class="pressure">🎯 ${d.pressure}</span>
    <a class="card-open" href="${d.url}">Open app →</a>
  </article>
`).join("");
