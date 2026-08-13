# Why this has to run on your own machine

*Part 9 of 10 on organization-wide skills.*

Everything described so far — the repo routing, the context concatenation, the gap log, the PR clustering — runs through [Ollama](https://ollama.ai/) on one machine, calling `llama3.2` locally. That's not a placeholder for "a real hosted model later." It's the point.

## What a hosted API would actually cost here

AOSSIE's whole shape is 300+ independently maintained open-source repos, run mostly by volunteers, talking to contributors in Discord. Every one of SkillBot's inputs — the question, the recent chat history, the repo's internal architecture notes, its unreleased roadmap — is either community-sensitive or simply not the org's to hand to a third party by default. Point that traffic at a hosted model and you've made a decision on behalf of every maintainer in every one of those repos: that their Discord conversations and internal docs now transit someone else's infrastructure, are subject to someone else's retention policy, and cost the org a per-seat or per-token bill that scales with 300 repos' worth of traffic.

For a company evaluating this same pattern internally, that trade is starker, not milder: "can we point this at our private repos and internal chat" turns from an engineering question into a legal one the moment a hosted API is in the loop. Running Ollama locally — plus keyword-based routing and Git-tracked markdown, no cloud dependency anywhere in the current pipeline — means the entire stack can sit inside infrastructure the org already controls, with nothing to trust beyond that.

## This isn't a data-center simulation of "local"

SkillBot currently runs on one maintainer's own laptop: an RTX 4060 (8 GB VRAM, usually a few GB free) and 16 GB of system RAM that's often down to 2–3 GB available under normal multitasking. That's a real, tight budget, not a generous local box standing in for a future cluster — and it's why `num_ctx` is read from an environment variable instead of left to whatever Ollama defaults to, and why context assembly stays a fixed, small concatenation instead of growing to include everything available. The constraint isn't a footnote; it shaped the design. A system that only works with a GPU most volunteer maintainers don't have isn't actually local-first, whatever it runs on paper.

## What "adaptable to any environment" means concretely

It doesn't mean this codebase is being packaged as a product for other companies to install. It targets AOSSIE's own repos, and the goal for this project is to make AOSSIE's own ecosystem work well — not to launch a multi-tenant platform. What *is* portable is the pattern, because of what the pieces are made of: a skill is a markdown file in Git, routing is a metadata table per repo, and inference is one swappable local model call. None of that is tied to a specific framework, hosting provider, or language — a repo can be a Next.js app, a Python CLI, or a Discord bot, and the same shape applies, because nothing in the pipeline inspects the tech stack, only the markdown. Another org standing up the same pattern for their own repos would be running their own instance on their own machine, the same way AOSSIE runs this one — not signing up for AOSSIE's.

The last question this series owes an answer to: why does this end up being infrastructure an org builds, rather than a documentation project a maintainer writes? That's Part 10.

---

**Repositories:** [Skills](https://github.com/AOSSIE-Org/Skills) · [SkillBot](https://github.com/AOSSIE-Org/SkillBot) · [PullRequestDashboard](https://github.com/AOSSIE-Org/PullRequestDashboard)
