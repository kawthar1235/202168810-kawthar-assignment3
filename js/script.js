"use strict";

/* =========================
   Helpers
========================= */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* =========================
   Footer Year
========================= */
(function setFooterYear() {
  const yearEl = $("#year");
  if (!yearEl) return;

  yearEl.textContent = new Date().getFullYear();
})();

/* =========================
   Greeting by Time of Day
========================= */
(function greetingByTime() {
  const greetingBadge = $("#greetingBadge");
  if (!greetingBadge) return;

  const hours = new Date().getHours();
  let text = "Hello!";

  if (hours < 12) {
    text = "Good morning ☀️";
  } else if (hours < 18) {
    text = "Good afternoon 🌤️";
  } else {
    text = "Good evening 🌙";
  }

  greetingBadge.textContent = text;
})();

/* =========================
   Theme Toggle
========================= */
(function themeSetup() {
  const root = document.documentElement;
  const themeButton = $("#themeToggle");
  if (!themeButton) return;

  const THEME_KEY = "theme";
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "dark" || savedTheme === "light") {
    root.setAttribute("data-theme", savedTheme);
  }

  const updateThemeIcon = () => {
    const currentTheme = root.getAttribute("data-theme") || "light";
    themeButton.textContent = currentTheme === "light" ? "🌙" : "☀️";
    themeButton.setAttribute(
      "aria-label",
      currentTheme === "light" ? "Switch to dark theme" : "Switch to light theme"
    );
  };

  const toggleTheme = () => {
    const currentTheme = root.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    updateThemeIcon();
  };

  updateThemeIcon();
  themeButton.addEventListener("click", toggleTheme);
})();

/* =========================
   Mobile Navigation Toggle
========================= */
(function navToggle() {
  const toggleButton = $("#navToggle");
  const navMenu = $("#navMenu");
  if (!toggleButton || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove("open");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    navMenu.classList.add("open");
    toggleButton.setAttribute("aria-expanded", "true");
  };

  toggleButton.addEventListener("click", () => {
    const isOpen = navMenu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = event.target.closest(".nav");
    if (!clickedInsideNav && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
    }
  });
})();

/* =========================
   Contact Form Interaction
========================= */
(function contactForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");
  const submitButton = $("#submitBtn");
  const nameInput = $("#name");
  const emailInput = $("#email");
  const messageInput = $("#message");

  if (!form || !status || !submitButton || !nameInput || !emailInput || !messageInput) {
    return;
  }

  const inputs = [nameInput, emailInput, messageInput];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form-status small show ${type}`;
  }

  function clearStatus() {
    status.textContent = "";
    status.className = "form-status small";
  }

  function clearErrors() {
    inputs.forEach((input) => input.classList.remove("input-error"));
  }

  function validateForm() {
    clearErrors();
    clearStatus();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    if (!name) {
      nameInput.classList.add("input-error");
      isValid = false;
    }

    if (!email) {
      emailInput.classList.add("input-error");
      isValid = false;
    }

    if (!message) {
      messageInput.classList.add("input-error");
      isValid = false;
    }

    if (!isValid) {
      showStatus("Please fill in all fields before sending.", "error");
      return false;
    }

    if (!emailPattern.test(email)) {
      emailInput.classList.add("input-error");
      showStatus("Please enter a valid email address.", "error");
      return false;
    }

    return true;
  }

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");

      if (status.classList.contains("show")) {
        clearStatus();
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const name = nameInput.value.trim();
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    window.setTimeout(() => {
      showStatus(`Thanks, ${name}! Your message was prepared successfully.`, "success");
      form.reset();
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }, 700);
  });
})();

/* =========================
   Mouse Gradient Follow
========================= */
(function mouseGradientFollow() {
  let rafId = null;

  document.addEventListener("mousemove", (event) => {
    if (rafId) return;

    rafId = window.requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--mx", `${x}%`);
      document.documentElement.style.setProperty("--my", `${y}%`);

      rafId = null;
    });
  });
})();

/* =========================
   Project Modal
========================= */
(function projectModal() {
  const modal = $("#projectModal");
  const modalClose = $("#modalClose");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  const modalTools = $("#modalTools");
  const modalLink = $("#modalLink");
  const detailButtons = $$(".details-btn");

  if (
    !modal ||
    !modalClose ||
    !modalTitle ||
    !modalDescription ||
    !modalTools ||
    !modalLink ||
    !detailButtons.length
  ) {
    return;
  }

  let lastFocusedButton = null;

  function openModal(button) {
    lastFocusedButton = button;

    modalTitle.textContent = button.dataset.title || "";
    modalDescription.textContent = button.dataset.description || "";
    modalTools.textContent = button.dataset.tools || "";
    modalLink.href = button.dataset.link || "#";

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    modalClose.focus();
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedButton) {
      lastFocusedButton.focus();
    }
  }

  detailButtons.forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
})();

/* =========================
   Reveal on Scroll
========================= */
(function revealOnScroll() {
  const revealElements = $$(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("active");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
})();

/* =========================
   Typing Name Animation
========================= */
(function typingNameEffect() {
  const target = $("#typingName");
  if (!target) return;

  const text = "Kawthar Ali,";
  let index = 0;

  target.textContent = "";

  function typeLetter() {
    if (index >= text.length) return;

    target.textContent += text.charAt(index);
    index += 1;
    window.setTimeout(typeLetter, 140);
  }

  typeLetter();
})();

/* =========================
   Cinematic Design Stack
========================= */
(function designStack() {
  const stack = $("#designStack");
  if (!stack) return;

  let isAnimating = false;

  function rotateStack() {
    if (isAnimating) return;

    const firstImage = stack.querySelector(".stack-img");
    if (!firstImage) return;

    isAnimating = true;
    firstImage.classList.add("exit-right");

    window.setTimeout(() => {
      firstImage.classList.remove("exit-right");
      stack.appendChild(firstImage);
      isAnimating = false;
    }, 700);
  }

  stack.addEventListener("click", rotateStack);

  stack.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      rotateStack();
    }
  });
})();

/* =========================
   Back To Top 
========================= */
(function backToTop() {
  const link = document.querySelector('.site-footer a');

  if (!link) return;

  link.addEventListener("click", function (e) {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
})();