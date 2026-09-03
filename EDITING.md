# 文献库维护说明

目录的唯一数据源是 `data/literature.csv`。`README.md` 中的表格和 `site/data/literature.json` 是生成文件。

## 推荐流程

1. 在 Pages CMS 中登录 GitHub，只为 `Hanyu-Meng/speech-front-end` 授权。
2. 打开 **Speech front-end literature** 数据表，新增或修改论文。
3. 保存后 GitHub Actions 会校验字段、重建 README 与网页数据，并发布 GitHub Pages。
4. 如果直接在 GitHub 或本地编辑 CSV，提交前运行 `npm run build` 和 `npm run check`。

## 字段规则

- `domain`：`ClassicFeatures`、`RobustFeatures`、`LearnableFrontend`、`SpeechEnhancement`、`Dereverberation`、`Beamforming`、`SpeechSeparation`、`SSLRepresentation`、`Streaming`、`Benchmark` 或 `Other`。
- `stage`：`Preprocess`、`Feature`、`Spatial`、`Enhancement`、`Separation`、`Representation`、`Evaluation` 或 `System`。
- `status`：`To read`、`Reading`、`Read` 或 `Revisit`。
- `rating`：留空，或填写 `1/5`、`3.5/5`、`5/5` 这类值。
- `keywords`：最多三个，使用 `；` 或 `;` 分隔。
- URL 字段：留空或填写完整的 `https://` / `http://` 地址。
- `id`：稳定、唯一的 ASCII 标识；发布后不要随意修改。
- `notes_target`：可选的私人笔记路径，构建时会从公开 JSON 中删除。

## 本地预览

```bash
npm run build
npm run check
npm run serve
```

然后访问 `http://localhost:4173`。按 `/` 可聚焦搜索框，按 `Esc` 可关闭详情窗口。
