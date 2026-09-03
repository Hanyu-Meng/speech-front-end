const DATA_URL = "./data/literature.json";

const TASK_LABELS = {
  "Speech Enhancement": "语音增强",
  "Target Speaker Extraction": "目标说话人提取",
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
  Flexible: "通道灵活"
};

const elements = {
  search: document.querySelector("#search-input"),
  task: document.querySelector("#task-filter"),
  paradigm: document.querySelector("#paradigm-filter"),
  channel: document.querySelector("#channel-filter"),
  scenario: document.querySelector("#scenario-filter"),
  year: document.querySelector("#year-filter"),
  sort: document.querySelector("#sort-control"),
  clear: document.querySelector("#clear-filters"),
  copy: document.querySelector("#copy-view"),
  export: document.querySelector("#export-csv"),
  grid: document.querySelector("#catalog-grid"),
  empty: document.querySelector("#empty-state"),
  resultCount: document.querySelector("#result-count"),
  activeFilters: document.querySelector("#active-filters"),
  syncStatus: document.querySelector("#sync-status"),
  dialog: document.querySelector("#detail-dialog"),
  closeDialog: document.querySelector("#close-dialog"),
  detailMeta: document.querySelector("#detail-meta"),
  detailTitle: document.querySelector("#detail-title"),
  detailTags: document.querySelector("#detail-tags"),
  detailSummary: document.querySelector("#detail-summary"),
  detailArchitecture: document.querySelector("#detail-architecture"),
  detailLimitations: document.querySelector("#detail-limitations"),
  detailMetrics: document.querySelector("#detail-metrics"),
  detailLinks: document.querySelector("#detail-links"),
  toast: document.querySelector("#toast")
};

const state = {
  catalog: [],
  filtered: [],
  filters: { search: "", task: "", paradigm: "", channel: "", scenario: "", year: "" },
  sort: "year:desc"
};
const collator = new Intl.Collator(["zh-CN", "en"], { numeric: true, sensitivity: "base" });
let toastTimer;

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function uniqueList(listKey) {
  return [...new Set(state.catalog.flatMap((record) => record[listKey] ?? []))].sort(collator.compare);
}

function uniqueField(key, numeric = false) {
  return [...new Set(state.catalog.map((record) => record[key]).filter(Boolean))].sort((a, b) => numeric ? Number(b) - Number(a) : collator.compare(a, b));
}

function addOptions(select, values, labels = {}) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = labels[value] ?? value;
    select.append(option);
  }
}

function hydrateControls() {
  addOptions(elements.task, uniqueList("tasks_list"), TASK_LABELS);
  addOptions(elements.paradigm, uniqueField("paradigm"), PARADIGM_LABELS);
  addOptions(elements.channel, uniqueList("channels_list"), CHANNEL_LABELS);
  addOptions(elements.scenario, uniqueList("scenarios_list"));
  addOptions(elements.year, uniqueField("year", true));
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(state.filters)) state.filters[key] = params.get(key) ?? "";
  if ([...elements.sort.options].some((option) => option.value === params.get("sort"))) state.sort = params.get("sort");
}

function syncControls() {
  for (const key of Object.keys(state.filters)) elements[key].value = state.filters[key];
  elements.sort.value = state.sort;
}

function writeUrlState() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state.filters)) if (value) params.set(key, value);
  if (state.sort !== "year:desc") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
}

function matches(record) {
  const query = state.filters.search.trim().toLocaleLowerCase();
  if (query) {
    const haystack = [record.title, record.venue, record.tasks, record.paradigm, record.channels, record.scenarios, record.model_family, record.keywords, record.summary, record.architecture, record.limitations, record.metrics].join(" ").toLocaleLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (state.filters.task && !record.tasks_list.includes(state.filters.task)) return false;
  if (state.filters.paradigm && record.paradigm !== state.filters.paradigm) return false;
  if (state.filters.channel && !record.channels_list.includes(state.filters.channel)) return false;
  if (state.filters.scenario && !record.scenarios_list.includes(state.filters.scenario)) return false;
  if (state.filters.year && record.year !== state.filters.year) return false;
  return true;
}

function sorted(records) {
  const [key, direction] = state.sort.split(":");
  const multiplier = direction === "desc" ? -1 : 1;
  return [...records].sort((a, b) => {
    const result = key === "year" ? Number(a.year) - Number(b.year) : collator.compare(a[key], b[key]);
    return result === 0 ? a.source_order - b.source_order : result * multiplier;
  });
}

function tag(text, modifier = "") {
  return node("span", `tag ${modifier}`.trim(), text);
}

function paperLinks(record, compact = false) {
  const wrapper = node("div", compact ? "paper-links compact" : "paper-links");
  const definitions = [["paper_url", "论文"], ["code_url", "代码"], ["demo_url", "Demo"]];
  for (const [key, label] of definitions) {
    if (!record[key]) continue;
    const link = node("a", "paper-link", `${label} ↗`);
    link.href = record[key];
    link.target = "_blank";
    link.rel = "noreferrer";
    link.addEventListener("click", (event) => event.stopPropagation());
    wrapper.append(link);
  }
  return wrapper;
}

function paperCard(record) {
  const article = node("article", `paper-card paradigm-${record.paradigm.toLowerCase()}`);
  article.tabIndex = 0;
  article.setAttribute("aria-label", `查看 ${record.title} 详情`);
  article.addEventListener("click", () => openDetail(record));
  article.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDetail(record); }
  });

  const meta = node("div", "paper-meta");
  meta.append(node("span", "paper-year", record.year), node("span", "paper-venue", record.venue));
  const paradigm = tag(PARADIGM_LABELS[record.paradigm] ?? record.paradigm, `paradigm ${record.paradigm.toLowerCase()}`);
  const taskRow = node("div", "task-tags");
  for (const taskName of record.tasks_list) taskRow.append(tag(TASK_LABELS[taskName] ?? taskName, "task-tag"));
  const title = node("h3", "", record.title);
  const family = node("p", "model-family", record.model_family);
  const summary = node("p", "paper-summary", record.summary);
  const context = node("div", "paper-context");
  for (const channel of record.channels_list) context.append(tag(CHANNEL_LABELS[channel] ?? channel));
  for (const scenario of record.scenarios_list.slice(0, 2)) context.append(tag(scenario));
  if (record.realtime === "Yes") context.append(tag("实时", "realtime"));
  const footer = node("div", "paper-footer");
  footer.append(paperLinks(record, true), node("button", "detail-trigger", "结构与问题 →"));
  article.append(meta, paradigm, taskRow, title, family, summary, context, footer);
  return article;
}

function renderFilters() {
  const labels = { search: "搜索", task: "任务", paradigm: "范式", channel: "通道", scenario: "场景", year: "年份" };
  const maps = { task: TASK_LABELS, paradigm: PARADIGM_LABELS, channel: CHANNEL_LABELS };
  const active = Object.entries(state.filters).filter(([, value]) => value);
  elements.activeFilters.replaceChildren();
  if (active.length === 0) {
    elements.activeFilters.append(node("span", "filter-hint", "当前显示全部文献"));
    return;
  }
  for (const [key, value] of active) {
    const button = node("button", "filter-chip", `${labels[key]}：${maps[key]?.[value] ?? value} ×`);
    button.type = "button";
    button.addEventListener("click", () => { state.filters[key] = ""; syncControls(); applyState(); });
    elements.activeFilters.append(button);
  }
}

function render() {
  elements.grid.replaceChildren(...state.filtered.map(paperCard));
  elements.empty.hidden = state.filtered.length > 0;
  elements.resultCount.textContent = `显示 ${state.filtered.length} / ${state.catalog.length} 篇`;
  renderFilters();
}

function applyState() {
  state.filtered = sorted(state.catalog.filter(matches));
  writeUrlState();
  render();
}

function renderStats() {
  elements.statTotal.textContent = String(state.catalog.length).padStart(2, "0");
  elements.statGenerative.textContent = String(state.catalog.filter((record) => ["Generative", "Hybrid"].includes(record.paradigm)).length).padStart(2, "0");
  elements.statRealtime.textContent = String(state.catalog.filter((record) => record.realtime === "Yes").length).padStart(2, "0");
  elements.statScenarios.textContent = String(uniqueList("scenarios_list").length).padStart(2, "0");
  for (const counter of document.querySelectorAll("[data-task-count]")) {
    counter.textContent = state.catalog.filter((record) => record.tasks_list.includes(counter.dataset.taskCount)).length;
  }
}

function openDetail(record) {
  elements.detailMeta.textContent = `${record.year} · ${record.venue} · ${record.model_family}`;
  elements.detailTitle.textContent = record.title;
  elements.detailSummary.textContent = record.summary;
  elements.detailArchitecture.textContent = record.architecture;
  elements.detailLimitations.textContent = record.limitations;
  elements.detailTags.replaceChildren(
    tag(PARADIGM_LABELS[record.paradigm] ?? record.paradigm, `paradigm ${record.paradigm.toLowerCase()}`),
    ...record.tasks_list.map((item) => tag(TASK_LABELS[item] ?? item, "task-tag")),
    ...record.channels_list.map((item) => tag(CHANNEL_LABELS[item] ?? item)),
    ...(record.realtime === "Yes" ? [tag("实时", "realtime")] : [])
  );
  elements.detailMetrics.replaceChildren(...record.metrics_list.map((item) => tag(item, "metric-pill")));
  elements.detailLinks.replaceChildren(paperLinks(record));
  elements.dialog.showModal();
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 2200);
}

function csvCell(value) {
  const string = String(value ?? "");
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function exportCsv() {
  const headers = ["year", "venue", "tasks", "paradigm", "channels", "scenarios", "title", "paper_url", "code_url", "summary", "architecture", "limitations", "metrics"];
  const content = [headers.join(","), ...state.filtered.map((record) => headers.map((header) => csvCell(record[header])).join(","))].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([`\ufeff${content}`], { type: "text/csv;charset=utf-8" }));
  link.download = "speech-front-end-view.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(`已导出 ${state.filtered.length} 篇文献`);
}

function bindEvents() {
  elements.search.addEventListener("input", () => { state.filters.search = elements.search.value; applyState(); });
  for (const key of ["task", "paradigm", "channel", "scenario", "year"]) {
    elements[key].addEventListener("change", () => { state.filters[key] = elements[key].value; applyState(); });
  }
  elements.sort.addEventListener("change", () => { state.sort = elements.sort.value; applyState(); });
  elements.clear.addEventListener("click", () => {
    for (const key of Object.keys(state.filters)) state.filters[key] = "";
    state.sort = "year:desc";
    syncControls();
    applyState();
  });
  elements.copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(window.location.href); showToast("筛选链接已复制"); }
    catch { showToast("浏览器未允许复制，请手动复制地址栏"); }
  });
  elements.export.addEventListener("click", exportCsv);
  elements.closeDialog.addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) elements.dialog.close();
  });
  for (const button of document.querySelectorAll("[data-task-jump]")) {
    button.addEventListener("click", () => {
      state.filters.task = button.dataset.taskJump;
      syncControls();
      applyState();
      document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName) && !elements.dialog.open) {
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
    hydrateControls();
    readUrlState();
    syncControls();
    renderStats();
    applyState();
    elements.syncStatus.innerHTML = "<span></span>目录已同步";
  } catch (error) {
    elements.syncStatus.textContent = "载入失败";
    elements.resultCount.textContent = "无法读取文献数据";
    elements.empty.hidden = false;
    elements.empty.textContent = `请通过本地服务器打开网站。${error.message}`;
  }
}

initialize();
