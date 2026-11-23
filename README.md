# JevRAG Workbench

> A side-by-side evaluation workbench that compares **Naive Vector RAG** against a **3-Stage Jev-Gated Modular RAG** pipeline on the exact same document and user query.

Demonstrates the core advantages of Jev's ("System One" decision model):
- **Hallucination Blocking (Zero-token Short-Circuit)**
- **Contradiction Preservation (Detecting and Prioritizing Refutations)**
- **Calibrated Probabilities**
- **75%+ Prompt Token Savings**

---

## ⚡ Quick Start

### 1. Install & Run
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Zero-Config Demo Mode:** The app runs out of the box with zero external configuration or database setup. If API keys are not supplied, the workbench runs in **Demo Mode**, utilizing calibrated simulations and local vector embeddings so all 3 killer presets work immediately.

---

## 🎯 The 3 Preset Benchmarks

| Preset | Failure Mode in Naive RAG | Jev-Gated Pipeline Resolution |
| :--- | :--- | :--- |
| **Test 1: Missing Info Trap** | Keywords exist in Section 5.1, but meal reimbursement rates are not governed in the handbook. Naive RAG hallucinates ₹500/day. | **Sufficiency Gate blocks generation** with 0 LLM tokens, preventing hallucinated numbers completely. |
| **Test 2: False Premise Test** | User asks why late submissions cost ₹500/day. Naive RAG is confused by other ₹500 fines (library cards) and accepts the premise. | **Stage 2 Contradiction Gate** identifies `contradicts_premise >= 0.60`, forces retention of Section 1.3, and refutes the false premise. |
| **Test 3: Noisy Context Benchmark** | Specific multi-part internship eligibility buried in dense regulations. Naive RAG stuffs 15 noisy chunks (~2,650 tokens). | **Parallel Filter & Rerank** drops 12 noise chunks, feeding only the 3 decisive chunks (saving **~78% prompt tokens**). |

---

## 🏗️ Architecture & 3-Stage Pipeline

### Track A: Naive Vector RAG
1. Embeds the user query.
2. Retrieves the **top 15 chunks** via cosine similarity.
3. Stuffs all 15 chunks directly into the generator prompt without filtering.
4. Suffers from prompt bloat, high cost, and hallucination on missing or contradictory info.

### Track B: 3-Stage Jev-Gated Modular RAG
Structured behind `lib/jev-client.ts` with **5-second fail-open safety** (gracefully degrades to top-5 standard RAG if Jev times out):

1. **Stage 1 — Pre-Retrieval Router (`Choice` + `Noul`):**
   - Categorizes query into `["needs_docs", "chitchat", "out_of_scope"]`.
   - Evaluates query ambiguity with `Noul`.
   - Bypasses retrieval entirely for non-document queries.
2. **Stage 2 — Parallel Filter & Rerank (`Noul` + `Score`):**
   - Retrieves top 15 chunks via vector search.
   - Computes:
     - `is_relevant` (`Noul`)
     - `contradicts_premise` (`Noul`): **Golden Rule: Always preserves chunks where `contradicts_premise >= 0.60`**, even if vector similarity is low.
     - `answer_utility` (`Score`, 0–1 scale)
   - Eliminates noise and retains the **top 3 surviving chunks**.
3. **Stage 3 — Sufficiency Gate (`Noul`):**
   - Evaluates: *"Is the provided evidence strictly sufficient to accurately answer the user's question without guessing?"*
   - Configurable threshold (default `0.70`).
   - **If probability < threshold:** Short-circuits immediately. Generator LLM is NOT called (`llmCalled: false`, `llmTokens: 0`).
   - **If probability >= threshold:** Calls LLM with only the 3 surviving chunks and strict citation constraints.

---

## 🧭 Interactive Workbench Features

1. **Split-Screen Answer Arena:** Direct comparison of answers, tokens, latency, and costs.
2. **Jev Decision Trace Inspector:**
   - Visual gauge for Stage 1 Router and ambiguity.
   - Sortable & filterable Stage 2 Chunk Matrix (Cosine similarity, Jev utility score, Contradiction flag, and Kept vs Dropped status).
   - Visual Stage 3 Sufficiency Meter with threshold line marker.
3. **Document & Chunks Explorer:** Click the active handbook badge to view and filter all indexed chunks with keywords (e.g. `Section 1.3`, `₹500`, `internship`).
4. **Production Scale ROI Calculator:** Compute annual dollar savings at 10K, 50K, 200K, or 1M monthly queries.
5. **Download Evaluation Audit:** Export full comparison traces as structured Markdown reports.

---

## ⚙️ Environment Configuration (Optional)

Create a `.env.local` file (or configure keys directly in the UI **Settings Modal**):

```bash
# TypeSafe AI Jev (System One)
JEV_API_KEY=jev_live_...
JEV_BASE_URL=https://api.typesafe.ai/v1/systemone

# Generator LLM (OpenAI, OpenRouter, or local vLLM/Ollama)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o

# Sufficiency Gate Threshold
SUFFICIENCY_THRESHOLD=0.70
```

---

## 📊 Telemetry & Cost Accounting

- **Jev Pricing Model:** Billed at **$42 per 1 Billion input tokens** ($0.042 / 1M tokens), making high-frequency System One gating dramatically cheaper than LLM prompt bloat.
- **Generator LLM:** Billed at standard GPT-4o tier ($2.50 / 1M input tokens, $10.00 / 1M output tokens).
- Telemetry strip compares total tokens saved, gate status, latency breakdown, and total cost reduction in real time.
