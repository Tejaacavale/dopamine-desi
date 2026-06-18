// ───────────────────────────────────────────────────────────
// Dopamine Desi — landing page. Renders the 10 idea cards.
// Two of them link to real, separate apps under /apps. No fake
// numbers or live counters anywhere on this page.
// ───────────────────────────────────────────────────────────

const IDEAS = [
  { ico: "🍔", name: "Bhook Bhagao", clone: "fake Swiggy / Zomato", url: "apps/bhook-bhagao/",
    desc: "Browse real-looking biryani, dosa & momos, fill a cart, hit “order”. A delivery boy named Rahul even starts moving. Nothing arrives. ₹0 + 0 calories.",
    pressure: "₹120 delivery fees + 11pm cravings" },
  { ico: "🚬", name: "Sutta Room", clone: "virtual smoke-break room", url: "http://localhost:5051/",
    desc: "Light up and take a break with whoever's actually online. The head-count is real connected people; the wall is real messages. The whole product is: you’re not alone at 2am.",
    pressure: "WFH isolation + hustle-culture burnout" },
  { ico: "📈", name: "Paper Paisa", clone: "fake Zerodha / Groww",
    desc: "Buy and sell stocks & crypto with fake money on a real-feeling ticker. Feel the rush of a 20% green candle without joining the 90% of F&O traders who lose real cash.",
    pressure: "finfluencer FOMO + gambling-grade dopamine" },
  { ico: "🚆", name: "Ghar Jaana Hai", clone: "fake IRCTC Tatkal",
    desc: "Run the 10am Tatkal adrenaline — pick the train home, race the timer, get ‘CONFIRMED, B2-43’. You never travel. The homesickness just eases for a minute.",
    pressure: "migrant homesickness + Tatkal anxiety" },
  { ico: "💍", name: "Sasti Shaadi", clone: "fake big-fat-wedding planner",
    desc: "Plan the whole shaadi — Udaipur palace, 600 guests, the lehenga, the menu — and ‘book’ it. The ₹40-lakh fantasy, the family pressure-free version.",
    pressure: "log kya kahenge + wedding inflation" },
  { ico: "🛒", name: "Big Billion Cart", clone: "fake Flipkart / Amazon sale",
    desc: "A sale that never ends. Watch fake price drops, fill the cart, ‘check out’. Retail therapy with the credit-card bill surgically removed.",
    pressure: "sale-season impulse + EMI guilt" },
  { ico: "📚", name: "Saath Mein Padho", clone: "virtual study room",
    desc: "A silent co-study room with a Pomodoro timer and real presence for UPSC/JEE/NEET kids grinding alone in Kota and PG rooms.",
    pressure: "coaching-hub loneliness + exam dread" },
  { ico: "🍲", name: "Maa Ke Haath Ka", clone: "home-kitchen presence app",
    desc: "Open it and Maa is ‘cooking’ — a cooker whistle, a thali filling up, ‘khaana ready hai, aa ja’. Comfort food for hostelers who can’t go home.",
    pressure: "PG/hostel homesickness" },
  { ico: "🪔", name: "Online Darshan", clone: "fake temple / aarti break",
    desc: "Ring the bell, light a diya, get 30 seconds of aarti. A tiny ritual pause, no queue, no travel, no donation box.",
    pressure: "anxiety + craving for stillness" },
  { ico: "💪", name: "Body Banaenge Kal", clone: "fake gym-streak app",
    desc: "Log the workout you didn’t do. Watch a streak and ‘gains’ climb. The dopamine of ‘kal se pakka’ — the resolution, minus the gym.",
    pressure: "fitness guilt + January energy in June" },
];

const grid = document.getElementById("ideaGrid");
grid.innerHTML = IDEAS.map((d, i) => `
  <article class="idea${d.url ? " live" : ""}">
    ${d.url ? '<span class="livetag">LIVE</span>' : '<span class="livetag soon">soon</span>'}
    <div class="num">app ${String(i + 1).padStart(2, "0")}</div>
    <div class="ico">${d.ico}</div>
    <h3>${d.name}</h3>
    <div class="clone">${d.clone}</div>
    <p>${d.desc}</p>
    <span class="pressure">🎯 ${d.pressure}</span>
    ${d.url ? `<a class="card-open" href="${d.url}">Open app →</a>` : ""}
  </article>
`).join("");
