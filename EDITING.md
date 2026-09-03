# 文献库维护说明

目录的唯一数据源是 `data/literature.csv`。`README.md` 中的表格和 `site/data/literature.json` 是生成文件。

## 推荐流程

1. 在 Pages CMS、GitHub 或本地编辑 `data/literature.csv`。
2. 运行 `npm run build` 生成 README 与网站数据。
3. 运行 `npm run check`，确认字段、枚举、链接格式和生成文件一致。
4. 本地运行 `npm run serve`，在 `http://localhost:4173` 预览。
5. 主分支提交后，将 `site/` 发布到远端 `gh-pages` 分支；仓库维护规则要求网站改动自动执行这一步。

## 字段规则

- `hanyu_rating`：Hanyu 的个人评分；可留空，或填写 `1/5` 到 `5/5`，支持 `0.5` 分档（例如 `4.5/5`）。
- `tasks`：`Speech Enhancement`、`Target Speaker Extraction`、`Dereverberation`、`Echo Cancellation`，可用 `;` 多选。
- `paradigm`：`Generative`、`Discriminative`、`Hybrid` 或 `Benchmark`。
- `channels`：`Single-channel`、`Multi-channel`、`Binaural`、`Flexible`，可多选。
- `scenarios`、`keywords`、`metrics`：使用英文分号 `;` 分隔；关键词最多四个。
- `realtime`：`Yes`、`No` 或 `Not stated`。只有论文明确给出因果 / 实时证据时才写 `Yes`。
- `summary`：一句话说明为什么值得读；`architecture`：说明输入、核心模块和输出；`limitations`：记录风险与尚未覆盖的条件。
- URL 字段：留空或填写完整的 `https://` / `http://` 地址。
- `id`：稳定、唯一的小写 ASCII slug，发布后不要随意修改。

## 前端使用

- 按 `/` 聚焦搜索框；筛选状态会写入 URL，可直接分享。
- 点击顶部任务统计可筛选对应文献集合。
- 点击表格中的论文标题查看结构、局限与评价指标。
- “导出结果”只导出当前筛选后的文献。
