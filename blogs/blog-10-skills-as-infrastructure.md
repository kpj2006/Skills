# Why every org running enough repos ends up here

*Part 10 of 10 on organization-wide skills.*

[Part 9](blog-9-local-first.md) argued for running this locally rather than through a hosted API. This closing post is about why "organization-wide skills" is infrastructure rather than a documentation project, and where the line sits between what a machine should do and what only a person should decide.

## Infrastructure, not a doc project

Any organization running more than a handful of repos hits [Part 1](blog-1-context-blind-ai.md) and [Part 2](blog-2-wrong-phase-right-artifact.md)'s failures eventually, whether or not they call the fix "skills." The moment there are more repos than one person can hold context for, contributor-facing truth starts decaying the instant it stops being the thing actively under discussion. Treating the fix as infrastructure rather than documentation is a specific, deliberate choice: infrastructure gets versioned, gated, and audited on a schedule; documentation gets written once, during enthusiasm, and left.

## A skill is a claim of authority, so it needs a higher bar than a wiki page

That distinction is also why a skill file can't be written casually. Its entire value is that a contributor's tool — and the contributor — treat it as authoritative. A skill that's wrong doesn't fail the way a missing doc fails; a missing doc makes an assistant say "I don't know," and a wrong skill makes it say the wrong thing with the confidence of a citation. That's the standard a skill has to clear before it's reputable enough to publish: traceable to a real source (a PR, a Discord message, a maintainer's own words), reviewed by a human before it lands, and revisited when the code it describes changes — not generated once and assumed correct forever. Everything in [Part 7](blog-7-skills-that-grow.md) and [Part 8](blog-8-clarifying-questions.md) about gating every proposed edit exists to enforce exactly this bar.

## Where AI tooling ends and a person has to decide

None of this is built to take a maintainer out of the loop — it's built to keep them out of the *repetitive* part of it. Every mechanism across this series that touches a skill file — the sync script, the eventual gap-driven updater, a future auto-flag on a stale doc — is designed to land as a proposed change, not a silent edit. The automation's job is to find the gap, draft the fix, and surface the contradiction. The human's job — small, specific, and non-negotiable — is the one sentence of judgment at the end: does this claim of authority actually deserve to be authoritative. That gate is cheap to keep and expensive to lose, which is the whole argument for building the infrastructure carefully instead of building it fast.

## What this series was actually for

Ten posts, and the throughline is one idea: the knowledge an AI-assisted contributor needs was never missing from the organization — it was missing from the place work happens, and it decays the moment no one's actively saying it out loud. Fixing that isn't a matter of writing better docs once. It's building the smallest possible loop — log the gap, draft the fix, gate the edit — and keeping every claim in it honest about what's actually running versus what's still a plan. That last part turned out to matter more than any single mechanism: a system that's precise about its own limits is more trustworthy than one that reads well and isn't checked against its own source.

---

**Repositories:** [Skills](https://github.com/AOSSIE-Org/Skills) · [SkillBot](https://github.com/AOSSIE-Org/SkillBot) · [PullRequestDashboard](https://github.com/AOSSIE-Org/PullRequestDashboard)

Running many repos with a handful of reviewers, on infrastructure you don't want to hand to another vendor? I'm looking for a couple of pilot organizations. Open an issue or a discussion on the Skills repo.
