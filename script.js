
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const clearChatButton = document.getElementById('clearChat');
const quickPrompts = document.getElementById('quickPrompts');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Automatically update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Demo chatbot responses (not real AI yet)
function getDemoReply(question) {
  const q = question.toLowerCase();

  if (q.includes('attendance')) {
    return 'Attendance requirements can vary by course and college policy. Please check your official attendance record or ask your department office for the current requirement.';
  }

  if (q.includes('exam') || q.includes('timetable') || q.includes('schedule')) {
    return 'Exam schedules and timetable updates are usually shared through official college notices or the examination department. Please check the latest notice to confirm dates.';
  }

  if (q.includes('scholarship') || q.includes('financial aid')) {
    return 'Scholarship eligibility, documents and deadlines depend on the specific scheme. Check your college scholarship desk and the official scholarship portal for current details.';
  }

  if (q.includes('admission') || q.includes('document')) {
    return 'Admission requirements may differ by course. Commonly requested documents include academic marksheets, identity proof, photographs and applicable certificates. Please confirm the current list with the admissions office.';
  }

  if (q.includes('fee') || q.includes('payment')) {
    return 'For exact fee amounts, payment deadlines and receipts, please refer to the college fee notice or accounts office. I do not have verified live fee information in this demo';
  }

  if (q.includes('library')) {
    return 'For library hours, membership rules and book availability, please check the library notice or contact the library desk. This demo does not have live library records';
  }

  if (q.includes('contact') || q.includes('office') || q.includes('help')) {
    return 'For an official or personal matter, please contact the relevant college office or department directly. Add the college’s verified contact details to this helpdesk when setting up the project';
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return 'Hello! 😊 What college-related question can I help you with today? Try asking about exams, attendance, admission, scholarships or fees';
  }

  return 'I can help with general college topics like exams, attendance, admission, scholarships, fees and campus facilities. I do not have verified information for that exact question yet. Please check with the relevant college office for an official answer';
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

  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  bubble.appendChild(paragraph);

  const time = document.createElement('span');
  time.className = 'message-time';
  time.textContent = sender === 'user' ? 'You · Just now' : 'CampusAI · Demo reply';
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

// Send a question
function sendQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) return;

  addMessage(trimmed, 'user');
  chatInput.value = '';
  chatInput.focus();

  showTyping();

  window.setTimeout(() => {
    document.getElementById('typingRow')?.remove();
    addMessage(getDemoReply(trimmed), 'assistant');
  }, 650);
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
  p.textContent = 'Hello again! 👋 What would you like to know?';

  bubble.appendChild(p);
  row.append(avatar, bubble);
  chatBody.appendChild(row);

  chatInput.value = '';
  chatInput.focus();
});

// Mobile menu
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});
