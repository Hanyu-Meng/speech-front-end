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
  "id",
  "year",
  "venue",
  "rating",
  "domain",
  "stage",
  "status",
  "title",
  "keywords",
  "paper_url",
  "github_url",
  "demo_url",
  "web_url",
  "summary",
  "why_it_matters",
  "notes_target"
];

const DOMAINS = new Set([
  "ClassicFeatures",
  "RobustFeatures",
  "LearnableFrontend",
  "SpeechEnhancement",
  "Dereverberation",
  "Beamforming",
  "SpeechSeparation",
  "SSLRepresentation",
  "Streaming",
  "Benchmark",
  "Other"
]);

const STAGES = new Set([
  "Preprocess",
  "Feature",
  "Spatial",
  "Enhancement",
  "Separation",
  "Representation",
  "Evaluation",
  "System"
]);

const STATUSES = new Set(["To read", "Reading", "Read", "Revisit"]);
const RATING_PATTERN = /^(?:[1-4](?:\.5)?|5)\/5$/;

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("CSV ended inside a quoted field");
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows.filter((item) => item.some((value) => value !== ""));
}

function validateUrl(value, rowNumber, field, errors) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) {
      errors.push(`row ${rowNumber}: ${field} must use http(s)`);
    }
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
    if (values.length !== headers.length) {
      errors.push(`row ${rowNumber}: expected ${headers.length} columns, got ${values.length}`);
    }

    const record = Object.fromEntries(
      headers.map((header, column) => [header, (values[column] ?? "").trim()])
    );
    record.source_order = index;
    record.keywords_list = record.keywords
      .split(/[；;]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    for (const field of [
      "id",
      "year",
      "venue",
      "domain",
      "stage",
      "status",
      "title",
      "summary",
      "why_it_matters"
    ]) {
      if (!record[field]) errors.push(`row ${rowNumber}: ${field} is required`);
    }

    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(record.id)) {
      errors.push(`row ${rowNumber}: id must be a stable ASCII slug`);
    }
    if (!/^\d{4}$/.test(record.year)) {
      errors.push(`row ${rowNumber}: year must contain four digits`);
    }
    if (!DOMAINS.has(record.domain)) {
      errors.push(`row ${rowNumber}: unsupported domain ${record.domain}`);
    }
    if (!STAGES.has(record.stage)) {
      errors.push(`row ${rowNumber}: unsupported stage ${record.stage}`);
    }
    if (!STATUSES.has(record.status)) {
      errors.push(`row ${rowNumber}: unsupported status ${record.status}`);
    }
    if (record.rating && !RATING_PATTERN.test(record.rating)) {
      errors.push(`row ${rowNumber}: invalid rating ${record.rating}`);
    }
    if (record.keywords_list.length === 0 || record.keywords_list.length > 3) {
      errors.push(`row ${rowNumber}: keywords must contain one to three terms`);
    }
    if (ids.has(record.id)) errors.push(`row ${rowNumber}: duplicate id ${record.id}`);
    if (titles.has(record.title)) errors.push(`row ${rowNumber}: duplicate title ${record.title}`);
    ids.add(record.id);
    titles.add(record.title);

    for (const field of ["paper_url", "github_url", "demo_url", "web_url"]) {
      validateUrl(record[field], rowNumber, field, errors);
    }

    return record;
  });

  if (errors.length > 0) {
    throw new Error(`Catalog validation failed:\n- ${errors.join("\n- ")}`);
  }

  return catalog;
}

function escapeMarkdown(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, "<br>")
    .replace(/\|/g, "\\|");
}

function markdownLinks(record) {
  const links = [];
  if (record.paper_url) links.push(`[paper](${record.paper_url})`);
  if (record.github_url) links.push(`[code](${record.github_url})`);
  if (record.demo_url) links.push(`[demo](${record.demo_url})`);
  if (record.web_url) links.push(`[web](${record.web_url})`);
  return links.join(" · ");
}

const STATUS_LABELS = {
  "To read": "待读",
  Reading: "在读",
  Read: "已读",
  Revisit: "重读"
};

function buildMarkdownTable(catalog) {
  const header = [
    "| 年份 / Venue | 星级 | 领域 / 阶段 | 状态 | 文献 | 核心词 | 链接 | 为什么值得读 |",
    "|---|:---:|---|:---:|---|---|---|---|"
  ];
  const rows = catalog.map((record) => {
    const cells = [
      `${record.year}<br>${record.venue}`,
      record.rating,
      `\`${record.domain}\` · \`${record.stage}\``,
      STATUS_LABELS[record.status],
      record.title,
      record.keywords,
      markdownLinks(record),
      record.why_it_matters
    ].map(escapeMarkdown);
    return `| ${cells.join(" | ")} |`;
  });
  return [...header, ...rows].join("\n");
}

function updateReadme(catalog) {
  const start = "<!-- catalog:start -->";
  const end = "<!-- catalog:end -->";
  const current = fs.readFileSync(README_PATH, "utf8");
  const startIndex = current.indexOf(start);
  const endIndex = current.indexOf(end);

  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    throw new Error("README catalog markers are missing or out of order");
  }

  const generated = `${start}\n${buildMarkdownTable(catalog)}\n${end}`;
  return `${current.slice(0, startIndex)}${generated}${current.slice(endIndex + end.length)}`;
}

function writeOrCheck(filePath, nextContent) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";

  if (CHECK_ONLY) {
    if (current !== nextContent) {
      throw new Error(`${path.relative(ROOT, filePath)} is out of date; run npm run build`);
    }
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, nextContent);
}

const catalog = loadCatalog();
const publicCatalog = catalog.map(({ notes_target: _notesTarget, ...record }) => record);
writeOrCheck(JSON_PATH, `${JSON.stringify(publicCatalog, null, 2)}\n`);
writeOrCheck(README_PATH, updateReadme(catalog));

console.log(`${CHECK_ONLY ? "Checked" : "Built"} ${catalog.length} literature records.`);
