import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;
const dataFile = path.join(process.cwd(), "messages.json");

// Middleware
app.use(cors()); // allow requests from anywhere (you can restrict to your GitHub Pages later)
app.use(express.json());

// Helper: Load messages
function loadMessages() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]"); // create empty file if missing
  }
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data || "[]");
}

// Helper: Save messages
function saveMessages(messages) {
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2));
}

// GET all messages
app.get("/messages", (req, res) => {
  try {
    const messages = loadMessages();
    res.json(messages);
  } catch (err) {
    console.error("❌ Error in GET /messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new message
app.post("/messages", (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const messages = loadMessages();
    const newMessage = {
      id: messages.length + 1,
      name,
      email,
      message,
      date: new Date().toISOString(),
    };

    messages.push(newMessage);
    saveMessages(messages);

    console.log("📩 New message saved:", newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error in POST /messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: simple root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
