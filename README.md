# 🧠 NeuroPath AI — Closed-Loop AI Learning Intelligence Platform

> **"Tell me where you want to go. I'll understand where you are, identify what you're missing, and continuously determine the best next step."**

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4+-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

NeuroPath AI is not a course catalog or static roadmap generator. It is a **production-grade, closed-loop AI Learning Intelligence Platform** that maintains a dynamic **Learner Digital Twin**, evaluates multidimensional skill evidence, enforces strict DAG prerequisites, and dynamically replans your personalized learning trajectory with every assessment and project.

---

## 🌟 Key Architecture: The Closed Learning Loop

```
                     ┌────────────────────────┐
                     │  Learner Digital Twin  │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   Goal Decomposition   │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │   DAG Skill Taxonomy   │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │  Skill Gap & Evidence  │
                     └───────────┬────────────┘
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
     ┌─────────────────────┐           ┌─────────────────────┐
     │ RAG Retrieval Engine│           │ Recommendation Rank │
     │ (Dense + Metadata)  │           │   (8-Factor Model)  │
     └──────────┬──────────┘           └──────────┬──────────┘
                └────────────────┬────────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │ Personalized Roadmap   │
                     │  (Topological Sort)    │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │ Adaptive Assessments & │
                     │   Project Submissions  │
                     └───────────┬────────────┘
                                 │
                                 ▼
                     ┌────────────────────────┐
                     │  Dynamic Replanning    │
                     └───────────┬────────────┘
                                 │
                                 └───────► Updates Digital Twin & Loops
```

---

## 🚀 Core Features

### 1. 🤖 Conversational AI Onboarding (`/onboarding`)
* **Multi-Turn Adaptive Questioning**: Analyzes user background, target timeline, weekly availability, and learning strategy (*Fast Track, Balanced, Project First, Interview First, Deep Mastery*).
* **Deterministic Structured Extraction**: Normalizes goals into structured competencies with confidence-weighted claims.

### 2. 🧬 Dynamic Learner Digital Twin (`LearnerTwinService`)
* Tracks confidence-weighted skill mastery calculated from multiple distinct evidence sources:
  $$\text{Mastery} = 0.15 \times \text{SelfReport} + 0.25 \times \text{Courses} + 0.35 \times \text{Assessments} + 0.25 \times \text{Projects}$$
* Tracks velocity ($v$), consistency ($\kappa$), and missing prerequisites before permitting advanced topics.

### 3. 🕸️ Directed Acyclic Graph (DAG) Skill Engine (`SkillGraphService`)
* Models hard/soft dependencies across 20+ core competencies (Python Core, NumPy/Pandas, Classical ML, Deep Learning, Attention & Transformers, Vector DBs, RAG, AI Agents, MLOps, System Design).
* Strict prerequisite validation prevents recommending advanced topics (e.g., *RAG Architecture*) until foundational requirements (*Vector DBs & Embeddings*, *Python Core*) meet minimum threshold scores.

### 4. ⚖️ Explainable 8-Factor Recommendation Scoring (`RecommendationEngine`)
Deterministic, explainable ranking model for each resource and roadmap step:
$$\begin{aligned}
\text{Score} &= 0.30 \times \text{GoalRelevance} + 0.20 \times \text{SkillGap} + 0.15 \times \text{PrerequisiteFit} \\
&+ 0.10 \times \text{DifficultyFit} + 0.10 \times \text{LearnerPreference} + 0.05 \times \text{ResourceQuality} \\
&+ 0.05 \times \text{DeadlineFit} + 0.05 \times \text{HistoricalFeedback}
\end{aligned}$$

### 5. 🎯 Next Best Action Engine & Command Center (`/dashboard`)
* Pinpoints the single highest-leverage task to complete right now with transparent mathematical justification.
* Displays Competency Radar, Goal Progress, and Prioritized Skill Gap Matrix with status badges (`BLOCKED`, `READY_TO_LEARN`, `IN_PROGRESS`, `MASTERED`).

### 6. ⚡ Adaptive Assessments & Automated Replanning (`/assessments`)
* Adaptive diagnostic assessments with MCQ, scenario questions, and code challenges.
* **Closed-Loop Replanning**: When a learner proves mastery (e.g., scoring 100% on *Python Core*), the system:
  1. Instantly updates the Digital Twin mastery state.
  2. Prunes redundant introductory modules from the roadmap.
  3. Reallocates saved hours toward deeper topics (e.g., *Production RAG* and *AI Agent Workflows*).
  4. Unlocks downstream blocked modules.

### 7. 🛠️ Practical Project Generator & Evaluator (`/projects`)
* Realistic milestone projects with rubric-based multi-category scoring (Architecture, Code Quality, Testing, Security, Documentation).
* Directly converts project evaluation scores into verified skill evidence.

### 8. 🔮 Interactive What-If Scenario Simulator (`/simulator`)
* Allows learners to simulate changing weekly study hours (5–40 hrs/wk), shifting deadlines (8–52 weeks), or changing strategies (*Fast Track vs Deep Mastery*) without destructively overwriting their live plan.
* Shows real-time delta diffs: projected finish date, velocity demand, and roadmap timeline adjustments.

### 9. 💬 AI Learning Copilot
* Always available floating assistant with real-time awareness of the learner's current goals, weaknesses, next best action, and active roadmap state.

---

## 🏗️ Tech Stack

* **Framework**: Next.js 15+ (App Router, Server Components & Route Handlers)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS, Glassmorphism design system
* **Animations & Visuals**: Framer Motion, Canvas Confetti
* **Data Visualization**: Recharts (Competency Radar, Progress Rings)
* **Icons**: Lucide React
* **ORM & Database**: Prisma ORM, PostgreSQL / SQLite compatible schema with vector embedding support

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ai/            # AI chat, provider endpoints
│   │   ├── assessments/   # Diagnostic assessment submission & replanning
│   │   ├── dashboard/     # Command center analytics & next best action
│   │   ├── onboarding/    # Multi-turn goal extraction & synthesis
│   │   ├── projects/      # Project rubric evaluation
│   │   ├── resources/     # Catalog search & filters
│   │   ├── roadmap/       # Graph recalculation & simulation
│   │   └── skills/        # Skill taxonomy & dependency graph
│   ├── assessments/       # Adaptive assessment UI
│   ├── dashboard/         # Learner command center
│   ├── onboarding/        # Conversational onboarding agent
│   ├── projects/          # Real-world project evaluator
│   ├── resources/         # Curated resource catalog
│   ├── roadmap/           # Interactive DAG roadmap
│   ├── simulator/         # What-If scenario simulator
│   ├── skills/            # Skill graph explorer
│   ├── layout.tsx         # Root layout with AI Copilot
│   └── page.tsx           # Platform landing page
├── components/
│   ├── copilot/           # Omnipresent AI Assistant
│   ├── dashboard/         # Radar charts, Next Best Action, Skill Matrix
│   ├── layout/            # Navbar, footer, navigation
│   └── roadmap/           # Step cards, intelligence drawers
├── data/
│   └── seedCatalog.ts     # Curated skills, resources, projects, assessments
├── services/
│   ├── ai/                # AIProvider abstraction
│   ├── learner/           # LearnerDigitalTwin state & evidence calculations
│   ├── recommendation/    # 8-factor ranking engine
│   ├── roadmap/           # PathOptimizer & AdaptiveReplanning services
│   ├── simulator/         # What-If simulator engine
│   ├── skill-engine/      # DAG graph service & topological sorting
│   ├── skill-gap/         # Skill gap & priority engine
│   └── state/             # Live memory/DB state synchronization
└── types/
    └── index.ts           # Unified TypeScript interfaces
```

---

## ⚡ Getting Started

### Prerequisites
* Node.js 18+
* npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/architSrivastava123/NeuroPathAI.git
   cd NeuroPathAI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [`http://localhost:3000`](http://localhost:3000)

---

## 📄 License

This project is licensed under the MIT License.
