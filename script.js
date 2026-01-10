const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* Footer Year */
$("#year").textContent = new Date().getFullYear();

/* Theme */
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
});

/* Mobile Menu */
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

$$(".nav-link").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("show"));
});

/* Scroll Progress + Active Nav */
const sections = $$("section[id]");
const navItems = $$(".nav-link");
const scrollProgress = $("#scrollProgress");

window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  scrollProgress.style.width = scrolled + "%";

  let current = "";
  sections.forEach((sec) => {
    const offset = sec.offsetTop - 120;
    if (scrollY >= offset) current = sec.id;
  });

  navItems.forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) a.classList.add("active");
  });
});

/* Reveal on Scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.14 }
);

$$(".reveal").forEach((el) => observer.observe(el));

/* Cursor Glow */
const cursorGlow = $("#cursorGlow");
window.addEventListener("mousemove", (e) => {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.setProperty("--x", e.clientX + "px");
  cursorGlow.style.setProperty("--y", e.clientY + "px");
});
window.addEventListener("mouseleave", () => (cursorGlow.style.opacity = "0"));

/* Magnetic Buttons */
function magneticEffect(el) {
  const strength = 18;

  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "translate(0px, 0px)";
  });
}

$$(".magnetic").forEach(magneticEffect);

/* Project Modal (Case Study style) */
const projectModal = $("#projectModal");
const modalOverlay = $("#modalOverlay");
const modalClose = $("#modalClose");

const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalList = $("#modalList");
const modalLive = $("#modalLive");
const modalCode = $("#modalCode");

const projectsData = {
  "ai-support": {
    title: "AI Customer Support — Multi Agent System",
    desc: "An AI-driven customer support chatbot that routes queries using agent roles and produces accurate, fast responses with a premium interface.",
    highlights: [
      "Multi-agent architecture for routing, answering, and escalation",
      "Smart fallback logic for unknown queries",
      "User-friendly UI + logging for analytics",
      "Scalable design for real businesses"
    ],
    live: "#",
    code: "#"
  },
  "voting-system": {
    title: "Online Voting System — DBMS Project",
    desc: "A secure online voting system backed by MySQL with admin controls, voter validation, and transparent database design.",
    highlights: [
      "ER diagram + normalized schema",
      "Role-based access control (Admin/Voter)",
      "Election & vote logs",
      "SQL constraints for integrity & security"
    ],
    live: "#",
    code: "#"
  },
  "quiz-app": {
    title: "Android App — Premium UI Build",
    desc: "INTUS is an AI-powered emotion prediction app that analyzes user input to detect emotional states accurately.It helps users understand their emotions better and supports mental wellness through smart insights.",
    highlights: [
      "Emotion prediction from user text/input",
      "Detects emotions like happy, sad, angry, fear,stress, netural",
      "real-time result with clean UI",
      "Privacy-focused(no unnecessary data sharing)",
      "Expandable system (mood tarcking, recommendations, journaling)",
      "I can't show the code but the apk will be in my github"
    ],
    live: "#",
    code: "#"
  }
};

function openModal(projectKey) {
  const data = projectsData[projectKey];
  if (!data) return;

  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;

  modalList.innerHTML = "";
  data.highlights.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = h;
    modalList.appendChild(li);
  });

  modalLive.href = data.live;
  modalCode.href = data.code;

  projectModal.classList.add("show");
  projectModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  projectModal.classList.remove("show");
  projectModal.setAttribute("aria-hidden", "true");
}

$$(".open-project").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".project");
    const key = card?.dataset?.project;
    openModal(key);
  });
});

modalOverlay.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* Toast */
const toast = $("#toast");
let toastTimer = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

/* Contact Form Validation */
/* =========================
   GOOGLE FORMS CONTACT FORM
   ========================= */

const contactForm = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validation
  if (name.length < 2) return showToast("Enter a valid name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) return showToast("Enter a valid email.");
  if (message.length < 10) return showToast("Message must be at least 10 characters.");

  // ✅ Your Google Form formResponse endpoint
  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScTCYY0ZvNddqm6wRaZokRQFchR8nCjQU8Cm-TdNVv8UuPKTw/formResponse";

  // ✅ Your Google Form entry IDs (from prefilled link)
  const FORM_FIELDS = {
    name: "entry.2003864831",
    email: "entry.1372598023",
    message: "entry.895534653"
  };

  // Create form data for Google Forms
  const formData = new FormData();
  formData.append(FORM_FIELDS.name, name);
  formData.append(FORM_FIELDS.email, email);
  formData.append(FORM_FIELDS.message, message);

  // Button loading state
  const oldText = sendBtn.textContent;
  sendBtn.textContent = "Sending...";
  sendBtn.disabled = true;

  try {
    /**
     * Google Forms blocks CORS; so we use mode: "no-cors"
     * This still submits successfully even though we can't read response.
     */
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    showToast("✅ Message sent successfully!");
    contactForm.reset();
  } catch (err) {
    console.error("Google Form Submit Error:", err);
    showToast("❌ Failed to send. Please try again.");
  } finally {
    sendBtn.textContent = oldText;
    sendBtn.disabled = false;
  }
});
