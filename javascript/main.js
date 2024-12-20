const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const chatForm = document.getElementById('chat-form');

chatForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const message = messageInput.value;

  if (!message) return;

  // Create a new message element
  const messageElement = document.createElement('div');
  messageElement.className = 'message';
  messageElement.innerHTML = `<strong>You:</strong> ${message}`;
  chatHistory.appendChild(messageElement);

  // Send message to PHP using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'chatbot.php', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const chatbotMessage = document.createElement('div');
      chatbotMessage.className = 'message';
      chatbotMessage.innerHTML = `<strong>Chatbot:</strong> ${response.message}`;
      chatHistory.appendChild(chatbotMessage);
    }
  };
  xhr.send(`message=${message}`);

  messageInput.value = '';
});