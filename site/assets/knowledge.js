const STORAGE_KEY = "speech-front-end-knowledge-progress-v1";

const checkboxes = [...document.querySelectorAll("[data-check]")];
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const resetButton = document.querySelector("#reset-progress");
const navigationLinks = [...document.querySelectorAll(".knowledge-sidebar nav a")];

function readProgress() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

function saveProgress() {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.dataset.check);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function renderProgress() {
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const percentage = checkboxes.length ? Math.round((completed / checkboxes.length) * 100) : 0;
  progressLabel.textContent = `${completed} / ${checkboxes.length}`;
  progressBar.style.width = `${percentage}%`;
  progressBar.parentElement.setAttribute("aria-valuenow", String(completed));
  progressBar.parentElement.setAttribute("aria-valuemax", String(checkboxes.length));
  progressBar.parentElement.setAttribute("aria-label", `${completed} of ${checkboxes.length} mastery items complete`);
}

function initializeChecklist() {
  const saved = readProgress();
  for (const checkbox of checkboxes) {
    checkbox.checked = saved.has(checkbox.dataset.check);
    checkbox.addEventListener("change", () => {
      saveProgress();
      renderProgress();
    });
  }
  resetButton.addEventListener("click", () => {
    for (const checkbox of checkboxes) checkbox.checked = false;
    saveProgress();
    renderProgress();
  });
  renderProgress();
}

function initializeNavigation() {
  const linksById = new Map(navigationLinks.map((link) => [link.hash.slice(1), link]));
  const sections = [...linksById.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
    if (!visible) return;
    for (const link of navigationLinks) link.classList.toggle("active", link === linksById.get(visible.target.id));
  }, { rootMargin: "-18% 0px -70%", threshold: [0, 0.1, 0.5] });
  for (const section of sections) observer.observe(section);
}

initializeChecklist();
initializeNavigation();
if (window.lucide) window.lucide.createIcons();
