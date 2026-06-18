# Dopamine Desi 🧠🇮🇳

Four working **"dopamine apps" for India** — apps where you do the ritual without the
transaction. Inspired by South Korea's real "dopamine sites": fake food-delivery apps you
order from but never pay, and virtual smoke-break rooms where lonely, burnt-out Gen Z sit
together doing nothing.

**No fake numbers anywhere.** Where an app shows "people online", it's real. Where it shows
money, it's your own simulated wallet. Nothing is fabricated for social proof.

## The four apps

| App | Folder | What it does | Backend |
|-----|--------|--------------|---------|
| 🍔 **Bhook Bhagao** | `apps/bhook-bhagao` | Fake Swiggy/Zomato. Browse menus → cart → checkout at ₹0 → rider tracking → "just kidding". Real order history in localStorage. | static |
| 🚬 **Sutta Room** | `apps/sutta-room` | Virtual smoke-break room with **real-time presence** — head-count = live WebSocket connections, real message wall. | Node + ws |
| 📈 **Paper Paisa** | `apps/paper-paisa` | Paper-trade stocks & crypto with ₹1,00,000 of fake money on a live simulated ticker. Portfolio + P&L. | static |
| 🚆 **Ghar Jaana Hai** | `apps/ghar-jaana-hai` | Tatkal-rush simulator. Pick a route home, race the queue, get a CONFIRMED seat + PNR, then the reveal. Trip history. | static |

The landing page (`index.html`) links to all four.

## Run locally

Static apps + landing (one server, same origin):

```bash
python3 -m http.server 4321        # from this folder
# landing:        http://localhost:4321/
# bhook bhagao:   http://localhost:4321/apps/bhook-bhagao/
# paper paisa:    http://localhost:4321/apps/paper-paisa/
# ghar jaana hai: http://localhost:4321/apps/ghar-jaana-hai/
```

Sutta Room needs its own Node server (real WebSocket presence):

```bash
cd apps/sutta-room
npm install
npm start                          # http://localhost:5051
```

## SEO

Each page ships with `<title>`, meta description + keywords, canonical, Open Graph + Twitter
cards, `theme-color`, and JSON-LD structured data (`WebSite` + `ItemList` on the landing,
`WebApplication` per app). Site-wide `robots.txt`, `sitemap.xml`, and `og-image.svg` live at
the root. Canonical/OG URLs point at `https://dopamine-desi.vercel.app` — update the base if
you deploy elsewhere.

> Note: the OG image is an SVG. Most search engines are fine with the meta tags as-is; for
> guaranteed social-card previews on every platform, rasterise `og-image.svg` to a 1200×630 PNG.

## Deploy

Static apps deploy anywhere (`npx vercel --prod`). Sutta Room needs a host that supports
persistent WebSocket connections (Render, Railway, Fly, or AWS — not Vercel's static tier).
