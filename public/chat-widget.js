(function () {
  if (document.getElementById("chat-widget-root")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    .chat-launcher {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      background-color: #f59e0b;
      color: white;
      padding: 1rem;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      font-size: 1.25rem;
      transition: background 0.2s;
      cursor: pointer;
    }

    .chat-launcher:hover {
      background-color: #d97706;
    }

    .chat-window {
      position: fixed;
      z-index: 9998;
      background-color: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease-in-out;
    }

    .chat-window.shrunk {
      bottom: 6rem;
      right: 1.5rem;
      width: 20rem;
      height: 24rem;
      border-radius: 1rem;
    }

    .chat-window.expanded {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0;
    }

    .chat-header {
      padding: 1rem;
      background-color: #f3f4f6;
      border-bottom: 1px solid #e5e7eb;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .chat-body {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background-color: #fde68a;
      color: #374151;
      font-size: 0.875rem;
    }

    .chat-header button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.75rem;
    }

    .chat-header button:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  const launcher = document.createElement("button");
  launcher.innerText = "💬";
  launcher.className = "chat-launcher";
  document.body.appendChild(launcher);

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
    <div class="chat-body">
      <p>Hello! Ask me anything…</p>
    </div>
  `;
  document.body.appendChild(chat);

  let expanded = false;

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
})();
// This code creates a chat widget that can be launched from a button in the bottom right corner of the page.
// The widget can be expanded to fill the screen or shrunk to a smaller size.
// It includes a header with buttons to toggle size and close the chat, and a body area for messages.
// The widget is styled with Tailwind CSS classes for a modern look and feel.
// The chat widget is designed to be user-friendly and visually appealing, with smooth transitions and responsive design.
