import { SkillNode, Difficulty } from "@/types";

export interface SeedResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  provider: string;
  url: string;
  type: "COURSE" | "VIDEO" | "INTERACTIVE" | "DOCUMENTATION" | "BOOK" | "TUTORIAL" | "EXERCISE";
  difficulty: Difficulty;
  durationMinutes: number;
  qualityScore: number;
  cost: "FREE" | "PAID" | "FREEMIUM";
  format: string;
  skills: { skillId: string; coverage: number; isPrimary: boolean }[];
  summary: string;
}

export interface SeedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  scenario: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "CAPSTONE";
  estimatedHours: number;
  rubric: {
    architecture: number;
    codeQuality: number;
    testing: number;
    security: number;
    documentation: number;
  };
  starterTemplateUrl: string;
  deliverables: string[];
  hints: string[];
  skills: string[];
}

export interface SeedQuestion {
  id: string;
  assessmentId: string;
  skillId: string;
  type: "MCQ" | "CODING" | "SCENARIO" | "SHORT_ANSWER";
  difficulty: Difficulty;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  codeSnippet?: string;
  points: number;
}

export interface SeedAssessment {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetSkillId: string;
  difficulty: Difficulty;
  passingScore: number;
  timeLimitMinutes: number;
  questions: SeedQuestion[];
}

export interface TargetRoleTrack {
  id: string;
  title: string;
  description: string;
  requiredSkills: { skillId: string; requiredMastery: number; importance: number }[];
  recommendedStrategy: "FAST_TRACK" | "BALANCED" | "PROJECT_FIRST" | "DEEP_MASTERY";
}

// ----------------------------------------------------
// 1. SKILL TAXONOMY & GRAPH
// ----------------------------------------------------
export const SKILL_CATALOG: SkillNode[] = [
  // Foundations
  {
    id: "python-core",
    name: "Python Core & Advanced Syntax",
    slug: "python-core",
    description: "Object-oriented Python, generators, decorators, typing, async I/O, and memory management.",
    category: "Programming & Foundations",
    difficulty: "BEGINNER",
    importanceWeight: 1.5,
    prerequisites: [],
    estimatedHoursToMaster: 25,
  },
  {
    id: "dsa-fundamentals",
    name: "Data Structures & Algorithms",
    slug: "dsa-fundamentals",
    description: "Arrays, hash maps, trees, graphs, sorting, dynamic programming, and computational complexity.",
    category: "Programming & Foundations",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.3,
    prerequisites: ["python-core"],
    estimatedHoursToMaster: 35,
  },
  {
    id: "git-version-control",
    name: "Git & Collaborative Workflow",
    slug: "git-version-control",
    description: "Branching strategies, interactive rebasing, merge conflict resolution, and CI/CD triggers.",
    category: "Programming & Foundations",
    difficulty: "BEGINNER",
    importanceWeight: 1.0,
    prerequisites: [],
    estimatedHoursToMaster: 10,
  },
  {
    id: "sql-databases",
    name: "Relational Databases & SQL",
    slug: "sql-databases",
    description: "Relational modeling, indexing strategies, complex JOINs, ACID transactions, and query plans.",
    category: "Data & Backend",
    difficulty: "BEGINNER",
    importanceWeight: 1.3,
    prerequisites: [],
    estimatedHoursToMaster: 20,
  },
  {
    id: "rest-apis",
    name: "REST API & Microservices Architecture",
    slug: "rest-apis",
    description: "FastAPI / Express API design, OpenAPI specs, rate limiting, authentication, and HTTP state machines.",
    category: "Data & Backend",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.4,
    prerequisites: ["python-core", "sql-databases"],
    estimatedHoursToMaster: 25,
  },
  {
    id: "docker-containers",
    name: "Docker & Containerization",
    slug: "docker-containers",
    description: "Multi-stage Docker builds, container networking, volume mounts, and Docker Compose orchestration.",
    category: "DevOps & Cloud",
    difficulty: "BEGINNER",
    importanceWeight: 1.2,
    prerequisites: ["git-version-control"],
    estimatedHoursToMaster: 15,
  },
  {
    id: "kubernetes-orchestration",
    name: "Kubernetes & Cloud Deployments",
    slug: "kubernetes-orchestration",
    description: "Pods, Deployments, Services, Ingress controllers, Helm charts, and auto-scaling.",
    category: "DevOps & Cloud",
    difficulty: "ADVANCED",
    importanceWeight: 1.1,
    prerequisites: ["docker-containers"],
    estimatedHoursToMaster: 30,
  },

  // Machine Learning & Math
  {
    id: "linear-algebra-stats",
    name: "Linear Algebra, Calculus & Statistics for AI",
    slug: "linear-algebra-stats",
    description: "Matrix operations, eigenvalues, gradients, probability distributions, hypothesis testing, and loss landscapes.",
    category: "AI & Machine Learning",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.4,
    prerequisites: ["python-core"],
    estimatedHoursToMaster: 30,
  },
  {
    id: "numpy-pandas-data",
    name: "Data Manipulation (NumPy, Pandas, Polars)",
    slug: "numpy-pandas-data",
    description: "Vectorized operations, data cleaning, feature engineering, and exploratory data analysis.",
    category: "AI & Machine Learning",
    difficulty: "BEGINNER",
    importanceWeight: 1.3,
    prerequisites: ["python-core"],
    estimatedHoursToMaster: 20,
  },
  {
    id: "classical-ml",
    name: "Classical Machine Learning (Scikit-Learn)",
    slug: "classical-ml",
    description: "Linear/logistic regression, decision trees, random forests, XGBoost, cross-validation, and metrics.",
    category: "AI & Machine Learning",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.5,
    prerequisites: ["linear-algebra-stats", "numpy-pandas-data"],
    estimatedHoursToMaster: 35,
  },
  {
    id: "deep-learning-foundations",
    name: "Deep Learning Foundations (PyTorch)",
    slug: "deep-learning-foundations",
    description: "Neural network architectures, backpropagation, autograd, optimizers (AdamW), and GPU acceleration in PyTorch.",
    category: "AI & Machine Learning",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.6,
    prerequisites: ["classical-ml"],
    estimatedHoursToMaster: 40,
  },
  {
    id: "transformers-nlp",
    name: "Transformer Architectures & Attention Mechanisms",
    slug: "transformers-nlp",
    description: "Self-attention, multi-head attention, positional encodings, BERT vs GPT, tokenization (BPE/WordPiece).",
    category: "AI & Machine Learning",
    difficulty: "ADVANCED",
    importanceWeight: 1.8,
    prerequisites: ["deep-learning-foundations"],
    estimatedHoursToMaster: 35,
  },

  // Generative AI & Applied LLMs
  {
    id: "llm-prompt-engineering",
    name: "LLM Fundamentals & Prompt Engineering",
    slug: "llm-prompt-engineering",
    description: "Few-shot prompting, chain-of-thought, structured JSON outputs, guardrails, context windows, and hallucination reduction.",
    category: "Generative AI & LLMs",
    difficulty: "BEGINNER",
    importanceWeight: 1.3,
    prerequisites: ["python-core"],
    estimatedHoursToMaster: 15,
  },
  {
    id: "vector-databases-embeddings",
    name: "Vector Embeddings & Vector Databases",
    slug: "vector-databases-embeddings",
    description: "Embedding models (OpenAI, Voyage, BGE), cosine similarity, HNSW / IVFFlat indexes, Pinecone, Qdrant, and pgvector.",
    category: "Generative AI & LLMs",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.7,
    prerequisites: ["linear-algebra-stats", "sql-databases"],
    estimatedHoursToMaster: 25,
  },
  {
    id: "rag-systems",
    name: "Production RAG (Retrieval-Augmented Generation)",
    slug: "rag-systems",
    description: "Chunking strategies, hybrid keyword/vector search, re-ranking (Cohere), query decomposition, and RAG evaluation (Ragas).",
    category: "Generative AI & LLMs",
    difficulty: "ADVANCED",
    importanceWeight: 2.0,
    prerequisites: ["transformers-nlp", "vector-databases-embeddings", "rest-apis"],
    estimatedHoursToMaster: 45,
  },
  {
    id: "fine-tuning-llms",
    name: "LLM Fine-Tuning (PEFT / LoRA / QLoRA)",
    slug: "fine-tuning-llms",
    description: "Parameter-efficient fine-tuning, dataset formatting, quantization, DPO, RLHF, and Unsloth / HuggingFace SFT.",
    category: "Generative AI & LLMs",
    difficulty: "ADVANCED",
    importanceWeight: 1.6,
    prerequisites: ["transformers-nlp", "deep-learning-foundations"],
    estimatedHoursToMaster: 40,
  },
  {
    id: "autonomous-ai-agents",
    name: "Autonomous AI Agents & Multi-Agent Systems",
    slug: "autonomous-ai-agents",
    description: "Tool calling, ReAct loops, planning, reflection, stateful workflows, LangGraph, CrewAI, and agent memory systems.",
    category: "Generative AI & LLMs",
    difficulty: "EXPERT",
    importanceWeight: 1.9,
    prerequisites: ["rag-systems", "rest-apis"],
    estimatedHoursToMaster: 45,
  },
  {
    id: "mlops-model-serving",
    name: "MLOps, Model Serving & LLMOps",
    slug: "mlops-model-serving",
    description: "vLLM, Ollama, TensorRT-LLM, model caching, streaming APIs, latency profiling, OpenTelemetry tracing, and Langfuse.",
    category: "DevOps & Cloud",
    difficulty: "ADVANCED",
    importanceWeight: 1.7,
    prerequisites: ["docker-containers", "rag-systems"],
    estimatedHoursToMaster: 35,
  },
  {
    id: "ai-safety-evaluations",
    name: "AI Evaluation, Safety & Benchmarking",
    slug: "ai-safety-evaluations",
    description: "LLM-as-a-judge, benchmark datasets, prompt injection defense, PII redacting, safety classifiers, and CI/CD model gating.",
    category: "Generative AI & LLMs",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.4,
    prerequisites: ["rag-systems"],
    estimatedHoursToMaster: 20,
  },
  {
    id: "nextjs-fullstack-ai",
    name: "Full-Stack AI Application Development (Next.js)",
    slug: "nextjs-fullstack-ai",
    description: "React Server Components, AI SDK streaming, client-side state, caching, optimistic UI, and production Vercel deployment.",
    category: "Software Engineering",
    difficulty: "INTERMEDIATE",
    importanceWeight: 1.5,
    prerequisites: ["rest-apis"],
    estimatedHoursToMaster: 30,
  },
];

// ----------------------------------------------------
// 2. TARGET ROLE TRACKS
// ----------------------------------------------------
export const TARGET_ROLE_TRACKS: TargetRoleTrack[] = [
  {
    id: "ai-engineer",
    title: "Production AI / LLM Engineer",
    description: "Architect, build, and deploy production-grade LLM applications, RAG pipelines, autonomous agents, and model serving systems.",
    recommendedStrategy: "BALANCED",
    requiredSkills: [
      { skillId: "python-core", requiredMastery: 85, importance: 1.5 },
      { skillId: "sql-databases", requiredMastery: 75, importance: 1.3 },
      { skillId: "rest-apis", requiredMastery: 80, importance: 1.4 },
      { skillId: "docker-containers", requiredMastery: 70, importance: 1.2 },
      { skillId: "linear-algebra-stats", requiredMastery: 70, importance: 1.2 },
      { skillId: "deep-learning-foundations", requiredMastery: 75, importance: 1.5 },
      { skillId: "transformers-nlp", requiredMastery: 85, importance: 1.8 },
      { skillId: "vector-databases-embeddings", requiredMastery: 90, importance: 1.9 },
      { skillId: "rag-systems", requiredMastery: 90, importance: 2.0 },
      { skillId: "autonomous-ai-agents", requiredMastery: 85, importance: 1.9 },
      { skillId: "mlops-model-serving", requiredMastery: 75, importance: 1.6 },
      { skillId: "ai-safety-evaluations", requiredMastery: 75, importance: 1.4 },
    ],
  },
  {
    id: "fullstack-ai-developer",
    title: "Full-Stack AI Application Developer",
    description: "Bridge web development and generative AI with reactive interfaces, streaming APIs, and multi-modal interactive agents.",
    recommendedStrategy: "PROJECT_FIRST",
    requiredSkills: [
      { skillId: "python-core", requiredMastery: 80, importance: 1.4 },
      { skillId: "rest-apis", requiredMastery: 85, importance: 1.6 },
      { skillId: "sql-databases", requiredMastery: 80, importance: 1.4 },
      { skillId: "nextjs-fullstack-ai", requiredMastery: 90, importance: 2.0 },
      { skillId: "vector-databases-embeddings", requiredMastery: 80, importance: 1.6 },
      { skillId: "rag-systems", requiredMastery: 85, importance: 1.8 },
      { skillId: "llm-prompt-engineering", requiredMastery: 85, importance: 1.5 },
      { skillId: "docker-containers", requiredMastery: 70, importance: 1.2 },
    ],
  },
  {
    id: "mlops-engineer",
    title: "MLOps & Cloud AI Infrastructure Engineer",
    description: "Scale high-throughput model inference, distributed training clusters, CI/CD for weights and models, and latency optimization.",
    recommendedStrategy: "DEEP_MASTERY",
    requiredSkills: [
      { skillId: "python-core", requiredMastery: 85, importance: 1.5 },
      { skillId: "docker-containers", requiredMastery: 90, importance: 1.9 },
      { skillId: "kubernetes-orchestration", requiredMastery: 85, importance: 1.8 },
      { skillId: "deep-learning-foundations", requiredMastery: 80, importance: 1.5 },
      { skillId: "mlops-model-serving", requiredMastery: 95, importance: 2.0 },
      { skillId: "fine-tuning-llms", requiredMastery: 80, importance: 1.6 },
      { skillId: "ai-safety-evaluations", requiredMastery: 75, importance: 1.3 },
    ],
  },
];

// ----------------------------------------------------
// 3. CURATED RESOURCE KNOWLEDGE BASE (50+ items)
// ----------------------------------------------------
export const RESOURCE_CATALOG: SeedResource[] = [
  // Python Core
  {
    id: "res-py-1",
    title: "Fluent Python: Clear, Concise, and Effective Programming",
    slug: "fluent-python-mastery",
    description: "Deep dive into Python data model, decorators, metaclasses, and modern asyncio concurrency.",
    provider: "O'Reilly",
    url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
    type: "BOOK",
    difficulty: "INTERMEDIATE",
    durationMinutes: 480,
    qualityScore: 4.9,
    cost: "PAID",
    format: "DOCUMENTATION",
    skills: [{ skillId: "python-core", coverage: 95, isPrimary: true }],
    summary: "Essential for advancing beyond basic scriptwriting to professional Pythonic architecture.",
  },
  {
    id: "res-py-2",
    title: "FastAPI Complete Mastery & Async Microservices",
    slug: "fastapi-async-mastery",
    description: "Build asynchronous RESTful microservices with Pydantic validation, dependency injection, and JWT auth.",
    provider: "FastAPI Official",
    url: "https://fastapi.tiangolo.com/tutorial/",
    type: "INTERACTIVE",
    difficulty: "BEGINNER",
    durationMinutes: 300,
    qualityScore: 4.8,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [
      { skillId: "rest-apis", coverage: 90, isPrimary: true },
      { skillId: "python-core", coverage: 40, isPrimary: false },
    ],
    summary: "Hands-on official walkthrough with automated interactive Swagger documentation.",
  },

  // Databases & Vector Databases
  {
    id: "res-sql-1",
    title: "PostgreSQL High-Performance Indexing & Query Tuning",
    slug: "postgres-query-tuning",
    description: "Master B-Trees, GIN, BRIN indexes, query execution explain plans, and isolation levels.",
    provider: "Postgres Open Guides",
    url: "https://use-the-index-luke.com/",
    type: "TUTORIAL",
    difficulty: "INTERMEDIATE",
    durationMinutes: 240,
    qualityScore: 4.9,
    cost: "FREE",
    format: "DOCUMENTATION",
    skills: [{ skillId: "sql-databases", coverage: 90, isPrimary: true }],
    summary: "Critical for understanding why slow SQL bottlenecks modern AI pipelines.",
  },
  {
    id: "res-vec-1",
    title: "Vector Search In-Depth: HNSW, IVFFlat and pgvector",
    slug: "pgvector-hnsw-deep-dive",
    description: "Mathematical principles behind high-dimensional vector search, cosine vs dot product, and scaling vector indexes.",
    provider: "Pinecone / pgvector Academy",
    url: "https://www.pinecone.io/learn/series/faiss/vector-indexes/",
    type: "COURSE",
    difficulty: "INTERMEDIATE",
    durationMinutes: 210,
    qualityScore: 4.85,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [{ skillId: "vector-databases-embeddings", coverage: 95, isPrimary: true }],
    summary: "Bridge standard relational SQL with high-dimensional embedding similarity search.",
  },

  // Deep Learning & Transformers
  {
    id: "res-dl-1",
    title: "PyTorch Deep Learning Bootcamp: From Tensors to Neural Networks",
    slug: "pytorch-deep-learning-bootcamp",
    description: "Write PyTorch neural nets from scratch, understand autograd, loss functions, GPU memory optimization, and custom datasets.",
    provider: "DeepLearning.AI",
    url: "https://www.deeplearning.ai/courses/deep-learning-specialization/",
    type: "COURSE",
    difficulty: "INTERMEDIATE",
    durationMinutes: 600,
    qualityScore: 4.92,
    cost: "FREEMIUM",
    format: "INTERACTIVE",
    skills: [{ skillId: "deep-learning-foundations", coverage: 95, isPrimary: true }],
    summary: "The definitive hands-on deep learning foundation course.",
  },
  {
    id: "res-tf-1",
    title: "The Illustrated Transformer & Attention Is All You Need Code Along",
    slug: "illustrated-transformer-code",
    description: "Visual walkthrough and step-by-step PyTorch implementation of Multi-Head Self-Attention, Key-Query-Value projections, and KV caching.",
    provider: "Jay Alammar & Hugging Face",
    url: "https://jalammar.github.io/illustrated-transformer/",
    type: "TUTORIAL",
    difficulty: "ADVANCED",
    durationMinutes: 280,
    qualityScore: 4.96,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [{ skillId: "transformers-nlp", coverage: 90, isPrimary: true }],
    summary: "World-renowned interactive visual explanation of modern attention mechanisms.",
  },

  // RAG & Advanced Retrieval
  {
    id: "res-rag-1",
    title: "Advanced RAG Architecture: Chunking, HyDE, Multi-Query & Cross-Encoders",
    slug: "advanced-rag-architecture",
    description: "Eliminate hallucinations with recursive character chunking, semantic routing, contextual compression, and Cohere re-ranking.",
    provider: "LlamaIndex & DeepLearning.AI",
    url: "https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/",
    type: "COURSE",
    difficulty: "ADVANCED",
    durationMinutes: 360,
    qualityScore: 4.94,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [
      { skillId: "rag-systems", coverage: 95, isPrimary: true },
      { skillId: "vector-databases-embeddings", coverage: 50, isPrimary: false },
    ],
    summary: "Move past toy vector retrieval to production-resilient hybrid search pipelines.",
  },
  {
    id: "res-rag-2",
    title: "Evaluating RAG with Ragas, TruLens, and LLM-as-a-Judge",
    slug: "evaluating-rag-pipelines",
    description: "Measure Faithfulness, Answer Relevance, Context Recall, and Context Precision systematically in CI pipelines.",
    provider: "Exploding Gradients / Ragas",
    url: "https://docs.ragas.io/en/stable/",
    type: "DOCUMENTATION",
    difficulty: "ADVANCED",
    durationMinutes: 180,
    qualityScore: 4.88,
    cost: "FREE",
    format: "DOCUMENTATION",
    skills: [
      { skillId: "rag-systems", coverage: 80, isPrimary: true },
      { skillId: "ai-safety-evaluations", coverage: 85, isPrimary: false },
    ],
    summary: "Critical for establishing quantitative ground truth before shipping RAG to customers.",
  },

  // AI Agents
  {
    id: "res-agent-1",
    title: "LangGraph: Multi-Agent Stateful Orchestration & Human-in-the-Loop",
    slug: "langgraph-multi-agent-orchestration",
    description: "Build cyclical state graphs, deterministic tool verification, short/long-term memory persistence, and checkpointed human approvals.",
    provider: "LangChain Academy",
    url: "https://academy.langchain.com/courses/intro-to-langgraph",
    type: "COURSE",
    difficulty: "ADVANCED",
    durationMinutes: 320,
    qualityScore: 4.91,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [{ skillId: "autonomous-ai-agents", coverage: 95, isPrimary: true }],
    summary: "Learn production multi-agent architectures beyond brittle sequential chains.",
  },

  // Fine-Tuning & MLOps
  {
    id: "res-ft-1",
    title: "Fine-Tuning LLMs with QLoRA and Unsloth on Custom Datasets",
    slug: "qlora-unsloth-finetuning",
    description: "Format instruction-tuning data, compute 4-bit NormalFloat quantization, train adapter weights, and export GGUF / Ollama models.",
    provider: "Hugging Face & Unsloth",
    url: "https://huggingface.co/blog/4bit-transformers-bitsandbytes",
    type: "TUTORIAL",
    difficulty: "ADVANCED",
    durationMinutes: 270,
    qualityScore: 4.87,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [{ skillId: "fine-tuning-llms", coverage: 90, isPrimary: true }],
    summary: "Accelerate parameter-efficient training 5x with minimal VRAM requirements.",
  },
  {
    id: "res-mlops-1",
    title: "vLLM High-Throughput LLM Serving & PagedAttention Deployment",
    slug: "vllm-high-throughput-serving",
    description: "Deploy quantized open-source models with continuous batching, PagedAttention memory management, and Prometheus metrics.",
    provider: "vLLM Project",
    url: "https://docs.vllm.ai/en/latest/",
    type: "DOCUMENTATION",
    difficulty: "ADVANCED",
    durationMinutes: 240,
    qualityScore: 4.89,
    cost: "FREE",
    format: "DOCUMENTATION",
    skills: [
      { skillId: "mlops-model-serving", coverage: 90, isPrimary: true },
      { skillId: "docker-containers", coverage: 40, isPrimary: false },
    ],
    summary: "Achieve 10x higher token throughput than basic Hugging Face pipeline endpoints.",
  },
  {
    id: "res-next-1",
    title: "Next.js AI SDK: Streaming UI, Tool Execution & Generative UI",
    slug: "nextjs-ai-sdk-streaming",
    description: "Build real-time generative user interfaces with useChat, useCompletion, object streaming with Zod, and server actions.",
    provider: "Vercel AI",
    url: "https://sdk.vercel.ai/docs",
    type: "INTERACTIVE",
    difficulty: "INTERMEDIATE",
    durationMinutes: 220,
    qualityScore: 4.93,
    cost: "FREE",
    format: "INTERACTIVE",
    skills: [{ skillId: "nextjs-fullstack-ai", coverage: 95, isPrimary: true }],
    summary: "Modern standard for building reactive, streaming AI web applications.",
  },
];

// ----------------------------------------------------
// 4. REALISTIC HANDS-ON PROJECTS (15 items)
// ----------------------------------------------------
export const PROJECT_CATALOG: SeedProject[] = [
  {
    id: "proj-1-fastapi-sql",
    title: "Production Asynchronous REST API with PostgreSQL & Auth",
    slug: "fastapi-postgres-auth-service",
    description: "Develop an asynchronous multi-tenant API with role-based access control, PostgreSQL connection pooling, and Pytest coverage.",
    scenario: "You are tasked with building the authentication and resource management backend for an enterprise AI workspace.",
    difficulty: "INTERMEDIATE",
    estimatedHours: 12,
    starterTemplateUrl: "https://github.com/example/fastapi-async-starter",
    skills: ["python-core", "sql-databases", "rest-apis", "docker-containers"],
    rubric: {
      architecture: 20,
      codeQuality: 20,
      testing: 20,
      security: 20,
      documentation: 20,
    },
    deliverables: [
      "Asynchronous endpoints with Pydantic v2 schemas",
      "JWT bearer token authentication with refresh tokens",
      "Docker Compose file linking API and PostgreSQL",
      "Comprehensive test suite with >80% test coverage",
      "Automated OpenAPI documentation with examples",
    ],
    hints: [
      "Use AsyncSession from SQLAlchemy 2.0 with asyncpg driver.",
      "Implement dependency injection for current user extraction.",
      "Protect against SQL injection and enforce database migration versions with Alembic.",
    ],
  },
  {
    id: "proj-2-rag-enterprise",
    title: "Enterprise Multi-Document RAG with Cohere Re-Ranking & Evaluation",
    slug: "enterprise-multi-doc-rag",
    description: "Build a production document intelligence system supporting PDF/Markdown ingestion, semantic chunking, pgvector hybrid search, and Ragas evaluation.",
    scenario: "A fintech firm needs a question-answering assistant over 5,000 regulatory compliance PDFs with zero tolerance for hallucinations.",
    difficulty: "ADVANCED",
    estimatedHours: 18,
    starterTemplateUrl: "https://github.com/example/rag-enterprise-starter",
    skills: ["vector-databases-embeddings", "rag-systems", "transformers-nlp", "ai-safety-evaluations"],
    rubric: {
      architecture: 25,
      codeQuality: 20,
      testing: 20,
      security: 15,
      documentation: 20,
    },
    deliverables: [
      "Document ingestion pipeline with structural PDF parsing",
      "Hybrid retrieval (Postgres Full-Text Search + pgvector HNSW)",
      "Cohere cross-encoder re-ranking stage",
      "Automated Ragas evaluation report with >0.85 faithfulness",
      "Citation linking with exact source page bounding boxes",
    ],
    hints: [
      "Benchmark chunk sizes between 400 and 800 tokens with 15% overlap.",
      "Include metadata filters for document publication date and access permissions.",
      "Implement prompt compression to maximize signal-to-noise ratio in prompt contexts.",
    ],
  },
  {
    id: "proj-3-agentic-coder",
    title: "Autonomous Code Refactoring Agent with LangGraph & Sandboxed Execution",
    slug: "autonomous-code-refactoring-agent",
    description: "Construct a multi-agent system that analyzes GitHub pull requests, writes unit tests, fixes syntax errors, and validates execution in Docker.",
    scenario: "A developer productivity startup wants an autonomous agent that fixes failing CI builds before humans review the code.",
    difficulty: "CAPSTONE",
    estimatedHours: 25,
    starterTemplateUrl: "https://github.com/example/agent-coder-starter",
    skills: ["autonomous-ai-agents", "rag-systems", "docker-containers", "python-core"],
    rubric: {
      architecture: 25,
      codeQuality: 25,
      testing: 20,
      security: 15,
      documentation: 15,
    },
    deliverables: [
      "LangGraph cyclical state graph with Planner, Coder, and Critic nodes",
      "Safe sandboxed container execution environment with memory & timeout caps",
      "Automated Git commit generation with concise diff explanations",
      "Telemetry and trace dashboard showing tool invocations and token usage",
    ],
    hints: [
      "Ensure sandbox network access is restricted to prevent malicious code exfiltration.",
      "Use structured output schemas with Zod/Pydantic to parse agent actions deterministically.",
      "Incorporate human-in-the-loop approval before pushing branch commits.",
    ],
  },
  {
    id: "proj-4-vllm-deploy",
    title: "High-Concurrency LLM Inference Service with vLLM & Prometheus Metrics",
    slug: "vllm-inference-service-deploy",
    description: "Containerize and deploy a Llama-3-8B / Mistral model on GPU instances with streaming SSE, token rate-limiting, and p99 latency monitoring.",
    scenario: "Scale an internal generative AI gateway to handle 500 concurrent corporate queries per second.",
    difficulty: "ADVANCED",
    estimatedHours: 15,
    starterTemplateUrl: "https://github.com/example/vllm-deploy-starter",
    skills: ["mlops-model-serving", "docker-containers", "rest-apis"],
    rubric: {
      architecture: 25,
      codeQuality: 20,
      testing: 20,
      security: 15,
      documentation: 20,
    },
    deliverables: [
      "vLLM service container with tensor parallelism and PagedAttention configured",
      "FastAPI gateway with token bucket rate limiting and API key auth",
      "Prometheus metrics scraping (TTFT, tokens/second, GPU memory utilization)",
      "Grafana dashboard configuration json",
    ],
    hints: [
      "Tune `--gpu-memory-utilization` and `--max-num-seqs` based on GPU VRAM.",
      "Use Server-Sent Events (SSE) with keep-alive heartbeats for stable streaming.",
    ],
  },
];

// ----------------------------------------------------
// 5. ADAPTIVE ASSESSMENTS & QUESTIONS (30+ questions)
// ----------------------------------------------------
export const ASSESSMENT_CATALOG: SeedAssessment[] = [
  {
    id: "assess-python-1",
    title: "Python Core & Advanced Architecture Assessment",
    slug: "python-core-assessment",
    description: "Evaluates proficiency with generators, decorators, GIL, memory references, and asynchronous concurrency in Python.",
    targetSkillId: "python-core",
    difficulty: "INTERMEDIATE",
    passingScore: 75,
    timeLimitMinutes: 15,
    questions: [
      {
        id: "q-py-1",
        assessmentId: "assess-python-1",
        skillId: "python-core",
        type: "MCQ",
        difficulty: "BEGINNER",
        prompt: "What is the primary difference between a list comprehension and a generator expression in Python?",
        options: [
          "List comprehension produces an eager list in memory; generator expression returns an iterator yielding items lazily.",
          "Generator expressions are faster for small lists of under 10 elements.",
          "List comprehensions cannot be used in for-loops.",
          "Generator expressions are immutable while list comprehensions are mutable.",
        ],
        correctAnswer: "List comprehension produces an eager list in memory; generator expression returns an iterator yielding items lazily.",
        explanation: "Generator expressions compute values on demand (lazy evaluation), preserving memory for large or infinite sequences.",
        points: 10,
      },
      {
        id: "q-py-2",
        assessmentId: "assess-python-1",
        skillId: "python-core",
        type: "MCQ",
        difficulty: "INTERMEDIATE",
        prompt: "In Python asyncio, what happens if you execute a long-running CPU-bound computation directly inside an async coroutine?",
        options: [
          "It automatically runs in a background thread without blocking the event loop.",
          "It blocks the entire single-threaded event loop, preventing all other pending coroutines from executing.",
          "Asyncio raises a CoroutineBlockedError after 5 seconds.",
          "The Python GIL distributes the computation across all CPU cores.",
        ],
        correctAnswer: "It blocks the entire single-threaded event loop, preventing all other pending coroutines from executing.",
        explanation: "Asyncio uses cooperative multitasking on a single thread. CPU-intensive loops must be offloaded to a ProcessPoolExecutor or ThreadPoolExecutor.",
        points: 10,
      },
      {
        id: "q-py-3",
        assessmentId: "assess-python-1",
        skillId: "python-core",
        type: "MCQ",
        difficulty: "ADVANCED",
        prompt: "What is the role of `functools.wraps` when writing a custom function decorator?",
        options: [
          "It optimizes decorator execution speed by compiling bytecode ahead of time.",
          "It preserves the original function's metadata such as `__name__`, `__doc__`, and signature.",
          "It enforces type annotations at runtime.",
          "It makes the decorator thread-safe by acquiring a lock.",
        ],
        correctAnswer: "It preserves the original function's metadata such as `__name__`, `__doc__`, and signature.",
        explanation: "Without `wraps`, the decorated function would report the wrapper's name and lose its docstring and debugging introspection.",
        points: 10,
      },
    ],
  },
  {
    id: "assess-rag-1",
    title: "Production RAG & Retrieval Intelligence Assessment",
    slug: "rag-systems-assessment",
    description: "Tests knowledge of vector search algorithms, chunking techniques, cross-encoders, and hallucination prevention.",
    targetSkillId: "rag-systems",
    difficulty: "ADVANCED",
    passingScore: 80,
    timeLimitMinutes: 20,
    questions: [
      {
        id: "q-rag-1",
        assessmentId: "assess-rag-1",
        skillId: "rag-systems",
        type: "MCQ",
        difficulty: "INTERMEDIATE",
        prompt: "Why is a Cross-Encoder (Re-Ranker) generally more accurate than Bi-Encoder (Embedding Cosine Similarity) search for document ranking?",
        options: [
          "Cross-Encoders generate 10x smaller vector indexes in memory.",
          "Cross-Encoders perform full self-attention across both the query and document tokens simultaneously, capturing cross-term interactions.",
          "Cross-Encoders only process keywords and ignore stop words.",
          "Cross-Encoders run directly on the database server without GPU acceleration.",
        ],
        correctAnswer: "Cross-Encoders perform full self-attention across both the query and document tokens simultaneously, capturing cross-term interactions.",
        explanation: "Bi-encoders encode query and document independently into fixed vectors, whereas cross-encoders calculate direct token-to-token attention between query and candidate passages.",
        points: 10,
      },
      {
        id: "q-rag-2",
        assessmentId: "assess-rag-1",
        skillId: "rag-systems",
        type: "MCQ",
        difficulty: "ADVANCED",
        prompt: "What is the primary problem addressed by 'Hypothetical Document Embeddings' (HyDE)?",
        options: [
          "Reducing vector database storage costs by 50%.",
          "Bridging the embedding space mismatch between short, ambiguous questions and long, informative document passages.",
          "Eliminating the need for vector indexing completely.",
          "Allowing LLMs to generate embeddings without using transformer layers.",
        ],
        correctAnswer: "Bridging the embedding space mismatch between short, ambiguous questions and long, informative document passages.",
        explanation: "HyDE prompts an LLM to generate a hypothetical answer document first, then embeds that synthetic document to search for real passages in the same linguistic semantic space.",
        points: 10,
      },
      {
        id: "q-rag-3",
        assessmentId: "assess-rag-1",
        skillId: "rag-systems",
        type: "MCQ",
        difficulty: "ADVANCED",
        prompt: "In Ragas evaluation metrics, how is 'Context Precision' defined?",
        options: [
          "The ratio of relevant chunks ranked near the top of the retrieved context window to irrelevant chunks.",
          "The percentage of tokens in the answer that directly match the prompt.",
          "The time taken by the vector database to return top-k nearest neighbors.",
          "The total number of embeddings generated per minute.",
        ],
        correctAnswer: "The ratio of relevant chunks ranked near the top of the retrieved context window to irrelevant chunks.",
        explanation: "Context precision evaluates whether all ground-truth relevant passages appear higher in the ranking than irrelevant ones.",
        points: 10,
      },
    ],
  },
  {
    id: "assess-agents-1",
    title: "Autonomous AI Agents & Multi-Agent Systems Assessment",
    slug: "autonomous-agents-assessment",
    description: "Evaluates architectural patterns for agentic tool use, cyclical state machines, deterministic guardrails, and error recovery.",
    targetSkillId: "autonomous-ai-agents",
    difficulty: "ADVANCED",
    passingScore: 80,
    timeLimitMinutes: 15,
    questions: [
      {
        id: "q-ag-1",
        assessmentId: "assess-agents-1",
        skillId: "autonomous-ai-agents",
        type: "MCQ",
        difficulty: "INTERMEDIATE",
        prompt: "In a ReAct (Reason + Act) agent loop, what occurs when a tool invocation returns an unexpected error code or malformed JSON?",
        options: [
          "The agent immediately crashes and terminates the user session.",
          "The error message is appended to the agent's observation history, allowing the LLM to inspect the failure and formulate an alternative action.",
          "The LLM hallucinates fake data to replace the failed tool response.",
          "The agent bypasses tool execution and switches to general knowledge.",
        ],
        correctAnswer: "The error message is appended to the agent's observation history, allowing the LLM to inspect the failure and formulate an alternative action.",
        explanation: "Self-correcting feedback loops allow agents to inspect execution errors, adjust parameter schemas, or retry alternative tools.",
        points: 10,
      },
      {
        id: "q-ag-2",
        assessmentId: "assess-agents-1",
        skillId: "autonomous-ai-agents",
        type: "MCQ",
        difficulty: "ADVANCED",
        prompt: "Why are directed cyclic graphs (such as LangGraph) preferred over linear chains for production multi-agent systems?",
        options: [
          "Linear chains consume more GPU memory than stateful graphs.",
          "State graphs natively support conditional branching, iterative refinement loops, state persistence, and human-in-the-loop interruptions.",
          "Linear chains cannot make HTTP API calls.",
          "State graphs do not require LLM prompt tokens.",
        ],
        correctAnswer: "State graphs natively support conditional branching, iterative refinement loops, state persistence, and human-in-the-loop interruptions.",
        explanation: "Real-world agent workflows require cyclical loops (review, critique, fix, retry, approve) that cannot be modeled in rigid linear DAG pipelines.",
        points: 10,
      },
    ],
  },
];
