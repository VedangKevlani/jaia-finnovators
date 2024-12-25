import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { db } from "./firebaseconf.js"; // Ensure this is correctly initialized with your Firebase config

document.addEventListener("DOMContentLoaded", () => {
  const auth = getAuth(); // Initialize Firebase Authentication
  let isFirstMessage = true; // Flag to track if it's the first message in the new chat
  let userId = null;

  // Monitor authentication state
  onAuthStateChanged(auth, (user) => {
      if (user) {
          userId = user.uid;
          console.log("User is logged in:", user.email);
      } else {
          alert("User is not logged in.");
          window.location.href = "index.html"; // Redirect to login page
      }
  });


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

  function handleWhatIsQuestion(message, financialProfile) {
    const { income, savings, fixedExpenses, variableExpenses, unplannedExpenses } = financialProfile.walletData;

    if (/what is.*income/i.test(message)) {
        let response = `Your current income is $${income.toFixed(2)}. `;
        if (income < 1000) {
            response += `This seems a bit low. Consider exploring ways to increase your income, such as freelancing or picking up part-time work.`;
        } else if (income < 3000) {
            response += `You're earning a moderate income. Keep track of your expenses to ensure you're saving effectively.`;
        } else {
            response += `You're doing great with your income! Keep focusing on your financial goals.`;
        }
        return response;
    }

    if (/what is in my.*savings/i.test(message)) {
        let response = `Your current savings amount to $${savings.toFixed(2)}. `;
        if (savings < 500) {
            response += `It might be wise to save a bit more if possible. Maybe cut back on unnecessary spending this week.`;
        } else if (savings < 2000) {
            response += `You're on the right track! Consider setting a specific savings goal for added motivation.`;
        } else {
            response += `Fantastic job saving! Make sure you also invest some of this to grow your wealth.`;
        }
        return response;
    }

    if (/what are my total.*expenses/i.test(message)) {
        const totalExpenses = fixedExpenses + variableExpenses + unplannedExpenses;
        let response = `Your total expenses are $${totalExpenses.toFixed(2)}. `;

        if (totalExpenses > income) {
            response += `It looks like you're spending more than you earn. Consider reviewing your planned expenses and cutting back where possible.\n`;
            response += `Here are some tips to help you manage your expenses:\n`;
            response += `1. Audit your subscriptions and cancel any that you don’t use regularly.\n`;
            response += `2. Cook at home more often to reduce dining out costs.\n`;
            response += `3. Track your expenses using a budgeting app to identify unnecessary spending.\n`;
        } else if (totalExpenses > income * 0.8) {
            response += `You're spending a significant portion of your income. Look for areas to optimize, such as reducing subscription services or eating out less.\n`;
            response += `Here are some tips to optimize your expenses:\n`;
            response += `1. Compare utility and insurance providers to get better rates.\n`;
            response += `2. Limit impulse purchases by creating a shopping list before going out.\n`;
            response += `3. Plan your meals for the week and shop with a grocery list to avoid wasteful spending.\n`;
        } else {
            response += `Your expenses are well-managed. Keep it up!\n`;
            response += `Here are some tips to maintain your good habits:\n`;
            response += `1. Automate your savings to ensure you're consistently setting aside money.\n`;
            response += `2. Set up an emergency fund if you don’t already have one.\n`;
            response += `3. Review your financial goals quarterly to make sure you're on track.\n`;
        }

        return response;
    }

    if (/what are my.*fixed.*expenses/i.test(message)) {
        let response = `Your fixed expenses are $${fixedExpenses.toFixed(2)}. `;
        response += `Fixed expenses include costs like rent, insurance, or utilities that are consistent every month.\n`;
        response += `Here are some tips to manage fixed expenses:\n`;
        response += `1. Negotiate lower rates for recurring bills like internet or insurance.\n`;
        response += `2. Consider bundling services to save money.\n`;
        response += `3. Ensure you're not paying for unnecessary subscriptions.`;
        return response;
    }

    if (/what are my.*unplanned.*expenses/i.test(message)) {
        let response = `Your planned expenses are $${unplannedExpenses.toFixed(2)}. `;
        response += `Planned expenses are those you've budgeted for, such as vacations or large purchases.\n`;
        response += `Here are some tips to manage planned expenses:\n`;
        response += `1. Create a sinking fund to save for big-ticket items over time.\n`;
        response += `2. Prioritize planned expenses based on their importance and deadlines.\n`;
        response += `3. Stick to your planned budget to avoid overspending.`;
        return response;
    }

    if (/what are my.*variable.*expenses/i.test(message)) {
        let response = `Your variable expenses are $${variableExpenses.toFixed(2)}. `;
        response += `Variable expenses are costs that can change each month, like groceries, dining out, or entertainment.\n`;
        response += `Here are some tips to manage variable expenses:\n`;
        response += `1. Set spending limits for categories like dining out or entertainment.\n`;
        response += `2. Track these expenses weekly to stay on budget.\n`;
        response += `3. Look for discounts or coupons to reduce costs.`;
        return response;
    }

    if (/can I afford to buy (.+) that costs (\d+(\.\d+)?)/i.test(message)) {
        const match = message.match(/can I afford to buy (.+) that costs (\d+(\.\d+)?)/i);
        const item = match[1];
        const cost = parseFloat(match[2]);

        const totalExpenses = fixedExpenses + variableExpenses + unplannedExpenses;
        const availableFunds = income - totalExpenses + savings;

        if (cost <= availableFunds) {
            return `Yes, you can afford to buy "${item}" for $${cost.toFixed(2)}. You have $${availableFunds.toFixed(2)} available after expenses and savings. However, it is wise to revisit your financial goals to see if a ${item} is the best purchase right now.`;
        } else {
            return `No, you cannot afford to buy "${item}" for $${cost.toFixed(2)}. You only have $${availableFunds.toFixed(2)} available after expenses and savings. Consider saving a bit more first or reducing your expenses, especially your unplanned ones.`;
        }
    }


    return `I'm not sure how to answer that. Can you clarify your question?`;
}

  
  // Fetch financial profile from Firebase
  
  async function fetchFinancialProfile() {
    if (!userId) {
      console.error("User ID is not set. Ensure the user is logged in.");
      return null;
    }
  
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
  
      if (docSnap.exists()) {
        const financialProfile = docSnap.data();
        
        // Fetch walletData and goalData
        const walletRef = doc(db, "users", userId, "walletData", "financialData");
        const walletSnap = await getDoc(walletRef);
        financialProfile.walletData = walletSnap.exists()
          ? walletSnap.data()
          : { income: 0, fixedExpenses: 0, variableExpenses: 0, unplannedExpenses: 0, savings: 0 };
  
        const goalRef = collection(db, "users", userId, "goalData");
        const goalSnap = await getDocs(goalRef);
        financialProfile.goalData = [];
        goalSnap.forEach((goalDoc) => {
          financialProfile.goalData.push({ id: goalDoc.id, ...goalDoc.data() });
        });
  
        console.log("Financial profile fetched:", financialProfile);
        return financialProfile;
      } else {
        console.warn("No financial profile found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching financial profile:", error);
      return null;
    }
  }
  
  function handleGoalQuery(financialProfile) {
    const { goalData, walletData } = financialProfile;
    const { unplannedExpenses } = walletData;

    if (goalData.length === 0) {
        return `You currently have no financial goals set. Consider adding some goals to keep you motivated and focused on your finances.`;
    }

    let response = `You have ${goalData.length} financial goals. The goals are as follows:\n`;

    goalData.forEach((goal, index) => {
        const { description, cost, deadline } = goal;
        response += `\n${index + 1}. Goal: "${description}"\n`;
        response += `   - Cost: $${cost.toFixed(2)}\n`;
        response += `   - Deadline: ${new Date(deadline).toLocaleDateString()}\n`;
        response += `To achieve the goal "${description}" by ${new Date(deadline).toLocaleDateString()}, you need to save up $${cost.toFixed(2)}.\n`;

        if (unplannedExpenses > 0) {
            response += `It seems you have $${unplannedExpenses.toFixed(
                2
            )} in planned expenses. Consider reviewing these to see where you can cut back to focus on achieving your goal.\n`;
        }
    });

    response += `\nKeep tracking your goals and ensure you're making consistent progress.`;
    return response;
}

  
  // Handle new message logic
  async function handleNewMessage(message) {
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
  
    // Fetch the financial profile
    let financialProfile;
    try {
      financialProfile = await fetchFinancialProfile();
      if (!financialProfile) {
        throw new Error("Financial profile could not be fetched.");
      }
    } catch (error) {
      console.error("Error fetching financial profile:", error);
      displayBotResponse("Oops! Something went wrong fetching your financial profile.");
      return;
    }
  
    // Determine the case based on the user query
    let botResponse;
    if (/goal/i.test(message)) {
      botResponse = handleGoalQuery(financialProfile);
    } else if (/what is/i.test(message) || /what are/i.test(message) || (/can I afford to buy (.+) that costs (\d+(\.\d+)?)/i.test(message))) {
      botResponse = handleWhatIsQuestion(message, financialProfile);
    } else if (/show me my financial report/i.test(message)) {
      botResponse = handleFinancialReport(financialProfile);
    } else {
      botResponse = "I'm here to help with financial questions or goals. Could you clarify your request?";
    }
  
    // Display the response
    displayBotResponse(botResponse);
  
    // Clear input field
    inputBar.value = "";
    scrollToBottom();
  }
  

  // Query GPT with user message and financial profile
  async function queryGPT(userMessage, financialProfile) {
    const apiKey = "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"; // Replace with your Hugging Face API key
    const url = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
  
    // Prepare the input for the Hugging Face model
    let inputs = userMessage;
    if (financialProfile) {
      inputs += `\nUser Profile:\nIncome: ${financialProfile.walletData.income}, Expenses: ${
        financialProfile.walletData.fixedExpenses + financialProfile.walletData.variableExpenses
      }, Savings: ${financialProfile.walletData.savings}, Goals: ${
        financialProfile.goalData.length
      } goals.`;
    }
  
    const payload = {
      inputs,
    };
  
    // Log the request structure
    console.log("Sending request to Hugging Face:");
    console.log("URL:", url);
    console.log("Headers:", {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    });
    console.log("Payload:", JSON.stringify(payload, null, 2));
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      // Log the full response from Hugging Face
      console.log("Hugging Face Response:", JSON.stringify(data, null, 2));
  
      // Validate the response and extract the generated text
      if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
        return data[0].generated_text.trim();
      } else {
        console.error("Invalid Hugging Face response structure:", data);
        return "Sorry, I couldn't generate a response.";
      }
    } catch (error) {
      console.error("Error querying Hugging Face API:", error);
      return "There was an issue connecting to the chatbot. Please try again.";
    }
  }

  // Display user message in the chat
  function displayUserMessage(message, chatContainer) {
    const chatBubble = document.createElement("div");
    chatBubble.className = "chat-bubble";
    chatBubble.textContent = message;
    chatContainer.appendChild(chatBubble);
  }

  // Simulate and display bot response
  function displayBotResponse(response) {
    const chatContainer = document.querySelector(".chat-messages");
    console.log("Displaying Bot Response:", response);

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
        //handleNewMessage(message);
        console.log("Prefilled input sent to chat:", message);

        // Clear the input bar after sending
        //inputBar.value = "";
        console.log("Input bar cleared after sending prefilled input.");

        // Clear prefilled input from localStorage
        localStorage.removeItem("prefilledInput");
        console.log("Prefilled input cleared from localStorage");
    } else {
        console.warn("No message to send from prefilled input.");
    }
}

function handleFinancialReport(financialProfile) {
  const { walletData, goalData, name } = financialProfile;

  if (!walletData) {
    return "No wallet data available. Please ensure your financial information is up to date.";
  }

  // Extract wallet data with default values for safety
  const income = walletData.income || 0;
  const fixedExpenses = walletData.fixedExpenses || 0;
  const variableExpenses = walletData.variableExpenses || 0;
  const unplannedExpenses = walletData.unplannedExpenses || 0;
  const savings = walletData.savings || 0;

  // Start building the financial report
  let response = `Here's your financial report, ${name || "User"}:\n\n`;
  response += `--- Wallet Data ---\n`;
  response += `Income: $${income.toFixed(2)}\n`;
  response += `Fixed Expenses: $${fixedExpenses.toFixed(2)}\n`;
  response += `Variable Expenses: $${variableExpenses.toFixed(2)}\n`;
  response += `Unplanned Expenses: $${unplannedExpenses.toFixed(2)}\n`;
  response += `Savings: $${savings.toFixed(2)}\n`;

  // Handle goal data
  response += `\n--- Goal Data ---\n`;
  if (!goalData || goalData.length === 0) {
    response += `You currently have no financial goals set.\n`;
  } else {
    response += `You have ${goalData.length} financial goals:\n`;
    goalData.forEach((goal, index) => {
      const { description, cost, deadline } = goal;
      response += `\n${index + 1}. Goal: "${description}"\n`;
      response += `   - Cost: $${cost.toFixed(2)}\n`;
      response += `   - Deadline: ${
        deadline ? new Date(deadline.seconds * 1000).toLocaleDateString() : "N/A"
      }\n`;
    });
  }

  response += `\nKeep working towards your goals and managing your finances effectively!`;

  return response;
}



});
