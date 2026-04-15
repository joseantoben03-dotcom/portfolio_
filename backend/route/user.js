const express = require("express");
const router = express.Router();
const User = require("../model/user");

// POST /message — save contact form submission
router.post("/message", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const newMessage = new User({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully! I'll get back to you soon." });

  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
});

// GET /messages — retrieve all messages (for dashboard)
router.get("/messages", async (req, res) => {
  try {
    const messages = await User.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
