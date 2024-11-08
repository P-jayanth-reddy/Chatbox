// Select the elements on the page that we will interact with
const chatBody = document.querySelector(".body-info"); // The container where the chat messages will be displayed
const messageInput = document.querySelector(".message-input"); // The input field where the user types their message
const sendMessageButton = document.querySelector("#send-message"); // The button used to send the message

// API key and URL for the Generative Language API
const apiKey = "AIzaSyDQCM7KJehcFPyqBterRSCWlMJdHPqEdbc"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

// Function to create a message element in the DOM
const createMessageElement = (content, classes, icon, isBotMessage = false) => {
  const div = document.createElement("div"); // Create a new div for the message
  div.classList.add("message", ...classes.split(" ")); // Add CSS classes for styling the message
  div.innerHTML = `${isBotMessage ? `<svg class="chatbot-logo" xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 1024 1024"><path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path></svg>` : ""} 
    <div class="message-text">${content}</div>`; // If it's a bot message, include an icon (SVG), otherwise, just the text
  return div; // Return the message div element
};

// Function to generate a bot response using the external API
const generateBotResponse = async (message) => {
  try {
    // Make a POST request to the API with the message as input
    const response = await fetch(API_URL, {
      method: "POST", // HTTP method is POST
      headers: { "Content-Type": "application/json" }, // Setting content type to JSON
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }) // The request body with the user message
    });
    
    // Parse the API response as JSON and extract the bot's response
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't process your message."; // Return bot response or a default error message
  } catch {
    // If there's an error (e.g., API fails), return an error message
    return "Error processing your request.";
  }
};

// Event handler for sending an outgoing message
const handleOutgoingMessage = async (e) => {
  e.preventDefault(); // Prevent the form submission (if any)
  
  const message = messageInput.value.trim(); // Get the user's message and remove any leading/trailing spaces
  
  if (message) { // If the message is not empty
    // Append the user message to the chat window
    chatBody.appendChild(createMessageElement(message, "user-message", "✔️"));
    messageInput.value = ""; // Clear the message input field
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll the chat window to the bottom to show the new message

    // Show a "thinking" indicator while the bot generates a response
    const botMessage = createMessageElement("...Thinking...", "bot-message thinking", "🤖", true);
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll down to the latest bot message

    // Fetch the bot's response from the API
    const botResponse = await generateBotResponse(message);
    
    // Update the bot's message with the actual response and remove the "thinking" class
    botMessage.querySelector(".message-text").textContent = botResponse;
    botMessage.classList.remove("thinking");
    chatBody.scrollTop = chatBody.scrollHeight; // Ensure the chat scrolls to the bottom
  }
};

// Add event listener to send the message when the button is clicked
sendMessageButton.addEventListener("click", handleOutgoingMessage);

// Add event listener to send the message when the Enter key is pressed
messageInput.addEventListener("keydown", (e) => e.key === "Enter" && messageInput.value.trim() && handleOutgoingMessage(e));
