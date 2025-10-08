class ChatApp {
  constructor() {
    this.currentContact = null;
    this.messages = {};
    this.contacts = [
      {
        id: 1,
        name: "Sarah Wilson",
        avatar: "https://via.placeholder.com/45/ff6b6b/ffffff?text=SW",
        status: "online",
        lastMessage: "Hey! How are you doing?",
        lastTime: "2:30 PM",
        unread: 2
      },
      {
        id: 2,
        name: "Mike Johnson",
        avatar: "https://via.placeholder.com/45/4ecdc4/ffffff?text=MJ",
        status: "offline",
        lastMessage: "See you tomorrow!",
        lastTime: "1:15 PM",
        unread: 0
      },
      {
        id: 3,
        name: "Emma Davis",
        avatar: "https://via.placeholder.com/45/45b7d1/ffffff?text=ED",
        status: "online",
        lastMessage: "Thanks for your help",
        lastTime: "12:45 PM",
        unread: 1
      },
      {
        id: 4,
        name: "Alex Brown",
        avatar: "https://via.placeholder.com/45/f9ca24/ffffff?text=AB",
        status: "away",
        lastMessage: "Let's catch up soon",
        lastTime: "11:30 AM",
        unread: 0
      }
    ];
    
    this.init();
  }

  init() {
    this.renderContacts();
    this.setupEventListeners();
    this.setupNotifications();
  }

  renderContacts() {
    const contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    
    this.contacts.forEach(contact => {
      const contactElement = document.createElement('div');
      contactElement.className = 'contact-item';
      contactElement.dataset.contactId = contact.id;
      
      contactElement.innerHTML = `
        <div class="contact-avatar">
          <img src="${contact.avatar}" alt="${contact.name}">
          ${contact.status === 'online' ? '<div class="online-indicator"></div>' : ''}
        </div>
        <div class="contact-info">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-last-message">${contact.lastMessage}</div>
        </div>
        <div class="contact-meta">
          <div class="contact-time">${contact.lastTime}</div>
          ${contact.unread > 0 ? `<div class="unread-badge">${contact.unread}</div>` : ''}
        </div>
      `;
      
      contactElement.addEventListener('click', () => this.selectContact(contact));
      contactsList.appendChild(contactElement);
    });
  }

  selectContact(contact) {
    this.currentContact = contact;
    
    // Update active contact
    document.querySelectorAll('.contact-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-contact-id="${contact.id}"]`).classList.add('active');
    
    // Update chat header
    document.getElementById('active-contact-name').textContent = contact.name;
    document.getElementById('active-contact-status').textContent = 
      contact.status.charAt(0).toUpperCase() + contact.status.slice(1);
    
    // Load messages
    this.loadMessages(contact.id);
    
    // Clear unread count
    contact.unread = 0;
    this.renderContacts();
  }

  loadMessages(contactId) {
    const chatWindow = document.getElementById('chat-window');
    
    // Sample messages
    if (!this.messages[contactId]) {
      this.messages[contactId] = [
        { text: "Hey there! 👋", sent: false, time: "2:25 PM" },
        { text: "Hi! How are you doing?", sent: true, time: "2:26 PM" },
        { text: "I'm doing great, thanks for asking! 😊", sent: false, time: "2:27 PM" }
      ];
    }
    
    chatWindow.innerHTML = '';
    
    this.messages[contactId].forEach(message => {
      this.displayMessage(message.text, message.sent, message.time);
    });
  }

  displayMessage(text, sent, time) {
    const chatWindow = document.getElementById('chat-window');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sent ? 'sent' : 'received'}`;
    
    messageDiv.innerHTML = `
      <div class="message-bubble">
        ${text}
        <div class="message-time">${time || this.getCurrentTime()}</div>
      </div>
    `;
    
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  sendMessage(text) {
    if (!this.currentContact || !text.trim()) return;
    
    const time = this.getCurrentTime();
    
    // Add to messages
    if (!this.messages[this.currentContact.id]) {
      this.messages[this.currentContact.id] = [];
    }
    this.messages[this.currentContact.id].push({ text, sent: true, time });
    
    // Display message
    this.displayMessage(text, true, time);
    
    // Simulate reply
    setTimeout(() => {
      const replies = [
        "That's interesting! 🤔",
        "I see what you mean 👍",
        "Thanks for sharing!",
        "Got it! 😊",
        "Sounds good to me!"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      
      this.messages[this.currentContact.id].push({ 
        text: reply, 
        sent: false, 
        time: this.getCurrentTime() 
      });
      
      this.displayMessage(reply, false);
      this.showNotification(this.currentContact.name, reply);
    }, 1000 + Math.random() * 2000);
  }

  setupEventListeners() {
    // Send message
    const sendBtn = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    
    const sendMessage = () => {
      this.sendMessage(messageInput.value);
      messageInput.value = '';
    };
    
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    // Emoji panel
    const emojiBtn = document.getElementById('emoji-btn');
    const emojiPanel = document.getElementById('emoji-panel');
    
    emojiBtn.addEventListener('click', () => {
      emojiPanel.classList.toggle('show');
    });
    
    // Add emoji to input
    emojiPanel.addEventListener('click', (e) => {
      if (e.target.textContent && e.target.textContent.trim()) {
        messageInput.value += e.target.textContent;
        emojiPanel.classList.remove('show');
        messageInput.focus();
      }
    });
    
    // Search contacts
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      this.searchContacts(e.target.value);
    });
    
    // Close emoji panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!emojiBtn.contains(e.target) && !emojiPanel.contains(e.target)) {
        emojiPanel.classList.remove('show');
      }
    });
  }

  searchContacts(query) {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
      const name = item.querySelector('.contact-name').textContent.toLowerCase();
      if (name.includes(query.toLowerCase())) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  setupNotifications() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  showNotification(sender, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`New message from ${sender}`, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
      
      setTimeout(() => notification.close(), 4000);
    }
  }
}

// Initialize the chat app
document.addEventListener('DOMContentLoaded', () => {
  new ChatApp();
});
