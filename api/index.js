const mongoose = require("mongoose");
const express  = require("express");
const cors     = require("cors");

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ── DB Connection (cached across warm invocations) ──────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = true;
}

// ── Message Model ────────────────────────────────────────────
const MessageSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Avoid model re-compilation on hot reload in serverless
const Message = mongoose.models.User || mongoose.model("User", MessageSchema);

// ── Routes ───────────────────────────────────────────────────

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// POST /message — save contact form submission
app.post("/message", async (req, res) => {
  try {
    await connectDB();

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully! I'll get back to you soon.",
    });
  } catch (err) {
    console.error("POST /message error:", err);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});

// GET /messages — retrieve all messages (dashboard)
app.get("/messages", async (req, res) => {
  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// DELETE /messages/:id — delete a message (dashboard)
app.delete("/messages/:id", async (req, res) => {
  try {
    await connectDB();
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("DELETE /messages/:id error:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Export for Vercel serverless ─────────────────────────────
module.exports = app;
