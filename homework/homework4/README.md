# HW4: GRPO Fine-tuning for Meme Intention Classification

**MAS.S60 / 6.S985 · Spring 2026 · MIT**

Fine-tunes `Qwen/Qwen3-VL-2B-Instruct` on meme intention classification using **Group Relative Policy Optimization (GRPO)** — no critic, no reward model, just rule-based rewards and group-normalized advantages.

---

## Task

Given a meme image, classify its communicative intention:
> Interactive · Expressive · Entertaining · Offensive · Other

Dataset: 120 samples from MET-Meme (same split as HW3), formatted as image + chain-of-thought prompt ending in `Answer:`.

---

## How GRPO Works Here

For each prompt, sample G completions → score each with two rule-based rewards → normalize within the group → update with clipped surrogate loss.

```
rewards = accuracy_reward + format_reward
advantage_i = (r_i - mean(r)) / (std(r) + ε)
```

- **`accuracy_reward`** — 1.0 if extracted answer matches ground truth, else 0.0
- **`format_reward`** — 1.0 if `Answer:` tag is present (keeps gradient non-zero early in training)

No value network. No learned reward model.

---

## Implementation Tests

All unit tests passed before training:

```
Test 1 passed: basic two-group case
Test 2 passed: single-sample group
Test 3 passed: masking
Test 4 passed: Dr. GRPO variant
Test 5 passed: uniform rewards   ← advantage = 0 when all rewards equal

extract_answer:   passed
accuracy_reward:  passed
format_reward:    passed
```

---

## Training

| Parameter | Value |
|---|---|
| Model | Qwen/Qwen3-VL-2B-Instruct |
| Steps | 100 |
| num_generations (G) | default |
| max_completion_length | default |
| KL penalty β | 0.0 (disabled) |
| Runtime | Colab A100 · ~6m 22s |

Training loss is sparse (many zero-loss steps) because when all G completions for a prompt are identically correct or wrong, the group advantage collapses to zero and the gradient vanishes — expected GRPO behavior.

---

## GRPO vs SFT (HW3)

| | SFT / LoRA (HW3) | GRPO (HW4) |
|---|---|---|
| Training signal | Cross-entropy on ground truth | Reward-normalized group advantage |
| Requires labeled answers | Yes | Yes (for accuracy reward) |
| Exploration | None | Implicit via G sampled completions |
| Format compliance | Forced by teacher forcing | Learned via format_reward |
| Convergence | Fast, monotone loss decrease | Sparse gradients, slower signal |

SFT converges faster; GRPO is more robust when ground truth is ambiguous or when the reward cannot be expressed as a next-token probability.

---

## Setup

```bash
pip install trl transformers torch pillow datasets
```

Runtime: Google Colab A100. Load model with `dtype=torch.bfloat16`.
