# CLAUDE.md - AI Assistant Guide for NeuroReel Studio

**Last Updated:** January 23, 2026
**Repository Status:** Specification Phase (Pre-Implementation)
**Project Codename:** NeuroReel Studio

---

## 🎯 Project Overview

**NeuroReel Studio** is an AI-native SaaS platform that democratizes the creation of high-fidelity, short-form educational video content. The platform accepts messy documents and rough ideas, then automatically generates polished 60-second TikTok/Reel-style explainer videos.

**Value Proposition:** Bridge the gap between cheap, low-quality automated videos and expensive manual editing tools.

**Current State:** This repository is in the specification and planning phase. The README.md contains the complete technical specification, but no source code has been implemented yet.

---

## 📁 Repository Structure

### Current Structure
```
demo-genie/
├── .git/                    # Git repository
├── README.md                # Project specification (primary document)
└── CLAUDE.md               # This file - AI assistant guide
```

### Planned Structure (Future Implementation)
```
demo-genie/
├── backend/                 # Python/Node.js backend
│   ├── src/
│   │   ├── ingestion/      # Module 1: Document parsing & RAG
│   │   ├── director/       # Module 2: LLM storyboard generation
│   │   ├── assets/         # Module 3: Image gen & TTS
│   │   ├── composition/    # Module 4: Remotion orchestration
│   │   └── api/            # REST/GraphQL endpoints
│   ├── tests/              # Backend test suite
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js + React application
│   ├── app/               # Next.js 13+ app directory
│   ├── components/        # React components
│   │   ├── editor/       # Timeline editor & scene cards
│   │   └── remotion/     # Remotion video components
│   ├── lib/              # Utilities and helpers
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
├── remotion/              # Remotion video components library
│   ├── compositions/     # 10 standard edu-video components
│   ├── transitions/      # Programmatic transition mappings
│   └── remotion.config.ts
│
├── infrastructure/        # IaC (Terraform/CloudFormation)
│   ├── aws/              # AWS Lambda, S3, etc.
│   └── docker/           # Container configurations
│
├── docs/                 # Project documentation
├── .github/              # GitHub Actions workflows
├── .env.example          # Environment variable template
├── README.md             # Project specification
└── CLAUDE.md            # This file
```

---

## 🏗️ System Architecture

NeuroReel Studio operates as a **4-stage AI pipeline**:

### Stage 1: Ingestion & RAG
- **Input:** PDFs, PPTX, DOCX, images, URLs
- **Processing:** Document parsing, OCR, audio transcription
- **Output:** Vector embeddings in Pinecone/Weaviate
- **Tools:** Unstructured/LlamaParse, Whisper

### Stage 2: Director Agent (Core IP)
- **Input:** RAG-retrieved context + user prompt
- **Processing:** LLM-driven storyboard generation
- **Output:** Structured JSON storyboard (~150 words script)
- **LLM:** Claude 3 Haiku or Llama 3 (Groq)

### Stage 3: Asset Generation
- **Parallel Execution:**
  - Image generation via fal.ai (SDXL/Nano models)
  - TTS audio via ElevenLabs or OpenAI
- **Output:** Images and audio files in S3
- **Optimization:** Prompt caching, cost-optimized routing

### Stage 4: Composition & Rendering
- **Engine:** Remotion (React for Video)
- **Processing:** Parameterized React components + dynamic timeline
- **Rendering:** Serverless AWS Lambda (Remotion Lambda)
- **Output:** MP4 video file in S3

---

## 🛠️ Technology Stack

### Frontend Stack
- **Framework:** Next.js 13+ with App Router
- **UI Library:** React 18+
- **Styling:** Tailwind CSS
- **State Management:** Zustand or Jotai (not Redux)
- **Video Engine:** Remotion
- **Purpose:** Timeline editor with scene cards, inline editing

### Backend Stack
- **Preferred:** Python with FastAPI
- **Alternative:** Node.js with NestJS or Hono
- **Rationale:** Python preferred for AI/RAG orchestration
- **Architecture:** Multi-step workflow management

### Data Layer
- **Database:** PostgreSQL via Supabase
- **Vector Extension:** pgvector for embeddings
- **Vector DB:** Pinecone or Weaviate
- **File Storage:** AWS S3
- **Caching:** Redis (as needed)

### AI & ML
- **LLM Orchestration:** LangChain or custom implementation
- **Primary LLM:** Claude 3 Haiku or Llama 3 (Groq)
- **Reasoning:** Balance of speed, cost, and intelligence
- **Image Generation:** fal.ai API (SDXL/Nano abstraction layer)
- **Text-to-Speech:** ElevenLabs or OpenAI TTS
- **Document Parsing:** Unstructured or LlamaParse
- **OCR/Audio:** Whisper for transcription

### Infrastructure
- **Cloud Provider:** AWS
- **Serverless Rendering:** AWS Lambda (Remotion Lambda)
- **Container Orchestration:** Docker + Lambda
- **IaC:** Terraform or CloudFormation
- **CI/CD:** GitHub Actions

---

## 🎨 Core Modules

### Module 1: Ingestion Engine
**Responsibility:** Multi-modal document processing and vector indexing

**Key Features:**
- Accept PDFs, PPTX, DOCX, images, URLs
- Preserve document hierarchy during parsing
- OCR for image text extraction
- Whisper transcription for audio content
- Semantic chunking and vector indexing

**Implementation Priority:** High (foundational)

### Module 2: Director Agent & Storyboarder ⭐
**Responsibility:** LLM-driven storyboard generation (Core IP)

**Key Features:**
- RAG-based context retrieval
- Script generation (~150 words per video)
- Visual planning per scene (images, typography, transitions)
- Structured JSON output with validated schema
- Ensures consistency and editability

**Implementation Priority:** Critical (unique value proposition)

### Module 3: Asset Generation
**Responsibility:** Image and audio asset creation

**Key Features:**
- Multi-model image generation support
- Prompt caching for cost optimization
- TTS audio generation
- S3 integration for asset storage
- Cost-optimized model routing

**Implementation Priority:** High

### Module 4: Remotion Agent & Composition
**Responsibility:** Video assembly and rendering

**Key Features:**
- Parameterized Remotion React components library
- 10 standard educational video components:
  1. Kinetic Title
  2. Split Screen
  3. Bullet List
  4. (7 more components to be designed)
- Dynamic timeline based on TTS duration
- Programmatic transition mapping
- Lambda-based serverless rendering

**Implementation Priority:** High

### Module 5: User Experience & Editor
**Responsibility:** Frontend interface for video editing

**Key Features:**
- Linear timeline editor with scene cards
- Inline text editing with auto-regenerated TTS
- Image regeneration and asset swapping
- Quick browser preview
- 4K export via Lambda

**Implementation Priority:** Medium (after backend modules)

---

## 🚧 Key Constraints & Guardrails

**These are MANDATORY constraints that must be respected:**

### 1. Cost Optimization (Critical)
- **Target:** < $0.10 per 60-second video at scale
- **Applies to:** Entire pipeline (LLM + Image Gen + TTS + Rendering)
- **Implications:**
  - Use cost-effective LLMs (Haiku, Llama 3)
  - Implement aggressive prompt caching
  - Use serverless rendering (pay per use)
  - Optimize model routing

### 2. Video Engine Mandate
- **Required:** Remotion (React for Video)
- **Prohibited:** Custom rendering engines
- **Rationale:** Leverage React ecosystem, programmatic control
- **Implementation:** All video components must be Remotion-based

### 3. Duration Optimization
- **Target Range:** 30-90 seconds
- **Format:** TikTok/Reel-style short-form content
- **Priority:** Visual quality over length
- **Design:** Optimized for educational explainer videos

### 4. Multi-Modal Ingestion
- **Input Flexibility:** Must accept PDFs, text, images, URLs
- **Processing:** Convert → Structured JSON → Video
- **Quality:** Preserve document hierarchy and context

### 5. MVP Scope Boundaries
- **In Scope:** Pause-and-ponder, end-card quiz formats
- **Out of Scope:** Interactive games (Phase 2 feature)
- **Focus:** Core pipeline and editor experience

### 6. Editor Accessibility
- **Target Users:** Non-technical content creators
- **UX Requirement:** Intuitive scene card interface
- **Editing:** Inline text editing, visual asset swapping
- **Technical Abstraction:** Hide JSON complexity from users

---

## 💻 Development Workflows

### For Backend Development
1. **Start with RAG Pipeline:** Prove PDF upload → accurate retrieval
2. **Develop Director Agent:** Focus on reliable JSON storyboard generation
3. **Validate Schemas:** Ensure strict JSON validation
4. **Implement Caching:** Aggressive caching for cost optimization
5. **Test End-to-End:** Full pipeline from upload to video output

### For Frontend Development
1. **Build Timeline Editor:** Scene card interface first
2. **Create Remotion Components:** Start with 10 standard components
3. **Implement Inline Editing:** Text editing with TTS regeneration
4. **Add Asset Management:** Image regeneration and swapping
5. **Optimize Previews:** Fast browser preview before Lambda export

### For AI/Prompt Engineering
1. **Design Storyboard Schema:** Define JSON structure
2. **Prompt Engineering:** Reliable Director Agent prompts
3. **RAG Optimization:** Improve context retrieval
4. **Cost Monitoring:** Track token usage per video
5. **Quality Validation:** Ensure storyboard consistency

### For Infrastructure/DevOps
1. **Set Up AWS Lambda:** Remotion serverless rendering
2. **Configure S3:** Asset storage and delivery
3. **Implement Monitoring:** Cost and performance tracking
4. **CI/CD Pipeline:** Automated testing and deployment
5. **Environment Management:** Dev, staging, production

---

## 📝 Coding Conventions

### General Principles
- **Simplicity First:** Avoid over-engineering
- **Cost Awareness:** Every API call has a cost implication
- **Type Safety:** Use TypeScript/Python type hints
- **Error Handling:** Graceful degradation, clear error messages
- **Logging:** Structured logging for pipeline debugging

### Python Backend Conventions
```python
# Use type hints
def generate_storyboard(content: str, context: dict) -> StoryboardSchema:
    pass

# Use Pydantic for validation
from pydantic import BaseModel

class Scene(BaseModel):
    duration: float
    script: str
    visual_prompt: str

# Async for I/O-bound operations
async def fetch_embeddings(text: str) -> list[float]:
    pass
```

### TypeScript/React Frontend Conventions
```typescript
// Use functional components with hooks
const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  return <div>{scene.script}</div>;
};

// Use Zustand for state management
const useVideoStore = create<VideoStore>((set) => ({
  scenes: [],
  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
}));

// Remotion component structure
export const KineticTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  // Animation logic
};
```

### Naming Conventions
- **Files:** `kebab-case.ts`, `snake_case.py`
- **Components:** `PascalCase` (React components, Python classes)
- **Functions:** `camelCase` (TypeScript), `snake_case` (Python)
- **Constants:** `UPPER_SNAKE_CASE`
- **Environment Variables:** `UPPER_SNAKE_CASE`

### Git Conventions
- **Branches:** `feature/module-name`, `fix/bug-description`, `claude/session-id`
- **Commits:** Conventional Commits format
  - `feat: add Director Agent storyboard generation`
  - `fix: resolve TTS audio sync issue`
  - `docs: update CLAUDE.md with new conventions`
  - `refactor: optimize RAG retrieval pipeline`
  - `test: add unit tests for storyboard schema`

---

## 🤖 AI Assistant Guidelines

### When Working on This Codebase

#### 1. **Always Read First**
- Read README.md for project specification
- Read this CLAUDE.md for development context
- Read existing code before making changes
- Never propose changes to code you haven't seen

#### 2. **Respect the Constraints**
- **Cost:** Every decision must consider the $0.10/video target
- **Remotion:** Never suggest custom video rendering engines
- **Duration:** Design for 30-90 second videos
- **Scope:** Stay within MVP boundaries

#### 3. **Module Awareness**
- Understand which module you're working in
- Respect module boundaries and responsibilities
- Director Agent (Module 2) is the core IP - treat with care
- Remotion components should be reusable and parameterized

#### 4. **Technology Stack Compliance**
- **Backend:** Python (FastAPI) preferred over Node.js
- **Frontend:** Next.js + React + Tailwind
- **State:** Zustand or Jotai (NOT Redux, NOT Context API)
- **Video:** Remotion (mandatory)
- **LLM:** Claude 3 Haiku or Llama 3 (cost-optimized)

#### 5. **Implementation Priorities**
When asked to implement features, follow this priority order:
1. **Core Pipeline:** Ingestion → Director → Assets → Rendering
2. **Director Agent:** The unique value proposition
3. **Remotion Components:** Standard educational video components
4. **Editor UX:** Scene card interface and inline editing
5. **Polish & Optimization:** Performance, cost reduction

#### 6. **Code Quality Standards**
- Use type hints (Python) and TypeScript (frontend)
- Write unit tests for business logic
- Integration tests for pipeline stages
- Document complex algorithms
- Add inline comments for non-obvious logic

#### 7. **Cost Optimization Mindset**
Always consider:
- Can this LLM call be cached?
- Can we use a cheaper model for this task?
- Are we generating unnecessary assets?
- Can we reuse existing prompts/images?
- Is this Lambda execution optimized?

#### 8. **JSON Schema Validation**
- Director Agent outputs MUST be validated against schema
- Use Pydantic (Python) or Zod (TypeScript) for validation
- Storyboard JSON is the contract between modules
- Never skip schema validation in the pipeline

#### 9. **Error Handling**
- Graceful degradation for AI failures
- Clear error messages for users
- Logging for debugging pipeline issues
- Retry logic for API calls (with exponential backoff)
- Cost tracking for failed attempts

#### 10. **Documentation Requirements**
When implementing:
- Update README.md if architecture changes
- Update this CLAUDE.md if conventions change
- Add inline code documentation
- Document API endpoints (OpenAPI/Swagger)
- Document Remotion component props

### What to Avoid

❌ **Don't:**
- Suggest custom video rendering engines (use Remotion)
- Recommend expensive LLMs (use Haiku or Llama 3)
- Add interactive game features (out of MVP scope)
- Optimize for videos longer than 90 seconds
- Use Redux or Context API for state (use Zustand/Jotai)
- Create unnecessary abstractions
- Skip schema validation
- Ignore cost implications

✅ **Do:**
- Respect the $0.10/video cost target
- Use Remotion for all video components
- Implement aggressive caching
- Focus on 30-90 second educational videos
- Use cost-effective LLMs
- Write simple, maintainable code
- Validate all JSON schemas
- Monitor costs continuously

---

## 🧪 Testing Strategy

### Unit Tests
- **Director Agent:** Prompt engineering, JSON generation
- **RAG Pipeline:** Document parsing, vector retrieval
- **Asset Generation:** Image gen routing, TTS integration
- **Remotion Components:** Component rendering, props validation

### Integration Tests
- **Pipeline Stages:** Ingestion → Director → Assets → Rendering
- **API Endpoints:** Backend API integration
- **Database:** Vector embeddings, data persistence

### End-to-End Tests
- **Full Pipeline:** Document upload → MP4 output
- **Editor Workflow:** Scene editing → regeneration → export
- **Cost Tracking:** Validate < $0.10 per video

### Performance Tests
- **Rendering Speed:** Lambda cold start and execution time
- **RAG Latency:** Vector search and retrieval speed
- **API Response:** Backend endpoint performance

---

## 🚀 Next Steps (Implementation Roadmap)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up repository structure (backend, frontend, remotion)
- [ ] Configure development environment
- [ ] Establish PostgreSQL + pgvector database
- [ ] Set up AWS S3 buckets
- [ ] Create environment configuration

### Phase 2: Backend Core (Weeks 3-5)
- [ ] **Module 1:** Implement ingestion engine (PDF parsing, RAG)
- [ ] **Module 2:** Develop Director Agent with storyboard generation
- [ ] Set up vector database (Pinecone/Weaviate)
- [ ] Implement JSON schema validation
- [ ] Create backend API endpoints

### Phase 3: Asset Generation (Weeks 6-7)
- [ ] **Module 3:** Integrate fal.ai for image generation
- [ ] Implement TTS with ElevenLabs/OpenAI
- [ ] Set up S3 asset storage and linking
- [ ] Add prompt caching for cost optimization

### Phase 4: Remotion & Rendering (Weeks 8-10)
- [ ] **Module 4:** Build 10 standard Remotion components
- [ ] Create composition and transition logic
- [ ] Set up Remotion Lambda on AWS
- [ ] Implement serverless rendering pipeline

### Phase 5: Frontend Editor (Weeks 11-13)
- [ ] **Module 5:** Build timeline editor UI
- [ ] Implement scene card interface
- [ ] Add inline text editing with TTS regeneration
- [ ] Create image regeneration and swapping
- [ ] Build preview and export functionality

### Phase 6: Testing & Optimization (Weeks 14-16)
- [ ] Write comprehensive test suite
- [ ] End-to-end pipeline testing
- [ ] Cost optimization and monitoring
- [ ] Performance tuning
- [ ] User acceptance testing

---

## 📚 Additional Resources

### Key Documents
- **README.md:** Primary project specification (read first)
- **CLAUDE.md:** This file - AI assistant guide

### External References
- [Remotion Documentation](https://www.remotion.dev/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### Team Communication
- Focus on async communication
- Document decisions in code comments
- Use GitHub Issues for feature discussions
- PR reviews focus on cost and quality

---

## 🔄 Maintenance

### Updating This Document
- Update when architecture decisions change
- Update when new conventions are established
- Update when technology choices are finalized
- Keep in sync with actual implementation
- Version control all changes

### Document Ownership
- **Primary:** Engineering team (backend, frontend, AI)
- **Reviews:** Product and design teams
- **Frequency:** Review monthly or after major milestones

---

## ✅ Checklist for AI Assistants

Before making changes, verify:
- [ ] I've read README.md and CLAUDE.md
- [ ] I understand which module I'm working in
- [ ] My changes respect the $0.10/video cost target
- [ ] I'm using the approved technology stack
- [ ] I'm following coding conventions
- [ ] I've considered error handling
- [ ] I've validated JSON schemas (if applicable)
- [ ] My changes don't violate MVP scope
- [ ] I've documented complex logic
- [ ] I've committed with conventional commit format

---

**Remember:** NeuroReel Studio's success depends on balancing quality, cost, and user experience. Every line of code should serve the mission of democratizing educational video creation.

**Questions?** Refer to README.md for project specification or propose updates to this document via pull request.
