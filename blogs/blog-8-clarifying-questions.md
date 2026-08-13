# The one clarifying question SkillBot already asks

*Part 8 of 10 on organization-wide skills.*

[Part 7](blog-7-skills-that-grow.md) drew a line between the gap log (real, running) and the maintainer-message-clustering loop (designed, not wired in). There's a third item worth its own careful look, because it's easy to describe a narrower, real behavior as if it were the richer, planned one.

## What's live today

When SkillBot can't map a question to a repo — keyword matching in `repo_router.py` comes up empty, and the LLM classifier fallback still can't decide — it doesn't guess. It asks the contributor directly which project they mean, and logs that exchange as a `repo_clarification_needed` gap. That's a real, shipped behavior: one specific kind of ambiguity, resolved with one specific question, every time it comes up.

## What's on the roadmap, described the same way

A richer version of this idea appears in SkillBot's own roadmap: the bot asking a clarifying question about *intent* — "local development or deployment?" — before answering a question that's already resolved to the right repo but still ambiguous about what's actually being asked. That's a good idea, and it's specific enough to be worth building. It is not something that runs today.

The difference is precise, not just a matter of degree: the working version narrows *which repo's skills to load*. The planned version would narrow *which section of those skills answers the question*. Both are worth having, and they solve different problems — a repo-routing failure and a within-repo ambiguity are different failure modes, with different fixes. Collapsing them into one sentence ("the bot asks a clarifying question when it's unsure") makes the system sound more finished than it is, and hides that the two versions would need different logic entirely: one is a lookup against a fixed table, the other requires an LLM judgment call about ambiguity before any skill file is even read.

## Why the distinction is worth a whole post

It would be easy to read "SkillBot asks clarifying questions" as one fact and move on. It's actually two facts with a gap between them — a shipped narrow behavior, and a planned broader one — and the gap is exactly where a future contributor's expectations would go wrong if they read the roadmap as a changelog. Naming the gap precisely is cheaper than someone discovering it by filing a bug report against a feature that was never claimed to exist, only planned.

Two things left in this series: why the whole stack insists on running locally instead of calling a hosted model, and why "organization-wide skills" ends up being infrastructure rather than a documentation project. That's Parts 9 and 10.

---

**Repositories:** [Skills](https://github.com/AOSSIE-Org/Skills) · [SkillBot](https://github.com/AOSSIE-Org/SkillBot) · [PullRequestDashboard](https://github.com/AOSSIE-Org/PullRequestDashboard)
