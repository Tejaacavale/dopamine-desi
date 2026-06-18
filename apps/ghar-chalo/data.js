// Ghar Jaana Hai — curated "routes home" with plausible trains. Train names,
// numbers and timings are realistic-flavoured catalogue data for the simulation;
// this app never books a real ticket and takes no money.

window.ROUTES = [
  {
    id: "ndls-pnbe", fromCity: "New Delhi", from: "NDLS", toCity: "Patna", to: "PNBE", km: 1003,
    trains: [
      { no: "12394", name: "Sampoorna Kranti SF Exp", dep: "19:40", arr: "07:35", dur: "11h 55m", classes: ["SL", "3A", "2A"] },
      { no: "12302", name: "Howrah Rajdhani Exp", dep: "16:50", arr: "23:55", dur: "07h 05m", classes: ["3A", "2A", "1A"] },
      { no: "12566", name: "Bihar Sampark Kranti", dep: "20:25", arr: "09:10", dur: "12h 45m", classes: ["SL", "3A", "2A"] },
    ],
  },
  {
    id: "ltt-lko", fromCity: "Mumbai", from: "LTT", toCity: "Lucknow", to: "LKO", km: 1389,
    trains: [
      { no: "12533", name: "Pushpak Express", dep: "20:10", arr: "21:30", dur: "25h 20m", classes: ["SL", "3A", "2A"] },
      { no: "22537", name: "Kushinagar Express", dep: "13:50", arr: "16:05", dur: "26h 15m", classes: ["SL", "3A", "2A"] },
    ],
  },
  {
    id: "sbc-mas", fromCity: "Bengaluru", from: "SBC", toCity: "Chennai", to: "MAS", km: 362,
    trains: [
      { no: "12658", name: "Bengaluru Mail", dep: "22:40", arr: "04:30", dur: "05h 50m", classes: ["SL", "3A", "2A"] },
      { no: "12028", name: "Shatabdi Express", dep: "06:00", arr: "11:00", dur: "05h 00m", classes: ["CC", "EC"] },
    ],
  },
  {
    id: "pune-gkp", fromCity: "Pune", from: "PUNE", toCity: "Gorakhpur", to: "GKP", km: 1556,
    trains: [
      { no: "12511", name: "Gorakhpur Raptisagar SF", dep: "10:35", arr: "18:20", dur: "31h 45m", classes: ["SL", "3A", "2A"] },
      { no: "15018", name: "LTT Gorakhpur Express", dep: "15:10", arr: "01:55", dur: "34h 45m", classes: ["SL", "3A"] },
    ],
  },
  {
    id: "hyb-vskp", fromCity: "Hyderabad", from: "HYB", toCity: "Visakhapatnam", to: "VSKP", km: 700,
    trains: [
      { no: "17016", name: "Visakha Express", dep: "18:45", arr: "08:00", dur: "13h 15m", classes: ["SL", "3A", "2A"] },
      { no: "12728", name: "Godavari SF Express", dep: "17:15", arr: "05:30", dur: "12h 15m", classes: ["SL", "3A", "2A"] },
    ],
  },
  {
    id: "mas-tcr", fromCity: "Chennai", from: "MAS", toCity: "Thrissur", to: "TCR", km: 685,
    trains: [
      { no: "12624", name: "Trivandrum Mail", dep: "19:45", arr: "06:40", dur: "10h 55m", classes: ["SL", "3A", "2A"] },
      { no: "22639", name: "Alleppey Express", dep: "20:25", arr: "07:35", dur: "11h 10m", classes: ["SL", "3A", "2A"] },
    ],
  },
];

window.CLASS_NAMES = { SL: "Sleeper", "3A": "AC 3 Tier", "2A": "AC 2 Tier", "1A": "AC First", CC: "Chair Car", EC: "Exec Chair" };
window.COACHES = { SL: ["S4", "S6", "S7", "S9"], "3A": ["B2", "B3", "B1"], "2A": ["A1", "A2"], "1A": ["H1"], CC: ["C3", "C5"], EC: ["E1"] };
window.BERTHS = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "Window"];
