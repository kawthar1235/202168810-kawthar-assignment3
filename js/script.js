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

/* =========================
   Random Quote (API)
========================= */
(function randomQuote() {
  const quoteText = $("#quoteText");
  const quoteAuthor = $("#quoteAuthor");
  const newQuoteBtn = $("#newQuoteBtn");

  if (!quoteText || !quoteAuthor || !newQuoteBtn) return;

  const API_URL = "https://motivational-spark-api.vercel.app/api/quotes/random";

  async function fetchQuote() {
    try {
      quoteText.textContent = "Loading quote...";
      quoteAuthor.textContent = "";

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();

      quoteText.textContent = `"${data.quote}"`;
      quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
      quoteText.textContent = `"Stay consistent. Small steps matter."`;
      quoteAuthor.textContent = "— Kawthar 💜";
      console.error("Quote API failed:", error);
    }
  }

  fetchQuote();
  newQuoteBtn.addEventListener("click", fetchQuote);
})();

/* =========================
   Latest GitHub Project
========================= */
(function latestGitHubProject() {
  const titleEl = $("#latestProjectTitle");
  const descEl = $("#latestProjectDesc");
  const statusEl = $("#latestProjectStatus");
  const linkEl = $("#latestProjectLink");
  const progressWrap = $("#latestProjectProgressWrap");
  const progressFill = $("#latestProjectProgressFill");
  const progressText = $("#latestProjectProgressText");

  if (
    !titleEl || !descEl || !statusEl || !linkEl ||
    !progressWrap || !progressFill || !progressText
  ) return;

  const username = "kawthar1235";

  function parseStatus(topics = []) {
    const statusTopic = topics.find((t) => t.startsWith("status-"));
    const progressTopic = topics.find((t) => t.startsWith("progress-"));

    let status = "Not specified";
    let progress = null;

    if (statusTopic) {
      status = statusTopic.replace("status-", "").replace(/-/g, " ");
    }

    if (progressTopic) {
      const value = Number(progressTopic.replace("progress-", ""));
      if (!isNaN(value)) {
        progress = Math.max(0, Math.min(100, value));
      }
    }

    return { status, progress };
  }

  async function loadLatestProject() {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=1`
      );

      if (!response.ok) throw new Error("Failed to fetch latest project");

      const repos = await response.json();
      if (!Array.isArray(repos) || repos.length === 0) {
        throw new Error("No repositories found");
      }

      const repo = repos[0];
      const { status, progress } = parseStatus(repo.topics || []);

      titleEl.textContent = repo.name;
      descEl.textContent = repo.description || "No description available.";
      linkEl.href = repo.html_url;

      const formattedStatus = status
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      statusEl.textContent = formattedStatus;

      statusEl.classList.remove("status-completed", "status-progress", "status-unknown");

      if (status.toLowerCase().includes("completed")) {
        statusEl.classList.add("status-completed");
      } else if (status.toLowerCase().includes("progress")) {
        statusEl.classList.add("status-progress");
      } else {
        statusEl.classList.add("status-unknown");
      }

      if (status.toLowerCase().includes("progress") && progress !== null) {
        progressWrap.classList.remove("hidden");
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}% completed`;
      } else {
        progressWrap.classList.add("hidden");
        progressFill.style.width = "0%";
        progressText.textContent = "";
      }
    } catch (error) {
      titleEl.textContent = "Could not load project";
      descEl.textContent = "Please try again later.";
      statusEl.textContent = "Unknown";
      statusEl.classList.remove("status-completed", "status-progress");
      statusEl.classList.add("status-unknown");
      progressWrap.classList.add("hidden");
      progressFill.style.width = "0%";
      progressText.textContent = "";
      console.error("GitHub error:", error);
    }
  }

  loadLatestProject();
})();

/* =========================
   Projects Filter + Sort
========================= */
(function projectsFilterAndSort() {
  const filterSelect = document.getElementById("filterLanguage");
  const sortSelect = document.getElementById("sortProjects");
  const grid = document.querySelector(".projects-grid");
  const projects = Array.from(document.querySelectorAll(".projects-grid .flip-card"));

  if (!filterSelect || !sortSelect || !grid || !projects.length) return;

  function getProjectName(project) {
    return (project.dataset.name || "").trim().toLowerCase();
  }

  function getProjectCategories(project) {
    return (project.dataset.category || "").trim().toLowerCase();
  }

  function updateProjects() {
    const filterValue = filterSelect.value.toLowerCase();
    const sortValue = sortSelect.value.toLowerCase();

    const sortedProjects = [...projects].sort((a, b) => {
      const nameA = getProjectName(a);
      const nameB = getProjectName(b);

      if (sortValue === "za") {
        return nameB.localeCompare(nameA);
      }

      return nameA.localeCompare(nameB);
    });

    sortedProjects.forEach((project) => {
      grid.appendChild(project);
    });

    projects.forEach((project) => {
      const categories = getProjectCategories(project);

      const matchesFilter =
        filterValue === "all" || categories.includes(filterValue);

      project.style.display = matchesFilter ? "" : "none";
    });
  }

  filterSelect.addEventListener("change", updateProjects);
  sortSelect.addEventListener("change", updateProjects);

  updateProjects();
})();

/* =========================
   Contact Timer + Feedback
========================= */
(function contactEnhancement() {
  const timerEl = document.getElementById("timeSpent");
  const feedback = document.getElementById("feedbackInput");
  const form = document.getElementById("contactForm");

  if (!timerEl || !form || !feedback) return;

  let seconds = 0;

  function updateTimer() {
    seconds++;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timerEl.textContent =
      `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  setInterval(updateTimer, 1000);

  form.addEventListener("submit", (event) => {
    const feedbackText = feedback.value.trim();

    if (feedbackText && feedbackText.length < 5) {
      event.preventDefault();
      alert("Please write a more meaningful feedback ✨");
    }
  });
})();

/* =========================
   Choose Your Path
========================= */
(function chooseYourPath() {
  const cards = document.querySelectorAll(".path-card");
  const messageEl = document.getElementById("pathMessage");

  if (!cards.length || !messageEl) return;

  const pathConfig = {
    build: {
      message: "Here are selected projects that reflect my technical skills and problem-solving approach.",
      target: "#projects"
    },
    create: {
      message: "This path highlights my visual creativity, design sense, and artistic work.",
      target: "#designs"
    },
    connect: {
      message: "Feel free to reach out for collaboration, project discussion, or professional connection.",
      target: "#contact"
    }
  };

  function activatePath(path) {
    const selected = pathConfig[path];
    if (!selected) return;

    cards.forEach((card) => {
      card.classList.toggle("active", card.dataset.path === path);
    });

    messageEl.textContent = selected.message;

    const targetSection = document.querySelector(selected.target);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      activatePath(card.dataset.path);
    });
  });
})();
/* =========================
   Visitor Name State
========================= */
(function visitorNameState() {
  const input = document.getElementById("visitorNameInput");
  const saveBtn = document.getElementById("saveVisitorName");
  const clearBtn = document.getElementById("clearVisitorName");
  const greeting = document.getElementById("visitorGreeting");

  if (!input || !saveBtn || !clearBtn || !greeting) return;

  const STORAGE_KEY = "visitorName";

  function updateGreeting(name) {
    if (name) {
      greeting.textContent = `Welcome back, ${name} ✨`;
      greeting.classList.add("has-name");
    } else {
      greeting.textContent = "Welcome! Your name will appear here.";
      greeting.classList.remove("has-name");
    }
  }

  function loadSavedName() {
    const savedName = localStorage.getItem(STORAGE_KEY);

    if (savedName) {
      input.value = savedName;
      updateGreeting(savedName);
    } else {
      updateGreeting("");
    }
  }

  saveBtn.addEventListener("click", () => {
    const name = input.value.trim();

    if (!name) {
      greeting.textContent = "Please enter your name first.";
      greeting.classList.remove("has-name");
      return;
    }

    localStorage.setItem(STORAGE_KEY, name);
    updateGreeting(name);
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    input.value = "";
    updateGreeting("");
  });

  loadSavedName();
})();