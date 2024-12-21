document.addEventListener("DOMContentLoaded", function () {
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');
  const chatContainer = document.getElementById('chat-container');
  const recentChatsContainer = document.getElementById("recent-chats-container");
  const introSection = document.getElementById('intro');
  const searchBar = document.getElementById("search-bar");
  const newChatBtn = document.getElementById('new-chat-btn'); // New Chat button

  // Initialize recentChats from localStorage or an empty array
  let recentChats = JSON.parse(localStorage.getItem('recentChats')) || [];
  let currentChat = null; // Holds the current chat object

  // Function to render the recent chats
  function renderChats(filteredChats = recentChats) {
    recentChatsContainer.innerHTML = ''; // Clear previous chat items

    filteredChats.forEach(chat => {
      const chatItem = document.createElement("div");
      chatItem.classList.add("chat-item");
      chatItem.textContent = chat.name;

      // Add click event to switch to the selected chat
      chatItem.addEventListener("click", function () {
        switchChat(chat.id); // Switch to the selected chat
      });

      // Add delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "X";
      deleteBtn.classList.add("delete-btn");

      // Delete button click event
      deleteBtn.addEventListener("click", function () {
        deleteChat(chat.id); // Call delete function with chat id
      });

      // Append delete button to the chat item
      chatItem.appendChild(deleteBtn);

      recentChatsContainer.appendChild(chatItem);
    });
  }

  // Function to delete a chat by its id
  function deleteChat(chatId) {
    recentChats = recentChats.filter(chat => chat.id !== chatId);
    localStorage.setItem('recentChats', JSON.stringify(recentChats)); // Save updated chats to localStorage
    renderChats(); // Re-render after deletion

    // If the deleted chat was the current chat, reset currentChat to null
    if (currentChat && currentChat.id === chatId) {
      currentChat = null;
      chatContainer.innerHTML = ''; // Clear the chat container
    }
  }

  // Function to extract a meaningful name from the first message
  function getChatTitle(message) {
    // You can add your logic here to generate a title from the message
    // For example, based on keywords in the message:
    const keywords = ['income', 'budget', 'savings', 'investment', 'account', 'debt', 'expenses', 'expense', 'credit'];
    for (let keyword of keywords) {
      if (message.toLowerCase().includes(keyword)) {
        return `Chat about ${keyword}`;
      }
    }
    return 'General Chat'; // Default name if no keyword matches
  }

  // Function to create a new chat for the first message
  function createNewChat(message) {
    // Generate chat name from the first message
    const chatName = getChatTitle(message);

    // Create a new chat object with the first message
    const newChat = {
      id: Date.now(), // Use a timestamp as unique ID
      name: chatName, // Set the chat name based on the message
      messages: [{ message, sender: 'user' }] // Store the first message
    };
    recentChats.push(newChat); // Add the new chat to the array
    localStorage.setItem('recentChats', JSON.stringify(recentChats)); // Save chats to localStorage
    currentChat = newChat; // Set the current chat to the new one
    renderChats(); // Re-render chats with the new one

    // Clear the chat container (since we're starting a new chat)
    chatContainer.innerHTML = '';
  }

  // Send button click event (User message)
  sendBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const userMessage = promptInput.value.trim();
    if (userMessage) {
      // If a current chat exists, add the message to the current chat
      if (currentChat) {
        currentChat.messages.push({ message: userMessage, sender: 'user' });
        localStorage.setItem('recentChats', JSON.stringify(recentChats)); // Save updated chat
      } else {
        // If no current chat, create a new one
        createNewChat(userMessage);
      }

      // Send the user message to the chat container
      sendMessage(userMessage, true); // User message
      promptInput.value = ''; // Clear input

      // Simulate AI bot response after 2 seconds
      setTimeout(function () {
        const aiMessage = 'This is a simulated AI response!';
        sendMessage(aiMessage, false); // AI message

        // Add AI response to the current chat
        if (currentChat) {
          currentChat.messages.push({ message: aiMessage, sender: 'ai' });
          localStorage.setItem('recentChats', JSON.stringify(recentChats)); // Save updated chat
        }
      }, 2000);
    }
  });

  // Ensure the intro section hides when user starts typing
  promptInput.addEventListener('focus', function () {
    if (introSection && introSection.style.display !== 'none') {
      introSection.style.display = 'none';  // Hide the intro when the user starts typing
    }
  });

  // Function to send a message to the chat container
  function sendMessage(message, isUser = true) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    if (isUser) {
      messageElement.style.backgroundColor = '#0bce15'; // Green for user messages
      messageElement.style.alignSelf = 'flex-end';  // Align user messages to the right
    } else {
      messageElement.style.backgroundColor = '#007bff'; // Blue for AI bot messages
      messageElement.style.alignSelf = 'flex-start'; // Align AI messages to the left
    }
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);

    // Scroll to the bottom after adding the message
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Load the selected chat into the chat container
  function switchChat(chatId) {
    // Find the selected chat by ID
    const selectedChat = recentChats.find(chat => chat.id === chatId);
    if (selectedChat) {
      currentChat = selectedChat; // Set the current chat
      chatContainer.innerHTML = ''; // Clear the chat container

      // Display messages from the selected chat
      selectedChat.messages.forEach((chat) => {
        sendMessage(chat.message, chat.sender === 'user');
      });
    }
  }

  // Initial rendering of chats (if any)
  renderChats();

  // Event listener for search bar to filter chats
  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredChats = recentChats.filter(chat => chat.name.toLowerCase().includes(searchTerm));
    renderChats(filteredChats); // Render filtered chats based on search term
  });

  // New chat button functionality
  newChatBtn.addEventListener('click', function () {
    // Clear chat history and reset
    currentChat = null; // Reset current chat
    promptInput.value = ''; // Clear the input field
    chatContainer.innerHTML = ''; // Clear the chat container
    renderChats(); // Re-render the chat list (still keeping the previous chats)
  });
});
