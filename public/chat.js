const socket = io();

let username = '';
let room = '';
let typingTimer;

// Enhanced join chat function with validation and animations
function joinChat() {
  username = document.getElementById('username').value.trim();
  room = document.getElementById('room').value.trim();
  
  // Enhanced validation
  if (!username) {
    showNotification('Please enter a username', 'error');
    document.getElementById('username').focus();
    return;
  }
  
  if (!room) {
    showNotification('Please enter a room name', 'error');
    document.getElementById('room').focus();
    return;
  }
  
  if (username.length < 2) {
    showNotification('Username must be at least 2 characters', 'error');
    return;
  }
  
  // Animate transition
  const loginContainer = document.getElementById('login');
  const chatContainer = document.getElementById('chat-container');
  
  loginContainer.style.animation = 'slideDown 0.5s ease-in forwards';
  
  setTimeout(() => {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    chatContainer.style.animation = 'slideUp 0.5s ease-out';
    
    // Update UI
    document.getElementById('room-name').textContent = `# ${room}`;
    document.getElementById('msg-input').focus();
    
    // Join room
    socket.emit('join room', { username, room });
    
    showNotification(`Welcome to ${room}!`, 'success');
  }, 300);
}

// Enhanced leave room function
function leaveRoom() {
  if (confirm('Are you sure you want to leave this room?')) {
    location.reload();
  }
}

// Get DOM elements
const form = document.getElementById('chat-form');
const input = document.getElementById('msg-input');
const messages = document.getElementById('messages');
const typingStatus = document.getElementById('typing-status');
const sendBtn = document.querySelector('.send-btn');

// Enhanced form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  
  if (text && text.length > 0) {
    // Disable send button temporarily
    sendBtn.disabled = true;
    
    socket.emit('chat message', text);
    input.value = '';
    
    // Re-enable send button
    setTimeout(() => {
      sendBtn.disabled = false;
    }, 100);
    
    // Stop typing indicator
    socket.emit('typing', false);
  }
});

// Enhanced typing indicator with debouncing
input.addEventListener('input', () => {
  const isTyping = input.value.trim() !== '';
  
  socket.emit('typing', isTyping);
  
  // Clear existing timer
  clearTimeout(typingTimer);
  
  // Set timer to stop typing indicator
  if (isTyping) {
    typingTimer = setTimeout(() => {
      socket.emit('typing', false);
    }, 2000);
  }
});

// Stop typing when input loses focus
input.addEventListener('blur', () => {
  socket.emit('typing', false);
  clearTimeout(typingTimer);
});

// Enter key handling (with Shift+Enter for new line)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

// Socket event handlers
socket.on('chat history', (history) => {
  messages.innerHTML = '';
  if (history.length === 0) {
    addWelcomeMessage();
  } else {
    history.forEach(msg => addMessage(msg));
  }
});

socket.on('chat message', (msg) => {
  addMessage(msg);
  playNotificationSound();
});

socket.on('typing', ({ user, isTyping }) => {
  if (user !== username) {
    typingStatus.textContent = isTyping ? `${user} is typing...` : '';
  }
});

// Enhanced message display function
function addMessage({ user, text, time }) {
  const item = document.createElement('li');
  const isSystemMessage = user === 'System';
  const isOwnMessage = user === username;
  
  if (isSystemMessage) {
    item.className = 'system-message';
    item.innerHTML = `
      <div style="text-align: center;">
        <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
        ${text}
        <span class="time">${formatTime(time)}</span>
      </div>
    `;
  } else {
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <strong style="color: ${isOwnMessage ? '#667eea' : '#1e293b'};">
            ${isOwnMessage ? 'You' : user}
          </strong>
          <span class="time">${formatTime(time)}</span>
          <div style="margin-top: 4px; line-height: 1.4;">
            ${escapeHtml(text)}
          </div>
        </div>
        ${isOwnMessage ? '<i class="fas fa-check" style="color: #10b981; font-size: 12px; margin-top: 4px;"></i>' : ''}
      </div>
    `;
  }
  
  messages.appendChild(item);
  
  // Smooth scroll to bottom
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 50);
  
  // Add entrance animation
  item.style.opacity = '0';
  item.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    item.style.transition = 'all 0.3s ease';
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  }, 10);
}

// Add welcome message for empty rooms
function addWelcomeMessage() {
  const welcomeItem = document.createElement('li');
  welcomeItem.className = 'system-message';
  welcomeItem.innerHTML = `
    <div style="text-align: center;">
      <i class="fas fa-star" style="margin-right: 6px;"></i>
      Welcome to the room! Start the conversation.
    </div>
  `;
  messages.appendChild(welcomeItem);
}

// Enhanced time formatting
function formatTime(timeString) {
  const date = new Date();
  const time = timeString || date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return time;
}

// HTML escape function for security
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    font-weight: 500;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 3000);
}

// Sound notification (optional)
function playNotificationSound() {
  // Create a subtle notification sound
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Fail silently if audio context is not available
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    to {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

// Auto-resize input based on content
function autoResizeInput() {
  const input = document.getElementById('msg-input');
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
}

// Enhanced emoji button functionality
document.addEventListener('DOMContentLoaded', () => {
  const emojiBtn = document.querySelector('.emoji-btn');
  if (emojiBtn) {
    emojiBtn.addEventListener('click', () => {
      const emojis = ['😀', '😊', '😂', '❤️', '👍', '👏', '🔥', '💯', '🎉', '😎'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const input = document.getElementById('msg-input');
      input.value += randomEmoji;
      input.focus();
    });
  }
});

// Connection status handling
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  showNotification('Connection lost. Attempting to reconnect...', 'error');
});

socket.on('reconnect', () => {
  showNotification('Reconnected successfully!', 'success');
});

// Handle connection errors
socket.on('connect_error', () => {
  showNotification('Failed to connect to server', 'error');
});

// Prevent form submission when disconnected
form.addEventListener('submit', (e) => {
  if (!socket.connected) {
    e.preventDefault();
    showNotification('Not connected to server', 'error');
  }
});

// Focus input when typing anywhere in chat
document.addEventListener('keydown', (e) => {
  const chatContainer = document.getElementById('chat-container');
  const input = document.getElementById('msg-input');
  
  if (chatContainer.style.display !== 'none' && 
      !input.matches(':focus') && 
      e.key.length === 1 && 
      !e.ctrlKey && 
      !e.altKey && 
      !e.metaKey) {
    input.focus();
  }
});

// Handle visibility change to manage typing indicators
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    socket.emit('typing', false);
    clearTimeout(typingTimer);
  }
});

// Message input enhancements
const messageInput = document.getElementById('msg-input');
if (messageInput) {
  messageInput.addEventListener('input', autoResizeInput);
  
  // Paste handling for better UX
  messageInput.addEventListener('paste', (e) => {
    setTimeout(autoResizeInput, 10);
  });
}