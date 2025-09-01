import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;
const dataFile = path.join(process.cwd(), "messages.json");

// middleware
app.use(cors());
app.use(express.json());

// load messages
function loadMessages() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]"); // create empty file if missing
  }
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data || "[]");
}

// save messages
function saveMessages(messages) {
  fs.writeFileSync(dataFile, JSON.stringify(messages, null, 2));
}

// GET all messages
app.get("/messages", (req, res) => {
  res.json(loadMessages());
});

// POST a new message
app.post("/messages", (req, res) => {
  try {
    console.log("📩 Incoming body:", req.body); // debug

    const messages = loadMessages();

    const newMessage = {
      id: messages.length + 1,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      date: new Date().toISOString(),
    };

    messages.push(newMessage);
    saveMessages(messages);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error in POST /messages:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
