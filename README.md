# MemeSonic

**MemeSonic: Giving Memes a Voice Through Affective Multimodal Generation**

> A multimodal prototype that interprets the mood and meaning of a meme image and generates matching expressive audio.
![System Overview](img/pipeline_figure.png)

---
## What is MemeSonic?

Internet memes are multimodal expressions where meaning depends on the interplay of image, text, and implicit cultural context. Yet memes remain silent — their tone, irony, and affect exist only in the reader's head.

MemeSonic gives memes a voice. Given a static meme image, the system:

1. **Interprets** the meme's mood, tone, and meaning using a multimodal LLM
2. **Surfaces** that interpretation as an explicit, human-readable intermediate layer (e.g., sentiment tag, voice script)
3. **Generates** expressive voice-based audio that matches how the meme is read

Rather than hiding interpretation inside a latent space, MemeSonic makes affective reading visible and steerable — the same intermediate layer can also support mood-based meme retrieval.

---

## Demo

The prototype is powered by Gemini Multimodal. Upload a meme image, and MemeSonic analyzes its tone and generates a matching voiceover.

| Step | Description |
|------|-------------|
| **1. Upload** | Select a meme image or choose from quick presets |
| **2. Analyze** | Gemini interprets the meme's mood, tone, and meaning |
| **3. Generate** | The system produces a sentiment tag, voice script, and audio |

**Example output:**

- **Input:** Doge side-eye meme
- **Detected mood:** `SARCASTIC`
- **Voice script:** *"Much wow. Very side eye. So judge."*
- **Output:** Expressive audio matching the sarcastic tone

---

**Gaps**
- Existing models struggle to decode semantic irony and cultural nuance in memes
- Dynamic meme generation, especially the acoustic dimension, remains largely unaddressed

**Applications**
- Automatic audio generation for memes conditioned on visual + textual content
- Text-based retrieval of audio-enriched memes

**Pipeline**

![MemeSonic Pipeline](img/meme%20pipeline.png)

- **Multimodal sentiment fusion** — visual + textual encodings → structured affective representation
- **Sentiment-conditioned audio generation** — audio reflecting the meme's intent (irony, absurdity, triumph)
- **Cross-modal alignment** — vision–language–audio alignment as training objective and evaluation criterion
- **Retrieval** — text-based lookup returning memes with generated audio

**Current Challenges**
- Irony and cultural nuance remain hard for vision-language models to capture
- No large-scale labeled dataset for meme sentiment with audio; we construct our own
- Cross-modal alignment across three modalities is technically demanding and hard to evaluate

---

## Homeworks

| | Topic | Link |
|---|---|---|
| HW1 | **`music+motion`** Music & Motion Data Preparation | [homework/homework1/](homework/homework1/README.md) |
| HW2 | **`meme`** Meme Fusion and Alignment | [homework/homework2/](homework/homework2/README.md) |
| HW3 | **`meme`** Meme LLM Fine-tuning | [homework/homework3/](homework/homework3/README.md) |
