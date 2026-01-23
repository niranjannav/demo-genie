# NeuroReel Studio

**Project Codename:** NeuroReel Studio  
**Status:** MVP - High Priority / Executing  
**Date:** October 26, 2023

## Executive Summary

NeuroReel Studio is an **AI-native platform** that democratizes the creation of high-fidelity, short-form educational video content. We occupy the middle ground between cheap, low-quality automated videos and expensive manual editing tools.

**User Promise:** *"Give us your messy documents and a rough idea; we'll give you a polished, 60-second TikTok/Reel-style explainer video that looks like it took days to make."*

### Key Guardrails (Must-Haves)
-  **Aggressive Cost Optimization:** < $0.10 per 60-second video at scale
-  **Remotion as Core Engine:** React for Video (not a custom rendering engine)
-  **High Fidelity, Short Duration:** 30-90 second outputs prioritizing visual quality
-  **Multi-Modal Ingestion:** Convert PDFs, text, images → structured JSON → video

---

## System Architecture

```
User Input (Docs, Prompts)
    ↓
Stage 1: Ingestion & RAG
    ├─ Doc Parsing (Unstructured/LlamaParse)
    └─ Vector DB (Pinecone/Weaviate)
    ↓
Stage 2: Director Agent (LLM)
    ├─ Retrieval-Augmented Generation
    └─ Storyboard JSON Generation
    ↓
Stage 3: Asset Generation
    ├─ Image Gen (fal.ai / Replicate)
    └─ TTS Audio (ElevenLabs / OpenAI)
    ↓
Stage 4: Composition & Rendering
    ├─ Remotion Agent Layer
    └─ Remotion Serverless Lambda Render
    ↓
Final Output: MP4 Video (S3)
```

---

## Core Modules

### **Module 1: Ingestion Engine**
- Accept PDFs, PPTX, DOCX, images, URLs
- Advanced parsing with hierarchy preservation
- OCR for image text; Whisper for audio transcription
- Semantic chunking and vector indexing

### **Module 2: Director Agent & Storyboarder**
- **The Core IP:** LLM-driven storyboard generation
- RAG-based script writing (~150 words per video)
- Visual planning per scene (images, typography, transitions)
- Structured JSON output (validated storyboard schema)

### **Module 3: Asset Generation**
- Image generation aggregation layer (multi-model support)
- Caching for identical prompts
- TTS audio generation with S3 linking
- Cost-optimized model routing

### **Module 4: Remotion Agent & Composition**
- Parameterized Remotion React components library
- Dynamic timeline based on TTS duration
- Programmatic transition mapping
- **Rendering:** Remotion Lambda (serverless, cost-effective)

### **Module 5: User Experience & Editor**
- Linear timeline editor with scene cards
- Inline text editing → auto-regenerates TTS
- Image regeneration and asset swapping
- Quick preview (browser) and 4K export (Lambda)

---

## Recommended Tech Stack

| Area | Technology | Rationale |
|------|-----------|-----------|
| **Frontend** | Next.js, React, Tailwind CSS | Speed, integrates with Remotion |
| **State Management** | Zustand / Jotai | Better than Context API for complex UI |
| **Video Engine** | Remotion | Programmatic React-based video |
| **Backend API** | Python (FastAPI) or Node.js (NestJS/Hono) | Python preferred for AI/RAG |
| **Database** | PostgreSQL (Supabase) + pgvector | Relational + vector embeddings |
| **LLM Orchestration** | LangChain or custom | Managing multi-step AI flows |
| **LLM Model** | Claude 3 Haiku / Llama 3 (Groq) | Speed/cost/intelligence balance |
| **Image Gen API** | fal.ai | Abstraction layer for SDXL/Nano models |
| **Rendering Infra** | Remotion Lambda (AWS) | Serverless, cost-effective scaling |
| **File Storage** | AWS S3 | Industry standard |

---

## Next Steps

- [ ] **Backend Team:** Prove RAG pipeline. Upload 20-page PDF → retrieve accurate answers
- [ ] **AI/Prompt Team:** Develop Director Agent. Generate reliable, validated JSON storyboards
- [ ] **Frontend/Remotion Team:** Build 10 standard edu-video components (Kinetic Title, Split Screen, Bullet List, etc.)
- [ ] **Design Team:** Map Scene Card editor UX. Make JSON editing intuitive for non-technical users

---

## Notes

- **Interactive Games (MVP):** Out of scope. Phase 2 feature. MVP focuses on pause-and-ponder and end-card quiz formats.
- **Video Duration:** Optimized for 30-90 seconds (short-form educational content).
- **Cost Target:** Entire pipeline (LLM + Image Gen + Rendering) < $0.10 per video.
