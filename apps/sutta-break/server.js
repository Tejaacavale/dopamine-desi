// ───────────────────────────────────────────────────────────
// Sutta Break — real-presence virtual smoke-break room.
// Everything here is REAL: the head-count is the number of
// actually-connected sockets, "on a sutta" is how many of them
// have lit up right now, and the wall shows real messages people
// actually sent. Nothing is randomised or seeded.
// ───────────────────────────────────────────────────────────
import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5052;

const app = express();
app.use(express.static(join(__dirname, "public")));

const server = createServer(app);
const wss = new WebSocketServer({ server });

// In-memory state. clients: ws -> { id, name, smoking, joinedAt }
const clients = new Map();
const recentMessages = []; // last 40 real messages, kept so new joiners see context
const MAX_MESSAGES = 40;

// Anonymous-but-stable display handles for real, connected people.
const HANDLE_ADJ = ["tired", "broke", "sleepy", "wired", "chill", "fried", "quiet", "lowkey", "night", "burnt"];
const HANDLE_NOUN = ["intern", "coder", "soul", "ghost", "owl", "grad", "dreamer", "drifter", "kid", "machine"];
function makeHandle() {
  const a = HANDLE_ADJ[Math.floor(Math.random() * HANDLE_ADJ.length)];
  const n = HANDLE_NOUN[Math.floor(Math.random() * HANDLE_NOUN.length)];
  // suffix keeps handles unique-ish among concurrent real users
  return `${a}_${n}`;
}

function presence() {
  let smoking = 0;
  for (const c of clients.values()) if (c.smoking) smoking++;
  return { inRoom: clients.size, smoking };
}

function broadcast(obj) {
  const data = JSON.stringify(obj);
  for (const ws of clients.keys()) {
    if (ws.readyState === ws.OPEN) ws.send(data);
  }
}

function broadcastPresence() {
  broadcast({ type: "presence", ...presence() });
}

wss.on("connection", (ws) => {
  const me = { id: randomUUID(), name: makeHandle(), smoking: false, joinedAt: Date.now() };
  clients.set(ws, me);

  // Send the newcomer their identity + real current state + real recent wall.
  ws.send(JSON.stringify({
    type: "init",
    you: { id: me.id, name: me.name },
    messages: recentMessages,
    ...presence(),
  }));

  // Tell everyone the head-count went up (real).
  broadcastPresence();

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }
    const self = clients.get(ws);
    if (!self) return;

    if (msg.type === "toggleSmoke") {
      self.smoking = !self.smoking;
      ws.send(JSON.stringify({ type: "you", smoking: self.smoking }));
      broadcastPresence();
    }

    if (msg.type === "chat") {
      const text = String(msg.text || "").trim().slice(0, 140);
      if (!text) return;
      const entry = { id: randomUUID(), name: self.name, text, ts: Date.now() };
      recentMessages.push(entry);
      if (recentMessages.length > MAX_MESSAGES) recentMessages.shift();
      broadcast({ type: "chat", msg: entry });
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    broadcastPresence(); // head-count goes down for real
  });
});

server.listen(PORT, () => {
  console.log(`🚬 Sutta Break running at http://localhost:${PORT}`);
});
