# Grading Rubric Response

This document directly addresses the grading criteria for the Makeup Match project.

---

## 1. Did you apply what we learned in class appropriately to your topic?

**Yes.** The following course concepts are applied to this makeup recommendation project:

### RAG (Retrieval Augmented Generation)
- **Implementation:** `backend/app/services/rag.py`, `backend/scripts/build_rag.py`
- **How it’s used:** A makeup knowledge base (face shapes, skin tones, makeup styles, features) is chunked, embedded with OpenAI `text-embedding-3-small`, and stored in ChromaDB. When a user uploads a photo, we extract face shape, skin tone, and eye type from the Vision output, build a query, and retrieve the top-6 similar chunks. The LLM receives this context plus the face analysis and generates recommendations.
- **Why it fits:** RAG grounds answers in curated makeup knowledge instead of pure generation, improving accuracy and explainability.

### Vision / Multimodal Models
- **Implementation:** `backend/app/services/vision.py`
- **How it’s used:** GPT-4o-mini Vision analyzes the uploaded face photo and returns structured JSON: face shape, skin tone, eye type, and other features.
- **Why it fits:** Vision provides the necessary face analysis input for the RAG query and for the recommendation prompt.

### LLM + Prompt Engineering
- **Implementation:** `backend/app/services/vision.py`, `backend/app/services/recommendation.py`
- **How it’s used:** 
  - Vision prompt: structured JSON output, instructions for when to use “unable to determine.”
  - Recommendation prompt: system prompt defines tone, required structure, and responsible-AI instructions; user prompt includes face analysis and RAG context.
- **Why it fits:** Prompts control format, tone, and adherence to knowledge base and inclusive recommendations.

### Responsible AI
- **Implementation:** Across codebase and prompts.
- **Privacy:** Photos are used only for analysis; they are not saved. Stated in the frontend footer (`frontend/src/App.jsx`).
- **Bias:** Knowledge base covers many face shapes and skin tones; recommendation prompt includes “Be inclusive; avoid stereotypes” (`recommendation.py`).
- **Explainability:** Recommendations must cite face analysis and knowledge base (prompt: “Cite both the face analysis and knowledge base explicitly”). RAG source count is shown to users (`rag_sources_count`).
- **Safety:** File type validation (jpeg/png/webp), size limit (5MB), and error handling in `main.py`.

---

## 2. How did you use AI to build your project?

AI was used extensively to develop this project.

### AI-Assisted Development
- **Cursor / AI pair programming:** Used for scaffolding the project, writing backend services (FastAPI, RAG, Vision), and implementing the frontend (React, Vite, Tailwind). AI helped with boilerplate, error handling, and wiring components together.
- **Prompt design:** AI-assisted iteration on Vision and recommendation prompts (e.g., reducing “unable to determine” when glasses are present).
- **Debugging:** AI used to diagnose API integration issues, ChromaDB setup, and CORS configuration.
- **Translations and copy:** AI translated the project from Chinese to English and refined UI copy.
- **Styling:** AI helped design the frontend palette (cream, blush, sage, terracotta), layout, and animations.

### AI Models in the Product
- **GPT-4o-mini (Vision):** Face analysis.
- **text-embedding-3-small:** RAG embeddings.
- **GPT-4o:** Final recommendation generation from face analysis and RAG context.

### Summary
Both the **development process** and the **product itself** rely on AI. The product uses RAG, Vision, and LLMs as taught in class; the build process used AI coding tools throughout.
