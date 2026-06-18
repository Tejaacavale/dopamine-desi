// Paper Paisa instruments. Prices are SIMULATED (a random walk) — this is a
// paper-trading toy, not a market feed. Base prices are roughly realistic so
// it *feels* right; nothing here is real money or a real quote.

window.INSTRUMENTS = [
  { sym: "RELIANCE", name: "Reliance Industries", kind: "stock", price: 1422.5, vol: 0.004, emoji: "🛢️" },
  { sym: "TCS", name: "Tata Consultancy Svc", kind: "stock", price: 3895.0, vol: 0.003, emoji: "💻" },
  { sym: "INFY", name: "Infosys", kind: "stock", price: 1564.2, vol: 0.004, emoji: "🖥️" },
  { sym: "HDFCBANK", name: "HDFC Bank", kind: "stock", price: 1681.0, vol: 0.003, emoji: "🏦" },
  { sym: "TATAMOTORS", name: "Tata Motors", kind: "stock", price: 982.4, vol: 0.006, emoji: "🚗" },
  { sym: "ZOMATO", name: "Eternal (Zomato)", kind: "stock", price: 268.7, vol: 0.008, emoji: "🍔" },
  { sym: "BTC", name: "Bitcoin", kind: "crypto", price: 9210000, vol: 0.010, emoji: "₿" },
  { sym: "ETH", name: "Ethereum", kind: "crypto", price: 312500, vol: 0.012, emoji: "Ξ" },
  { sym: "SOL", name: "Solana", kind: "crypto", price: 18450, vol: 0.018, emoji: "◎" },
  { sym: "DOGE", name: "Dogecoin", kind: "crypto", price: 32.4, vol: 0.025, emoji: "🐕" },
];
