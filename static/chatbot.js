// chatbot.js
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", () => {
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotWindow = document.getElementById("chatbot-window");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotSend = document.getElementById("chatbot-send");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  if (!chatbotIcon || !chatbotWindow) return;

  // --- Gemini Setup ---
  const API_KEY = "YOUR_GEMINI_API_KEY_HERE";  // ⬅️ Replace with your real key
  const MODEL_NAME = "gemini-2.0-flash";

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // --- Toggle chatbot window ---
  chatbotIcon.addEventListener("click", () => {
    chatbotWindow.classList.toggle("open");
  });

  // Close button
  chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.remove("open");
  });

  // --- Send Message ---
  async function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    // user message
    const userMsg = document.createElement("div");
    userMsg.textContent = "You: " + text;
    userMsg.style.fontWeight = "bold";
    userMsg.style.marginBottom = "5px";
    chatbotMessages.appendChild(userMsg);

    // placeholder bot message
    const botMsg = document.createElement("div");
    botMsg.textContent = "Bot: …";
    botMsg.style.marginBottom = "10px";
    chatbotMessages.appendChild(botMsg);

    chatbotInput.value = "";
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    try {
      // Gemini API call
      const result = await model.generateContent(text);
      const response = result.response.text();

      botMsg.textContent = "Bot: " + response;
    } catch (err) {
      console.error("Gemini error:", err);
      botMsg.textContent = "Bot: ⚠️ Error connecting to Gemini";
    }
  }

  // event listeners
  chatbotSend.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
