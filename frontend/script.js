const API_BASE = "https://messages-portal.onrender.com";

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
// Create heart cursor element
const heartCursor = document.createElement('div');
heartCursor.style.position = 'absolute';
heartCursor.style.width = '20px';
heartCursor.style.height = '20px';
heartCursor.style.backgroundImage = "url('data:image/svg+xml,%3Csvg fill=\"%23FF3366\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"/%3E%3C/svg%3E')";
heartCursor.style.backgroundSize = 'cover';
heartCursor.style.pointerEvents = 'none';
heartCursor.style.zIndex = '9999';
document.body.appendChild(heartCursor);

// Move cursor
document.addEventListener('mousemove', e => {
  heartCursor.style.left = e.pageX - 10 + 'px';
  heartCursor.style.top = e.pageY - 10 + 'px';
});

// Heart explosion on click
document.addEventListener('click', e => {
  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.style.position = 'absolute';
    heart.style.width = '15px';
    heart.style.height = '15px';
    heart.style.backgroundImage = heartCursor.style.backgroundImage;
    heart.style.backgroundSize = 'cover';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.opacity = '1';
    heart.style.zIndex = '9999';
    document.body.appendChild(heart);

    const angle = Math.random() * 2 * Math.PI;
    const distance = 50 + Math.random() * 50;

    heart.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.5)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 500,
      easing: 'ease-out'
    });

    setTimeout(() => heart.remove(), 1500);
  }
});



// Load messages on page load
loadMessages();
