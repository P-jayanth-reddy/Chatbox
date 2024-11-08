const chatBody = document.querySelector(".body-info");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");

const apiKey = "AIzaSyDQCM7KJehcFPyqBterRSCWlMJdHPqEdbc"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const createMessageElement = (content, classes, icon, isBotMessage = false) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes.split(" "));
  div.innerHTML = `${isBotMessage ? `<svg class="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>` : ""} 
    <div class="message-text">${content}</div>`;
  return div;
};

const generateBotResponse = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process your message.";
  } catch {
    return "Error processing your request.";
  }
};

const handleOutgoingMessage = async (e) => {
  e.preventDefault();
  
  const message = messageInput.value.trim();
  
  if (message) {
    chatBody.appendChild(createMessageElement(message, "user-message", "✔️"));
    messageInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    const botMessage = createMessageElement("...Thinking...", "bot-message thinking", "🤖", true);
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;

    const botResponse = await generateBotResponse(message);
    
    botMessage.querySelector(".message-text").textContent = botResponse;
    botMessage.classList.remove("thinking");
    chatBody.scrollTop = chatBody.scrollHeight;
  }
};

sendMessageButton.addEventListener("click", handleOutgoingMessage);

messageInput.addEventListener("keydown", (e) => e.key === "Enter" && messageInput.value.trim() && handleOutgoingMessage(e));
