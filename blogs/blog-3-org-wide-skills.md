# Don't copy your skills into 300 repositories

*Part 3 of 10 on organization-wide skills.*

Once you accept that AI-assisted contributors need repository context in a machine-readable form ([Part 2](blog-2-wrong-phase-right-artifact.md)), the obvious next move is also the wrong one:

> Write a good `skills/` directory once. Copy it into every repo. Done.

This is how most orgs handle `CONTRIBUTING.md`, PR templates, CI workflows, and lint configs. It works until it doesn't, and at AOSSIE's scale — 300+ repositories — it doesn't for long.

## Why copying breaks

**Copies drift silently.** The moment a file exists in 300 places, it has 300 independent futures. Someone fixes the review policy in repo #14. The other 299 keep answering with the old policy, confidently, because a skill file's whole job is to sound authoritative. A stale skill is worse than no skill: no skill makes an assistant say "I don't know"; a stale skill makes it say the wrong thing with citations.

**There's no fix-once path.** When the org changes how demo videos must be recorded, the correct amount of work should be one edit. With copies it's 300 PRs, and in practice it's four PRs and 296 repos that quietly disagree.

**Copies hide what's actually repo-specific.** If `constraints.md` is 90% boilerplate and 10% "client bundle must stay under 10 KB," a reader (human or model) has to wade through the boilerplate to find the one line that matters.

**Nobody can audit it.** "What does our org tell contributors about dependencies?" becomes an unanswerable question when the answer is scattered across hundreds of near-identical files with unknown edit dates.

## The split: org knowledge vs. repo knowledge

The fix starts with noticing that skills are not one category:

| Org-level (one copy, org-wide) | Repo-level (unique per repo) |
|---|---|
| Contribution workflow, PR expectations | Architecture and module boundaries |
| Dependency and licensing philosophy | Hard constraints (bundle size, no server) |
| Communication norms | API contracts and data shapes |
| Onboarding basics | Current roadmap phase and known issues |

Roughly: **org skills describe how we work; repo skills describe what this thing is.**

In a naive copy-paste setup, both live in the same duplicated pile per repo. The question that actually matters is what mechanism keeps them apart — and whether that mechanism is running today or still on a roadmap. That's Part 4.

---

**Repositories:** [Skills](https://github.com/AOSSIE-Org/Skills) · [SkillBot](https://github.com/AOSSIE-Org/SkillBot) · [PullRequestDashboard](https://github.com/AOSSIE-Org/PullRequestDashboard)

Running many repos with a handful of reviewers? I'm looking for a couple of pilot organizations. Open an issue or a discussion on the Skills repo.
