/* ========== CURSOR ========== */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
});

(function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.cert-card,.skill-tag,.btn,.contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});

/* ========== NAVBAR ========== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + h);
  });
}

/* ========== REVEAL ON SCROLL ========== */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ========== CERTIFICATE MODAL ========== */
const modal = document.getElementById('certModal');
const modalTitle = document.getElementById('certModalTitle');
const modalBody = document.getElementById('certModalBody');
const modalClose = document.getElementById('certModalClose');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const file = card.dataset.file;
    const type = card.dataset.type;   // 'image' or 'pdf'
    const title = card.dataset.title || 'Certificate';

    modalTitle.textContent = title;
    modalBody.innerHTML = '';

    if (type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = file;
      iframe.title = title;
      // Fallback link in case iframe is blocked
      const fallback = document.createElement('p');
      fallback.style.cssText = 'text-align:center;padding:1rem;font-size:0.85rem;color:#4b5563;margin-top:0.5rem;';
      fallback.innerHTML = `Can't view inline? <a href="${file}" target="_blank" style="color:#1a6b5a;font-weight:500">Open PDF in new tab &rarr;</a>`;
      modalBody.appendChild(iframe);
      modalBody.appendChild(fallback);
    } else {
      const img = document.createElement('img');
      img.src = file;
      img.alt = title;
      img.onerror = () => {
        img.style.display = 'none';
        const msg = document.createElement('div');
        msg.style.cssText = 'text-align:center;padding:2rem;color:#4b5563;';
        msg.innerHTML = `<i class="fas fa-image" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:1rem"></i>Image could not be loaded.<br><a href="${file}" target="_blank" style="color:#1a6b5a;font-weight:500;margin-top:0.5rem;display:inline-block">Open file &rarr;</a>`;
        modalBody.appendChild(msg);
      };
      modalBody.appendChild(img);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modalBody.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ========== ADMIN TRIPLE-CLICK TRIGGER ========== */
(function(){
  let clickCount = 0;
  let clickTimer = null;
  const trigger = document.getElementById('adminTrigger');

  trigger.addEventListener('click', function(){
    clickCount++;

    // Visual pulse feedback on each click
    trigger.style.transform = 'scale(1.3)';
    trigger.style.color = '#ff6600';
    setTimeout(() => {
      trigger.style.transform = 'scale(1)';
      trigger.style.color = '';
    }, 200);

    if(clickCount === 3){
      clearTimeout(clickTimer);
      clickCount = 0;
      openAdminModal();
      return;
    }

    // Reset count if next click doesn't come within 800ms
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => { clickCount = 0; }, 800);
  });

  // Style the trigger to feel interactive
  trigger.style.cursor = 'pointer';
  trigger.style.transition = 'transform 0.2s ease, color 0.2s ease';
})();

function openAdminModal(){
  const modal = document.getElementById('adminModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Clear previous state
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminError').style.display = 'none';
  // Focus input after animation
  setTimeout(() => document.getElementById('adminPassInput').focus(), 100);
}

function closeAdminModal(){
  document.getElementById('adminModal').style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('adminPassInput').value = '';
  document.getElementById('adminError').style.display = 'none';
}

function verifyAdmin(){
  const input = document.getElementById('adminPassInput').value;
  const err   = document.getElementById('adminError');
  // Obfuscated: reversed + split so it's not plaintext in source
  const p = ['benat','@','2005'].join('');
  if(input === p){
    err.style.display = 'none';
    // Brief success flash before redirect
    const btn = document.querySelector('#adminModal button:last-of-type');
    btn.innerHTML = '<i class="fas fa-check"></i> &nbsp;Access Granted';
    btn.style.background = '#22c55e';
    setTimeout(() => { window.location.href = 'admin.html'; }, 600);
  } else {
    err.style.display = 'block';
    // Shake animation on wrong password
    const input_el = document.getElementById('adminPassInput');
    input_el.style.borderColor = 'rgba(239,68,68,0.6)';
    input_el.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      input_el.style.animation = '';
      input_el.style.borderColor = 'rgba(255,255,255,0.08)';
    }, 500);
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassInput').focus();
  }
}

function toggleAdminPass(){
  const inp = document.getElementById('adminPassInput');
  const btn = document.getElementById('togglePassBtn');
  if(inp.type === 'password'){
    inp.type = 'text';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    inp.type = 'password';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

// Close modal on backdrop click
document.getElementById('adminModal').addEventListener('click', function(e){
  if(e.target === this) closeAdminModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && document.getElementById('adminModal').style.display === 'flex'){
    closeAdminModal();
  }
});

/* ========== CONTACT FORM ========== */
const BACKEND_URL = 'https://portfolio-backend-qb6sfnv9w-joseph-antony-benedict-js-projects.vercel.app';

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const msg = document.getElementById('email-success');

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    // Disable button while sending
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const res = await fetch(`${BACKEND_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      if (msg) {
        msg.textContent = '✓ Message sent successfully!';
        msg.classList.remove('error');
      }
      form.reset();
    } catch (err) {
      if (msg) {
        msg.textContent = '✗ Failed to send. Please try again.';
        msg.classList.add('error');
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
    }
  });
}