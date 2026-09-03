const DATA_URL = "./data/literature.json";

const DOMAIN_LABELS = {
  ClassicFeatures: "经典特征",
  RobustFeatures: "鲁棒特征",
  LearnableFrontend: "可学习前端",
  SpeechEnhancement: "语音增强",
  Dereverberation: "去混响",
  Beamforming: "波束形成",
  SpeechSeparation: "语音分离",
  SSLRepresentation: "自监督表示",
  Streaming: "流式部署",
  Benchmark: "评测基准",
  Other: "其他"
};

const STAGE_LABELS = {
  Preprocess: "预处理",
  Feature: "特征提取",
  Spatial: "空间处理",
  Enhancement: "增强",
  Separation: "分离",
  Representation: "表示学习",
  Evaluation: "评测",
  System: "系统集成"
};

const STATUS_LABELS = {
  "To read": "待读",
  Reading: "在读",
  Read: "已读",
  Revisit: "重读"
};

const elements = {
  search: document.querySelector("#search-input"),
  domain: document.querySelector("#domain-filter"),
  stage: document.querySelector("#stage-filter"),
  year: document.querySelector("#year-filter"),
  status: document.querySelector("#status-filter"),
  rating: document.querySelector("#rating-filter"),
  sort: document.querySelector("#sort-control"),
  clear: document.querySelector("#clear-filters"),
  copy: document.querySelector("#copy-view"),
  export: document.querySelector("#export-csv"),
  body: document.querySelector("#catalog-body"),
  tableState: document.querySelector("#table-state"),
  resultCount: document.querySelector("#result-count"),
  activeFilters: document.querySelector("#active-filters"),
  syncStatus: document.querySelector("#sync-status"),
  statTotal: document.querySelector("#stat-total"),
  statDomains: document.querySelector("#stat-domains"),
  statYears: document.querySelector("#stat-years"),
  statRead: document.querySelector("#stat-read"),
  dialog: document.querySelector("#detail-dialog"),
  closeDialog: document.querySelector("#close-dialog"),
  detailMeta: document.querySelector("#detail-meta"),
  detailTitle: document.querySelector("#detail-title"),
  detailLabels: document.querySelector("#detail-labels"),
  detailSummary: document.querySelector("#detail-summary"),
  detailValue: document.querySelector("#detail-value"),
  detailKeywords: document.querySelector("#detail-keywords"),
  detailLinks: document.querySelector("#detail-links"),
  toast: document.querySelector("#toast")
};

const state = {
  catalog: [],
  filtered: [],
  filters: { search: "", domain: "", stage: "", year: "", status: "", rating: "" },
  sort: "year:desc"
};

const collator = new Intl.Collator(["zh-CN", "en"], { numeric: true, sensitivity: "base" });
let toastTimer;

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function ratingValue(value) {
  return value ? Number.parseFloat(value) : -1;
}

function uniqueValues(key, numeric = false) {
  const values = [...new Set(state.catalog.map((record) => record[key]).filter(Boolean))];
  return values.sort((left, right) => numeric
    ? Number(right) - Number(left)
    : collator.compare(left, right));
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
  addOptions(elements.domain, uniqueValues("domain"), DOMAIN_LABELS);
  addOptions(elements.stage, uniqueValues("stage"), STAGE_LABELS);
  addOptions(elements.year, uniqueValues("year", true));
  addOptions(elements.status, uniqueValues("status"), STATUS_LABELS);
  addOptions(
    elements.rating,
    [...new Set(state.catalog.map((record) => record.rating).filter(Boolean))]
      .sort((left, right) => ratingValue(right) - ratingValue(left))
  );
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(state.filters)) state.filters[key] = params.get(key) ?? "";
  const requestedSort = params.get("sort");
  if ([...elements.sort.options].some((option) => option.value === requestedSort)) {
    state.sort = requestedSort;
  }
}

function syncControls() {
  for (const key of ["search", "domain", "stage", "year", "status", "rating"]) {
    elements[key].value = state.filters[key];
  }
  elements.sort.value = state.sort;
}

function writeUrlState() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state.filters)) {
    if (value) params.set(key, value);
  }
  if (state.sort !== "year:desc") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
}

function matches(record) {
  const search = state.filters.search.trim().toLocaleLowerCase();
  if (search) {
    const haystack = [
      record.title,
      record.venue,
      record.keywords,
      record.summary,
      record.why_it_matters,
      DOMAIN_LABELS[record.domain],
      STAGE_LABELS[record.stage]
    ].join(" ").toLocaleLowerCase();
    if (!haystack.includes(search)) return false;
  }

  for (const key of ["domain", "stage", "year", "status"]) {
    if (state.filters[key] && record[key] !== state.filters[key]) return false;
  }
  if (state.filters.rating === "unrated" && record.rating) return false;
  if (state.filters.rating && state.filters.rating !== "unrated" && record.rating !== state.filters.rating) return false;
  return true;
}

function sortRecords(records) {
  const [key, direction] = state.sort.split(":");
  const multiplier = direction === "desc" ? -1 : 1;
  return [...records].sort((left, right) => {
    if (key === "rating") {
      const difference = ratingValue(left.rating) - ratingValue(right.rating);
      if (difference !== 0) return difference * multiplier;
    } else if (key === "year") {
      const difference = Number(left.year) - Number(right.year);
      if (difference !== 0) return difference * multiplier;
    } else {
      const difference = collator.compare(left[key] ?? "", right[key] ?? "");
      if (difference !== 0) return difference * multiplier;
    }
    return left.source_order - right.source_order;
  });
}

function badge(text, modifier = "") {
  return createElement("span", `badge ${modifier}`.trim(), text);
}

function createLinks(record, compact = false) {
  const definitions = [
    ["paper_url", "Paper"],
    ["github_url", "Code"],
    ["demo_url", "Demo"],
    ["web_url", "Web"]
  ];
  const wrapper = createElement("div", compact ? "row-links compact" : "row-links");
  for (const [key, label] of definitions) {
    if (!record[key]) continue;
    const link = createElement("a", "paper-link", `${label} ↗`);
    link.href = record[key];
    link.target = "_blank";
    link.rel = "noreferrer";
    link.addEventListener("click", (event) => event.stopPropagation());
    wrapper.append(link);
  }
  return wrapper;
}

function renderRow(record) {
  const row = document.createElement("tr");
  row.tabIndex = 0;
  row.setAttribute("aria-label", `查看 ${record.title}`);
  row.addEventListener("click", () => openDetail(record));
  row.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail(record);
    }
  });

  const dateCell = document.createElement("td");
  dateCell.dataset.label = "年份 / Venue";
  dateCell.append(createElement("strong", "year", record.year), createElement("span", "venue", record.venue));

  const domainCell = document.createElement("td");
  domainCell.dataset.label = "领域 / 阶段";
  domainCell.append(
    badge(DOMAIN_LABELS[record.domain] ?? record.domain, `domain domain-${record.domain}`),
    badge(STAGE_LABELS[record.stage] ?? record.stage, "stage")
  );

  const titleCell = document.createElement("td");
  titleCell.dataset.label = "文献";
  titleCell.append(createElement("button", "paper-title", record.title));

  const keywordCell = document.createElement("td");
  keywordCell.dataset.label = "关键词";
  const keywordList = createElement("div", "keyword-list");
  for (const keyword of record.keywords_list) keywordList.append(badge(keyword, "keyword"));
  keywordCell.append(keywordList);

  const statusCell = document.createElement("td");
  statusCell.dataset.label = "状态";
  statusCell.append(badge(STATUS_LABELS[record.status] ?? record.status, `status status-${record.status.toLowerCase().replaceAll(" ", "-")}`));

  const ratingCell = document.createElement("td");
  ratingCell.dataset.label = "星级";
  ratingCell.append(createElement("span", record.rating ? "rating" : "rating empty", record.rating || "—"));

  const linksCell = document.createElement("td");
  linksCell.dataset.label = "入口";
  linksCell.append(createLinks(record, true));

  row.append(dateCell, domainCell, titleCell, keywordCell, statusCell, ratingCell, linksCell);
  return row;
}

function renderActiveFilters() {
  const labels = {
    search: "搜索",
    domain: "领域",
    stage: "阶段",
    year: "年份",
    status: "状态",
    rating: "星级"
  };
  const values = {
    domain: DOMAIN_LABELS,
    stage: STAGE_LABELS,
    status: STATUS_LABELS
  };
  const chips = Object.entries(state.filters).filter(([, value]) => value);
  elements.activeFilters.replaceChildren();

  if (chips.length === 0) {
    elements.activeFilters.append(createElement("span", "filter-placeholder", "当前显示全部文献"));
    return;
  }

  for (const [key, value] of chips) {
    const displayValue = value === "unrated" ? "未评分" : (values[key]?.[value] ?? value);
    const button = createElement("button", "filter-chip", `${labels[key]}：${displayValue} ×`);
    button.type = "button";
    button.addEventListener("click", () => {
      state.filters[key] = "";
      syncControls();
      applyState();
    });
    elements.activeFilters.append(button);
  }
}

function render() {
  elements.body.replaceChildren();
  for (const record of state.filtered) elements.body.append(renderRow(record));
  elements.tableState.hidden = state.filtered.length > 0;
  if (state.filtered.length === 0) elements.tableState.textContent = "没有匹配的文献，试试减少筛选条件。";
  elements.resultCount.textContent = `显示 ${state.filtered.length} / ${state.catalog.length} 篇文献`;
  renderActiveFilters();
}

function applyState() {
  state.filtered = sortRecords(state.catalog.filter(matches));
  writeUrlState();
  render();
}

function renderStats() {
  const years = state.catalog.map((record) => Number(record.year));
  elements.statTotal.textContent = String(state.catalog.length).padStart(2, "0");
  elements.statDomains.textContent = String(new Set(state.catalog.map((record) => record.domain)).size).padStart(2, "0");
  elements.statYears.textContent = String(Math.max(...years) - Math.min(...years) + 1);
  elements.statRead.textContent = String(state.catalog.filter((record) => ["Read", "Reading"].includes(record.status)).length).padStart(2, "0");
}

function openDetail(record) {
  elements.detailMeta.textContent = `${record.year} / ${record.venue}`;
  elements.detailTitle.textContent = record.title;
  elements.detailSummary.textContent = record.summary;
  elements.detailValue.textContent = record.why_it_matters;
  elements.detailKeywords.textContent = record.keywords_list.join(" · ");
  elements.detailLabels.replaceChildren(
    badge(DOMAIN_LABELS[record.domain] ?? record.domain, `domain domain-${record.domain}`),
    badge(STAGE_LABELS[record.stage] ?? record.stage, "stage"),
    badge(STATUS_LABELS[record.status] ?? record.status, "status"),
    badge(record.rating || "未评分", record.rating ? "rating" : "rating empty")
  );
  elements.detailLinks.replaceChildren(createLinks(record));
  elements.dialog.showModal();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2200);
}

function csvEscape(value) {
  const string = String(value ?? "");
  return /[",\n]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function exportCsv() {
  const headers = ["year", "venue", "rating", "domain", "stage", "status", "title", "keywords", "paper_url", "github_url", "summary", "why_it_matters"];
  const rows = [headers, ...state.filtered.map((record) => headers.map((key) => record[key]))];
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "speech-front-end-literature.csv";
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(`已导出 ${state.filtered.length} 篇文献`);
}

function bindEvents() {
  let searchTimer;
  elements.search.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.filters.search = elements.search.value;
      applyState();
    }, 120);
  });

  for (const key of ["domain", "stage", "year", "status", "rating"]) {
    elements[key].addEventListener("change", () => {
      state.filters[key] = elements[key].value;
      applyState();
    });
  }

  elements.sort.addEventListener("change", () => {
    state.sort = elements.sort.value;
    applyState();
  });

  elements.clear.addEventListener("click", () => {
    for (const key of Object.keys(state.filters)) state.filters[key] = "";
    state.sort = "year:desc";
    syncControls();
    applyState();
  });

  elements.copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("筛选链接已复制");
    } catch {
      showToast("复制失败，请从地址栏复制");
    }
  });

  elements.export.addEventListener("click", exportCsv);
  elements.closeDialog.addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) elements.dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.catalog = await response.json();
    hydrateControls();
    readUrlState();
    syncControls();
    renderStats();
    bindEvents();
    applyState();
    elements.syncStatus.textContent = `${state.catalog.length} 条记录已同步`;
  } catch (error) {
    elements.tableState.hidden = false;
    elements.tableState.textContent = "目录载入失败，请确认已先运行 npm run build。";
    elements.resultCount.textContent = "数据不可用";
    elements.syncStatus.textContent = "同步失败";
    console.error(error);
  }
}

init();
