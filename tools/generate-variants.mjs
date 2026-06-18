// ───────────────────────────────────────────────────────────
// Variant generator. Stamps out re-branded, re-skinned clones of the
// four base apps into apps/<slug>/. Each clone gets a UNIQUE title,
// meta description, keywords, theme colour, brand name and a SELF
// canonical — so search engines see distinct pages, not duplicates.
//
//   node tools/generate-variants.mjs
// ───────────────────────────────────────────────────────────
import { promises as fs } from "fs";
import { cpSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = "https://dopamine-desi.vercel.app";

// ── config: 4 variants per base app ─────────────────────────
const APPS = [
  {
    base: "bhook-bhagao", brand: "Bhook Bhagao", nbsp: "Bhook&nbsp;Bhagao",
    kind: "static", accentVars: ["--brand", "--brand-2"],
    kw: "fake food delivery, order without paying, craving simulator, dopamine app India, Swiggy dupe",
    variants: [
      { slug: "khaana-aaya-kya", brand: "Khaana Aaya Kya", accent: ["#e23744", "#ff7e5f"], tagline: "order it, never pay for it 🍔", desc: "Browse Indian menus, fill a cart and 'order' — pay ₹0, nothing arrives, the craving leaves anyway. A fake food-delivery dopamine app." },
      { slug: "bhook-mitao", brand: "Bhook Mitao", accent: ["#f5511e", "#ff8a00"], tagline: "kill the craving, keep the cash 🍛", desc: "Do the whole food-ordering ritual for free. Track a rider who isn't coming, then keep every rupee. India's craving-without-cost app." },
      { slug: "order-karle", brand: "Order Karle", accent: ["#16a34a", "#4ade80"], tagline: "the order you'll never place 🥟", desc: "Add biryani, dosa and momos to a cart, hit order, pay nothing. A guilt-free fake-delivery app for late-night cravings." },
      { slug: "zaika-zero", brand: "Zaika Zero", accent: ["#9333ea", "#c084fc"], tagline: "all the flavour, zero bill 🧁", desc: "Taste the dopamine of ordering food without the delivery fee, the calories or the regret. Zero-rupee fake food delivery." },
    ],
  },
  {
    base: "sutta-room", brand: "Sutta Room", nbsp: "Sutta&nbsp;Room",
    kind: "server", accentVars: ["--ember", "--ember-glow"], basePort: 5051,
    kw: "virtual sutta room, online smoke break, real-time presence, lonely at 2am, dopamine app India",
    variants: [
      { slug: "sutta-break", brand: "Sutta Break", accent: ["#ff8c42", "#ff5e3a"], port: 5052, tagline: "take five with real strangers 🚬", desc: "A virtual smoke break with a real head-count and a live message wall. Sit with whoever's actually online right now." },
      { slug: "cutting-sutta", brand: "Cutting Sutta", accent: ["#e0a458", "#c9a44e"], port: 5053, tagline: "ek cutting, saath mein 🚬", desc: "A real-time break room — genuine presence, anonymous wall. Light up and feel less alone at odd hours." },
      { slug: "damta-adda", brand: "Damta Adda", accent: ["#4dd0e1", "#26a69a"], port: 5054, tagline: "the online break room ✨", desc: "India's answer to Korea's Online Damta: real connected people taking a break together, a live wall, nothing faked." },
      { slug: "sutta-saath", brand: "Sutta Saath", accent: ["#f06292", "#ec407a"], port: 5055, tagline: "alone, together 🌃", desc: "Real-time virtual smoke-break room. The count is live sockets, the messages are real. Company for the burnt-out." },
    ],
  },
  {
    base: "paper-paisa", brand: "Paper Paisa", nbsp: "Paper&nbsp;Paisa",
    kind: "static", accentVars: ["--accent"],
    kw: "paper trading India, virtual stock market, practice trading, fake money trading, simulated stocks crypto",
    variants: [
      { slug: "kaagaz-paisa", brand: "Kaagaz Paisa", accent: ["#22c55e"], tagline: "trade on paper, lose nothing 📈", desc: "Buy and sell stocks and crypto with ₹1,00,000 of fake money on a live simulated ticker. The green-candle rush, zero real risk." },
      { slug: "demo-dalal", brand: "Demo Dalal", accent: ["#3b82f6"], tagline: "be the broker, fake the money 📊", desc: "A paper-trading playground: practice trades, track P&L, chase profits with simulated cash. No real rupee at stake." },
      { slug: "jhootha-profit", brand: "Jhootha Profit", accent: ["#a855f7"], tagline: "all the highs, none of the losses 🤑", desc: "Feel the dopamine of a winning trade on fake money. Live simulated prices, portfolio P&L, zero real downside." },
      { slug: "paper-vyapaar", brand: "Paper Vyapaar", accent: ["#f59e0b"], tagline: "practise the trade, skip the risk 💸", desc: "Simulated stock and crypto trading with paper money. Learn the rush of the market without losing real cash." },
    ],
  },
  {
    base: "ghar-jaana-hai", brand: "Ghar Jaana Hai", nbsp: "Ghar&nbsp;Jaana&nbsp;Hai",
    kind: "static", accentVars: ["--rail", "--rail-2"],
    kw: "Tatkal simulator, fake train booking, IRCTC dopamine app, homesick India, virtual train ticket",
    variants: [
      { slug: "ghar-chalo", brand: "Ghar Chalo", accent: ["#2563eb", "#60a5fa"], tagline: "book the seat home, skip the trip 🚆", desc: "Run the 10am Tatkal rush, get a CONFIRMED seat and PNR, then remember you're not actually travelling. Relief for the homesick." },
      { slug: "tatkal-maaro", brand: "Tatkal Maaro", accent: ["#dc2626", "#f87171"], tagline: "win the Tatkal scramble 🎫", desc: "The 10am queue adrenaline, the confirmed berth, the relief — minus the journey. A homesickness simulator, ₹0." },
      { slug: "seat-pakdo", brand: "Seat Pakdo", accent: ["#059669", "#34d399"], tagline: "grab a seat you'll never sit in 🚆", desc: "Race the Tatkal queue, lock a confirmed seat home, keep the ticket as a keepsake. No real booking, no money." },
      { slug: "ghar-ki-yaad", brand: "Ghar Ki Yaad", accent: ["#7c3aed", "#a78bfa"], tagline: "90 seconds of going home 🏡", desc: "For the migrant heart: book the train home, feel the homesickness ease, and let it go. A free Tatkal-rush simulator." },
    ],
  },
];

// ── helpers ─────────────────────────────────────────────────
const setTitle = (h, t) => h.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
const setMeta = (h, attrName, attrVal, content) =>
  h.replace(new RegExp(`(<meta\\s+(?:name|property)="${attrVal}"\\s+content=")[\\s\\S]*?(")`),
    `$1${content.replace(/"/g, "&quot;")}$2`);
const setAttr = (h, re, val) => h.replace(re, val);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function rebrandHtml(html, app, v, selfPath) {
  let h = html;
  const title = `${v.brand} — ${v.tagline}`;
  h = setTitle(h, title);
  h = setMeta(h, "name", "description", v.desc);
  h = setMeta(h, "name", "keywords", app.kw);
  h = setMeta(h, "name", "theme-color", v.accent[0]);
  h = setMeta(h, "property", "og:title", title);
  h = setMeta(h, "property", "og:description", v.desc);
  h = setMeta(h, "name", "twitter:title", title);
  h = setMeta(h, "name", "twitter:description", v.desc);
  // canonical + og:url + json-ld url: swap the base path → self path
  h = h.split(`/apps/${app.base}/`).join(`/apps/${v.slug}/`);
  // json-ld + visible name
  h = h.split(`"name": "${app.brand}"`).join(`"name": "${v.brand}"`);
  if (app.nbsp) h = h.split(app.nbsp).join(v.brand.replace(/ /g, "&nbsp;"));
  h = h.split(app.brand).join(v.brand);
  // accent re-skin: inject a :root override right before </head>
  const overrides = app.accentVars.map((name, i) => `${name}:${v.accent[i] || v.accent[0]}`).join(";");
  h = h.replace("</head>", `  <style>:root{${overrides}}</style>\n</head>`);
  return h;
}

function rebrandJs(js, app, v) {
  return js.split(app.brand).join(v.brand);
}

// ── run ─────────────────────────────────────────────────────
const generated = [];
for (const app of APPS) {
  for (const v of app.variants) {
    const src = join(ROOT, "apps", app.base);
    const dst = join(ROOT, "apps", v.slug);
    rmSync(dst, { recursive: true, force: true });
    cpSync(src, dst, { recursive: true });
    // never copy node_modules / lockfiles into clones
    rmSync(join(dst, "node_modules"), { recursive: true, force: true });

    if (app.kind === "static") {
      const htmlPath = join(dst, "index.html");
      const jsPath = join(dst, "app.js");
      await fs.writeFile(htmlPath, rebrandHtml(await fs.readFile(htmlPath, "utf8"), app, v));
      await fs.writeFile(jsPath, rebrandJs(await fs.readFile(jsPath, "utf8"), app, v));
    } else {
      // server app: rebrand public/ front-end + set a distinct default port
      const htmlPath = join(dst, "public", "index.html");
      const jsPath = join(dst, "public", "app.js");
      await fs.writeFile(htmlPath, rebrandHtml(await fs.readFile(htmlPath, "utf8"), app, v));
      await fs.writeFile(jsPath, rebrandJs(await fs.readFile(jsPath, "utf8"), app, v));
      const srvPath = join(dst, "server.js");
      let srv = await fs.readFile(srvPath, "utf8");
      srv = srv.replace(`|| ${app.basePort}`, `|| ${v.port}`).split(app.brand).join(v.brand);
      await fs.writeFile(srvPath, srv);
      const pkgPath = join(dst, "package.json");
      let pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
      pkg.name = v.slug;
      await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }
    generated.push({ slug: v.slug, brand: v.brand, kind: app.kind, port: v.port });
    console.log(`✓ ${app.base} → ${v.slug} (${v.brand})`);
  }
}

// ── rewrite sitemap.xml with bases + clones ─────────────────
const bases = APPS.map((a) => a.base);
const allPaths = ["", ...bases.map((b) => `apps/${b}/`), ...generated.map((g) => `apps/${g.slug}/`)];
const urls = allPaths.map((p) => `  <url>\n    <loc>${BASE_URL}/${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === "" ? "1.0" : "0.7"}</priority>\n  </url>`).join("\n");
await fs.writeFile(join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

console.log(`\nGenerated ${generated.length} clones. Sitemap now lists ${allPaths.length} URLs.`);
