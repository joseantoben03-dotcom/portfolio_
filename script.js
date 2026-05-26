/* ══════════════════════════════════════════
   Portfolio Script — Joseph Antony Benedict J
   Fixed crash bug + Vercel-ready (relative API URLs)
══════════════════════════════════════════ */

/* ── API base: relative so it works on any Vercel domain ── */
const API_BASE = '';

/* ── Custom Cursor ── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.transform  = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
  cursorRing.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 17}px)`;
});

document.querySelectorAll('a, button, .cert-card, .skill-tag, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('expand'));
});

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

function toggleMenu(force) {
  const isOpen = force !== undefined ? force : !navMenu.classList.contains('active');
  navMenu.classList.toggle('active', isOpen);
  const spans = hamburger.querySelectorAll('span');
  spans.forEach((span, i) => {
    if (isOpen) {
      if (i === 0) span.style.transform = 'rotate(45deg) translate(4px, 4px)';
      if (i === 1) span.style.opacity = '0';
      if (i === 2) span.style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      span.style.transform = 'none';
      span.style.opacity = '1';
    }
  });
}

hamburger.addEventListener('click', () => toggleMenu());

/* ── Nav Links — close menu + smooth scroll ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href === 'dashboard.html') return;
    e.preventDefault();
    toggleMenu(false);
    const target = document.querySelector(href);
    if (target) window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' });
  });
});

/* ── Navbar: hide on scroll down, show on scroll up ── */
let lastScroll = 0;
const navbar   = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const cur = window.pageYOffset;
  if (cur > lastScroll && cur > 100) {
    navbar.style.transform = 'translateY(-100%)';
    toggleMenu(false);
  } else {
    navbar.style.transform = 'translateY(0)';
  }
  navbar.classList.toggle('scrolled', cur > 60);
  lastScroll = cur;

  let current = '';
  sections.forEach(s => { if (cur >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
});

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ── */
function animateCounter(el) {
  const raw     = el.innerText.replace(/\D/g, '');
  const target  = parseInt(raw, 10);
  const hasPlus = el.innerText.includes('+');
  if (isNaN(target) || target === 0) return;
  let count = 0;
  const step = Math.max(1, target / 60);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      el.innerText = target + (hasPlus ? '+' : '');
      clearInterval(timer);
    } else {
      el.innerText = Math.floor(count) + (hasPlus ? '+' : '');
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const h4 = e.target.querySelector('h4');
      if (h4 && !h4.dataset.animated) {
        h4.dataset.animated = '1';
        animateCounter(h4);
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(s => statsObserver.observe(s));

/* ── Hero Parallax ── */
window.addEventListener('scroll', () => {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;
  const scrolled = window.pageYOffset;
  if (scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.28}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - scrolled / 560);
  }
}, { passive: true });

/* ── Certificate Modal ── */
const certModal      = document.getElementById('certModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalBody  = document.getElementById('certModalBody');
const certModalClose = document.getElementById('certModalClose');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const file  = card.dataset.file;
    const type  = card.dataset.type;
    const title = card.dataset.title || 'Certificate';

    certModalTitle.textContent = title;
    certModalBody.innerHTML    = '';

    if (type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src   = file;
      iframe.title = title;
      certModalBody.appendChild(iframe);
    } else {
      const img = document.createElement('img');
      img.src   = file;
      img.alt   = title;
      certModalBody.appendChild(img);
    }

    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

certModalClose.addEventListener('click', closeCertModal);
certModal.addEventListener('click', (e) => { if (e.target === certModal) closeCertModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });

function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { certModalBody.innerHTML = ''; }, 300);
}

/* ── Contact Form ── */
const contactForm = document.getElementById('contact-form');
const successEl   = document.getElementById('email-success');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  successEl.textContent = '';
  successEl.className   = 'form-feedback';

  if (!name || !email || !subject || !message) {
    showFormFeedback('Please fill in all fields.', 'error');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormFeedback('Please enter a valid email address.', 'error');
    return;
  }

  const btn      = document.getElementById('submit-btn');
  const btnSpan  = btn.querySelector('span');
  const btnIcon  = btn.querySelector('i');

  btn.disabled        = true;
  btnSpan.textContent = 'Sending…';
  if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

  try {
    /* Relative URL — works on localhost AND on Vercel */
    const res = await fetch(`${API_BASE}/message`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, subject, message }),
    });

    let data = {};
    try { data = await res.json(); } catch (_) {}

    if (res.ok) {
      showFormFeedback(data.message || "✓ Message sent! I'll get back to you soon.", 'success');
      contactForm.reset();
    } else {
      showFormFeedback(data.error || 'Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    showFormFeedback('Network error — please try again or email me directly.', 'error');
  } finally {
    btn.disabled        = false;
    btnSpan.textContent = 'Send Message';
    if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
  }
});

function showFormFeedback(msg, type) {
  successEl.textContent = msg;
  successEl.className   = `form-feedback${type === 'error' ? ' error' : ''}`;
}

/* ── Developer Easter Egg ── */
console.log('%c👋 Hello, developer!', 'color:#c9a96e;font-size:18px;font-weight:bold;');
console.log('%cBuilt by Joseph Antony Benedict J — joseantoben03@gmail.com', 'color:#8a8070;font-size:13px;');
console.log('%cOpen to SDE · Full Stack · Flutter internships', 'color:#c9a96e;font-size:12px;');
