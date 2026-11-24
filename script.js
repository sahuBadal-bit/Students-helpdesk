
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const clearChatButton = document.getElementById('clearChat');
const quickPrompts = document.getElementById('quickPrompts');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Backend API URL
const API_URL = window.CAMPUSAI_API_URL ||
  (['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3000/api/chat'
    : '/api/chat');

// Automatically update footer year
document.getElementById('year').textContent = new Date().getFullYear();

function appendInlineFormatting(container, text) {
  const tokenPattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
  let cursor = 0;
  let match;

  while ((match = tokenPattern.exec(text)) !== null) {
    container.appendChild(document.createTextNode(text.slice(cursor, match.index)));

    if (match[1]) {
      const strong = document.createElement('strong');
      strong.textContent = match[1];
      container.appendChild(strong);
    } else {
      const bareUrl = match[4];
      const href = match[3] || bareUrl.replace(/[.,!?;:]+$/, '');
      const link = document.createElement('a');

      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = match[2] || href;
      container.appendChild(link);
      if (!match[2] && href !== bareUrl) {
        container.appendChild(document.createTextNode(bareUrl.slice(href.length)));
      }
    }

    cursor = tokenPattern.lastIndex;
  }

  container.appendChild(document.createTextNode(text.slice(cursor)));
}

function renderAssistantReply(container, text) {
  const lines = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)\s*\(\2\)/g, '[$1]($2)')
    .split(/\r?\n/);
  let paragraphLines = [];
  let list = null;
  let listType = '';

  function flushParagraph() {
    if (!paragraphLines.length) return;
    const paragraph = document.createElement('p');
    appendInlineFormatting(paragraph, paragraphLines.join(' '));
    container.appendChild(paragraph);
    paragraphLines = [];
  }

  function closeList() {
    if (!list) return;
    container.appendChild(list);
    list = null;
    listType = '';
  }

  lines.forEach((line) => {
    const item = line.match(/^\s*(?:[-*]\s+|(\d+)[.)]\s+)(.*)$/);

    if (item) {
      flushParagraph();
      const nextListType = item[1] ? 'ol' : 'ul';
      if (listType !== nextListType) closeList();
      if (!list) {
        list = document.createElement(nextListType);
        listType = nextListType;
      }

      const listItem = document.createElement('li');
      appendInlineFormatting(listItem, item[2]);
      list.appendChild(listItem);
      return;
    }

    closeList();
    if (line.trim()) {
      paragraphLines.push(line.trim());
    } else {
      flushParagraph();
    }
  });

  flushParagraph();
  closeList();
}

// Add a message to the chat
function addMessage(text, sender) {
  const row = document.createElement('div');
  row.className = `message-row ${sender === 'user' ? 'user-row' : 'assistant-row'}`;

  if (sender === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '✦';
    row.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = `message ${sender === 'user' ? 'user-message' : 'assistant-message'}`;

  if (sender === 'assistant') {
    renderAssistantReply(bubble, text);
  } else {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.appendChild(paragraph);
  }

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = sender === 'user'
    ? 'You · Just now'
    : 'CampusAI · Backend reply';

  bubble.appendChild(time);
  row.appendChild(bubble);
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Show animated typing dots
function showTyping() {
  const row = document.createElement('div');
  row.className = 'message-row assistant-row';
  row.id = 'typingRow';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '✦';

  const bubble = document.createElement('div');
  bubble.className = 'message assistant-message';

  const dots = document.createElement('div');
  dots.className = 'typing-bubble';
  dots.setAttribute('aria-label', 'CampusAI is typing');

  for (let i = 0; i < 3; i++) {
    dots.appendChild(document.createElement('span'));
  }

  bubble.appendChild(dots);
  row.append(avatar, bubble);
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Remove typing indicator
function removeTyping() {
  document.getElementById('typingRow')?.remove();
}

// Send a question to the backend
async function sendQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) return;

  addMessage(trimmed, 'user');
  chatInput.value = '';
  chatInput.focus();

  showTyping();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: trimmed })
    });

    const data = await response.json();

    removeTyping();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong.');
    }

    addMessage(data.reply, 'assistant');

  } catch (error) {
    removeTyping();

    console.error('CampusAI API Error:', error);

    addMessage(
      'I could not connect to the CampusAI server. Please make sure the backend is running and try again.',
      'assistant'
    );
  }
}

// Submit form
chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendQuestion(chatInput.value);
});

// Quick prompt buttons and help cards
document.addEventListener('click', (event) => {
  const promptButton = event.target.closest('[data-question]');

  if (promptButton) {
    sendQuestion(promptButton.dataset.question);

    document.getElementById('assistant').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

// Clear chat and restart
clearChatButton.addEventListener('click', () => {
  chatBody.innerHTML = '';

  const dateLabel = document.createElement('div');
  dateLabel.className = 'chat-date';
  dateLabel.textContent = 'TODAY';
  chatBody.appendChild(dateLabel);

  const row = document.createElement('div');
  row.className = 'message-row assistant-row';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = '✦';

  const bubble = document.createElement('div');
  bubble.className = 'message assistant-message';

  const p = document.createElement('p');
  p.textContent = 'Hello again! 👋 Ask me about B. K. Birla College admissions, courses, fees, scholarships, exams, or campus services.';

  bubble.appendChild(p);
  row.append(avatar, bubble);
  chatBody.appendChild(row);

  chatInput.value = '';
  chatInput.focus();
});

// Sliding sidebar navigation
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
  navLinks.classList.add('open');
  sidebarBackdrop.classList.add('open');
  navLinks.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close navigation');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  navLinks.classList.remove('open');
  sidebarBackdrop.classList.remove('open');
  navLinks.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('sidebar-open');
}

menuToggle.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeSidebar() : openSidebar();
});
sidebarClose.addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.querySelectorAll('a').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    closeSidebar();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('open')) closeSidebar();
});
