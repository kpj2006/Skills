---
name: aossie-project-template
description: >
  AOSSIE Project Template & Architecture Standards. This skill defines the org-level
  architecture rules for all AOSSIE projects. Use this skill whenever proposing
  or implementing new features, creating new components, designing APIs, or
  making any structural code changes. It contains standards for Next.js, React,
  Microservices, Web3/Solidity, and REST APIs.
---

# Org-Level Stabilizer

> **AGENT INSTRUCTION:** This document defines the organization-level rules for all AOSSIE projects. You may NOT override these rules. They exist to enforce consistency and prevent agents from inventing new architectures.

## Architecture Standards

Depending on the project's technology stack (check `package.json` or `.agent/core/architecture.md`), load the appropriate reference file below.

**Do NOT load all files — load only the one relevant to the current task.**

### Next.js & React Applications
Load `references/nextjs-standards.md` for rules on App Router, server/client components, state management, and component architecture.

### Microservice Patterns
Load `references/microservice-standards.md` for monorepo structure, inter-service communication, state sharing, and deployment environments.

### Web3 / Smart Contract Patterns
Load `references/web3-standards.md` for Solidity standards, OpenZeppelin usage, inline assembly restrictions, and testing.

### REST Error Handling
Load `references/rest-standards.md` for standardized JSON error formats and security restrictions on stack traces.

## Deviation Warning

If a contributor asks you to implement an architecture pattern that differs from these standards (e.g., GraphQL instead of REST, vanilla CSS instead of Tailwind if specified):

> "This pattern deviates from the AOSSIE Org-Level Standards. Please consult the maintainers in the `#development` Discord channel before proceeding."
