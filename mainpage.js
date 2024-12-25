document.addEventListener("DOMContentLoaded", () => {
  let isFirstMessage = true;

  // Event listener for enter key in input field
  document.querySelector(".input-bar").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector(".send-btn").click();
    }
  });

  document.querySelector(".send-btn").addEventListener("click", async () => {
    const inputBar = document.querySelector(".input-bar");
    const message = inputBar.value.trim();
  
    console.log("Message sent:", message);  // Add this for debugging
    
    if (message) {
      await handleNewMessage(message);  // Use 'await' for async call
    }
  });

  async function getBotResponse(message) {
    const response = await fetch('https://finnovators-bb552.cloudfunctions.net/askOpenAI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    console.log('Response Status:', response.status); // Log the response status
  
    if (!response.ok) {
      throw new Error('Failed to fetch from the server');
    }
  
    const data = await response.json();
    return data.response; // The chatbot's reply
  }
  
  function displayBotResponse(response, chatContainer) {
    // Check if the image already exists
    const existingBotImage = chatContainer.querySelector('.bot-response img');
    if (existingBotImage) {
      existingBotImage.remove(); // Remove the existing image to avoid duplicates
    }
  
    // Create the new bot message container
    const botContainer = document.createElement("div");
    botContainer.className = "bot-response";
  
    // Create the bot's image
    const botImage = document.createElement("img");
    botImage.src = "/assets/finny-get-started.png";
    botImage.alt = "Finny";
  
    // Create the response text container
    const responseText = document.createElement("div");
    responseText.className = "response-text";
    responseText.textContent = response;
  
    // Append the image and response text to the bot container
    botContainer.appendChild(botImage);
    botContainer.appendChild(responseText);
  
    // Append the bot container to the chat container
    chatContainer.appendChild(botContainer);
  }
   

// Function to handle new messages (user input)
async function handleNewMessage(message) {
  const chatContainer = document.querySelector(".chat-messages");

  // Display the user's input first
  displayUserMessage(message, chatContainer);

  // Then get the bot's response
  const botResponse = await getOpenAIResponse(message);
  displayBotResponse(botResponse, chatContainer);

  scrollToBottom();
  const inputBar = document.querySelector(".input-bar");
  inputBar.value = "";  // Clear the input field after sending
}

// Function to check if the message is financial-related
function isFinancialQuery(message) {
    const financialKeywords = ["afford", "buy", "purchase", "expenses", "budget", "expense", "income", "savings"];
    return financialKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

const getOpenAIResponse = async (message) => {
  try {
    const response = await fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),  // Include your message in the body
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from the server');
    }

    const data = await response.json();  // Parse the JSON response
    console.log(data);

    if (data && data.response) {
      displayBotResponse(data.response, chatContainer);  // Display the bot response
    } else {
      console.error('No response data found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  // Function to scroll the chat to the bottom
  function scrollToBottom() {
    const chatContainer = document.querySelector(".chat-messages");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Initial load of the first tab's chat (e.g., "General" tab)
  loadChatState("general"); // Pass the default tabId (like "general", "wallet", etc.)
});

function loadChatState(tabId) {
  const chatContainer = document.querySelector(".chat-messages");
  chatContainer.innerHTML = ""; // Clear current chat history

  // You can check for prefilled input here, but only if needed for specific behavior
  const prefilledInput = localStorage.getItem("prefilledInput");

  if (prefilledInput) {
    const inputBar = document.querySelector(".input-bar");
    inputBar.value = prefilledInput; // Set prefilled input if needed
    console.log("Prefilled input set in input bar:", inputBar.value);

    // Optionally, send the prefilled message automatically (remove if not needed)
    const message = inputBar.value.trim();
    if (message) {
      handleNewMessage(message); // Send the message
      inputBar.value = ""; // Clear input after sending
      localStorage.removeItem("prefilledInput"); // Remove from localStorage to avoid resending
      console.log("Prefilled input cleared from localStorage");
    }
  }
}

 // Display user message in the chat
 function displayUserMessage(message, chatContainer) {
  const chatBubble = document.createElement("div");
  chatBubble.className = "chat-bubble user";
  chatBubble.textContent = message;
  chatContainer.appendChild(chatBubble);
}

function displayUserMessage(message, chatContainer) {
  const chatBubble = document.createElement("div");
  chatBubble.className = "chat-bubble";
  chatBubble.textContent = message;
  chatContainer.appendChild(chatBubble);
}

 // Store chat message in localStorage
 function saveChatMessage(message, sender = 'user') {
  const currentChatId = localStorage.getItem("currentChatId");

  if (!currentChatId) {
      console.error("No current chat ID found.");
      return;
  }

  const chats = JSON.parse(localStorage.getItem("chats")) || {};

  if (!chats[currentChatId]) {
      chats[currentChatId] = [];
  }

  const existingMessages = chats[currentChatId];

  // Check if the message already exists based on text and sender
  const messageExists = existingMessages.some(msg => msg.text === message && msg.sender === sender);

  if (!messageExists) {
      chats[currentChatId].push({ text: message, sender: sender, timestamp: Date.now() });
      localStorage.setItem("chats", JSON.stringify(chats));
  }
}
  function generateUniqueChatId() {
    const timestamp = Date.now();
    return `Chat ${timestamp}`;
  }

  // Create a new chat
  function createNewChat() {
    const chatContainer = document.querySelector(".chat-messages");
    const introSection = document.querySelector(".intro");
  
    // Check if the current chat has any messages
    const hasMessages = chatContainer.textContent.trim() !== "";
  
    if (hasMessages) {
      chatContainer.innerHTML = "";
      introSection.style.display = "flex";
      introSection.style.opacity = 1;
  
      const chats = JSON.parse(localStorage.getItem("chats")) || {};
  
      // Generate a unique chat ID
      const newChatId = generateUniqueChatId();
      localStorage.setItem("currentChatId", newChatId);
  
      // Initialize the new chat in localStorage
      chats[newChatId] = [];
      localStorage.setItem("chats", JSON.stringify(chats));
  
      // Reset first message flag for the new chat
      isFirstMessage = true;
  
      // Add the new chat to recent chats
      addChatToRecent(newChatId);
  
      console.log(`Added new chat: ${newChatId}`);
    } else {
      console.warn("Cannot create a new chat if the current one is blank.");
    }
  }
  
  document.querySelector(".new-chat-btn").addEventListener("click", createNewChat);

  function addMessage(sender, text) {
    const chatMessages = document.querySelector(".chat-messages");
    const chatBubble = document.createElement("div");
    chatBubble.className = `chat-bubble ${sender}`;  // Ensure sender is either 'user' or 'bot'
    chatBubble.textContent = text;
    chatMessages.appendChild(chatBubble);
  
    toggleChatBackground();  // Update background state if needed
    scrollToBottom();  // Ensure the chat scrolls to the bottom after each new message
  }
  

  function clearMessages() {
    const chatMessages = document.querySelector(".chat-messages");
    chatMessages.innerHTML = "";  // Clear all messages
  
    // Reset the current chat state in localStorage
    const currentChatId = localStorage.getItem("currentChatId");
    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    if (currentChatId && chats[currentChatId]) {
      chats[currentChatId] = [];  // Clear chat history for the current chat
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  
    toggleChatBackground();  // Update background state if needed
  }
  

 // Function to add chat to recent chats
 function addChatToRecent(chatId) {
  const recentChatsContainer = document.getElementById("recent-chats-container");

  // Ensure no duplicate chatId in the container
  if (!recentChatsContainer.querySelector(`[data-chat-id="${chatId}"]`)) {
      const recentChat = document.createElement("div");
      recentChat.className = "folder recent-chat";
      recentChat.dataset.chatId = chatId;

      const chatName = document.createElement("span");
      chatName.textContent = chatId;
      recentChat.appendChild(chatName);

      const dotsImage = document.createElement("img");
      dotsImage.src = "/assets/three-dots.png";
      dotsImage.alt = "Options";
      dotsImage.className = "chat-dots";

      dotsImage.addEventListener("click", (e) => {
          e.stopPropagation();  // Prevent the click event from triggering the chat load
          toggleOptionsMenu(recentChat, chatId);
      });

      recentChat.appendChild(dotsImage);

      recentChat.addEventListener("click", () => loadChat(chatId));  // Load the chat when clicked
      recentChatsContainer.appendChild(recentChat);
  }
}

  function loadChat(chatId) {
    const chatMessages = document.querySelector(".chat-messages");
    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    
    if (!chats[chatId]) {
      console.error("No chat history found for this chat ID.");
      return;
    }
  
    const messages = chats[chatId];
    chatMessages.innerHTML = "";  // Clear current chat
  
    // Iterate over messages and display them based on sender
    messages.forEach((msg) => {
      if (msg.sender === 'user') {
        addMessage('user', msg.text);
      } else if (msg.sender === 'bot') {
        addMessage('bot', msg.text);
      }
    });
  
    scrollToBottom();  // Scroll to the bottom after loading the chat
  }

  function toggleOptionsMenu(recentChat, chatId) {
    const existingMenu = document.querySelector(".chat-options-list.active");
    if (existingMenu) {
      existingMenu.classList.remove("active");  // Close the active menu
    }
    
    const currentMenu = recentChat.querySelector(".chat-options-list");
    if (!currentMenu || !currentMenu.classList.contains("active")) {
      createOptionsMenu(recentChat, chatId); // Create and show the new menu
    }
  }
  
  
  function createOptionsMenu(recentChat, chatId) {
    const optionsList = document.createElement("div");
    optionsList.className = "chat-options-list active";
  
    // Calculate position based on the dots button
    const rect = recentChat.getBoundingClientRect();
    const sidebar = document.querySelector(".sidebar");
    const sidebarRect = sidebar.getBoundingClientRect();
  
    // Position the menu outside of the sidebar, vertically aligned
    optionsList.style.top = `${rect.top + window.scrollY}px`; // Account for page scroll
    optionsList.style.left = `${sidebarRect.right + 10}px`; // Place 10px to the right of the sidebar
  
    const renameOption = document.createElement("div");
    renameOption.className = "chat-options-item rename";
    renameOption.innerHTML = '<i class="fas fa-pencil-alt"></i> Rename';
    renameOption.addEventListener("click", () => {
      const chatNameElement = recentChat.querySelector("span");
      renameChat(chatId, chatNameElement);
      document.body.removeChild(optionsList); // Remove the menu after selection
    });
  
    const deleteOption = document.createElement("div");
    deleteOption.className = "chat-options-item delete";
    deleteOption.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
    deleteOption.addEventListener("click", () => {
      deleteChat(chatId, recentChat);
      document.body.removeChild(optionsList); // Remove the menu after deletion
    });
  
    optionsList.appendChild(renameOption);
    optionsList.appendChild(deleteOption);
  
    // Close the menu when clicking outside
    document.addEventListener(
      "click",
      (event) => {
        if (!optionsList.contains(event.target) && !recentChat.contains(event.target)) {
          document.body.removeChild(optionsList); // Remove the menu
        }
      },
      { once: true }
    );
  
    document.body.appendChild(optionsList); // Append to the body for global positioning
  }
  

  function renameChat(chatId, chatNameElement) {
    const newName = prompt("Enter a new name for the chat:", chatNameElement.textContent);
    if (newName) {
      chatNameElement.textContent = newName;
      // Update chat name in localStorage or server if needed
      const chats = JSON.parse(localStorage.getItem("chats")) || {};
      if (chats[chatId]) {
        chats[chatId].name = newName;
        localStorage.setItem("chats", JSON.stringify(chats));
      }
    }
  }
  
  function deleteChat(chatId, recentChat) {
    if (confirm(`Are you sure you want to delete the chat: ${chatId}?`)) {
      // Remove chat from localStorage
      const chats = JSON.parse(localStorage.getItem("chats")) || {};
      delete chats[chatId];
      localStorage.setItem("chats", JSON.stringify(chats));
  
      // Remove chat from the recent chats section
      recentChat.remove();
    }
  }
  
  // Update chat name in localStorage
  function updateChatNameInLocalStorage(chatId, newName) {
    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    if (chats[chatId]) {
      chats[chatId].name = newName;
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }

  // Sidebar toggle functionality
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebarShow = document.querySelector(".sidebar-show");

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    sidebarShow.classList.remove("hidden");
    sidebarShow.classList.add("visible");
  });

  sidebarShow.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    sidebarShow.classList.add("hidden");
    sidebarShow.classList.remove("visible");
  });

 // Clear chat display and reset input on page refresh
const chatContainer = document.querySelector(".chat-messages");
chatContainer.innerHTML = ""; // Clear visible messages

const introSection = document.querySelector(".intro");
introSection.style.display = "flex"; // Show intro section initially
introSection.style.opacity = 1;

// Check for prefilled input on page load, and set it if necessary
const prefilledInput = localStorage.getItem("prefilledInput");

if (prefilledInput) {
  const inputBar = document.querySelector(".input-bar");
  inputBar.value = prefilledInput.trim(); // Set prefilled input if necessary
  console.log("Prefilled input set in input bar:", inputBar.value);

  // Clear prefilled input from localStorage after setting
  localStorage.removeItem("prefilledInput");
  console.log("Prefilled input cleared from localStorage");

  // Send prefilled message if necessary
  const message = inputBar.value.trim();
  if (message) {
    handleNewMessage(message); // Send the message
    inputBar.value = ""; // Clear input after sending
  }
} else {
  // If no prefilled input, ensure input is empty
  const inputBar = document.querySelector(".input-bar");
  inputBar.value = ""; // Ensure no prefilled input
}

// Add event listener for input bar to trigger intro section clearing
const inputBar = document.querySelector(".input-bar");
inputBar.addEventListener("input", () => {
  if (introSection.style.display !== "none" && inputBar.value.trim() !== "") {
    // Hide the intro section when user starts typing
    introSection.style.display = "none";
    introSection.style.opacity = 0; // Optionally fade out the intro section
  }
});