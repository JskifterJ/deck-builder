---
theme: ./theme
title: Asset-Light GPU Compute Platforms
info: Master's thesis defence — worked example for slidev-theme-academic
transition: fade
mdc: true
layout: cover
---

# Asset-Light GPU Compute Platforms and Workload-Aware Routing

## Master's Thesis Defence · MSc Management of Technology

- Johannes Skifter
- Academic supervisor — Olivier Gallay (UNIL-HEC)
- Company supervisor — Sebastian Pfeiffer
- EPFL · August 2026

<!--
Good morning, and thank you for being here. Aim for ~20 minutes and leave room for questions. Start the timer.
-->

---
layout: default
---

# Agenda

1. The problem: why GPU access is mispriced
2. Research question and scope
3. Method
4. Findings
5. Contribution and limitations

<!-- Keep to 20 seconds. Signpost the three findings you want them to remember. -->

---
layout: section
---

<Kicker>Part One</Kicker>

# The problem: capacity exists, access does not

<!-- The motivating puzzle: utilisation is low, yet buyers are rationed. -->

---
layout: default
---

# GPU capacity is abundant but poorly routed

- Reported cluster utilisation sits well below nameplate capacity [@jeon2019analysis]
- Buyers still face queues, minimum commitments, and regional lock-in
- NVIDIA's debt-backstop financing is reshaping who can hold capacity [@semianalysis2026nvidiabackstop]

<div class="callout">A routing problem, not a supply problem: the same GPU-hour is worth very different amounts to different workloads at different times.</div>

<!-- Anchor the "abundant but poorly routed" line — it's the thesis in one sentence. Defend figures with the source, never improvise. -->

---
layout: default
---

# Research question

## How can an asset-light platform capture value by routing workloads across third-party GPU capacity?

- **RQ1** — What pricing signals separate workloads by willingness-to-pay?
- **RQ2** — Under what conditions is asset-light routing defensible against integrated clouds? [@jacobides2018ecosystems]

<!-- Read RQ1 and RQ2 slowly. These frame everything the committee will grade you on. -->

---
layout: two-cols
---

# Method

- Qualitative-dominant, mixed design
- 14 semi-structured interviews with operators and buyers
- Coded against a routing-value framework

::right::

<div class="mt-12" />

- Secondary pricing data from public GPU marketplaces
- Two illustrative routing scenarios
- Triangulated across sources before any claim

<!-- Emphasise triangulation — pre-empt "n=14 is small" by stressing depth over breadth. -->

---
layout: default
---

# Finding 1 — Willingness-to-pay splits by latency tolerance

<div class="deck-grid cols-3 mt-4">
  <div class="card"><h4>Interruptible</h4><p>Batch training tolerant to preemption — lowest price, highest routability.</p></div>
  <div class="card"><h4>Deferrable</h4><p>Fine-tuning with soft deadlines — mid price, time-shiftable.</p></div>
  <div class="card accent"><h4>Real-time</h4><p>Inference with SLAs — highest price, least routable.</p></div>
</div>

<v-click>

<div class="callout mt-4">The platform's margin comes from matching interruptible supply to deferrable demand [@deschapell2024divergence].</div>

</v-click>

<!-- Click to reveal the margin sentence only after walking the three cards. -->

---
layout: default
---

# Finding 2 — Where asset-light wins and loses

| Condition | Integrated cloud | Asset-light router |
|---|---|---|
| Guaranteed SLA, single region | Strong | Weak |
| Bursty, price-sensitive demand | Weak | **Strong** |
| Multi-provider arbitrage | Absent | **Core advantage** |
| Capital intensity | High | Low |

<div class="src mt-2">Synthesised from operator interviews and pipeline data [@woodmackenzie2026dcpipeline].</div>

<!-- The defensibility answer to RQ2 lives in rows 2 and 3. -->

---
layout: statement
---

> We don't lack GPUs. We lack a way to sell the hour that would otherwise go idle.

<div class="attr">Operator interview · anonymised</div>

<!-- Let this sit for a beat. Strongest evidence for the routing thesis. -->

---
layout: default
---

# The economics in one line

Gross margin per routed GPU-hour:

$$ m \;=\; p_{\text{sell}} \;-\; c_{\text{rent}} \;-\; c_{\text{ops}} $$

Platform take rate, where routing lifts $p_{\text{sell}}$ by matching demand to the cheapest adequate supply:

$$ \tau \;=\; \frac{m}{p_{\text{sell}}} \;=\; 1 - \frac{c_{\text{rent}} + c_{\text{ops}}}{p_{\text{sell}}} $$

<!-- KaTeX renders this identically to the thesis. Walk left to right; don't read the symbols aloud. -->

---
layout: default
---

# Contribution and limitations

- **Contribution** — a routing-value framework linking workload latency tolerance to platform margin [@jacobides2018ecosystems]
- **Limitation** — single-period scenarios; no dynamic pricing model
- **Further work** — simulate routing under volatile spot prices

<!-- Name the limitations before the committee does. It reads as rigour. -->

---
layout: references
---

# Selected references

<References />

<!-- Auto-generated from the .bib — only the keys actually cited in this deck, APA-style, alphabetical. -->

---
layout: end
---

# Thank you

<div class="contact">
Questions welcome<br>
johannes.skifter@epfl.ch
</div>

<!-- Invite questions calmly. You know this material better than anyone in the room. -->
