# What's actually built vs. what's on the roadmap

*Part 4 of 10 on organization-wide skills.*

[Part 3](blog-3-org-wide-skills.md) split skills into org-level and repo-level knowledge, and argued that copying either into 300 repos breaks in four specific ways. This post is about the mechanism that's supposed to keep them apart — and being precise about which parts of it exist today versus which are still a plan, because it's easy to describe the target architecture as if it already runs.

## What's live in SkillBot right now

- **Repo routing is keyword matching, not search.** `repo_router.py` matches a message against a fixed `REPO_METADATA` table; an LLM classifier only kicks in as a fallback when keyword matching can't decide. If it still can't resolve a repo, the bot asks the contributor directly which project they mean.
- **Context is concatenated in one fixed order, never ranked.** For a resolved repo, the bot builds its prompt from `.agent/` content, then any `skills/**/SKILL.md` files, then the repo's own `README.md` (first 2000 characters), then the shared `org-wide-skills/*/SKILL.md` files — in that priority order, every time. There's no vector index, no embedding search, no similarity score deciding what gets included.
- **The org layer is a scheduled file copy, not a live layer.** `scripts/sync_org_skills.py` downloads a zip of the [Skills](https://github.com/AOSSIE-Org/Skills) repo and copies a fixed allowlist of org-wide skill folders (contributor onboarding, the AI/dependency policy, the project template, MCP integration) into each repo's `org-wide-skills/` directory. No git subtree, no per-repo YAML config selecting which skill set applies — every repo currently gets the same org allowlist.

That's a real, working answer to "how do we avoid copying repo-specific files 300 times": the repo layer stays small and specific, and the org layer is refreshed from one source instead of hand-edited per repo.

## What's still a plan, not a behavior

It is *not* yet the fuller picture — per-repo vector collections, duplicate-detection at index time, and promotion of a repeated repo skill up into the org layer — that shows up in SkillBot's own roadmap document. Those are later-phase plans, not current behavior, and I'd rather say so here than let the roadmap's confident phrasing pass as a description of what runs today. Same for a per-repo YAML config selecting which skill set a channel loads — the current code applies the same org allowlist everywhere; the configurable version is a design, not a shipped feature.

## What the current, smaller mechanism buys you anyway

- **One place to update org policy.** Re-running the sync script refreshes every repo's `org-wide-skills/` folder from the same source — no per-repo hand edits.
- **Repo files stay short**, because they never have to restate org-wide policy.
- **No lock-in.** It's markdown in Git, matched by keyword, and read by a local model. No cloud API, no per-seat pricing, nothing leaving your infrastructure.

## The part none of this solves yet

A synced, deduplicated skills tree is still a static snapshot. It captures what maintainers knew on the day they wrote it. Two weeks later a decision gets made in a Discord thread, a PR lands that invalidates a documented pattern, and the tree starts drifting from reality — cleanly organized, and increasingly wrong. Parts 7 and 8 are about where new knowledge is actually supposed to come from, and how much of that loop is built versus planned.

First, it's worth showing exactly what this routing-and-concatenation mechanism looks like from the inside, with one real contributor question — that's Part 5. Part 6 does the same for PR Dashboard, with two real pull requests.

---

**Repositories:** [Skills](https://github.com/AOSSIE-Org/Skills) · [SkillBot](https://github.com/AOSSIE-Org/SkillBot) · [PullRequestDashboard](https://github.com/AOSSIE-Org/PullRequestDashboard)
