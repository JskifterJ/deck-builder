---
title: Asset-Light GPU Compute Platforms
theme: academic-defence
logo: SMT · Master's Defence
---

<!-- layout: title -->

# Asset-Light GPU Compute Platforms and Workload-Aware Routing

## Master's Thesis Defence — MSc Management of Technology

- Johannes Skifter
- Academic supervisor: Olivier Gallay (UNIL-HEC)
- Company supervisor: Sebastian Pfeiffer
- EPFL · August 2026

<!-- note:
Good morning, and thank you for being here. I'm Johannes Skifter, and today I'll defend my thesis on asset-light GPU compute platforms.
Aim for ~20 minutes, leaving room for questions. Breathe. Start the timer.
-->

---

<!-- layout: content -->

# Agenda

1. The problem: why GPU access is mispriced
2. Research question and scope
3. Method
4. Findings
5. Contribution and limitations

<!-- note: Keep this to 20 seconds. Signpost the three findings you want them to remember. -->

---

<!-- layout: section -->

### Part One

# The problem: capacity exists, access does not

<!-- note: This is the motivating puzzle. Utilisation is low yet buyers are rationed. -->

---

<!-- layout: content -->

# GPU capacity is abundant but poorly routed

- Reported cluster utilisation sits well below nameplate capacity
- Buyers still face queues, minimum commitments, and regional lock-in
- The gap is not silicon — it is **allocation and pricing**

<div class="callout">A routing problem, not a supply problem: the same GPU-hour is worth very different amounts to different workloads at different times.</div>

<!-- note:
Anchor the "abundant but poorly routed" line — it's the thesis in one sentence.
If asked for the utilisation figure, cite your source slide, don't improvise a number.
-->

---

<!-- layout: content -->

# Research question

## How can an asset-light platform capture value by routing workloads across third-party GPU capacity?

- **RQ1** — What pricing signals separate workloads by willingness-to-pay?
- **RQ2** — Under what conditions is asset-light routing defensible against integrated clouds?

<!-- note: Read RQ1 and RQ2 slowly. These frame everything the committee will grade you on. -->

---

<!-- layout: two-col -->

# Method

- Qualitative-dominant, mixed design
- 14 semi-structured interviews with operators and buyers
- Coded against a routing-value framework
<!-- col -->
- Secondary pricing data from public GPU marketplaces
- Two illustrative routing scenarios
- Triangulated across sources before any claim

<!-- note: Emphasise triangulation — pre-empt the "n=14 is small" question by stressing depth over breadth. -->

---

<!-- layout: content -->

# Finding 1 — Willingness-to-pay splits by latency tolerance

<div class="grid-3">
  <div class="card"><h4>Interruptible</h4><p>Batch training tolerant to preemption — lowest price, highest routability.</p></div>
  <div class="card"><h4>Deferrable</h4><p>Fine-tuning with soft deadlines — mid price, time-shiftable.</p></div>
  <div class="card card-accent"><h4>Real-time</h4><p>Inference with SLAs — highest price, least routable.</p></div>
</div>

<p class="step">The platform's margin comes from matching interruptible supply to deferrable demand.</p>

<!-- note: Click to reveal the margin sentence only after you've walked the three cards. -->

---

<!-- layout: table -->

# Finding 2 — Where asset-light wins and loses

| Condition | Integrated cloud | Asset-light router |
|---|---|---|
| Guaranteed SLA, single region | Strong | Weak |
| Bursty, price-sensitive demand | Weak | Strong |
| Multi-provider arbitrage | Absent | Core advantage |
| Capital intensity | High | Low |

<!-- note: The defensibility answer to RQ2 lives in rows 2 and 3. -->

---

<!-- layout: quote -->

> "We don't lack GPUs. We lack a way to sell the hour that would otherwise go idle."

Operator interview · anonymised

<!-- note: Let this sit for a beat. It's your strongest piece of evidence for the routing thesis. -->

---

<!-- layout: content -->

# Contribution and limitations

- **Contribution** — a routing-value framework linking workload latency tolerance to platform margin
- **Limitation** — single-period scenarios; no dynamic pricing model
- **Further work** — simulate routing under volatile spot prices

<!-- note: Name the limitations before the committee does. It reads as rigour, not weakness. -->

---

<!-- layout: references -->

# Selected references

- Author, A. (2025). *Title of the key source.* Journal, vol(iss), pp.
- Author, B., & Author, C. (2024). *Another source.* Publisher.
- Marketplace pricing data, retrieved 2026, from [source].
- Replace these with your Zotero-exported entries before submission.

<!-- note: These are placeholders — export the real list from Zotero and check every byline. -->

---

<!-- layout: thanks -->

# Thank you

- Questions welcome
- johannes.skifter@epfl.ch

<!-- note: Stop the timer mentally. Invite questions calmly. You know this material better than anyone in the room. -->
