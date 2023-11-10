"use strict";

const botBtn = document.querySelector(".active");
const closeIcon = document.querySelector(".close");
const cancelIcon = document.querySelector(".bot-toggler span:last-child");
const botIcon = document.querySelector(".bot-toggler span:first-child");
const botToggler = document.querySelector(".bot-toggler");
const chatBot = document.querySelector(".chatbot");
const message = document.querySelector(".text");
const messageElement = document.querySelector(".chat-input textarea");
const sendMsg = document.querySelector(".send");
const chatbox = document.querySelector(".chatbox");

const inputInitHeight = messageElement.scrollHeight;

// Toggle functinality
function toggle() {
  if (chatBot.classList.contains("active")) {
    chatBot.classList.remove("active");
    cancelIcon.style.opacity = "1";
    botIcon.style.opacity = "0";
  } else {
    chatBot.classList.toggle("active");
    cancelIcon.style.opacity = "0";
    botIcon.style.opacity = "1";
  }
}

// Chat open and close
botToggler.addEventListener("click", toggle);
closeIcon.addEventListener("click", toggle);

// --------------------------------------------------------------------
// Handle chat
let userMessage;

function createChatLi(message, className) {
  const chatLi = document.createElement("li");

  chatLi.classList.add("chat", className);

  let chatContent =
    className === "outgoing"
      ? `<p class="chat-message">${message}</p>`
      : `<span class="material-symbols-outlined bot-icon"> smart_outlet </span><p class="chat-message">${message}</p>`;

  chatLi.innerHTML = chatContent;
  return chatLi;
}

function handleChat() {
  userMessage = message.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  const thinkingMessage = createChatLi("Thinking...", "incoming");
  chatbox.appendChild(thinkingMessage);

  fetch(`http://localhost:8080?message=${userMessage}`)
    .then((res) => res.json())
    .then((data) => {
      chatbox.removeChild(thinkingMessage);

      chatbox.appendChild(
        createChatLi(data.answer || "Sorry, I didn't understood!", "incoming")
      );
      chatbox.scrollTop = chatbox.scrollHeight;
    })
    .catch((err) => console.log(err));

  message.value = "";
}

sendMsg.addEventListener("click", handleChat);

messageElement.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

messageElement.addEventListener("input", () => {
  messageElement.style.height = `${messageElement.scrollHeight}px`;
});
