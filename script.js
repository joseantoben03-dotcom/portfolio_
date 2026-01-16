

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  const spans = hamburger.querySelectorAll("span");
  spans.forEach((span, index) => {
    if (navMenu.classList.contains("active")) {
      if (index === 0)
        span.style.transform = "rotate(45deg) translate(5px, 5px)";
      if (index === 1) span.style.opacity = "0";
      if (index === 2)
        span.style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      span.style.transform = "none";
      span.style.opacity = "1";
    }
  });
});

const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    const spans = hamburger.querySelectorAll("span");
    spans.forEach((span) => {
      span.style.transform = "none";
      span.style.opacity = "1";
    });
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

let lastScroll = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
  }

  if (currentScroll > lastScroll && currentScroll > 100) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll(
  ".skill-category, .project-card, .cert-card, .timeline-item, .stat"
);
animatedElements.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el); 
});

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (!name || !email || !subject || !message) {
    alert("Please fill in all fields");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  try {
    const res = await fetch("https://portfolio-amber-nine-66.vercel.app/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();
    console.log("Response from backend:", data);
    const success=document.getElementById('email-success')
    success.style.textContent=data

    alert("Thank you for your message! I will get back to you soon.");
    contactForm.reset();
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("Something went wrong. Please try again later.");
  }
});

const heroTitle = document.querySelector(".hero-title");
const originalText = heroTitle.innerHTML;
let index = 0;

function typeWriter() {
  if (index < originalText.length) {
    index++;
    setTimeout(typeWriter, 50);
  }
}

window.addEventListener("load", () => {
  typeWriter();
});

const skillTags = document.querySelectorAll(".skill-tag");
skillTags.forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.transform = "scale(1.1) rotate(5deg)";
  });

  tag.addEventListener("mouseleave", () => {
    tag.style.transform = "scale(1) rotate(0deg)";
  });
});

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

const stats = document.querySelectorAll(".stat h4");

const animateCounter = (element) => {
  const target = parseInt(element.innerText);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.innerText = target + (element.innerText.includes("+") ? "+" : "");
      clearInterval(timer);
    } else {
      element.innerText =
        Math.floor(current) + (element.innerText.includes("+") ? "+" : "");
    }
  }, 16);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector("h4");
        if (statNumber && !statNumber.classList.contains("animated")) {
          statNumber.classList.add("animated");
          animateCounter(statNumber);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat").forEach((stat) => {
  statsObserver.observe(stat);
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero-content");

  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    hero.style.opacity = 1 - scrolled / 700;
  }
});

const timelineItems = document.querySelectorAll(".timeline-item");
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }, index * 200);
      }
    });
  },
  { threshold: 0.2 }
);

timelineItems.forEach((item) => {
  item.style.opacity = "0";
  item.style.transition = "opacity 0.6s ease, transform 0.6s ease";

  if (item.querySelector(".timeline-content")) {
    item.style.transform = item.classList.contains("odd")
      ? "translateX(50px)"
      : "translateX(-50px)";
  }

  timelineObserver.observe(item);
});

const buttons = document.querySelectorAll(".btn, .project-link");
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();

    ripple.style.width = ripple.style.height =
      Math.max(rect.width, rect.height) + "px";
    ripple.style.left = e.clientX - rect.left - ripple.offsetWidth / 2 + "px";
    ripple.style.top = e.clientY - rect.top - ripple.offsetHeight / 2 + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

const style = document.createElement("style");
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .project-link {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

console.log(
  "%c👋 Hello there, developer!",
  "color: #6366f1; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cLooking at the code? Feel free to reach out!",
  "color: #8b5cf6; font-size: 14px;"
);

document.querySelectorAll(".project-link, .social-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (link.getAttribute("href") === "#") {
      e.preventDefault();
      alert(
        "Please update this link with your actual GitHub/Demo/Social media URL!"
      );
    }
  });
});
