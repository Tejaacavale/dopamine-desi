// Static catalog for Bhook Bhagao. These are menu/catalogue facts (names,
// prices, cuisines) — the kind of data any food app ships with. There are NO
// fake live numbers (no "23 people ordering now") anywhere in this app.

window.RESTAURANTS = [
  {
    id: "meena",
    name: "Meena's Biryani House",
    cuisines: ["Biryani", "Hyderabadi", "Mughlai"],
    rating: 4.5, eta: 32, priceForTwo: 400, grad: "linear-gradient(135deg,#ff7e5f,#feb47b)",
    emoji: "🍛", promo: "20% OFF up to ₹100",
    menu: [
      { cat: "Must Try", items: [
        { id: "m1", name: "Hyderabadi Chicken Dum Biryani", desc: "Long-grain basmati, slow-dum, served with raita & mirchi ka salan", price: 269, veg: false, bestseller: true, emoji: "🍗" },
        { id: "m2", name: "Veg Dum Biryani", desc: "Seasonal veggies, saffron, fried onions", price: 199, veg: true, bestseller: true, emoji: "🍚" },
        { id: "m3", name: "Mutton Biryani", desc: "Tender mutton, bone-in, family recipe", price: 329, veg: false, emoji: "🍖" },
      ]},
      { cat: "Sides & Kebabs", items: [
        { id: "m4", name: "Chicken 65", desc: "Crispy, spicy, curry-leaf tempered", price: 189, veg: false, emoji: "🌶️" },
        { id: "m5", name: "Paneer Tikka", desc: "Char-grilled, malai marinade", price: 179, veg: true, emoji: "🧀" },
        { id: "m6", name: "Double ka Meetha", desc: "Bread halwa, dry fruits", price: 99, veg: true, emoji: "🍮" },
      ]},
    ],
  },
  {
    id: "udupi",
    name: "Udupi Express",
    cuisines: ["South Indian", "Dosa", "Tiffin"],
    rating: 4.6, eta: 24, priceForTwo: 250, grad: "linear-gradient(135deg,#43cea2,#185a9d)",
    emoji: "🥞", promo: "Free filter coffee over ₹199",
    menu: [
      { cat: "Dosas", items: [
        { id: "u1", name: "Masala Dosa", desc: "Crispy, potato masala, chutney & sambar", price: 119, veg: true, bestseller: true, emoji: "🥞" },
        { id: "u2", name: "Mysore Masala Dosa", desc: "Red chutney smeared, spicy", price: 139, veg: true, emoji: "🌶️" },
        { id: "u3", name: "Ghee Roast", desc: "Extra long, dripping ghee", price: 149, veg: true, emoji: "🧈" },
      ]},
      { cat: "Tiffin", items: [
        { id: "u4", name: "Idli Vada Combo", desc: "2 idli, 1 vada, sambar, 2 chutneys", price: 99, veg: true, bestseller: true, emoji: "🍩" },
        { id: "u5", name: "Pongal", desc: "Ghee pongal, ginger, cashews", price: 109, veg: true, emoji: "🍚" },
        { id: "u6", name: "Filter Coffee", desc: "Degree kaapi, steel tumbler vibes", price: 49, veg: true, emoji: "☕" },
      ]},
    ],
  },
  {
    id: "momo",
    name: "Momo Mia",
    cuisines: ["Tibetan", "Chinese", "Street"],
    rating: 4.3, eta: 28, priceForTwo: 300, grad: "linear-gradient(135deg,#c94b4b,#4b134f)",
    emoji: "🥟", promo: "Buy 2 plates, get 1",
    menu: [
      { cat: "Momos", items: [
        { id: "mo1", name: "Steamed Veg Momos (8 pc)", desc: "Cabbage-carrot, fiery red chutney", price: 99, veg: true, bestseller: true, emoji: "🥟" },
        { id: "mo2", name: "Chicken Fried Momos (8 pc)", desc: "Crispy fried, schezwan dip", price: 139, veg: false, bestseller: true, emoji: "🍗" },
        { id: "mo3", name: "Tandoori Momos (6 pc)", desc: "Char-grilled, mint mayo", price: 159, veg: false, emoji: "🔥" },
      ]},
      { cat: "Noodles & More", items: [
        { id: "mo4", name: "Schezwan Hakka Noodles", desc: "Wok-tossed, extra spicy", price: 149, veg: true, emoji: "🍜" },
        { id: "mo5", name: "Chilli Paneer", desc: "Dry, capsicum, spring onion", price: 169, veg: true, emoji: "🧀" },
        { id: "mo6", name: "Thukpa", desc: "Hot noodle soup, winter special", price: 159, veg: true, emoji: "🍲" },
      ]},
    ],
  },
  {
    id: "irani",
    name: "Irani Cafe & Bakery",
    cuisines: ["Cafe", "Chai", "Bun Maska"],
    rating: 4.8, eta: 18, priceForTwo: 200, grad: "linear-gradient(135deg,#8e2de2,#4a00e0)",
    emoji: "☕", promo: "Cutting chai @ ₹15",
    menu: [
      { cat: "Chai & Buns", items: [
        { id: "i1", name: "Cutting Chai + Maska Bun", desc: "Irani chai, butter-loaded bun", price: 69, veg: true, bestseller: true, emoji: "☕" },
        { id: "i2", name: "Bun Maska Jam", desc: "Soft bun, butter & mixed-fruit jam", price: 59, veg: true, emoji: "🍞" },
        { id: "i3", name: "Osmania Biscuits (250g)", desc: "Sweet-salty, melt-in-mouth", price: 89, veg: true, bestseller: true, emoji: "🍪" },
      ]},
      { cat: "Bakery", items: [
        { id: "i4", name: "Mawa Cake Slice", desc: "Dense, cardamom, classic", price: 79, veg: true, emoji: "🍰" },
        { id: "i5", name: "Brun Maska", desc: "Hard-crust bun, soft inside", price: 49, veg: true, emoji: "🥖" },
        { id: "i6", name: "Keema Pav", desc: "Spiced mutton mince, soft pav", price: 159, veg: false, emoji: "🍖" },
      ]},
    ],
  },
  {
    id: "punjabi",
    name: "Punjab Da Dhaba",
    cuisines: ["North Indian", "Punjabi", "Tandoor"],
    rating: 4.4, eta: 38, priceForTwo: 450, grad: "linear-gradient(135deg,#f7971e,#ffd200)",
    emoji: "🍲", promo: "Free gulab jamun over ₹399",
    menu: [
      { cat: "Mains", items: [
        { id: "p1", name: "Dal Makhani", desc: "Slow-cooked overnight, butter, cream", price: 199, veg: true, bestseller: true, emoji: "🍲" },
        { id: "p2", name: "Butter Chicken", desc: "Tomato-makhani gravy, smoky", price: 289, veg: false, bestseller: true, emoji: "🍗" },
        { id: "p3", name: "Shahi Paneer", desc: "Rich cashew gravy", price: 229, veg: true, emoji: "🧀" },
      ]},
      { cat: "Breads & Rice", items: [
        { id: "p4", name: "Butter Naan (2)", desc: "Tandoor-fresh, brushed with butter", price: 79, veg: true, emoji: "🫓" },
        { id: "p5", name: "Jeera Rice", desc: "Basmati, cumin tempered", price: 129, veg: true, emoji: "🍚" },
        { id: "p6", name: "Lassi (Sweet)", desc: "Thick, malai-topped", price: 89, veg: true, emoji: "🥛" },
      ]},
    ],
  },
  {
    id: "sweet",
    name: "Sweet Tooth Mithai Co.",
    cuisines: ["Desserts", "Mithai", "Ice Cream"],
    rating: 4.7, eta: 26, priceForTwo: 180, grad: "linear-gradient(135deg,#ee9ca7,#ffdde1)",
    emoji: "🧁", promo: "Mithai box deals",
    menu: [
      { cat: "Hot Sweets", items: [
        { id: "s1", name: "Gulab Jamun (4 pc)", desc: "Warm, syrup-soaked, khoya", price: 99, veg: true, bestseller: true, emoji: "🍮" },
        { id: "s2", name: "Gajar Ka Halwa", desc: "Slow-cooked carrot, ghee, nuts", price: 129, veg: true, emoji: "🥕" },
        { id: "s3", name: "Jalebi (250g)", desc: "Crisp, hot, kesar syrup", price: 89, veg: true, emoji: "🟠" },
      ]},
      { cat: "Mithai", items: [
        { id: "s4", name: "Kaju Katli (250g)", desc: "Cashew, silver vark", price: 219, veg: true, bestseller: true, emoji: "💎" },
        { id: "s5", name: "Rasgulla (6 pc)", desc: "Spongy, light syrup", price: 119, veg: true, emoji: "⚪" },
        { id: "s6", name: "Kulfi Falooda", desc: "Malai kulfi, rose, vermicelli", price: 139, veg: true, emoji: "🍧" },
      ]},
    ],
  },
];
