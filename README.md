# Speech Front-End 文献库

[交互式目录](https://hanyu-meng.github.io/speech-front-end/) · [在线编辑](https://app.pagescms.org/) · [维护说明](EDITING.md) · [编辑原始数据](https://github.com/Hanyu-Meng/speech-front-end/edit/main/data/literature.csv)

> `data/literature.csv` 是唯一数据源。README 表格与网页 JSON 均由脚本生成，请勿直接修改生成区域。

这个仓库用于持续整理 speech front-end 方向的论文，包括传统与可学习声学特征、语音增强、去混响、波束形成、语音分离、自监督语音表示、流式部署和评测基准。

当前是第一版底座：先建立稳定的数据结构、自动校验、GitHub Pages 展示与一组代表性种子论文。星级和阅读状态保留为可持续维护的个人字段，不替你预设主观判断。

## 快速使用

```bash
npm run build
npm run check
npm run serve
```

本地目录打开 `http://localhost:4173`。新增或修改论文只编辑 `data/literature.csv`，然后运行 `npm run build`。

## 文献索引

领域和阶段标签用于定位论文在 front-end pipeline 中的位置；同一篇论文暂时只保留一个主标签，避免目录失去可筛选性。

<!-- catalog:start -->
| 年份 / Venue | 星级 | 领域 / 阶段 | 状态 | 文献 | 核心词 | 链接 | 为什么值得读 |
|---|:---:|---|:---:|---|---|---|---|
| 1980<br>IEEE TASSP |  | `ClassicFeatures` · `Feature` | 待读 | Comparison of Parametric Representations for Monosyllabic Word Recognition in Continuously Spoken Sentences | MFCC；mel scale；cepstrum | [paper](https://doi.org/10.1109/TASSP.1980.1163420) | 建立手工特征基线；后续可从感知尺度、去相关和动态特征三个维度理解神经前端的改进。 |
| 1990<br>JASA |  | `ClassicFeatures` · `Feature` | 待读 | Perceptual Linear Predictive (PLP) Analysis of Speech | PLP；critical bands；equal loudness | [paper](https://doi.org/10.1121/1.399423) | 提供与 MFCC 不同的感知建模路径，适合分析传统 front-end 在噪声与信道变化下的归纳偏置。 |
| 1994<br>IEEE TSAP |  | `RobustFeatures` · `Preprocess` | 待读 | RASTA Processing of Speech | RASTA；channel robustness；temporal filtering | [paper](https://doi.org/10.1109/89.326616) | 是鲁棒特征处理中“对时间调制谱施加先验”的经典起点，可与现代可学习归一化和增强模块对照。 |
| 2010<br>IEEE TASLP |  | `Dereverberation` · `Preprocess` | 待读 | Speech Dereverberation Based on Variance-Normalized Delayed Linear Prediction | WPE；late reverberation；linear prediction | [paper](https://doi.org/10.1109/TASL.2010.2052251) · [code](https://github.com/fgnt/nara_wpe) | WPE 仍是多通道远场前端的重要模块；理解其统计假设有助于判断神经去混响应替代还是补充它。 |
| 2015<br>IEEE/ACM TASLP |  | `RobustFeatures` · `Feature` | 待读 | Power-Normalized Cepstral Coefficients (PNCC) for Robust Speech Recognition | PNCC；medium-time power；noise robustness | [paper](https://doi.org/10.1109/TASLP.2015.2461931) | 为低算力或小数据条件提供强传统基线，也能启发可解释的神经特征归一化设计。 |
| 2016<br>ICASSP |  | `Beamforming` · `Spatial` | 待读 | Neural Network Based Spectral Mask Estimation for Acoustic Beamforming | spectral mask；spatial covariance；beamforming | [paper](https://doi.org/10.1109/ICASSP.2016.7471664) | 清晰展示“神经估计 + 可解释空间滤波”的混合范式，是多麦克风前端的核心参考。 |
| 2018<br>SLT |  | `LearnableFrontend` · `Feature` | 待读 | Speaker Recognition from Raw Waveform with SincNet | SincNet；band-pass filters；raw waveform | [paper](https://arxiv.org/abs/1808.00158) · [code](https://github.com/mravanelli/SincNet) | 是研究可学习前端时最简洁的可解释基线，便于比较固定 mel、自由卷积和受约束滤波器。 |
| 2019<br>IEEE/ACM TASLP |  | `SpeechSeparation` · `Separation` | 待读 | Conv-TasNet: Surpassing Ideal Time-Frequency Magnitude Masking for Speech Separation | time-domain；TCN；learned encoder | [paper](https://arxiv.org/abs/1809.07454) | 代表从手工时频前端转向端到端可学习分析/合成滤波器组的关键节点。 |
| 2020<br>Interspeech |  | `SpeechEnhancement` · `Enhancement` | 待读 | DCCRN: Deep Complex Convolution Recurrent Network for Phase-Aware Speech Enhancement | complex network；phase-aware；real-time | [paper](https://arxiv.org/abs/2008.00264) · [code](https://github.com/huyanxin/DeepComplexCRN) | 是复数谱建模与实时工程结合的代表作，可作为频域增强系统的强基线。 |
| 2020<br>Interspeech |  | `Benchmark` · `Evaluation` | 待读 | The INTERSPEECH 2020 Deep Noise Suppression Challenge: Datasets, Subjective Testing Framework, and Challenge Results | DNS Challenge；P.808；real-world noise | [paper](https://arxiv.org/abs/2005.13981) · [code](https://github.com/microsoft/DNS-Challenge) | 提醒前端研究不能只看合成测试集与单一客观指标；数据失配、主观质量和实时性应同时报告。 |
| 2020<br>NeurIPS |  | `SSLRepresentation` · `Representation` | 待读 | wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations | contrastive learning；quantization；masked latent | [paper](https://arxiv.org/abs/2006.11477) · [code](https://github.com/facebookresearch/fairseq/tree/main/examples/wav2vec) | 将 front-end 从固定特征推进到大规模自监督表示；适合作为内容导向表示学习的主干基线。 |
| 2020<br>Interspeech |  | `Streaming` · `Separation` | 待读 | VoiceFilter-Lite: Streaming Targeted Voice Separation for On-Device Speech Recognition | target speaker；streaming；on-device | [paper](https://arxiv.org/abs/2009.04323) | 把算法指标与真实部署约束放在同一问题中，适合作为流式个性化前端的设计样板。 |
| 2021<br>ICASSP |  | `SpeechEnhancement` · `Enhancement` | 待读 | FullSubNet: A Full-Band and Sub-Band Fusion Model for Real-Time Single-Channel Speech Enhancement | full-band；sub-band；real-time | [paper](https://arxiv.org/abs/2010.15508) · [code](https://github.com/Audio-WestlakeU/FullSubNet) | 提供了清晰的多尺度频谱建模范式，也便于研究性能、延迟和复杂度之间的折中。 |
| 2021<br>ICASSP |  | `SpeechSeparation` · `Separation` | 待读 | Attention is All You Need in Speech Separation | SepFormer；dual-path；transformer | [paper](https://arxiv.org/abs/2010.13154) · [code](https://github.com/speechbrain/speechbrain/tree/develop/recipes/WSJ0Mix/separation) | 是 dual-path 分离架构的重要代表，适合与 Conv-TasNet 对比长程建模收益及计算代价。 |
| 2021<br>Interspeech |  | `SpeechEnhancement` · `Enhancement` | 待读 | MetricGAN+: An Improved Version of MetricGAN for Speech Enhancement | metric learning；PESQ；perceptual quality | [paper](https://arxiv.org/abs/2104.03538) · [code](https://github.com/speechbrain/speechbrain/tree/develop/recipes/Voicebank/enhance/MetricGAN) | 适合研究训练目标与感知评价的错位，同时也提示必须检查代理指标过拟合和域外泛化。 |
| 2021<br>IEEE/ACM TASLP |  | `SSLRepresentation` · `Representation` | 待读 | HuBERT: Self-Supervised Speech Representation Learning by Masked Prediction of Hidden Units | masked prediction；offline clustering；hidden units | [paper](https://arxiv.org/abs/2106.07447) · [code](https://github.com/facebookresearch/fairseq/tree/main/examples/hubert) | 提供不同于对比学习的伪标签路线，是分析层级语音表示和下游迁移能力的核心文献。 |
| 2021<br>ICLR |  | `LearnableFrontend` · `Feature` | 待读 | LEAF: A Learnable Frontend for Audio Classification | Gabor filters；PCEN；learnable pooling | [paper](https://arxiv.org/abs/2101.08596) · [code](https://github.com/google-research/leaf-audio) | 适合直接检验学习型前端是否在不同语音任务和噪声条件下真正优于固定特征。 |
| 2021<br>SLT |  | `Benchmark` · `Evaluation` | 待读 | SUPERB: Speech processing Universal PERformance Benchmark | SUPERB；frozen encoder；transfer learning | [paper](https://arxiv.org/abs/2105.01051) · [code](https://github.com/s3prl/s3prl) · [web](https://superbbenchmark.org/) | 为通用 speech front-end 提供比单一 ASR WER 更完整的评价框架。 |
| 2022<br>IEEE JSTSP |  | `SSLRepresentation` · `Representation` | 待读 | WavLM: Large-Scale Self-Supervised Pre-Training for Full Stack Speech Processing | masked prediction；denoising；94k hours | [paper](https://arxiv.org/abs/2110.13900) · [code](https://github.com/microsoft/unilm/tree/master/wavlm) | 相比偏内容建模的 SSL 路线，WavLM 更直接面向说话人、分离与副语言等全栈前端需求。 |
| 2022<br>IWAENC |  | `Streaming` · `Enhancement` | 待读 | DeepFilterNet2: Towards Real-Time Speech Enhancement on Embedded Devices for Full-Band Audio | deep filtering；48 kHz；embedded | [paper](https://arxiv.org/abs/2205.05474) · [code](https://github.com/Rikorose/DeepFilterNet) | 是评价嵌入式前端时很好的工程参照：除质量外还应记录实时因子、缓存、参数量与平台。 |
| 2022<br>Interspeech |  | `SpeechEnhancement` · `Enhancement` | 待读 | CMGAN: Conformer-based Metric GAN for Speech Enhancement | Conformer；metric GAN；complex spectrum | [paper](https://arxiv.org/abs/2203.15149) · [code](https://github.com/ruizhecao96/CMGAN) | 适合观察长程时频建模与感知指标优化的组合收益，也应与更轻量的实时模型公平比较。 |
| 2023<br>IEEE/ACM TASLP |  | `SpeechSeparation` · `Separation` | 待读 | TF-GridNet: Integrating Full- and Sub-Band Modeling for Speech Separation | full-band；sub-band；complex mapping | [paper](https://arxiv.org/abs/2211.12433) | 重新证明时频域在强结构设计下仍具竞争力，适合与 Conv-TasNet、SepFormer 比较表示域和长程建模选择。 |
| 2023<br>Interspeech |  | `SpeechEnhancement` · `Enhancement` | 待读 | MP-SENet: A Speech Enhancement Model with Parallel Denoising of Magnitude and Phase Spectra | magnitude；phase；parallel denoising | [paper](https://arxiv.org/abs/2305.13686) · [code](https://github.com/yxlu-0102/MP-SENet) | 为“相位应隐式恢复还是显式建模”提供直接实验对象，可与 DCCRN、CMGAN 组成连续比较。 |
| 2024<br>IEEE/ACM TASLP |  | `Beamforming` · `Spatial` | 待读 | SpatialNet: Extensively Learning Spatial Information for Multichannel Joint Speech Separation, Denoising and Dereverberation | narrow-band；cross-band；spatial cues | [paper](https://arxiv.org/abs/2307.16516) · [code](https://github.com/Audio-WestlakeU/NBSS) · [web](https://audio.westlake.edu.cn/Research/SpatialNet.htm) | 代表从显式掩码波束形成走向端到端空间建模的路线，适合检查阵列泛化和长时流式能力。 |
| 2025<br>Interspeech |  | `SpeechEnhancement` · `System` | 待读 | ClearerVoice-Studio: Bridging Advanced Speech Processing Research and Practical Deployment | toolkit；pretrained models；deployment | [paper](https://arxiv.org/abs/2506.19398) · [code](https://github.com/modelscope/ClearerVoice-Studio) | 提供从论文模型走向可用系统的工程参照，也便于快速建立复现、推理和主观试听基线。 |
<!-- catalog:end -->

## 字段约定

- `rating`：留空或使用 `1/5` 到 `5/5`，支持半星；表示与你当前研究的相关性，而非论文绝对质量。
- `status`：`To read`、`Reading`、`Read` 或 `Revisit`。
- `keywords`：最多三个关键词，使用中文分号 `；` 分隔。
- `summary`：只陈述论文做了什么；`why_it_matters`：记录它对你的 front-end 研究有什么用。
- `notes_target`：可选的笔记路径，仅用于私人知识库路由，不会进入公开网页 JSON。

## 建议阅读路径

1. 先用 MFCC、PLP、RASTA 和 PNCC 建立传统特征与鲁棒性直觉。
2. 用 SincNet、LEAF、Conv-TasNet 理解“固定分析前端”如何转向可学习表示。
3. 按 WPE → 神经波束形成 → DCCRN / FullSubNet → SepFormer 梳理复杂声学条件下的处理链。
4. 用 wav2vec 2.0、HuBERT、WavLM 比较不同自监督目标，再通过 SUPERB 检查跨任务迁移。
5. 最后用 DNS Challenge、VoiceFilter-Lite、DeepFilterNet2 补齐真实噪声、主观评价、延迟和设备端约束。

## 下一步收录模板

每加入一篇论文，至少回答四件事：

1. 它处在 front-end pipeline 的哪一段？
2. 它替换或补充了哪个经典模块？
3. 主要证据来自什么数据、指标与部署条件？
4. 对当前研究最值得复现的一个结论是什么？
