import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = path.join(ROOT, "data", "literature.csv");
const JSON_PATH = path.join(ROOT, "site", "data", "literature.json");
const README_PATH = path.join(ROOT, "README.md");
const CHECK_ONLY = process.argv.includes("--check");

const EXPECTED_HEADERS = [
  "id", "year", "venue", "hanyu_rating", "tasks", "paradigm", "channels", "scenarios",
  "model_family", "realtime", "title", "keywords", "paper_url", "code_url",
  "demo_url", "summary", "architecture", "limitations", "metrics"
];

const TASKS = new Set([
  "Speech Enhancement",
  "Target Speaker Extraction",
  "Dereverberation",
  "Echo Cancellation"
]);
const PARADIGMS = new Set(["Generative", "Discriminative", "Hybrid", "Benchmark"]);
const CHANNELS = new Set(["Single-channel", "Multi-channel", "Binaural", "Flexible"]);
const REALTIME = new Set(["Yes", "No", "Not stated"]);
const LIST_FIELDS = new Set(["tasks", "channels", "scenarios", "keywords", "metrics"]);

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
      continue;
    }
    if (character === '"' && field.length === 0) quoted = true;
    else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += character;
  }
  if (quoted) throw new Error("CSV ended inside a quoted field");
  if (field.length > 0 || row.length > 0) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows.filter((item) => item.some((value) => value !== ""));
}

function splitList(value) {
  return value.split(/[；;]/).map((item) => item.trim()).filter(Boolean);
}

function validateUrl(value, rowNumber, field, errors) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) errors.push(`row ${rowNumber}: ${field} must use http(s)`);
  } catch {
    errors.push(`row ${rowNumber}: ${field} is not a valid URL`);
  }
}

function loadCatalog() {
  if (!fs.existsSync(CSV_PATH)) throw new Error("data/literature.csv is missing");
  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf8"));
  if (rows.length < 2) throw new Error("The catalog has no literature rows");
  const [headers, ...records] = rows;
  if (headers.join("\0") !== EXPECTED_HEADERS.join("\0")) {
    throw new Error(`Unexpected CSV headers. Expected: ${EXPECTED_HEADERS.join(", ")}`);
  }

  const errors = [];
  const ids = new Set();
  const titles = new Set();
  const catalog = records.map((values, index) => {
    const rowNumber = index + 2;
    if (values.length !== headers.length) errors.push(`row ${rowNumber}: expected ${headers.length} columns, got ${values.length}`);
    const record = Object.fromEntries(headers.map((header, column) => [header, (values[column] ?? "").trim()]));
    for (const field of LIST_FIELDS) record[`${field}_list`] = splitList(record[field]);
    record.source_order = index;
    for (const field of ["id", "year", "venue", "tasks", "paradigm", "channels", "scenarios", "model_family", "realtime", "title", "keywords", "paper_url", "summary", "architecture", "limitations", "metrics"]) {
      if (!record[field]) errors.push(`row ${rowNumber}: ${field} is required`);
    }
    if (!/^[a-z0-9][a-z0-9-]*$/.test(record.id)) errors.push(`row ${rowNumber}: id must be a lowercase ASCII slug`);
    if (!/^20\d{2}$/.test(record.year)) errors.push(`row ${rowNumber}: year must contain four digits`);
    if (record.hanyu_rating && !/^(?:[1-4](?:\.5)?|5(?:\.0)?)\/5$/.test(record.hanyu_rating)) {
      errors.push(`row ${rowNumber}: hanyu_rating must be blank or use 1/5 to 5/5 in 0.5 steps`);
    }
    for (const task of record.tasks_list) if (!TASKS.has(task)) errors.push(`row ${rowNumber}: unsupported task ${task}`);
    for (const channel of record.channels_list) if (!CHANNELS.has(channel)) errors.push(`row ${rowNumber}: unsupported channel ${channel}`);
    if (!PARADIGMS.has(record.paradigm)) errors.push(`row ${rowNumber}: unsupported paradigm ${record.paradigm}`);
    if (!REALTIME.has(record.realtime)) errors.push(`row ${rowNumber}: unsupported realtime value ${record.realtime}`);
    if (record.keywords_list.length < 1 || record.keywords_list.length > 4) errors.push(`row ${rowNumber}: keywords must contain one to four terms`);
    if (ids.has(record.id)) errors.push(`row ${rowNumber}: duplicate id ${record.id}`);
    if (titles.has(record.title)) errors.push(`row ${rowNumber}: duplicate title ${record.title}`);
    ids.add(record.id);
    titles.add(record.title);
    for (const field of ["paper_url", "code_url", "demo_url"]) validateUrl(record[field], rowNumber, field, errors);
    return record;
  });
  if (errors.length > 0) throw new Error(`Catalog validation failed:\n- ${errors.join("\n- ")}`);
  return catalog;
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\r?\n/g, "<br>").replace(/\|/g, "\\|");
}

function links(record) {
  return [
    record.paper_url && `[paper](${record.paper_url})`,
    record.code_url && `[code](${record.code_url})`,
    record.demo_url && `[demo](${record.demo_url})`
  ].filter(Boolean).join(" · ");
}

function buildMarkdownTable(catalog) {
  const header = [
    "| 年份 / Venue | Hanyu | 任务 | 范式 | 通道 / 场景 | 文献 | 入口 |",
    "|---|---|---|---|---|---|---|"
  ];
  const rows = catalog.map((record) => `| ${[
    `${record.year}<br>${record.venue}`,
    record.hanyu_rating || "—",
    record.tasks_list.join(" · "),
    `${record.paradigm}<br>${record.model_family}`,
    `${record.channels_list.join(" · ")}<br>${record.scenarios_list.join(" · ")}`,
    record.title,
    links(record)
  ].map(escapeMarkdown).join(" | ")} |`);
  return [...header, ...rows].join("\n");
}

function updateReadme(catalog) {
  const start = "<!-- catalog:start -->";
  const end = "<!-- catalog:end -->";
  const current = fs.readFileSync(README_PATH, "utf8");
  const startIndex = current.indexOf(start);
  const endIndex = current.indexOf(end);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) throw new Error("README catalog markers are missing or out of order");
  const generated = `${start}\n${buildMarkdownTable(catalog)}\n${end}`;
  return `${current.slice(0, startIndex)}${generated}${current.slice(endIndex + end.length)}`;
}

function writeOrCheck(filePath, nextContent) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  if (CHECK_ONLY) {
    if (current !== nextContent) throw new Error(`${path.relative(ROOT, filePath)} is out of date; run npm run build`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, nextContent);
}

const catalog = loadCatalog();
writeOrCheck(JSON_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
writeOrCheck(README_PATH, updateReadme(catalog));
console.log(`${CHECK_ONLY ? "Checked" : "Built"} ${catalog.length} curated papers.`);
