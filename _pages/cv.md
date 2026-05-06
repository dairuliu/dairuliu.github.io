---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

[Download CV as PDF]({{ base_path }}/files/DairuLiu_CV.pdf)

Education
======
* **Nankai University**, Tianjin, China
  * B.Eng. in Software Engineering; GPA: 3.75; Top 15%
  * Sep. 2023 -- Jun. 2027 (expected)

* **The Affiliated High School of Peking University**, Beijing, China

Research Interests
======
My primary research goal is to leverage large-scale data to build generalizable embodied agents capable of performing diverse real world tasks. I am particularly interested in **Robot Learning** (scaling up robot data, efficient robot learning algorithms, humanoid whole-body control, loco-manipulation) and **Multimodal Reasoning** (agentic perception, cross-modal understanding, long-horizon decision making).

Publications
======
1. **HumanTracker: Towards Comprehensive and Human-Aligned Motion Tracking Benchmark**
   * _Dairu Liu\*, Zekun Qi\*, Jiayu Zeng\*, Yu Guan, Chenghuai Lin, Xuchuan Chen, Xinqiang Yu, Wenyao Zhang, He Wang, Li Yi_
   * **ECCV 2026** (Score: 4.33/6.0; Top 2% Submission)
   * Built a standardized humanoid motion tracking benchmark with 150 hours of newly captured optical mocap from 24 professional performers, comprising 24K clips organized into 4 motion families for fine-grained diagnosis.
   * Proposed **HumanScore**, a preference-aligned reward model trained on 3K pairwise human comparisons; achieves 0.8834 alignment rate with human judgments, outperforming MPJPE (0.8164), and validated on Unitree G1 real-robot deployment.

2. **Thinking with Visual Abstract: Enhancing Multimodal Reasoning via Visual Abstraction** [[Paper](https://arxiv.org/abs/2505.20164)] [[Project](https://github.com/THUNLP-MT/VAT)]
   * _Dairu Liu\*, Ziyue Wang\*, Minyuan Ruan\*, Fuwen Luo, Chi Chen, Peng Li, Yang Liu_
   * **COLM 2026 Under Review**; **NeurIPS 2025 Workshop**
   * Proposed **Visual Abstract Thinking (VAT)**, a reasoning paradigm that replaces verbose verbal CoT with visual abstractions, focusing models on semantic, structural, and geometric cues.
   * VAT achieves +2.21% average gain over the GPT-5 baseline, exceeding CoT (+0.96%); uses only 0.68x CoT runtime and 0.1x the tokens of Visual Sketchpad on GPT-4o. RL-trained VAT further gains +4.52% on Qwen-2.5-VL-3B.

3. **LIMMT: Less is More for Motion Tracking**
   * _Yu Guan\*, Zekun Qi\*, Chenghuai Lin, Dairu Liu, Xuchuan Chen, Wenyao Zhang, Jilong Wang, Xinqiang Yu, He Wang, Li Yi_
   * **ICML 2026**
   * First data centric study for humanoid motion tracking: General Quality Selection (GQS) scores motion along physics feasibility, diversity (HME embeddings), and complexity, then selects compact subsets via complexity-weighted farthest-point sampling.
   * Showed a strong less-is-more effect: training on approximately 3% of AMASS can outperform the full corpus across trackers (e.g., Any2Track, TWIST2); validated cross-dataset transfer and real-world Unitree G1 deployment without fine-tuning.

4. **Humanoid-GPT: Scaling Data and Structure for Zero-Shot Motion Tracking**
   * _Zekun Qi\*, Xuchuan Chen\*, Jilong Wang\*, Chenghuai Lin\*, Yunrui Lian, Zhikai Zhang, Dairu Liu, Wenyao Zhang, Yu Guan, Xinqiang Yu, He Wang, Li Yi_
   * **CVPR 2026**
   * Introduced **Humanoid-GPT**, a GPT style causal Transformer trained on an approximately 2B-frame retargeted motion corpus, distilling hundreds of RL motion experts via DAgger into a single general motion tracker with strong zero-shot generalization on Unitree G1.
   * Proposed **Harmonic Motion Embedding (HME)** for diversity-aware, distribution-balanced sampling; characterized scaling trends for data and model size and deployed with real-time inference (ONNX/TensorRT, <1.5 ms on RTX 4090).

5. **Evaluating Time Awareness and Cross-modal Active Perception of Large Models via 4D Escape Room Task**
   * _Yurui Dong\*, Ziyue Wang\*, Shuyun Lu\*, Dairu Liu\*, Xuechen Liu\*, Fuwen Luo, Peng Li, Yang Liu_
   * **EMNLP 2026 Under Review**
   * Developed **EscapeCraft-4D**, a customizable 4D escape-room benchmark (66 scenes, 1,032 objects) incorporating trigger-based audio, misleading auditory distractors, and temporally transient clues for evaluating time-aware multimodal reasoning.
   * Introduced 4D specific process level metrics beyond final success rate: AMR (Audio Misleading Rate) and TCSS (Transient Clue Seeing Speed), revealing significant modality bias and failures in time-conditioned decision making across Omni models.

Research Experience
======
* **Research Intern, GALBOT | IIIS, Tsinghua University**, Beijing, China (Dec. 2025 -- Present)
  * Advisor: Prof. **Li Yi**
  * Built a large-scale humanoid motion tracking benchmark and proposed a preference-aligned reward model for whole-body control evaluation, addressing the misalignment between kinematic metrics and human perception. [1]

* **Research Intern, THUNLP | AIR, Tsinghua University**, Beijing, China (Apr. 2024 -- Present)
  * Advisor: Prof. **Peng Li**, Prof. **Yang Liu**
  * Proposed Visual Abstract Thinking, a novel multimodal reasoning paradigm that enhances MLLMs via visual abstraction rather than verbose verbal rationales. [2]
  * Developed a 4D escape-room benchmark for evaluating time awareness and cross-modal active perception in Omni models. [5]
  * Exploring self-evolving agents that generalize from weak to strong supervision.

Awards
======
* **National Scholarship** (Top 0.2%; Undergraduate, 10000CNY), Sep. 2024
* **Second Prize**, NOIP 2018 (National Olympiad in Informatics in Provinces), Dec. 2018
* **Second Prize**, CSP-S 2019 (CCF Certified Software Professional), Dec. 2019

Leadership and Services
======
* **Vice President**, Quantitative Finance & Investment Society, Nankai University (Sep. 2025 -- Present)
* **Member**, University Ski Team, Nankai University (2024 -- 2025)
* **Academic Department Vice-Head**, Psychology Association, Nankai University (Sep. 2024 -- Sep. 2025)

Skills
======
* **Robot Platforms**: Unitree G1
* **Programming**: C++, Python, MATLAB, LaTeX
* **Languages**: Mandarin Chinese (native); English (IELTS 7.0: L 7.5, R 8.0, S 6.0, W 6.0; CET-6 608)
* **Interests**: Skiing
