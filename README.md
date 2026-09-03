# Speech Front-End 研究地图

[交互式网站](https://hanyu-meng.github.io/speech-front-end/) · [维护说明](EDITING.md) · [编辑原始数据](https://github.com/Hanyu-Meng/speech-front-end/edit/main/data/literature.csv)

聚焦 2023—2026 年的四类语音前端任务：语音增强（SE）、目标说话人提取（TSE）、去混响（DR）与声学回声消除（AEC）。目录按生成式 / 非生成式范式以及单通道、多通道、移动说话人、双耳、助听器、流式等场景交叉组织。当前共 56 篇，其中 31 篇为 2026 年论文或正式会议版本。

> `data/literature.csv` 是唯一数据源。README 表格与网页 JSON 由脚本生成，请勿直接修改生成区域。

## 这版整理回答什么

- 各任务的输入条件、主流架构与典型失败方式有什么不同。
- 扩散、score-based、语音语言模型、flow matching 等生成式路线解决了什么，又带来哪些保真与延迟风险。
- 时域提取、复数谱映射、全带 / 子带建模、神经波束形成、FCP 和神经后滤波等非生成式路线如何组合。
- 为什么 SI-SDR、PESQ、STOI、DNSMOS、SRMR、ERLE、AECMOS、WER、HASPI / HASQI 和实时指标必须成组使用。

网站以可筛选、可排序的紧凑表格为主；“方法对比”和“指标速查”提供中文综述。点击论文标题可查看架构、局限、指标以及论文 / 代码 / Demo 入口。

## 快速使用

```bash
npm run build
npm run check
npm run serve
```

本地访问 `http://localhost:4173`。新增或修改文献时只编辑 `data/literature.csv`，随后运行构建与检查。

网站由远端 `gh-pages` 分支发布；每次网站更新会在推送 `main` 后同步发布该目录。

## 文献索引

一篇论文可以属于多个任务、通道和场景；`Hybrid` 表示显式组合生成 / 判别网络或神经 / 信号处理模块，而不是含糊的“其他”。

<!-- catalog:start -->
| 年份 / Venue | 任务 | 范式 | 通道 / 场景 | 文献 | 入口 |
|---|---|---|---|---|---|
| 2026<br>ICASSP | Speech Enhancement | Benchmark<br>Challenge benchmark | Flexible<br>Universal · Challenge · Multi-distortion | ICASSP 2026 URGENT Speech Enhancement Challenge | [paper](https://arxiv.org/abs/2601.13531) · [demo](https://urgent-challenge.github.io/urgent2026/) |
| 2026<br>ICASSP | Speech Enhancement | Hybrid<br>TF-GridNet + autoregressive fusion | Flexible<br>Universal · Multi-distortion · Variable sample rate | A Hybrid Discriminative and Generative System for Universal Speech Enhancement | [paper](https://arxiv.org/abs/2601.19113) |
| 2026<br>ICASSP | Speech Enhancement | Hybrid<br>Discriminative + codec token prediction | Flexible<br>Universal · Multi-distortion | Hybrid Speech Enhancement with Discriminative and Codec Token Prediction Models Guided by Cleaned SSL Features for the ICASSP 2026 URGENT Challenge | [paper](https://doi.org/10.1109/ICASSP55912.2026.11461676) |
| 2026<br>ICASSP | Speech Enhancement | Hybrid<br>Generative-predictive fusion | Flexible<br>Universal · Bandwidth extension · Multi-distortion | GAP-URGENet: A Generative-Predictive Fusion Framework for Universal Speech Enhancement | [paper](https://arxiv.org/abs/2604.01832) · [demo](https://xiaobin-rong.github.io/gap-urgenet_demo) |
| 2026<br>IEEE/ACM TASLP | Speech Enhancement | Generative<br>SSL representation + vocoder | Flexible<br>Universal · Multi-distortion · Variable sample rate | UniPASE: A Generative Model for Universal Speech Enhancement with High Fidelity and Low Hallucinations | [paper](https://arxiv.org/abs/2604.14606) · [code](https://github.com/xiaobin-rong/unipase/) |
| 2026<br>AAAI | Speech Enhancement · Dereverberation | Generative<br>Multi-metric DPO | Single-channel<br>Restoration · Preference alignment · Singing | Multi-Metric Preference Alignment for Generative Speech Restoration | [paper](https://arxiv.org/abs/2508.17229) · [demo](https://gensr-pref.github.io/) |
| 2026<br>Interspeech | Speech Enhancement | Generative<br>Autoregressive LM + GSPO | Single-channel<br>Restoration · Preference optimization · DNS2020 | Post-Training Speech Enhancement Language Models with Perceptual Rewards | [paper](https://arxiv.org/abs/2606.21458) |
| 2026<br>arXiv | Speech Enhancement | Generative<br>Schrodinger bridge rectified flow | Single-channel<br>Low SNR · One-step · General | SB-RF: Schrödinger Bridge Rectified Flow for One-Step Robust Speech Enhancement | [paper](https://arxiv.org/abs/2606.05575) |
| 2026<br>IWAENC | Speech Enhancement | Generative<br>Codec latent language models | Single-channel<br>Universal · Codec latent · Comparative study | Rethinking Language Model-Based Generative Speech Enhancement in the Latent Space of a Neural Audio Codec | [paper](https://arxiv.org/abs/2608.12082) |
| 2026<br>arXiv | Speech Enhancement | Generative<br>Diffusion posterior refinement | Multi-channel<br>Array-agnostic · Real recordings · Separation | Unified Diffusion Refinement for Multi-Channel Speech Enhancement and Separation | [paper](https://arxiv.org/abs/2603.24810) · [demo](https://xzwy.github.io/Uni-ArrayDPS/) |
| 2026<br>Interspeech | Speech Enhancement | Discriminative<br>Causal TF-Mamba + distillation | Single-channel<br>Streaming · On-device · Long-form | RT-SEMamba: Real-Time Speech Enhancement Mamba via Progressive Knowledge Distillation | [paper](https://arxiv.org/abs/2608.12099) |
| 2026<br>Interspeech | Speech Enhancement | Discriminative<br>Distributed recurrent masking | Binaural<br>Binaural · Hearing aid · Streaming | RT-Tango: Real-Time Distributed Binaural Speech Enhancement for Low-Power Hearing Aid Devices | [paper](https://arxiv.org/abs/2607.01834) |
| 2026<br>Interspeech | Speech Enhancement | Hybrid<br>BMVDR + lightweight network | Binaural<br>Binaural · Open-fit hearing aid · Acoustic leakage | ABSE-NET: A Lightweight Neural Model for Active Binaural Speech Enhancement in Open-Fit Hearing Aids | [paper](https://arxiv.org/abs/2609.00966) · [code](https://github.com/Bream101/ABSE-NET) |
| 2026<br>IWAENC | Speech Enhancement | Discriminative<br>Binaural masking + cue loss | Binaural<br>Binaural · Hearing aid · Cue preservation | A Novel Binaural Cue Preservation Loss for DNN-Based Binaural Speech Enhancement | [paper](https://arxiv.org/abs/2608.16299) |
| 2026<br>arXiv | Target Speaker Extraction | Hybrid<br>Discriminative front-end + decoder-only LM | Single-channel<br>Enrollment utterance · Noisy-reverberant · Codec latent | Discriminative-Generative Target Speaker Extraction with Decoder-Only Language Models | [paper](https://arxiv.org/abs/2601.06006) |
| 2026<br>arXiv | Target Speaker Extraction | Hybrid<br>Masking + one-step flow | Single-channel<br>Enrollment utterance · One-step · Static | Mask2Flow-TSE: Two-Stage Target Speaker Extraction with Masking and Flow Matching | [paper](https://arxiv.org/abs/2603.12837) |
| 2026<br>arXiv | Target Speaker Extraction | Generative<br>Conditional AlphaFlow | Single-channel<br>Enrollment utterance · One-step · Real conversation | AlphaFlowTSE: One-Step Generative Target Speaker Extraction via Conditional AlphaFlow | [paper](https://arxiv.org/abs/2603.10701) |
| 2026<br>arXiv | Target Speaker Extraction | Generative<br>Streaming autoregressive LM | Single-channel<br>Enrollment utterance · Streaming · Long-form | StarTSE: Towards Streaming Target Speaker Extraction via Chunk-wise Interleaved Splicing of Autoregressive Language Model | [paper](https://arxiv.org/abs/2604.19635) |
| 2026<br>Interspeech | Target Speaker Extraction | Discriminative<br>Modular cue-conditioned framework | Flexible<br>Enrollment utterance · Spatial cue · Audio-visual · Text cue | WeSep: A Modular and Cue-Composable Framework for Target Speaker Extraction | [paper](https://arxiv.org/abs/2607.27436) |
| 2026<br>ICASSP | Target Speaker Extraction | Discriminative<br>Folded prompt + split-role attention | Single-channel<br>Enrollment utterance · Noisy-reverberant · Static | LexTra: Folded Prompt and Split-Role Attention for Target Speaker Extraction | [paper](https://doi.org/10.1109/ICASSP55912.2026.11465070) |
| 2026<br>arXiv | Target Speaker Extraction | Discriminative<br>HRTF-conditioned BSS | Binaural<br>Binaural · HRTF clue · Real recordings | HRTF-guided Binaural Target Speaker Extraction with Real-World Validation | [paper](https://arxiv.org/abs/2603.16668) |
| 2026<br>arXiv | Target Speaker Extraction | Discriminative<br>Geometry-conditioned nonlinear filter | Multi-channel<br>Flexible array · DOA clue · Geometry mismatch | Flexible Multi-Channel Target Speaker Extraction Using Geometry-Conditioned Spatially Selective Non-linear Filters | [paper](https://arxiv.org/abs/2605.18442) |
| 2026<br>IWAENC | Target Speaker Extraction · Speech Enhancement | Hybrid<br>Autoregressive neural beamforming | Multi-channel<br>Moving speaker · Dynamic meeting · Ambisonics | Weakly Guided and Autoregressive Beamformer Parameterization for Generalizable Moving Speaker Extraction in Higher-Order Ambisonics | [paper](https://arxiv.org/abs/2607.04471) |
| 2026<br>IEEE SLT Challenge | Target Speaker Extraction | Benchmark<br>Real-world challenge benchmark | Single-channel<br>Real conversation · Streaming · Bilingual | SLT 2026 REAL-TSE Challenge: Real-world Target Speaker Extraction from Conversational Recordings | [paper](https://arxiv.org/abs/2607.15198) |
| 2026<br>arXiv | Dereverberation | Hybrid<br>Reverberant-target training | Single-channel<br>Unsupervised · Real recordings · Static | ARTT: Augmented Reverberant-Target Training for Unsupervised Monaural Speech Dereverberation | [paper](https://arxiv.org/abs/2603.18485) |
| 2026<br>arXiv | Dereverberation | Discriminative<br>Correlation-to-filter network | Single-channel<br>Real recordings · Noisy-reverberant · Far-field | Deep Filter Estimation from Inter-Frame Correlations for Monaural Speech Dereverberation | [paper](https://arxiv.org/abs/2603.14986) |
| 2026<br>Speech Communication | Speech Enhancement · Dereverberation | Discriminative<br>Task-decoupled denoise + dereverb | Multi-channel<br>Noisy-reverberant · Static · Two-stage | DDNet: A Task-Decoupled Two-Stage Network for Multi-Channel Speech Denoising and Dereverberation | [paper](https://doi.org/10.1016/j.specom.2026.103394) |
| 2026<br>ICASSP | Echo Cancellation | Discriminative<br>End-to-end aligned network | Single-channel<br>Streaming · Double-talk · Long delay | E2E-AEC: Implementing an End-to-End Neural Network Learning Approach for Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2601.16774) |
| 2026<br>Interspeech | Echo Cancellation · Speech Enhancement | Hybrid<br>LAEC + multi-path alignment | Single-channel<br>Streaming · Double-talk · On-device | LMPAN: A Lightweight Multi-Path Alignment Network for Joint Full-Duplex Acoustic Echo Cancellation and Noise Suppression | [paper](https://arxiv.org/abs/2607.02062) |
| 2026<br>arXiv | Echo Cancellation | Hybrid<br>Bark-domain LAEC post-filter | Single-channel<br>Streaming · Double-talk · On-device | Echo-Aware Modulation for Compact-Latent Frequency-Time Modeling in Lightweight Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2608.03650) |
| 2026<br>Interspeech | Echo Cancellation · Speech Enhancement | Generative<br>Conditional diffusion VQE | Single-channel<br>Acoustic echo · Noise · Offline | DiffVQE: Hybrid Diffusion Voice Quality Enhancement Under Acoustic Echo and Noise | [paper](https://arxiv.org/abs/2605.08189) |
| 2023<br>IEEE/ACM TASLP | Speech Enhancement · Dereverberation | Generative<br>Score-based diffusion | Single-channel<br>General · Noisy-reverberant | Speech Enhancement and Dereverberation with Diffusion-based Generative Models | [paper](https://arxiv.org/abs/2208.05830) · [code](https://github.com/sp-uhh/sgmse) |
| 2023<br>IEEE/ACM TASLP | Speech Enhancement · Dereverberation | Hybrid<br>Predict-then-diffuse | Single-channel<br>General · Noisy-reverberant | StoRM: A Diffusion-based Stochastic Regeneration Model for Speech Enhancement and Dereverberation | [paper](https://arxiv.org/abs/2212.11851) · [demo](https://uhh.de/inf-sp-storm) |
| 2023<br>arXiv | Speech Enhancement | Generative<br>Consistency / Brownian bridge | Single-channel<br>General · Downstream ASR | SE-Bridge: Speech Enhancement with Consistent Brownian Bridge | [paper](https://arxiv.org/abs/2305.13796) |
| 2024<br>arXiv | Speech Enhancement | Hybrid<br>Predictive latent + diffusion | Single-channel<br>General | Extract and Diffuse: Latent Integration for Improved Diffusion-based Speech and Vocal Enhancement | [paper](https://arxiv.org/abs/2409.09642) |
| 2024<br>ICASSP | Speech Enhancement | Generative<br>Speech language model | Single-channel<br>General · Offline | SELM: Speech Enhancement Using Discrete Tokens and Language Models | [paper](https://arxiv.org/abs/2312.09747) · [demo](https://honee-w.github.io/SELM/) |
| 2023<br>arXiv | Speech Enhancement | Generative<br>Flow matching | Single-channel<br>General · Large-scale pretraining | Generative Pre-training for Speech with Flow Matching | [paper](https://arxiv.org/abs/2310.16338) |
| 2025<br>Interspeech | Speech Enhancement | Generative<br>Flow matching | Single-channel<br>General · Optional text | FlowSE: Efficient and High-Quality Speech Enhancement via Flow Matching | [paper](https://arxiv.org/abs/2505.19476) · [code](https://github.com/Honee-W/FlowSE) |
| 2023<br>Interspeech | Speech Enhancement | Discriminative<br>Magnitude-phase parallel mapping | Single-channel<br>General | MP-SENet: A Speech Enhancement Model with Parallel Denoising of Magnitude and Phase Spectra | [paper](https://arxiv.org/abs/2305.13686) · [code](https://github.com/yxlu-0102/MP-SENet) |
| 2023<br>IEEE/ACM TASLP | Speech Enhancement · Dereverberation | Discriminative<br>Time-frequency GridNet | Flexible<br>Single-channel · Multi-channel · Noisy-reverberant | TF-GridNet: Integrating Full- and Sub-Band Modeling for Speech Separation | [paper](https://arxiv.org/abs/2211.12433) · [code](https://github.com/espnet/espnet) |
| 2024<br>IEEE/ACM TASLP | Speech Enhancement · Dereverberation | Discriminative<br>Spatial-spectral neural network | Multi-channel<br>Static · Noisy-reverberant | SpatialNet: Extensively Learning Spatial Information for Multichannel Joint Speech Separation, Denoising and Dereverberation | [paper](https://arxiv.org/abs/2307.16516) · [code](https://github.com/Audio-WestlakeU/NBSS) |
| 2024<br>IEEE SPL | Speech Enhancement | Discriminative<br>Streaming spatial network | Multi-channel<br>Streaming · Moving speaker · Static | Multichannel Long-Term Streaming Neural Speech Enhancement for Static and Moving Speakers | [paper](https://arxiv.org/abs/2403.07675) · [code](https://github.com/Audio-WestlakeU/NBSS) |
| 2025<br>Interspeech | Speech Enhancement · Target Speaker Extraction | Discriminative<br>Unified speech restoration system | Flexible<br>General · Deployment · Streaming | ClearerVoice-Studio: Bridging Advanced Speech Processing Research and Practical Deployment | [paper](https://arxiv.org/abs/2506.19398) · [code](https://github.com/modelscope/ClearerVoice-Studio) |
| 2023<br>Interspeech | Target Speaker Extraction | Generative<br>Conditional diffusion | Single-channel<br>Static · Enrollment utterance | Target Speech Extraction with Conditional Diffusion Model | [paper](https://arxiv.org/abs/2308.03987) |
| 2023<br>ASRU | Target Speaker Extraction | Generative<br>Score-based diffusion | Single-channel<br>Static · Personalized · Enrollment utterance | Conditional Diffusion Model for Target Speaker Extraction | [paper](https://arxiv.org/abs/2310.04791) |
| 2024<br>Interspeech | Target Speaker Extraction | Discriminative<br>Binaural FaSNet + selective attention | Binaural<br>Binaural · Static · Enrollment utterance | Binaural Selective Attention Model for Target Speaker Extraction | [paper](https://arxiv.org/abs/2406.12236) |
| 2023<br>Clarity CEC2 | Target Speaker Extraction · Speech Enhancement | Hybrid<br>Neural beamforming + TF-GridNet | Multi-channel<br>Hearing aid · Streaming · Head movement | Multi-Channel Target Speaker Extraction with Refinement: The WavLab Submission to the Second Clarity Enhancement Challenge | [paper](https://arxiv.org/abs/2302.07928) |
| 2023<br>WASPAA | Target Speaker Extraction | Hybrid<br>Beamformer-guided extraction | Multi-channel<br>Static · Direction clue | Beamformer-Guided Target Speaker Extraction | [paper](https://arxiv.org/abs/2303.08702) |
| 2024<br>Interspeech | Target Speaker Extraction | Discriminative<br>Conv-TasNet + state space model | Single-channel<br>Streaming · On-device · Enrollment utterance | SpeakerBeam-SS: Real-time Target Speaker Extraction with Lightweight Conv-TasNet and State Space Modeling | [paper](https://arxiv.org/abs/2407.01857) |
| 2024<br>IEEE TMM | Target Speaker Extraction | Discriminative<br>Audio-visual selective attention | Single-channel<br>Audio-visual · Static | Audio-Visual Target Speaker Extraction with Reverse Selective Auditory Attention | [paper](https://arxiv.org/abs/2404.18501) |
| 2025<br>arXiv | Target Speaker Extraction · Dereverberation | Discriminative<br>Complex-valued HRTF-conditioned network | Binaural<br>Binaural · Static · HRTF clue | Binaural Target Speaker Extraction using HRTFs | [paper](https://arxiv.org/abs/2507.19369) · [demo](https://bi-ctse-hrtf.github.io/) |
| 2024<br>ICASSP | Dereverberation | Hybrid<br>Unsupervised neural forward filtering | Multi-channel<br>Static · Unsupervised | USDnet: Unsupervised Speech Dereverberation via Neural Forward Filtering | [paper](https://arxiv.org/abs/2402.00820) |
| 2023<br>Interspeech | Echo Cancellation · Speech Enhancement · Dereverberation | Discriminative<br>Cross-attention CNN-RNN | Single-channel<br>Streaming · Double-talk · Deployment | DeepVQE: Real Time Deep Voice Quality Enhancement for Joint Acoustic Echo Cancellation, Noise Suppression and Dereverberation | [paper](https://arxiv.org/abs/2306.03177) |
| 2024<br>ICASSP | Echo Cancellation | Generative<br>Fast score-based diffusion | Single-channel<br>Streaming · Double-talk · Edge | FADI-AEC: Fast Score Based Diffusion Model Guided by Far-end Signal for Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2401.04283) |
| 2023<br>ICASSP | Echo Cancellation · Target Speaker Extraction | Hybrid<br>Two-stage neural post-filter | Single-channel<br>Personalized · Double-talk · Streaming | An Exploration of Task-decoupling on Two-stage Neural Post Filter for Real-time Personalized Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2310.04715) |
| 2023<br>ICASSP | Echo Cancellation | Benchmark<br>Challenge benchmark | Single-channel<br>Double-talk · Personalized · 20 ms latency | ICASSP 2023 Acoustic Echo Cancellation Challenge | [paper](https://arxiv.org/abs/2309.12553) · [code](https://github.com/microsoft/AEC-Challenge) |
<!-- catalog:end -->

## 收录原则

1. 以 2023—2026 年论文为主；2026 条目系统覆盖 ICASSP、Interspeech、IWAENC、AAAI、TASLP 与同期 arXiv。
2. 只收录与四个核心任务直接相关的资料；经典方法通过近期神经混合方法的脉络说明，不再堆积宽泛 front-end 文献。
3. 结论以论文原文、官方代码或挑战资料为依据；`arXiv` 条目明确标注，不把预印本写成已正式发表。
4. 不做主观星级。更值得复现的判断由结构、场景、限制和指标共同支撑。

最近一次系统检索截止到 **2026-09-03**。2026 年会议归属以 IEEE Xplore、ISCA/论文 arXiv comment、期刊官网或挑战官方材料为准；仅投稿但尚未正式接收的工作统一标为 `arXiv`。

## 一个实用阅读顺序

1. 从 URGENT 2026 challenge 和 REAL-TSE 2026 challenge 看清今年的数据、任务与指标变化。
2. 比较 UniPASE、Post-Training SE LM、SB-RF 与 codec-LM study，理解“低幻觉、偏好后训练、一步生成、连续潜变量”四条生成式主线。
3. 对照 LauraTSE、Mask2Flow-TSE、AlphaFlowTSE 与 StarTSE，观察 TSE 如何从多步扩散走向混合式、一步式和流式生成。
4. 用 RT-Tango、ABSE-NET、HRTF-guided TSE、GC-SSF 与 moving-HOA beamforming 补齐双耳、灵活阵列和移动说话人。
5. 最后看 ARTT / IF-CorrNet 与 E2E-AEC / LMPAN / DiffVQE，比较物理约束、轻量对齐和生成式后处理的边界。
