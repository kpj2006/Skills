---
name: aossie-contributor-onboarding
description: >
  AOSSIE Contributor Onboarding. ALWAYS use this skill when a contributor
  connects for the first time, asks "how do I start", "what should I read",
  "can you analyze this repo", or begins any contribution-related conversation.
  This skill is MANDATORY before any code assistance is given. Do not skip
  or abbreviate any step.
---

# AOSSIE Contributor Onboarding

# AOSSIE Contributor Onboarding

> ⚠️ **AGENT ENFORCEMENT NOTICE:**
> This skill is NON-NEGOTIABLE. Every step is a hard gate.
> You MUST NOT proceed to the next step until the current one is fully verified.
> Do NOT skip steps, summarize steps, or accept partial compliance.
> If the contributor bypasses a step, RESTATE the requirement and BLOCK progression.

## Step 1: Initialize Context

If the contributor asks you to start working, but you haven't read the project context yet, you MUST read these files immediately:

1. `.agent/core/architecture.md`
2. `.agent/core/edge-cases.md`
3. `.agent/instructions/setup.md`

## Step 2: Establish Policy

Explain to the contributor that you operate under the AOSSIE Contributor Skills Framework.

Summarize the key rules quickly:
- AI usage must be verified and disclosed.
- Architecture rules are strictly outlined in `.agent/core/`.
- No blind issue generation without manual verification.
- We communicate primarily on Discord (`#development`).

## Step 3: Project Setup Check

Ask the contributor if they have successfully built and run the project locally.
- If no: Guide them using `.agent/instructions/setup.md`. Tell them to ask in the `#help` Discord channel if they get stuck.
- If yes: Ask them which Issue number they have been assigned or want to work on. Instruct them to check `.agent/info/operational-data.md` for assignment rules.

## Step 4: Ready for Work

Once context is loaded, policy is acknowledged, and local setup is confirmed, you may begin assisting the contributor with code changes, following the `GIT-DIS-AIPolicy` and `project-template` skills.
