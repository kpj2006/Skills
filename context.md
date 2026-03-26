You are analyzing a repository that is part of a larger system. Do not treat this repository as an isolated project. This system is designed as a unified infrastructure to improve open-source contribution workflows by introducing structured context, controlled AI interaction, and automated reasoning over contributions.

---

### Global System Overview

The system is built around a central idea:

A structured **skills layer** acts as the source of truth, and all other components either consume, update, or reason over this layer.

The entire system consists of four tightly connected modules:

1. Skills Core
2. Skill Bot (Discord Assistant)
3. Skill Updater
4. PR Dashboard

All modules are connected through shared context and are not independent systems.

---

### 1. Skills Core (Foundation Layer)

Purpose:

The Skills Core defines how repository knowledge is structured and consumed. It acts as the central context layer for all other modules.

Key responsibilities:

* Stores repository-specific knowledge in a structured format using the `skills/` directory
* Defines a single entry point (`AGENTS.md`) for all AI agents
* Standardizes how different tools (Copilot, Cursor, Gemini, etc.) access repository context
* Separates repository-level knowledge from organization-level policies

Structure followed:

* `AGENTS.md` → single source of truth
* Wrapper files (CLAUDE.md, GEMINI.md, etc.) → reference AGENTS.md
* `skills/` → contains:

  * core (architecture, edge cases)
  * instructions (setup, workflows)
  * info (Discord links, APIs, maintainers)

Org-level context (shared across repos via submodules):

* GIT-DIS-AIPolicy
* project-template

Role in system:

* Provides context to Skill Bot
* Provides context to PR Dashboard
* Gets updated by Skill Updater

---

### 2. Skill Bot (Discord Assistant)

Purpose:

Acts as the interface between contributors and repository knowledge by answering questions using the Skills Core.

Key responsibilities:

* Responds to contributor queries using structured skill files
* Ensures communication is thread-based and scoped
* Reduces repeated questions and maintainer effort
* Guides contributors using repository-specific context

Modes of operation:

1. Dedicated AI channel (#ai-chat)
2. GSoC-specific mode (uses specialized skill files)
3. Inline invocation in normal conversations

Behavior:

* Always prioritizes skills-based answers
* Uses LLM fallback only when required
* Creates a thread for every interaction
* Suggests correct channels when needed

Role in system:

* Consumes Skills Core
* Benefits from Skill Updater improvements
* Can provide contextual signals for future extensions

---

### 3. Skill Updater (Knowledge Evolution Layer)

Purpose:

Continuously updates the Skills Core using real maintainer discussions, ensuring that knowledge evolves over time.

Key responsibilities:

* Fetches maintainer messages and their replied context from Discord
* Filters noise and keeps only meaningful technical content
* Uses embeddings to identify relevant skill files
* Generates structured updates using LLM
* Applies updates directly to skill files with logging and review

Important constraint:

* Only maintainer messages are used to avoid incorrect or speculative knowledge
* This ensures high-quality and validated updates

Flow:

Discord discussions → filtering → relevance scoring → structured edits → skills updated

Role in system:

* Updates Skills Core
* Improves Skill Bot responses
* Improves PR Dashboard reasoning

---

### 4. PR Dashboard (Maintainer Decision System)

Purpose:

Helps maintainers analyze pull requests by identifying overlaps, conflicts, and optimal merge strategies.

Key responsibilities:

* Fetches pull requests using GitHub CLI
* Extracts CodeRabbit summaries (not raw code)
* Uses embeddings to cluster similar PRs
* Injects repository context from Skills Core
* Performs LLM-based reasoning for:

  * conflict detection
  * merge order recommendation
  * best approach selection

Important design choice:

* Operates on semantic summaries instead of code to reduce complexity and align with human reasoning

Future extension:

* Can integrate Discord discussions for deeper context

Role in system:

* Consumes Skills Core
* Indirectly benefits from Skill Updater
* Assists maintainers in decision-making

---

### System Relationships (IMPORTANT)

* Skills Core is the central layer
* Skill Bot reads from Skills Core
* Skill Updater writes to Skills Core
* PR Dashboard reads from Skills Core

This creates a continuous loop:

Knowledge → Usage → Update → Better Knowledge

---

### Design Principles

* Skills-first approach (structured context before AI reasoning)
* Thread-based communication (no noisy channels)
* Maintainer-validated knowledge only
* Minimal duplication across tools and repositories
* Modular and scalable across multiple repositories

---

### Goal of the System

The goal is to transform open-source workflows from:

Unstructured discussions + generic AI usage

into:

Structured knowledge + context-aware AI + assisted decision-making

---

### Instruction for Analysis

While analyzing this repository:

* Identify where it fits in this system
* Explain how it interacts with Skills Core
* Highlight which part of the workflow it improves
* Do not treat it as a standalone project
* Always relate logic back to the global system
