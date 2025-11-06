// server.js
import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: FRONTEND_ORIGIN, methods: ["GET", "POST", "PATCH", "DELETE"] }
});

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

// --- super tiny "auth" ---
const DEV_USER = { id: "u1", email: "demo@cloudcollab.dev", name: "Demo User" };
const DEV_TOKEN = "dev-token"; // your frontend will store this in localStorage

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== DEV_TOKEN) return res.status(401).json({ message: "Unauthorized" });
  req.user = DEV_USER;
  next();
}

// --- in-memory data model ---
const projects = [
  { id: "p1", name: "CloudCollab Core", description: "Main project board" },
  { id: "p2", name: "Website", description: "Marketing site & docs" }
];

// a simple 3-column board per project
const initialTickets = [
  { id: "t1", title: "Set up repo", status: "todo" },
  { id: "t2", title: "Build login page", status: "inprogress" },
  { id: "t3", title: "Drag & drop board", status: "done" }
];

// map: projectId -> tickets[]
const ticketsByProject = {
  p1: JSON.parse(JSON.stringify(initialTickets)),
  p2: JSON.parse(JSON.stringify(initialTickets))
};

// --- Socket.IO auth (optional) ---
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (token !== DEV_TOKEN) return next(new Error("Unauthorized socket"));
  return next();
});

io.on("connection", (socket) => {
  // you can join rooms by project for scoped updates:
  socket.on("joinProject", (projectId) => {
    socket.join(`project:${projectId}`);
  });

  socket.on("disconnect", () => {});
});

// --- routes ---
// Auth: simple demo login returns a fixed token
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  // accept anything for demo
  if (!email || !password) return res.status(400).json({ message: "Missing email or password" });
  return res.json({ token: DEV_TOKEN, user: DEV_USER });
});

// For signup; mirrors login for demo
app.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Missing email or password" });
  return res.json({ token: DEV_TOKEN, user: { ...DEV_USER, email, name: name || "New User" } });
});

// Current user
app.get("/auth/me", requireAuth, (req, res) => {
  res.json(req.user);
});

// List projects
app.get("/projects", requireAuth, (req, res) => {
  res.json(projects);
});

// Get a single project's tickets (grouped by status for convenience)
app.get("/projects/:id/tickets", requireAuth, (req, res) => {
  const { id } = req.params;
  const list = ticketsByProject[id] || [];
  res.json({
    todo: list.filter(t => t.status === "todo"),
    inprogress: list.filter(t => t.status === "inprogress"),
    done: list.filter(t => t.status === "done")
  });
});

// Reorder / move ticket between columns
// payload: { ticketId, sourceColumn, destColumn, destIndex }
app.patch("/projects/:id/tickets/reorder", requireAuth, (req, res) => {
  const { id } = req.params;
  const { ticketId, sourceColumn, destColumn, destIndex } = req.body || {};
  const list = ticketsByProject[id];
  if (!list) return res.status(404).json({ message: "Project not found" });

  const idx = list.findIndex(t => t.id === ticketId);
  if (idx === -1) return res.status(404).json({ message: "Ticket not found" });

  // remove from source
  const [ticket] = list.splice(idx, 1);
  // update status
  ticket.status = destColumn;

  // compute insertion index relative to destColumn subset
  // rebuild order by interleaving columns with desired position
  const before = list.filter(t => t.status !== destColumn);
  const destCol = list.filter(t => t.status === destColumn);

  const insertAt = Math.max(0, Math.min(destIndex ?? destCol.length, destCol.length));
  destCol.splice(insertAt, 0, ticket);

  // write back merged order: keep all non-dest tickets then the dest tickets together
  ticketsByProject[id] = [...before, ...destCol];

  // notify sockets in this project room
  io.to(`project:${id}`).emit("tickets:updated", { projectId: id });

  return res.json({ ok: true });
});

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
  console.log(`CORS allowed from ${FRONTEND_ORIGIN}`);
});
