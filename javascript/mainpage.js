document.addEventListener("DOMContentLoaded", () => {


  let isFirstMessage = true; // Flag to track if it's the first message in the new chat


  document.querySelector(".input-bar").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior of Enter key
      document.querySelector(".send-btn").click(); // Trigger send button click
    }
  });
  
  // Event listener for sending messages
  document.querySelector(".send-btn").addEventListener("click", () => {
    const inputBar = document.querySelector(".input-bar");
    const message = inputBar.value.trim();

    if (message) {
      handleNewMessage(message);
    }
  });

  function handleNewMessage(message) {
    const introSection = document.querySelector(".intro");
    const chatContainer = document.querySelector(".chat-messages");
    const inputBar = document.querySelector(".input-bar");
  
    // Hide intro section if necessary
    if (introSection && introSection.style.display !== "none") {
      introSection.style.opacity = 0;
      setTimeout(() => (introSection.style.display = "none"), 300);
    }
  
    // Display user message
    displayUserMessage(message, chatContainer);
  
    // Store chat message locally
    saveChatMessage(message);
  
    // Simulate bot response (show a loading message temporarily)
    setTimeout(() => {
      displayBotResponse("One moment please...");
      scrollToBottom();
    }, 1000);
  
    // Check if the message contains relevant keywords to fetch wallet data
    setTimeout(() => {
      const walletData = JSON.parse(localStorage.getItem("walletData")) || {};
      let responseMessage = "";
  
      // Check if the message contains a request to update the wallet
      if (message.toLowerCase().includes("change") || message.toLowerCase().includes("add") || message.toLowerCase().includes("update") || message.toLowerCase().includes("set")) {
        // Match and capture category and value using regular expressions
        const updateMatch = message.match(/(income|balance|fixed expenses|variable expenses|unplanned expenses)\s*(to|set)\s*\$?(\d+(\.\d{1,2})?)/i);
  
        if (updateMatch) {
          const category = updateMatch[1].toLowerCase().replace(" ", "");
          const newValue = parseFloat(updateMatch[3]);
  
          // Update the wallet data
          if (category && walletData.hasOwnProperty(category)) {
            walletData[category] = newValue;
  
            // Recalculate the wallet balance based on income and expenses
            walletData.balance = calculateWalletBalance(walletData);
  
            // Store the updated wallet data in localStorage
            localStorage.setItem("walletData", JSON.stringify(walletData));
  
            // Prepare the response confirming the update
            responseMessage = `Your ${category.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated to $${newValue.toFixed(2)}.`;
          } else {
            responseMessage = "Sorry, I couldn't understand which category to update.";
          }
        } else {
          responseMessage = "I couldn't understand your request to update the wallet. Please specify which category and the new value.";
        }
      }
  
      // If no update is requested, respond with the appropriate value
      if (!responseMessage) {
        if (message.includes("income")) {
          responseMessage = `Your income is $${walletData.income.toFixed(2)}.`;
        } else if (message.includes("balance")) {
          responseMessage = `Your balance is $${walletData.balance.toFixed(2)}.`;
        } else if (message.includes("fixed expenses")) {
          responseMessage = `Your fixed expenses are $${walletData.fixedExpenses.toFixed(2)}.`;
        } else if (message.includes("variable expenses")) {
          responseMessage = `Your variable expenses are $${walletData.variableExpenses.toFixed(2)}.`;
        } else if (message.includes("unplanned expenses")) {
          responseMessage = `Your unplanned expenses are $${walletData.unplannedExpenses.toFixed(2)}.`;
        } else {
          responseMessage = "Sorry, I couldn't understand your request.";
        }
      }
  
      // Display the bot response
      displayBotResponse(responseMessage);
      scrollToBottom();
    }, 1500);  // Delay for simulating response
    
    // Add to Recent Chats on first message
    if (isFirstMessage) {
      const currentChatId = localStorage.getItem("currentChatId");
      addChatToRecent(currentChatId);
      isFirstMessage = false; // Set flag to false after first message
    }
  
    // Clear input field
    inputBar.value = "";
    scrollToBottom();
  }

  // Function to recalculate the wallet balance
function calculateWalletBalance(walletData) {
  // Balance is calculated as: income - (fixedExpenses + variableExpenses + unplannedExpenses)
  return walletData.income - (walletData.fixedExpenses + walletData.variableExpenses + walletData.unplannedExpenses);
}

  // Display user message in the chat
  function displayUserMessage(message, chatContainer) {
    const chatBubble = document.createElement("div");
    chatBubble.className = "chat-bubble";
    chatBubble.textContent = message;
    chatContainer.appendChild(chatBubble);
  }

// Function to display wallet data
function displayWalletData() {
  const walletData = JSON.parse(localStorage.getItem("walletData")) || {
    income: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    unplannedExpenses: 0,
    balance: 0
  };

  // Update the displayed wallet data
  document.querySelector(".wallet-income").textContent = `$${walletData.income.toFixed(2)}`;
  document.querySelector(".wallet-fixed-expenses").textContent = `$${walletData.fixedExpenses.toFixed(2)}`;
  document.querySelector(".wallet-variable-expenses").textContent = `$${walletData.variableExpenses.toFixed(2)}`;
  document.querySelector(".wallet-unplanned-expenses").textContent = `$${walletData.unplannedExpenses.toFixed(2)}`;
  document.querySelector(".wallet-balance").textContent = `$${walletData.balance.toFixed(2)}`;
}

// Update wallet data in localStorage when the user modifies the income (or other categories)
function updateWalletData(category, amount) {
  const walletData = JSON.parse(localStorage.getItem("walletData")) || {
    income: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    unplannedExpenses: 0
  };

  // Update the specified category
  walletData[category] = parseFloat(amount);

  // Store the updated data back in localStorage
  localStorage.setItem("walletData", JSON.stringify(walletData));
}


// Call this function on page load or when needed
window.addEventListener("DOMContentLoaded", () => {
  displayWalletData();
});


// Display bot response in the chat
function displayBotResponse(response) {
  const chatContainer = document.querySelector(".chat-messages");

  const botContainer = document.createElement("div");
  botContainer.className = "bot-response";

  const botImage = document.createElement("img");
  botImage.src = "/assets/finny-get-started.png";
  botImage.alt = "Finny";

  const responseText = document.createElement("div");
  responseText.className = "response-text";
  responseText.textContent = response;

  botContainer.appendChild(botImage);
  botContainer.appendChild(responseText);
  chatContainer.appendChild(botContainer);

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

  // Save chat messages to localStorage
  function saveChatMessage(message) {
    const currentChatId = localStorage.getItem("currentChatId");
    const chats = JSON.parse(localStorage.getItem("chats")) || {};

    if (!chats[currentChatId]) {
      chats[currentChatId] = [];
    }
    chats[currentChatId].push({ text: message, timestamp: Date.now() });
    localStorage.setItem("chats", JSON.stringify(chats));
  }


// Store the wallet data in localStorage (for testing purposes)
const walletData = {
  balance: 76530.25,
  income: 5000.00,
  fixedExpenses: 1200.00,
  variableExpenses: 800.00,
  unplannedExpenses: 300.00
};
localStorage.setItem("walletData", JSON.stringify(walletData));

function updateWalletData(category, newValue) {
  const walletData = JSON.parse(localStorage.getItem("walletData")) || {
    income: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    unplannedExpenses: 0
  };

  // Update the category value in walletData
  walletData[category] = newValue;

  // Recalculate the wallet balance
  walletData.balance = calculateWalletBalance(walletData);

  // Save the updated walletData back to localStorage
  localStorage.setItem("walletData", JSON.stringify(walletData));
  
  // Optionally, you can return the updated walletData if needed
  return walletData;
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

  // Load a specific chat's messages
  function loadChat(chatId) {
    const chatContainer = document.querySelector(".chat-messages");
    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    const messages = chats[chatId] || [];

    chatContainer.innerHTML = ""; // Clear existing messages
    const introSection = document.querySelector(".intro");

    if (messages.length === 0) {
      introSection.style.display = "flex";
      introSection.style.opacity = 1;
    } else {
      introSection.style.display = "none";
    }

    messages.forEach((msg) => {
      const chatBubble = document.createElement("div");
      chatBubble.className = "chat-bubble";
      chatBubble.textContent = msg.text;
      chatContainer.appendChild(chatBubble);
    });

    localStorage.setItem("currentChatId", chatId);
  }

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
        e.stopPropagation();
        toggleOptionsMenu(recentChat, chatId);
      });
  
      recentChat.appendChild(dotsImage);
  
      recentChat.addEventListener("click", () => loadChat(chatId));
      recentChatsContainer.appendChild(recentChat);
  
      console.log("Added chat to recent chats:", chatId);
    } else {
      console.warn(`Chat ${chatId} already exists in recent chats.`);
    }
  }
  
  
  

  // Toggle options menu visibility
  function toggleOptionsMenu(recentChat, chatId) {
    const existingMenu = recentChat.querySelector(".chat-options-list");
    if (existingMenu) {
      existingMenu.classList.toggle("active");
    } else {
      createOptionsMenu(recentChat, chatId);
    }
  }

  // Create options menu dynamically
  function createOptionsMenu(recentChat, chatId) {
    const optionsList = document.createElement("div");
    optionsList.className = "chat-options-list active";

    // Calculate position based on the dots button
    const rect = recentChat.getBoundingClientRect();
    const sidebar = document.querySelector(".sidebar");
    const sidebarRect = sidebar.getBoundingClientRect();

    // Position the menu outside of the sidebar, vertically aligned
    optionsList.style.top = `${rect.top}px`; // Align with the top of the dots button
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

  // Rename chat
  function renameChat(chatId, chatNameElement) {
    const newName = prompt("Enter a new name for this chat:");
    if (newName) {
      chatNameElement.textContent = newName;
      updateChatNameInLocalStorage(chatId, newName);
    }
  }


// Delete chat
function deleteChat(chatId, chatElement) {
  const confirmDelete = confirm("Are you sure you want to delete this chat?");
  if (confirmDelete) {
    const chats = JSON.parse(localStorage.getItem("chats")) || {};
    const currentChatId = localStorage.getItem("currentChatId");

    // Remove the chat from localStorage
    delete chats[chatId];
    localStorage.setItem("chats", JSON.stringify(chats));

    // If the deleted chat is the current chat
    if (currentChatId === chatId) {
      const chatContainer = document.querySelector(".chat-messages");
      const introSection = document.querySelector(".intro");

      // Clear chat container and display intro section
      chatContainer.innerHTML = "";
      introSection.style.display = "flex";
      introSection.style.opacity = 1;

      // Generate a new chat ID
      const newChatId = `Chat ${Date.now()}`;
      chats[newChatId] = []; // Add new chat to chats
      localStorage.setItem("chats", JSON.stringify(chats));
      localStorage.setItem("currentChatId", newChatId); // Set the new chat as current

      // Add the new chat to the Recent Chats
      addChatToRecent(newChatId);
    }

    // Remove the chat button from the sidebar
    chatElement.remove();
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

  // Clear chat display on page refresh
  const chatContainer = document.querySelector(".chat-messages");
  chatContainer.innerHTML = ""; // Clear visible messages
  const introSection = document.querySelector(".intro");
  introSection.style.display = "flex"; // Show intro section
  introSection.style.opacity = 1;

  // Scroll chat container to the bottom
  function scrollToBottom() {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
// Check for prefilled input in localStorage
const prefilledInput = localStorage.getItem("prefilledInput");

if (prefilledInput) {
    const inputBar = document.querySelector(".input-bar");
    inputBar.value = prefilledInput;
    console.log("Prefilled input set in input bar:", inputBar.value);

    // Simulate a send button click programmatically
    const message = inputBar.value.trim();
    if (message) {
        // Call handleNewMessage directly to send the message
        handleNewMessage(message);
        console.log("Prefilled input sent to chat:", message);

        // Clear the input bar after sending
        inputBar.value = "";
        console.log("Input bar cleared after sending prefilled input.");

        // Clear prefilled input from localStorage
        localStorage.removeItem("prefilledInput");
        console.log("Prefilled input cleared from localStorage");
    } else {
        console.warn("No message to send from prefilled input.");
    }
}


});