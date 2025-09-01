const form = document.getElementById("messageForm");
const responseMessage = document.getElementById("responseMessage");
const messagesList = document.getElementById("messagesList");

// Render messages
function renderMessages(messages) {
  messagesList.innerHTML = "";
  // newest first
  messages.slice().reverse().forEach(msg => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${msg.name}</strong> (${msg.email})<br>
      💬 ${msg.message}<br>
      <small>🕒 ${new Date(msg.date).toLocaleString()}</small>
    `;
    li.classList.add("message-item");
    messagesList.appendChild(li);
  });
}

// Fetch messages
async function loadMessages() {
  try {
    //const res = await fetch("http://localhost:5001/messages");
    const API_BASE = "https://messages-portal.onrender.com";
    const res = await fetch(`${API_BASE}/messages`);
    const data = await res.json();
    renderMessages(data);
  } catch (err) {
    console.error("❌ Error loading messages:", err);
  }
}

// Handle form submit
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    responseMessage.textContent = "⚠️ Please fill out all fields.";
    responseMessage.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
  });

    if (!res.ok) throw new Error("Failed to submit");

    responseMessage.textContent = "✅ Message submitted successfully!";
    responseMessage.style.color = "green";
    form.reset();

    loadMessages(); // refresh list
  } catch (err) {
    console.error("❌ Error submitting message:", err);
    responseMessage.textContent = "❌ Error submitting message.";
    responseMessage.style.color = "red";
  }
});

// Load messages on page load
loadMessages();
