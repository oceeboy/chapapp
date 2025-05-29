(function () {
  if (document.getElementById("chat-widget-root")) return;

  // Detect theme
  const scriptTag = document.currentScript;
  const theme = scriptTag?.dataset?.theme || "light";
  const colors = {
    light: {
      bubbleBg: "#fde68a",
      text: "#374151",
      headerBg: "#f3f4f6",
    },
    dark: {
      bubbleBg: "#1f2937",
      text: "#f3f4f6",
      headerBg: "#111827",
    },
  }[theme];

  // Inject styles
  const style = document.createElement("style");
  style.innerHTML = `
    .chat-launcher {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      background-color: #f59e0b; color: white; padding: 1rem;
      border-radius: 9999px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      font-size: 1.25rem; transition: background 0.2s; cursor: pointer;
    }
    .chat-launcher:hover { background-color: #d97706; }

    .chat-window {
      position: fixed; z-index: 9998; display: flex;
      flex-direction: column; transition: all 0.3s ease-in-out;
      background-color: white; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .chat-window.shrunk {
      bottom: 6rem; right: 1.5rem; width: 20rem; height: 28rem;
      border-radius: 1rem;
    }
    .chat-window.expanded {
      top: 0; left: 0; right: 0; bottom: 0; border-radius: 0;
    }

    .chat-header {
      padding: 1rem; font-weight: bold; display: flex;
      justify-content: space-between; align-items: center;
      font-size: 0.875rem; background: ${colors.headerBg}; color: ${colors.text};
    }
    .chat-body {
      flex: 1; padding: 1rem; overflow-y: auto;
      background-color: ${colors.bubbleBg}; color: ${colors.text};
      font-size: 0.875rem;
    }
    .chat-input {
      display: flex; border-top: 1px solid #e5e7eb;
      background: white;
    }
    .chat-input input {
      flex: 1; padding: 0.75rem; border: none;
      font-size: 0.875rem; outline: none;
    }
    .chat-input button {
      background: #f59e0b; color: white;
      padding: 0 1rem; border: none; cursor: pointer;
    }
    .chat-input button:hover { background: #d97706; }

    .chat-header button {
      background: none; border: none; cursor: pointer; font-size: 0.75rem;
    }
    .chat-header button:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);

  // Launcher
  const launcher = document.createElement("button");
  launcher.innerText = "💬";
  launcher.className = "chat-launcher";
  document.body.appendChild(launcher);

  // Chat Window
  const chat = document.createElement("div");
  chat.className = "chat-window shrunk";
  chat.style.display = "none";
  chat.id = "chat-widget-root";
  chat.innerHTML = `
    <div class="chat-header">
      <span>Chatbot</span>
      <div>
        <button id="toggle-size">Expand ↗</button>
        <button id="close-chat" style="color: red;">✖</button>
      </div>
    </div>
    <div class="chat-body" id="chat-body">
      <p>Hello! Ask me anything…</p>
    </div>
    <div class="chat-input">
      <input type="text" placeholder="Type a message..." id="chat-input" />
      <button id="send-btn">Send</button>
    </div>
  `;
  document.body.appendChild(chat);

  let expanded = false;

  // Interactions
  launcher.addEventListener("click", () => {
    chat.style.display = "flex";
  });

  chat.querySelector("#toggle-size").addEventListener("click", () => {
    expanded = !expanded;
    chat.className = "chat-window " + (expanded ? "expanded" : "shrunk");
    chat.querySelector("#toggle-size").innerText = expanded
      ? "Shrink ↘"
      : "Expand ↗";
  });

  chat.querySelector("#close-chat").addEventListener("click", () => {
    chat.style.display = "none";
    expanded = false;
    chat.className = "chat-window shrunk";
    chat.querySelector("#toggle-size").innerText = "Expand ↗";
  });

  // Send
  const body = chat.querySelector("#chat-body");
  const input = chat.querySelector("#chat-input");
  const sendBtn = chat.querySelector("#send-btn");

  function appendMsg(text, sender = "user") {
    const msg = document.createElement("p");
    msg.textContent = text;
    msg.style.fontWeight = sender === "bot" ? "bold" : "normal";
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    appendMsg(text, "user");
    input.value = "";

    // 🧠 Optional: Send to backend
    fetch("https://your-backend.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    })
      .then((res) => res.json())
      .then((data) => {
        appendMsg(data.reply || "Bot is thinking…", "bot");
      })
      .catch(() => {
        appendMsg("Error reaching server.", "bot");
      });
  });
})();
