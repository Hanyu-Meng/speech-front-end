# Speech Front-End 研究地图

[交互式网站](https://hanyu-meng.github.io/speech-front-end/) · [维护说明](EDITING.md) · [编辑原始数据](https://github.com/Hanyu-Meng/speech-front-end/edit/main/data/literature.csv)

聚焦 2020—2025 年的四类语音前端任务：语音增强（SE）、目标说话人提取（TSE）、去混响（DR）与声学回声消除（AEC）。目录按生成式 / 非生成式范式以及单通道、多通道、移动说话人、双耳、助听器、流式等场景交叉组织。

> `data/literature.csv` 是唯一数据源。README 表格与网页 JSON 由脚本生成，请勿直接修改生成区域。

## 这版整理回答什么

- 各任务的输入条件、主流架构与典型失败方式有什么不同。
- 扩散、score-based、语音语言模型、flow matching 等生成式路线解决了什么，又带来哪些保真与延迟风险。
- 时域提取、复数谱映射、全带 / 子带建模、神经波束形成、FCP 和神经后滤波等非生成式路线如何组合。
- 为什么 SI-SDR、PESQ、STOI、DNSMOS、SRMR、ERLE、AECMOS、WER、HASPI / HASQI 和实时指标必须成组使用。

网站的“方法脉络”和“指标地图”提供中文综述；每张论文卡进一步列出架构、局限、指标以及论文 / 代码 / Demo 入口。

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
| 2022<br>ICASSP 2022 | Speech Enhancement | Generative<br>Conditional diffusion | Single-channel<br>General | Conditional Diffusion Probabilistic Model for Speech Enhancement | [paper](https://arxiv.org/abs/2202.05256) |
| 2023<br>IEEE/ACM TASLP 2023 | Speech Enhancement · Dereverberation | Generative<br>Score-based diffusion | Single-channel<br>General · Noisy-reverberant | Speech Enhancement and Dereverberation with Diffusion-based Generative Models | [paper](https://arxiv.org/abs/2208.05830) · [code](https://github.com/sp-uhh/sgmse) |
| 2023<br>IEEE/ACM TASLP 2023 | Speech Enhancement · Dereverberation | Hybrid<br>Predict-then-diffuse | Single-channel<br>General · Noisy-reverberant | StoRM: A Diffusion-based Stochastic Regeneration Model for Speech Enhancement and Dereverberation | [paper](https://arxiv.org/abs/2212.11851) · [demo](https://uhh.de/inf-sp-storm) |
| 2023<br>arXiv 2023 | Speech Enhancement | Generative<br>Consistency / Brownian bridge | Single-channel<br>General · Downstream ASR | SE-Bridge: Speech Enhancement with Consistent Brownian Bridge | [paper](https://arxiv.org/abs/2305.13796) |
| 2024<br>arXiv 2024 | Speech Enhancement | Hybrid<br>Predictive latent + diffusion | Single-channel<br>General | Extract and Diffuse: Latent Integration for Improved Diffusion-based Speech and Vocal Enhancement | [paper](https://arxiv.org/abs/2409.09642) |
| 2024<br>ICASSP 2024 | Speech Enhancement | Generative<br>Speech language model | Single-channel<br>General · Offline | SELM: Speech Enhancement Using Discrete Tokens and Language Models | [paper](https://arxiv.org/abs/2312.09747) · [demo](https://honee-w.github.io/SELM/) |
| 2023<br>arXiv 2023 | Speech Enhancement | Generative<br>Flow matching | Single-channel<br>General · Large-scale pretraining | Generative Pre-training for Speech with Flow Matching | [paper](https://arxiv.org/abs/2310.16338) |
| 2025<br>Interspeech 2025 | Speech Enhancement | Generative<br>Flow matching | Single-channel<br>General · Optional text | FlowSE: Efficient and High-Quality Speech Enhancement via Flow Matching | [paper](https://arxiv.org/abs/2505.19476) · [code](https://github.com/Honee-W/FlowSE) |
| 2022<br>Interspeech 2022 | Speech Enhancement | Generative<br>Metric-guided GAN | Single-channel<br>General | CMGAN: Conformer-based Metric GAN for Speech Enhancement | [paper](https://arxiv.org/abs/2203.15149) · [code](https://github.com/ruizhecao96/CMGAN) |
| 2023<br>Interspeech 2023 | Speech Enhancement | Discriminative<br>Magnitude-phase parallel mapping | Single-channel<br>General | MP-SENet: A Speech Enhancement Model with Parallel Denoising of Magnitude and Phase Spectra | [paper](https://arxiv.org/abs/2305.13686) · [code](https://github.com/yxlu-0102/MP-SENet) |
| 2023<br>IEEE/ACM TASLP 2023 | Speech Enhancement · Dereverberation | Discriminative<br>Time-frequency GridNet | Flexible<br>Single-channel · Multi-channel · Noisy-reverberant | TF-GridNet: Integrating Full- and Sub-Band Modeling for Speech Separation | [paper](https://arxiv.org/abs/2211.12433) · [code](https://github.com/espnet/espnet) |
| 2024<br>IEEE/ACM TASLP 2024 | Speech Enhancement · Dereverberation | Discriminative<br>Spatial-spectral neural network | Multi-channel<br>Static · Noisy-reverberant | SpatialNet: Extensively Learning Spatial Information for Multichannel Joint Speech Separation, Denoising and Dereverberation | [paper](https://arxiv.org/abs/2307.16516) · [code](https://github.com/Audio-WestlakeU/NBSS) |
| 2024<br>IEEE SPL 2024 | Speech Enhancement | Discriminative<br>Streaming spatial network | Multi-channel<br>Streaming · Moving speaker · Static | Multichannel Long-Term Streaming Neural Speech Enhancement for Static and Moving Speakers | [paper](https://arxiv.org/abs/2403.07675) · [code](https://github.com/Audio-WestlakeU/NBSS) |
| 2025<br>Interspeech 2025 | Speech Enhancement · Target Speaker Extraction | Discriminative<br>Unified speech restoration system | Flexible<br>General · Deployment · Streaming | ClearerVoice-Studio: Bridging Advanced Speech Processing Research and Practical Deployment | [paper](https://arxiv.org/abs/2506.19398) · [code](https://github.com/modelscope/ClearerVoice-Studio) |
| 2020<br>ICASSP 2020 | Target Speaker Extraction | Discriminative<br>Time-domain speaker extraction | Single-channel<br>Static · Enrollment utterance | SpEx+: A Complete Time Domain Speaker Extraction Network | [paper](https://arxiv.org/abs/2005.04686) · [code](https://github.com/xuchenglin28/speaker_extraction_SpEx) |
| 2020<br>Interspeech 2020 | Target Speaker Extraction | Discriminative<br>Lightweight spectral masking | Single-channel<br>Streaming · On-device · Personalized | VoiceFilter-Lite: Streaming Targeted Voice Separation for On-Device Speech Recognition | [paper](https://arxiv.org/abs/2009.04323) |
| 2023<br>Interspeech 2023 | Target Speaker Extraction | Generative<br>Conditional diffusion | Single-channel<br>Static · Enrollment utterance | Target Speech Extraction with Conditional Diffusion Model | [paper](https://arxiv.org/abs/2308.03987) |
| 2023<br>ASRU 2023 | Target Speaker Extraction | Generative<br>Score-based diffusion | Single-channel<br>Static · Personalized · Enrollment utterance | Conditional Diffusion Model for Target Speaker Extraction | [paper](https://arxiv.org/abs/2310.04791) |
| 2024<br>Interspeech 2024 | Target Speaker Extraction | Discriminative<br>Binaural FaSNet + selective attention | Binaural<br>Binaural · Static · Enrollment utterance | Binaural Selective Attention Model for Target Speaker Extraction | [paper](https://arxiv.org/abs/2406.12236) |
| 2023<br>Clarity CEC2 / ICASSP 2023 | Target Speaker Extraction · Speech Enhancement | Hybrid<br>Neural beamforming + TF-GridNet | Multi-channel<br>Hearing aid · Streaming · Head movement | Multi-Channel Target Speaker Extraction with Refinement: The WavLab Submission to the Second Clarity Enhancement Challenge | [paper](https://arxiv.org/abs/2302.07928) · [demo](https://wavlab.org/activities/2022/clarity2/) |
| 2023<br>WASPAA 2023 | Target Speaker Extraction | Hybrid<br>Beamformer-guided extraction | Multi-channel<br>Static · Direction clue | Beamformer-Guided Target Speaker Extraction | [paper](https://arxiv.org/abs/2303.08702) |
| 2024<br>Interspeech 2024 | Target Speaker Extraction | Discriminative<br>Conv-TasNet + state space model | Single-channel<br>Streaming · On-device · Enrollment utterance | SpeakerBeam-SS: Real-time Target Speaker Extraction with Lightweight Conv-TasNet and State Space Modeling | [paper](https://arxiv.org/abs/2407.01857) |
| 2024<br>IEEE TMM 2024 | Target Speaker Extraction | Discriminative<br>Audio-visual selective attention | Single-channel<br>Audio-visual · Static | Audio-Visual Target Speaker Extraction with Reverse Selective Auditory Attention | [paper](https://arxiv.org/abs/2404.18501) |
| 2025<br>arXiv 2025 | Target Speaker Extraction · Dereverberation | Discriminative<br>Complex-valued HRTF-conditioned network | Binaural<br>Binaural · Static · HRTF clue | Binaural Target Speaker Extraction using HRTFs | [paper](https://arxiv.org/abs/2507.19369) · [demo](https://bi-ctse-hrtf.github.io/) |
| 2021<br>IEEE/ACM TASLP 2022 | Dereverberation | Hybrid<br>Neural forward convolutive prediction | Single-channel<br>Static · Noisy-reverberant | Convolutive Prediction for Monaural Speech Dereverberation and Noisy-Reverberant Speaker Separation | [paper](https://arxiv.org/abs/2108.07376) |
| 2021<br>IEEE/ACM TASLP 2022 | Dereverberation | Hybrid<br>FCP + MVDR beamforming | Multi-channel<br>Static · Noisy-reverberant | Convolutive Prediction for Reverberant Speech Separation | [paper](https://arxiv.org/abs/2108.07194) |
| 2022<br>ICASSP 2022 | Dereverberation | Discriminative<br>Dense recurrent convolutional network | Single-channel<br>Static · Noisy-reverberant | DRC-Net: Densely Connected Recurrent Convolutional Neural Network for Speech Dereverberation | [paper](https://doi.org/10.1109/ICASSP43922.2022.9747111) |
| 2024<br>ICASSP 2024 | Dereverberation | Hybrid<br>Unsupervised neural forward filtering | Multi-channel<br>Static · Unsupervised | USDnet: Unsupervised Speech Dereverberation via Neural Forward Filtering | [paper](https://arxiv.org/abs/2402.00820) |
| 2021<br>Interspeech 2021 | Echo Cancellation | Discriminative<br>Time-domain TCN + LSTM | Single-channel<br>Double-talk · Streaming | EchoFilter: End-to-End Neural Network for Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2105.14666) |
| 2022<br>Interspeech 2022 | Echo Cancellation · Speech Enhancement · Target Speaker Extraction | Discriminative<br>Cross-attention Conformer | Single-channel<br>Streaming · ASR · Missing context | A Universally-Deployable ASR Frontend for Joint Acoustic Echo Cancellation, Speech Enhancement, and Voice Separation | [paper](https://arxiv.org/abs/2209.06410) |
| 2022<br>Interspeech 2022 | Echo Cancellation · Target Speaker Extraction | Discriminative<br>Gated temporal convolution | Single-channel<br>Personalized · Double-talk · Enrollment utterance | Personalized Acoustic Echo Cancellation for Full-duplex Communications | [paper](https://arxiv.org/abs/2205.15195) |
| 2023<br>Interspeech 2023 | Echo Cancellation · Speech Enhancement · Dereverberation | Discriminative<br>Cross-attention CNN-RNN | Single-channel<br>Streaming · Double-talk · Deployment | DeepVQE: Real Time Deep Voice Quality Enhancement for Joint Acoustic Echo Cancellation, Noise Suppression and Dereverberation | [paper](https://arxiv.org/abs/2306.03177) |
| 2024<br>ICASSP 2024 | Echo Cancellation | Generative<br>Fast score-based diffusion | Single-channel<br>Streaming · Double-talk · Edge | FADI-AEC: Fast Score Based Diffusion Model Guided by Far-end Signal for Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2401.04283) |
| 2023<br>ICASSP 2024 | Echo Cancellation · Target Speaker Extraction | Hybrid<br>Two-stage neural post-filter | Single-channel<br>Personalized · Double-talk · Streaming | An Exploration of Task-decoupling on Two-stage Neural Post Filter for Real-time Personalized Acoustic Echo Cancellation | [paper](https://arxiv.org/abs/2310.04715) |
| 2023<br>ICASSP 2023 | Echo Cancellation | Benchmark<br>Challenge benchmark | Single-channel<br>Double-talk · Personalized · 20 ms latency | ICASSP 2023 Acoustic Echo Cancellation Challenge | [paper](https://arxiv.org/abs/2309.12553) · [code](https://github.com/microsoft/AEC-Challenge) |
<!-- catalog:end -->

## 收录原则

1. 以 2020—2025 年论文为主，优先正式发表、开源、挑战优胜或定义新范式的工作。
2. 只收录与四个核心任务直接相关的资料；经典方法通过近期神经混合方法的脉络说明，不再堆积宽泛 front-end 文献。
3. 结论以论文原文、官方代码或挑战资料为依据；`arXiv` 条目明确标注，不把预印本写成已正式发表。
4. 不做主观星级。更值得复现的判断由结构、场景、限制和指标共同支撑。

## 一个实用阅读顺序

1. 先用 MP-SENet、TF-GridNet、SpEx+、DeepVQE 理解四个任务的确定性基线。
2. 再读 CDiffuSE → SGMSE+ → StoRM → SE-Bridge，比较扩散过程和加速方式。
3. 接着看 SELM、SpeechFlow、FlowSE，理解 token LM 与 flow matching 如何改变增强定义。
4. 用 SpatialNet / Online SpatialNet、Binaural Selective Attention、iNeuBe-X 补齐多通道、移动和双耳场景。
5. 最后对照 FCP / USDnet 与 FADI-AEC，观察物理约束和生成先验各自适合的位置。
