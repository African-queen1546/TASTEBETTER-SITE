const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

const loaderHTML = `
  <div class="loader-inner">
    <div class="loader-rect" aria-hidden="true"></div>
  </div>
`;

const siteIndex = [
  {
    title: 'Home',
    path: 'index.html',
    description: 'Beverage depot services built for fast pickup, online ordering, and wholesale savings.',
    tags: ['home', 'depot', 'online', 'pickup', 'wholesale']
  },
  {
    title: 'About',
    path: 'PAGES/About us.html',
    description: 'Learn more about Joshb\'s Depo, the team and the depot experience.',
    tags: ['about', 'mission', 'team', 'history']
  },
  {
    title: 'Services',
    path: 'PAGES/services.html',
    description: 'Depot services for pickup, online ordering, wholesale sourcing, and logistics.',
    tags: ['services', 'depot', 'online', 'wholesale', 'support']
  },
  {
    title: 'Online Services',
    path: 'PAGES/online services.html',
    description: 'Order online for delivery or pickup from the depot with fast checkout.',
    tags: ['online', 'order', 'delivery', 'pickup']
  },
  {
    title: 'Wholesale',
    path: 'PAGES/wholesale.html',
    description: 'Wholesale pricing and volume supply for restaurants, retailers, and bars.',
    tags: ['wholesale', 'bulk', 'pricing', 'supply']
  },
  {
    title: 'Contact',
    path: 'PAGES/contact us.html',
    description: 'Reach out for depot questions, orders, or customer support.',
    tags: ['contact', 'support', 'help', 'email', 'phone']
  },
  {
    title: 'FAQs',
    path: 'PAGES/FAQs.html',
    description: 'Frequently asked questions about ordering, pickup, and depot services.',
    tags: ['faqs', 'questions', 'help', 'support']
  },
  {
    title: 'Appointment',
    path: 'PAGES/Appointment.html',
    description: 'Book a pickup or depot visit with the appointment form.',
    tags: ['appointment', 'booking', 'pickup', 'visit']
  },
  {
    title: 'Rate Our Service',
    path: 'PAGES/Rate our Service.html',
    description: 'Share your feedback and rate the quality of depot service.',
    tags: ['rate', 'feedback', 'review', 'service']
  },
  {
    title: 'Blog',
    path: 'PAGES/blog.html',
    description: 'News and updates about Joshb\'s Depo and beverage supply.',
    tags: ['blog', 'news', 'updates', 'depot']
  }
];

function resolveSiteUrl(pagePath) {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const isInPagesFolder = currentPath.includes('/PAGES/');

  if (isInPagesFolder) {
    if (pagePath.startsWith('PAGES/')) {
      return pagePath.slice(6);
    }
    return `../${pagePath}`;
  }

  return pagePath;
}

function createSearchOverlay() {
  let overlay = document.querySelector('.search-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Site search results">
      <button class="search-close" type="button" aria-label="Close search">×</button>
      <div class="search-panel-header">
        <h2>Search the site</h2>
        <p>Search across every page for services, depot pickup, wholesale, contact, and more.</p>
      </div>
      <div class="search-panel-body">
        <div class="search-form-inline">
          <input class="search-input" type="search" placeholder="Search site..." aria-label="Search site" />
          <button class="search-submit" type="button">Search</button>
        </div>
        <div class="search-results"></div>
      </div>
    </div>
  `;

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('.search-close')) {
      closeSearchOverlay();
    }
  });

  document.body.appendChild(overlay);
  const submitButton = overlay.querySelector('.search-submit');
  const input = overlay.querySelector('.search-input');
  submitButton.addEventListener('click', () => runSiteSearch(input.value.trim()));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runSiteSearch(input.value.trim());
    }
  });
  return overlay;
}

function openSearchOverlay(initialQuery = '') {
  const overlay = createSearchOverlay();
  overlay.classList.add('active');
  const input = overlay.querySelector('.search-input');
  if (initialQuery) {
    input.value = initialQuery;
    runSiteSearch(initialQuery);
  } else {
    input.value = '';
    renderSearchResults([], '');
  }
  input.focus();
}

function closeSearchOverlay() {
  const overlay = document.querySelector('.search-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function runSiteSearch(query) {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? siteIndex.filter((page) => {
        const target = `${page.title} ${page.description} ${page.tags.join(' ')}`.toLowerCase();
        return normalized.split(/\s+/).every((term) => target.includes(term));
      })
    : siteIndex.slice(0, 5);

  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const resultsContainer = document.querySelector('.search-results');
  if (!resultsContainer) return;

  if (!query.trim()) {
    resultsContainer.innerHTML = `
      <div class="search-welcome">
        <p>Try searching for <strong>pickup</strong>, <strong>online ordering</strong>, <strong>wholesale</strong>, or <strong>contact</strong>.</p>
      </div>
    `;
    return;
  }

  if (!results.length) {
    resultsContainer.innerHTML = `
      <div class="search-empty">
        <p>No matches found for <strong>${query}</strong>. Try a different keyword or browse the site links.</p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = results
    .map((page) => {
      const pageUrl = resolveSiteUrl(page.path);
      return `
        <a class="search-result" href="${pageUrl}">
          <h3>${page.title}</h3>
          <p>${page.description}</p>
        </a>
      `;
    })
    .join('');
}

const APPOINTMENT_STORAGE_KEY = 'tastebetter-appointment-order';

function getSavedAppointment() {
  try {
    const raw = localStorage.getItem(APPOINTMENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveAppointment(order) {
  try {
    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(order));
  } catch (error) {
    // ignore storage failures
  }
}

function clearSavedAppointment() {
  try {
    localStorage.removeItem(APPOINTMENT_STORAGE_KEY);
  } catch (error) {
    // ignore storage failures
  }
}

function formatDateLabel(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function handleAppointmentSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const fullNameInput = form.querySelector('#full-name');
  const visitDateInput = form.querySelector('#visit-date');
  const visitTimeInput = form.querySelector('#visit-time');
  const orderNotesInput = form.querySelector('#order-notes');
  const feedback = form.querySelector('.form-feedback');

  const order = {
    fullName: fullNameInput?.value.trim() || '',
    visitDate: visitDateInput?.value || '',
    visitTime: visitTimeInput?.value || '',
    notes: orderNotesInput?.value.trim() || '',
    savedAt: new Date().toISOString()
  };

  if (!order.fullName || !order.visitDate || !order.visitTime) {
    if (feedback) {
      feedback.textContent = 'Please fill in your name, preferred date and time before submitting.';
      feedback.classList.add('visible');
      setTimeout(() => feedback.classList.remove('visible'), 4000);
    }
    return;
  }

  saveAppointment(order);
  if (feedback) {
    feedback.textContent = 'Your appointment request was saved. Visit the Order page to view or cancel it.';
    feedback.classList.add('visible');
    setTimeout(() => feedback.classList.remove('visible'), 4000);
  }
  form.reset();
}

function renderOrderPage() {
  const content = document.getElementById('order-page-content');
  if (!content) return;

  const appointment = getSavedAppointment();
  if (!appointment) {
    content.innerHTML = `
      <div class="order-empty">
        <h3>No saved order found</h3>
        <p>There is no appointment or order saved yet. Please place an order first using the <a class="inline-link" href="Appointment.html">Appointment</a> page.</p>
      `;
    return;
  }

  content.innerHTML = `
    <div class="order-summary">
      <h3>Your saved order</h3>
      <p>Review the appointment details you saved from the Book or Cancel links.</p>
      <dl>
        <div>
          <dt>Name</dt>
          <dd>${appointment.fullName}</dd>
        </div>
        <div>
          <dt>Preferred date</dt>
          <dd>${formatDateLabel(appointment.visitDate)}</dd>
        </div>
        <div>
          <dt>Preferred time</dt>
          <dd>${appointment.visitTime}</dd>
        </div>
        <div>
          <dt>Order notes</dt>
          <dd>${appointment.notes ? appointment.notes : 'No notes provided'}</dd>
        </div>
      </dl>
      <div class="order-action">
        <button id="cancel-saved-order" class="btn btn-primary" type="button">Cancel saved order</button>
        <a class="btn btn-secondary" href="Appointment.html">Update appointment</a>
      </div>
    </div>
  `;

  const cancelButton = document.getElementById('cancel-saved-order');
  cancelButton?.addEventListener('click', () => {
    clearSavedAppointment();
    renderOrderPage();
  });
}

function createSearchBar() {
  const form = document.createElement('form');
  form.className = 'header-search-form';
  form.innerHTML = `
    <label class="sr-only" for="headerSearchInput">Search site</label>
    <input id="headerSearchInput" class="header-search-input" type="search" placeholder="Search site..." aria-label="Search site" />
    <button class="header-search-button" type="submit" aria-label="Search">Search</button>
  `;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('.header-search-input');
    const query = input.value.trim();
    openSearchOverlay(query);
  });

  return form;
}

function createChatWidget() {
  const container = document.createElement('div');
  container.className = 'chatbot-widget';
  container.innerHTML = `
    <button class="chatbot-button" type="button" aria-label="Open chat bot">Chat</button>
    <div class="chatbot-panel" role="dialog" aria-modal="true" aria-label="Chat bot">
      <div class="chatbot-header">
        <h2>Depot Chat</h2>
        <button class="chatbot-close" type="button" aria-label="Close chat">×</button>
      </div>
      <div class="chatbot-messages"></div>
      <form class="chatbot-form">
        <input class="chatbot-input" type="text" placeholder="Ask about orders, pickup, wholesale..." aria-label="Chat message" />
        <button class="chatbot-send" type="submit">Send</button>
      </form>
    </div>
  `;

  document.body.appendChild(container);
  const openButton = container.querySelector('.chatbot-button');
  const closeButton = container.querySelector('.chatbot-close');
  const panel = container.querySelector('.chatbot-panel');
  const form = container.querySelector('.chatbot-form');

  openButton.addEventListener('click', () => {
    container.classList.add('open');
    panel.querySelector('.chatbot-input').focus();
    appendChatMessage('bot', 'Hi! I can help you search the site, answer questions about pickup, wholesale, and orders.');
  });
  closeButton.addEventListener('click', () => container.classList.remove('open'));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('.chatbot-input');
    const message = input.value.trim();
    if (!message) return;
    appendChatMessage('user', message);
    input.value = '';
    setTimeout(() => appendChatMessage('bot', getChatbotReply(message)), 300);
  });
}

function appendChatMessage(role, message) {
  const messages = document.querySelector('.chatbot-messages');
  if (!messages) return;

  const item = document.createElement('div');
  item.className = `chatbot-message chatbot-message-${role}`;
  item.textContent = message;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function getChatbotReply(message) {
  const normalized = message.toLowerCase();
  if (/\b(search|find|look|where)\b/.test(normalized)) {
    openSearchOverlay(message);
    return 'I opened the site search for you. Check the results and click a page to explore.';
  }

  const responses = [
    {
      match: /\b(order|online|delivery|pickup)\b/,
      reply: 'You can place an order online or book pickup at the depot. Use the Online or Appointment page to start.'
    },
    {
      match: /\b(wholesale|bulk|pricing|supply)\b/,
      reply: 'Wholesale orders are available through the Wholesale page. We help restaurants and retailers with bulk pricing.'
    },
    {
      match: /\b(contact|support|help|phone|email)\b/,
      reply: 'Visit the Contact page to reach our team for questions, orders, or depot support.'
    },
    {
      match: /\b(faq|question|questions|help)\b/,
      reply: 'The FAQs page answers common questions about ordering, pickup, and depot services.'
    },
    {
      match: /\b(about|team|mission|story)\b/,
      reply: 'The About page shares who Joshb\'s Depo is and what makes the depot experience different.'
    }
  ];

  const match = responses.find((item) => item.match.test(normalized));
  if (match) return match.reply;

  return 'I’m here to help! Try asking about orders, pickup, wholesale, contact, or type a keyword like pickup or delivery.';
}

function initSiteTools() {
  const headerGrid = document.querySelector('.site-header .header-grid');
  if (headerGrid) {
    const searchBar = createSearchBar();
    headerGrid.insertBefore(searchBar, headerGrid.querySelector('.site-nav'));
  }

  document.addEventListener('keydown', (event) => {
    if ((event.key === 'k' || event.key === 'K') && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      openSearchOverlay();
    }
  });

  createChatWidget();
}

function createPageLoader() {
  let overlay = document.querySelector('.page-loader');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-loader active';
    overlay.innerHTML = loaderHTML;
    overlay.dataset.loaderShownAt = Date.now().toString();
    document.body.appendChild(overlay);
  }
  return overlay;
}

function hidePageLoader(loader) {
  if (!loader) return;
  const minVisibleMs = 2000;
  const shownAt = Number(loader.dataset.loaderShownAt) || Date.now();
  const elapsed = Date.now() - shownAt;
  const remaining = minVisibleMs - elapsed;

  if (remaining > 0) {
    setTimeout(() => {
      loader.classList.remove('active');
    }, remaining);
  } else {
    loader.classList.remove('active');
  }
}

function showPageLoader(loader) {
  if (!loader) return;
  loader.classList.add('active');
  loader.dataset.loaderShownAt = Date.now().toString();
}

function handleLinkNavigation(loader) {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || !link.href) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;
    if (link.hasAttribute('target') || link.hasAttribute('download')) return;
    if (link.href === window.location.href) return;
    if (link.hash && url.pathname === window.location.pathname) return;

    event.preventDefault();
    showPageLoader(loader);
    // Navigate immediately so the loader doesn't artificially delay navigation
    window.location.href = link.href;
  });
}

function applyTheme(theme) {
  const body = document.body;
  body.classList.remove('theme-light', 'theme-dark');
  let activeTheme = 'theme-dark';
  if (theme === 'theme-light' || theme === 'theme-dark') {
    activeTheme = theme;
  } else if (theme === 'light') {
    activeTheme = 'theme-light';
  }
  body.classList.add(activeTheme);
  localStorage.setItem('theme', activeTheme);

  const toggleButton = document.querySelector('.theme-toggle');
  if (toggleButton) {
    toggleButton.textContent = activeTheme === 'theme-light' ? '🌙 Dark' : '☀️ Light';
    toggleButton.setAttribute('aria-label', activeTheme === 'theme-light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
}

function createThemeToggle() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.setAttribute('aria-label', 'Toggle theme');
  return button;
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'theme-dark' : 'theme-light');
  applyTheme(theme);

  const headerGrid = document.querySelector('.site-header .header-grid');
  if (headerGrid) {
    const toggleButton = createThemeToggle();
    toggleButton.addEventListener('click', () => {
      const current = document.body.classList.contains('theme-light') ? 'theme-light' : 'theme-dark';
      applyTheme(current === 'theme-light' ? 'theme-dark' : 'theme-light');
    });
    headerGrid.insertBefore(toggleButton, headerGrid.querySelector('.nav-toggle'));
  }
}

function initApp() {
  const pageLoader = createPageLoader();

  handleLinkNavigation(pageLoader);

  const links = document.querySelectorAll('.site-nav a, .footer-nav a');
  links.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add('active-link');
    }
  });

  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
  }

  const forms = document.querySelectorAll('form[data-feedback]');
  forms.forEach((form) => {
    if (form.id === 'appointment-form') return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = 'Thanks! Your request is received. Joshb\'s Depo will contact you soon.';
        feedback.classList.add('visible');
        setTimeout(() => feedback.classList.remove('visible'), 4500);
      }
      form.reset();
    });
  });

  renderOrderPage();

  initTheme();
  initSiteTools();

  if (document.readyState === 'complete') {
    hidePageLoader(pageLoader);
  } else {
    window.addEventListener('load', () => {
      hidePageLoader(pageLoader);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

navToggle?.addEventListener('click', () => {
  siteNav.classList.toggle('nav-open');
  document.body.classList.toggle('nav-active');
});

document.addEventListener('click', (event) => {
  if (
    siteNav &&
    navToggle &&
    !siteNav.contains(event.target) &&
    !navToggle.contains(event.target)
  ) {
    siteNav.classList.remove('nav-open');
    document.body.classList.remove('nav-active');
  }
});

// Scroll animations: fade elements in when they enter the viewport
(function() {
  const animated = document.querySelectorAll('.animate-on-scroll');
  if (!animated.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  });

  animated.forEach(el => observer.observe(el));
})();
