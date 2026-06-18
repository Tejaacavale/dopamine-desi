# Dopamine Desi 🧠🇮🇳

A concept showcase of **10 "dopamine app" ideas for India** — apps where you do the
ritual without the transaction. Inspired by South Korea's real "dopamine sites":
fake food-delivery apps you order from but never pay, and virtual smoke-break rooms
where lonely, burnt-out Gen Z sit together doing nothing.

Two of the ten ideas are **fully working demos** on the page:

- **🍔 Bhook Bhagao** — a fake Swiggy/Zomato. Browse Indian menus, fill a cart, "place order",
  watch a delivery rider move… then nothing arrives. ₹0, 0 calories.
- **☕ Chai Pe Charcha** — a virtual chai-tapri break room. Tap the cup, see how many strangers
  are "on a break", and post one tired line.

The other 8 (Paper Paisa, Ghar Jaana Hai, Sasti Shaadi, Big Billion Cart, Saath Mein Padho,
Maa Ke Haath Ka, Online Darshan, Body Banaenge Kal) are presented as cards.

## Stack

Pure static — `index.html` + `styles.css` + `app.js`. No build step, no dependencies.

## Run locally

```bash
python3 -m http.server 4321
# open http://localhost:4321
```

## Deploy

It's a static folder, so any host works. Two one-liners:

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir .
```

Both will prompt you to log in the first time.
