/* ── Custom Cursor ── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
  cursorRing.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
});

document.querySelectorAll('a, button, .cert-card, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.style.transform += ' scale(1.5)');
  el.addEventListener('mouseleave', () => {});
});

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const spans = hamburger.querySelectorAll('span');
  spans.forEach((span, i) => {
    if (navMenu.classList.contains('active')) {
      if (i === 0) span.style.transform = 'rotate(45deg) translate(4px, 4px)';
      if (i === 1) span.style.opacity = '0';
      if (i === 2) span.style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      span.style.transform = 'none';
      span.style.opacity = '1';
    }
  });
});

/* ── Nav Links – close menu + smooth scroll ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navMenu.classList.remove('active');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });

    const target = document.querySelector(link.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - 65, behavior: 'smooth' });
  });
});

/* ── Navbar hide-on-scroll + active link ── */
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  const cur = window.pageYOffset;
  navbar.style.transform = (cur > lastScroll && cur > 120) ? 'translateY(-100%)' : 'translateY(0)';
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
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ── */
const animateCounter = (el) => {
  const raw = el.innerText.replace(/\D/g, '');
  const target = parseInt(raw);
  const hasPLus = el.innerText.includes('+');
  if (isNaN(target)) return;
  let count = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    count += step;
    if (count >= target) { el.innerText = target + (hasPLus ? '+' : ''); clearInterval(timer); }
    else el.innerText = Math.floor(count) + (hasPLus ? '+' : '');
  }, 16);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const h4 = e.target.querySelector('h4');
      if (h4 && !h4.dataset.animated) { h4.dataset.animated = '1'; animateCounter(h4); }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(s => statsObserver.observe(s));

/* ── Hero Parallax ── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const scrolled = window.pageYOffset;
  hero.style.transform = `translateY(${scrolled * 0.35}px)`;
  hero.style.opacity = Math.max(0, 1 - scrolled / 600);
});

/* ── Certificate Modal ── */
const certModal = document.getElementById('certModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalBody = document.getElementById('certModalBody');
const certModalClose = document.getElementById('certModalClose');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const file = card.dataset.file;
    const type = card.dataset.type;
    const title = card.dataset.title || 'Certificate';

    certModalTitle.textContent = title;
    certModalBody.innerHTML = '';

    if (type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = file;
      iframe.title = title;
      certModalBody.appendChild(iframe);
    } else {
      const img = document.createElement('img');
      img.src = file;
      img.alt = title;
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
  certModalBody.innerHTML = '';
}

/* ── Contact Form ── */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const successEl = document.getElementById('email-success');

  if (!name || !email || !subject || !message) {
    alert('Please fill in all fields');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  try {
    const res = await fetch('https://portfolio-amber-nine-66.vercel.app/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();

    // FIX: was `success.style.textContent = data` — corrected below
    successEl.textContent = data.message || 'Message sent successfully!';
    contactForm.reset();
  } catch (err) {
    console.error('Error submitting form:', err);
    successEl.style.color = '#e87070';
    successEl.textContent = 'Something went wrong. Please try again.';
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
  }
});

/* ── Developer Easter Egg ── */
console.log('%c👋 Hello, developer!', 'color:#c9a96e;font-size:18px;font-weight:bold;');
console.log('%cLooking at the code? Feel free to reach out — joseantoben03@gmail.com', 'color:#8a8070;font-size:13px;');
