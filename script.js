const menuToggle = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const form = document.getElementById("contact-form");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  console.log("Form Data:", data);
  document.getElementById("email-success").textContent = "Message captured successfully.";
  form.reset();
});