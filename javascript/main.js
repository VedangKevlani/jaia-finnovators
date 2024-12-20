document.addEventListener("DOMContentLoaded", function() {
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');
  const chatContainer = document.getElementById('chat-container');
  const recentChatsContainer = document.getElementById("recent-chats-container");
  const introSection = document.getElementById('intro');
  const searchBar = document.getElementById("search-bar");

  // Dummy data: Replace with actual chat data
  let recentChats = [];  // Initialize as an empty array

  // Function to render the recent chats
  function renderChats(filteredChats = recentChats) {
    recentChatsContainer.innerHTML = ''; // Clear previous chat items

    filteredChats.forEach(chat => {
      const chatItem = document.createElement("div");
      chatItem.classList.add("chat-item");
      chatItem.textContent = chat.name;

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
    renderChats(); // Re-render after deletion
  }

  // Function to create a new chat for the first message
  function createNewChat(message) {
    // Create a new chat object with the first message
    const newChat = {
      id: recentChats.length + 1, // Increment ID for new chat
      name: `Chat ${recentChats.length + 1}`, // You can change this name
      messages: [message] // Store the first message
    };
    recentChats.push(newChat); // Add the new chat to the array
    renderChats(); // Re-render chats with the new one
  }

  // Send button click event (User message)
  sendBtn.addEventListener('click', function(event) {
    const userMessage = promptInput.value.trim();
    if (userMessage) {
      if (recentChats.length === 0) {
        // Create a new chat if this is the first message
        createNewChat(userMessage);
      } else {
        // Otherwise, just add the message to the last chat
        const lastChat = recentChats[recentChats.length - 1];
        lastChat.messages.push(userMessage);
      }

      // Send the message to the chat container
      sendMessage(userMessage, true); // User message
      promptInput.value = ''; // Clear input

      // Simulate AI bot response after 2 seconds
      setTimeout(function() {
        const aiMessage = 'This is a simulated AI response!';
        sendMessage(aiMessage, false); // AI message
      }, 2000);
    }
  });

  // Ensure the intro section hides when user starts typing
  promptInput.addEventListener('focus', function() {
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

  // Also ensure the input focus doesn't cause the page to scroll
  promptInput.addEventListener('focus', function() {
    chatContainer.scrollTop = chatContainer.scrollHeight;  // Ensure it stays scrolled to bottom
  });

  // Initial rendering of chats (if any)
  renderChats();

  // Event listener for search bar to filter chats
  searchBar.addEventListener("input", function () {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredChats = recentChats.filter(chat => chat.name.toLowerCase().includes(searchTerm));
    renderChats(filteredChats); // Render filtered chats based on search term
  });
});