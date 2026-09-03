const DATA_URL = "./data/literature.json?v=20260903-hanyu";

const TASK_LABELS = {
  "Speech Enhancement": "语音增强",
  "Target Speaker Extraction": "目标说话人",
  Dereverberation: "去混响",
  "Echo Cancellation": "回声消除"
};

const PARADIGM_LABELS = {
  Generative: "生成式",
  Discriminative: "非生成式",
  Hybrid: "混合式",
  Benchmark: "基准"
};

const CHANNEL_LABELS = {
  "Single-channel": "单通道",
  "Multi-channel": "多通道",
  Binaural: "双耳",
  Flexible: "灵活通道"
};

const elements = {
  search: document.querySelector("#search-input"),
  task: document.querySelector("#task-filter"),
  year: document.querySelector("#year-filter"),
  venue: document.querySelector("#venue-filter"),
  hanyu: document.querySelector("#hanyu-filter"),
  paradigm: document.querySelector("#paradigm-filter"),
  channel: document.querySelector("#channel-filter"),
  scenario: document.querySelector("#scenario-filter"),
  clear: document.querySelector("#clear-filters"),
  copy: document.querySelector("#copy-view"),
  export: document.querySelector("#export-csv"),
  body: document.querySelector("#catalog-body"),
  tableState: document.querySelector("#table-state"),
  resultCount: document.querySelector("#result-count"),
  activeFilters: document.querySelector("#active-filters"),
  syncStatus: document.querySelector("#sync-status"),
  detailDialog: document.querySelector("#detail-dialog"),
  detailMeta: document.querySelector("#detail-meta"),
  detailTitle: document.querySelector("#detail-title"),
  detailLabels: document.querySelector("#detail-labels"),
  detailSummary: document.querySelector("#detail-summary"),
  detailArchitecture: document.querySelector("#detail-architecture"),
  detailLimitations: document.querySelector("#detail-limitations"),
  detailMetrics: document.querySelector("#detail-metrics"),
  detailLinks: document.querySelector("#detail-links"),
  methodDialog: document.querySelector("#method-dialog"),
  metricDialog: document.querySelector("#metric-dialog"),
  toast: document.querySelector("#toast")
};

const state = {
  catalog: [],
  filtered: [],
  filters: {
    search: "",
    task: "",
    year: "",
    venue: "",
    hanyu: "",
    paradigm: "",
    channel: "",
    scenario: ""
  },
  sort: "year",
  direction: "desc"
};

const collator = new Intl.Collator(["zh-CN", "en"], { numeric: true, sensitivity: "base" });

function el(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function uniqueValues(key, listKey = false) {
  const values = state.catalog.flatMap((record) => listKey ? record[key] : [record[key]]).filter(Boolean);
  return [...new Set(values)];
}

function populateSelect(select, values, labels = {}) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = labels[value] ?? value;
    select.append(option);
  }
}

function hydrateFilters() {
  populateSelect(elements.task, uniqueValues("tasks_list", true).sort(collator.compare), TASK_LABELS);
  populateSelect(elements.year, uniqueValues("year").sort((a, b) => Number(b) - Number(a)));
  populateSelect(elements.venue, uniqueValues("venue").sort(collator.compare));
  populateSelect(elements.channel, uniqueValues("channels_list", true).sort(collator.compare), CHANNEL_LABELS);
  populateSelect(elements.scenario, uniqueValues("scenarios_list", true).sort(collator.compare));
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(state.filters)) state.filters[key] = params.get(key) ?? "";
  state.sort = params.get("sort") || "year";
  state.direction = params.get("dir") === "asc" ? "asc" : "desc";
}

function syncControls() {
  elements.search.value = state.filters.search;
  elements.task.value = state.filters.task;
  elements.year.value = state.filters.year;
  elements.venue.value = state.filters.venue;
  elements.hanyu.value = state.filters.hanyu;
  elements.channel.value = state.filters.channel;
  elements.scenario.value = state.filters.scenario;
  for (const button of elements.paradigm.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.value === state.filters.paradigm));
  }
}

function updateUrl() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state.filters)) if (value) params.set(key, value);
  if (state.sort !== "year") params.set("sort", state.sort);
  if (state.direction !== "desc") params.set("dir", state.direction);
  const query = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function recordSearchText(record) {
  return [
    record.title,
    record.year,
    record.venue,
    record.tasks,
    record.paradigm,
    record.channels,
    record.scenarios,
    record.model_family,
    record.keywords,
    record.summary,
    record.architecture,
    record.limitations,
    record.metrics
  ].join(" ").toLocaleLowerCase();
}

function matchesFilters(record) {
  const filter = state.filters;
  const query = filter.search.trim().toLocaleLowerCase();
  if (query && !recordSearchText(record).includes(query)) return false;
  if (filter.task && !record.tasks_list.includes(filter.task)) return false;
  if (filter.year && record.year !== filter.year) return false;
  if (filter.venue && record.venue !== filter.venue) return false;
  if (filter.hanyu === "unrated" && record.hanyu_rating) return false;
  if (filter.hanyu && filter.hanyu !== "unrated" && record.hanyu_rating !== filter.hanyu) return false;
  if (filter.paradigm && record.paradigm !== filter.paradigm) return false;
  if (filter.channel && !record.channels_list.includes(filter.channel)) return false;
  if (filter.scenario && !record.scenarios_list.includes(filter.scenario)) return false;
  return true;
}

function sortValue(record, key) {
  if (key === "task") return record.tasks_list[0] ?? "";
  return record[key] ?? "";
}

function ratingValue(value) {
  return value ? Number.parseFloat(value) : -1;
}

function compareRecords(left, right) {
  const leftValue = sortValue(left, state.sort);
  const rightValue = sortValue(right, state.sort);
  let result;
  if (state.sort === "year") result = Number(leftValue) - Number(rightValue);
  else if (state.sort === "hanyu_rating") result = ratingValue(leftValue) - ratingValue(rightValue);
  else result = collator.compare(leftValue, rightValue);
  if (result === 0) return left.source_order - right.source_order;
  return state.direction === "asc" ? result : -result;
}

function makeTag(value, type = "") {
  const className = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return el("span", `tag ${type ? `tag-${type}` : `tag-${className}`}`, value);
}

function makeRating(value) {
  return el("span", `rating${value ? "" : " rating-unrated"}`, value || "—");
}

function resourceDefinitions(record) {
  return [
    ["paper_url", "Paper", "file-text"],
    ["code_url", "Code", "github"],
    ["demo_url", "Demo", "play"]
  ].filter(([key]) => Boolean(record[key]));
}

function resourceLink(record, [key, label, icon]) {
  const link = el("a", "resource-link");
  link.href = record[key];
  link.target = "_blank";
  link.rel = "noreferrer";
  const iconElement = document.createElement("i");
  iconElement.dataset.lucide = icon;
  iconElement.setAttribute("aria-hidden", "true");
  link.append(iconElement, document.createTextNode(label));
  return link;
}

function makeRow(record) {
  const row = document.createElement("tr");
  row.dataset.id = record.id;

  const yearCell = el("td", "year-venue");
  yearCell.append(el("strong", "", record.year));
  if (record.year === "2026") yearCell.append(makeTag("NEW", "2026"));
  yearCell.append(el("span", "", record.venue));

  const ratingCell = el("td", "rating-cell");
  ratingCell.append(makeRating(record.hanyu_rating));

  const taskCell = el("td", "task-list");
  for (const task of record.tasks_list) taskCell.append(makeTag(TASK_LABELS[task] ?? task, "task"));

  const paradigmCell = document.createElement("td");
  paradigmCell.append(makeTag(PARADIGM_LABELS[record.paradigm] ?? record.paradigm, record.paradigm.toLowerCase()));

  const contextCell = el("td", "context-list");
  for (const channel of record.channels_list) contextCell.append(el("span", "", CHANNEL_LABELS[channel] ?? channel));
  for (const scenario of record.scenarios_list.slice(0, 3)) contextCell.append(el("span", "", scenario));
  if (record.realtime === "Yes") contextCell.append(el("span", "", "实时"));

  const titleCell = document.createElement("td");
  const titleButton = el("button", "title-button", record.title);
  titleButton.type = "button";
  titleButton.addEventListener("click", () => openDetail(record));
  titleCell.append(titleButton, el("span", "model-family", record.model_family));

  const keywordsCell = el("td", "keywords optional-wide", record.keywords_list.join(" · "));

  const linksCell = document.createElement("td");
  const linkList = el("div", "link-list");
  for (const definition of resourceDefinitions(record)) linkList.append(resourceLink(record, definition));
  linksCell.append(linkList);

  const findingCell = el("td", "finding optional-wide");
  findingCell.append(el("strong", "", record.summary), el("span", "", record.limitations));

  row.append(yearCell, ratingCell, taskCell, paradigmCell, contextCell, titleCell, keywordsCell, linksCell, findingCell);
  return row;
}

function renderActiveFilters() {
  const labels = { search: "搜索", task: "任务", year: "年份", venue: "Venue", hanyu: "Hanyu", paradigm: "范式", channel: "通道", scenario: "场景" };
  const valueLabels = { ...TASK_LABELS, ...PARADIGM_LABELS, ...CHANNEL_LABELS };
  elements.activeFilters.replaceChildren();
  for (const [key, value] of Object.entries(state.filters)) {
    if (!value) continue;
    const chip = el("button", "filter-chip", `${labels[key]}：${valueLabels[value] ?? value} ×`);
    chip.type = "button";
    chip.addEventListener("click", () => {
      state.filters[key] = "";
      syncControls();
      render();
    });
    elements.activeFilters.append(chip);
  }
}

function updateSortHeaders() {
  for (const button of document.querySelectorAll(".sort-button")) {
    const active = button.dataset.sort === state.sort;
    button.dataset.active = String(active);
    button.closest("th").setAttribute("aria-sort", active ? (state.direction === "asc" ? "ascending" : "descending") : "none");
    const icon = button.querySelector("i, svg");
    if (icon) icon.setAttribute("data-lucide", active ? (state.direction === "asc" ? "arrow-up" : "arrow-down") : "chevrons-up-down");
  }
}

function render() {
  state.filtered = state.catalog.filter(matchesFilters).sort(compareRecords);
  elements.body.replaceChildren(...state.filtered.map(makeRow));
  elements.tableState.hidden = state.filtered.length > 0;
  if (state.filtered.length === 0) elements.tableState.textContent = "没有匹配的文献，请减少筛选条件";
  const count2026 = state.filtered.filter((record) => record.year === "2026").length;
  elements.resultCount.textContent = `显示 ${state.filtered.length} / ${state.catalog.length} 篇 · 其中 2026 年 ${count2026} 篇`;
  renderActiveFilters();
  updateSortHeaders();
  updateUrl();
  refreshIcons();
}

function renderStats() {
  for (const counter of document.querySelectorAll("[data-task-count]")) {
    counter.textContent = state.catalog.filter((record) => record.tasks_list.includes(counter.dataset.taskCount)).length;
  }
}

function openDetail(record) {
  elements.detailMeta.textContent = `${record.year} · ${record.venue} · ${record.model_family}`;
  elements.detailTitle.textContent = record.title;
  elements.detailLabels.replaceChildren(
    ...record.tasks_list.map((task) => makeTag(TASK_LABELS[task] ?? task, "task")),
    makeTag(PARADIGM_LABELS[record.paradigm] ?? record.paradigm, record.paradigm.toLowerCase()),
    ...record.channels_list.map((channel) => makeTag(CHANNEL_LABELS[channel] ?? channel)),
    ...(record.realtime === "Yes" ? [makeTag("实时")] : [])
  );
  elements.detailSummary.textContent = record.summary;
  elements.detailArchitecture.textContent = record.architecture;
  elements.detailLimitations.textContent = record.limitations;
  elements.detailMetrics.replaceChildren(...record.metrics_list.map((metric) => el("span", "metric-pill", metric)));
  elements.detailLinks.replaceChildren(...resourceDefinitions(record).map((definition) => resourceLink(record, definition)));
  elements.detailDialog.showModal();
  refreshIcons();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.dataset.visible = "true";
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => { elements.toast.dataset.visible = "false"; }, 2300);
}

function csvEscape(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportFilteredCsv() {
  const headers = ["year", "venue", "hanyu_rating", "tasks", "paradigm", "channels", "scenarios", "model_family", "title", "paper_url", "code_url", "demo_url", "summary", "architecture", "limitations", "metrics"];
  const rows = [headers, ...state.filtered.map((record) => headers.map((key) => record[key]))];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "speech-front-end-literature.csv";
  anchor.click();
  URL.revokeObjectURL(url);
  showToast(`已导出 ${state.filtered.length} 篇文献`);
}

function resetFilters() {
  for (const key of Object.keys(state.filters)) state.filters[key] = "";
  state.sort = "year";
  state.direction = "desc";
  syncControls();
  render();
}

function closeOnBackdrop(dialog) {
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
}

function bindEvents() {
  elements.search.addEventListener("input", () => { state.filters.search = elements.search.value; render(); });
  for (const key of ["task", "year", "venue", "hanyu", "channel", "scenario"]) {
    elements[key].addEventListener("change", () => { state.filters[key] = elements[key].value; render(); });
  }
  for (const button of elements.paradigm.querySelectorAll("button")) {
    button.addEventListener("click", () => { state.filters.paradigm = button.dataset.value; syncControls(); render(); });
  }
  for (const button of document.querySelectorAll(".sort-button")) {
    button.addEventListener("click", () => {
      if (state.sort === button.dataset.sort) state.direction = state.direction === "asc" ? "desc" : "asc";
      else { state.sort = button.dataset.sort; state.direction = button.dataset.sort === "year" ? "desc" : "asc"; }
      render();
    });
  }
  for (const button of document.querySelectorAll("[data-task-shortcut]")) {
    button.addEventListener("click", () => { state.filters.task = button.dataset.taskShortcut; syncControls(); render(); document.querySelector(".filters").scrollIntoView({ behavior: "smooth" }); });
  }
  elements.clear.addEventListener("click", resetFilters);
  elements.copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); showToast("筛选链接已复制"); }
    catch { showToast("浏览器未允许复制，请手动复制地址栏"); }
  });
  elements.export.addEventListener("click", exportFilteredCsv);
  document.querySelector("#open-method-guide").addEventListener("click", () => elements.methodDialog.showModal());
  document.querySelector("#open-metric-guide").addEventListener("click", () => elements.metricDialog.showModal());
  for (const dialog of document.querySelectorAll("dialog")) {
    dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
    closeOnBackdrop(dialog);
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName) && !document.querySelector("dialog[open]")) {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

async function initialize() {
  bindEvents();
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.catalog = await response.json();
    hydrateFilters();
    readUrlState();
    syncControls();
    renderStats();
    render();
    const count2026 = state.catalog.filter((record) => record.year === "2026").length;
    elements.syncStatus.textContent = `${state.catalog.length} 篇 · 2026 年 ${count2026} 篇`;
  } catch (error) {
    elements.syncStatus.textContent = "目录载入失败";
    elements.resultCount.textContent = "无法读取文献数据";
    elements.tableState.hidden = false;
    elements.tableState.textContent = `请通过本地服务器打开。${error.message}`;
  }
}

initialize();
