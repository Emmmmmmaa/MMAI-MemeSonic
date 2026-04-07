# Homework 3: Fine-Tuning Vision-Language Models for Meme Classification

**Course:** MAS.S60 / 6.S985 — Modeling: MultiModal AI (MIT, Spring 2026)

## Overview

This assignment explores Vision-Language Models (VLMs) through hands-on fine-tuning on a meme communicative intention classification task. Given a meme image, the model must classify its intent as one of: **Interactive, Expressive, Entertaining, Offensive, or Other**.

## Dataset

**Source:** [`Emmaruyi/met-meme-filtered`](https://huggingface.co/datasets/Emmaruyi/met-meme-filtered) (Hugging Face)

- Format: JSONL with image-text pairs
- Split: `mmai-data/train/` for training, `mmai-data/test/` for evaluation 

**Sample test entry:**
```json
{"image": "images/0001.jpg", "question": "What is the communicative intention of this meme? ...", "answer": "Expressive"}
```

### Example Test Images

| Image | Label |
|-------|-------|
| ![0001](img/0001.jpg) | Expressive |
| ![0000](img/0000.jpg) | Entertaining |
| ![0005](img/0005.jpg) | Offensive |

## Model

**[Qwen2.5-VL-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct)** — a 3B-parameter Vision-Language Model from Alibaba, fine-tuned via **LoRA** (Low-Rank Adaptation) using the PEFT library.

- Total parameters: 3,756,466,176
- Trainable (LoRA): 1,843,200 — **only 0.049% of total**


### VLM Fine-Tuning

**Problem 2: Dataset Preparation**
Download and format the meme dataset; convert non-image entries to valid inputs.

**Problem 3: Baseline Inference**
Load `Qwen2.5-VL-3B-Instruct` and run zero-shot inference on 4 held-out meme images.

**Problem 4: Prompt Engineering**
Test 4 prompting strategies on the same image (ground truth: *Expressive*):

| Strategy | Prediction | Correct? |
|---|---|---|
| Baseline | Expressive | ✓ |
| Format-restriction | Expressive | ✓ |
| Few-shot | Entertaining | ✗ |
| Chain-of-thought | Expressive | ✓ |

> **Finding:** Simple clear instructions work best; few-shot examples can mislead if they don't match the target.

**Problem 5: LoRA Fine-Tuning**

Best hyperparameter configuration:

| Hyperparameter | Value |
|---|---|
| `LORA_R` | 16 |
| `LORA_ALPHA` | 32 |
| `target_modules` | `q_proj, k_proj, v_proj, o_proj` |
| Learning rate | 1e-3 |
| Batch size | 4 |
| Epochs | 5 |

Training loss converged to **~0.46**.

> **Key finding:** `LORA_TARGET` (which attention layers to adapt) had the most impact. Adapting all four attention projections outperformed partial configurations.

**Problem 6: Post-Training Evaluation**
Load saved LoRA adapters and compare pre-trained vs. fine-tuned predictions on held-out images.
