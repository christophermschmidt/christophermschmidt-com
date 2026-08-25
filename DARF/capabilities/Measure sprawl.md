# Measure sprawl

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md), [Minimum sufficient context](Minimum%20sufficient%20context.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Semantic Integrity → Measure sprawl (coverage: **gap** — Microsoft ships nothing)

## Definition

The active management of how many measures exist, how many are duplicates or near-duplicates, and how many are still used. Sprawl control is the deprecation half of canonical metrics: defining the one true measure achieves nothing if the four wrong ones remain queryable.

## Why it matters

Sprawl is a hallucination-surface problem, not a tidiness problem. Every measure in a model is a candidate the agent can select. A model with 40 measures and a model with 900 measures present very different odds of the agent choosing the one the asker meant, and the 900-measure model gives no signal about which of the seven revenue variants is current. Sprawl also inflates the context the agent must be given to disambiguate, which is a direct and measurable cost.

## Failure modes

- Measures named `Revenue`, `Revenue v2`, `Revenue (new)`, `Revenue_FINAL`, all live, none deprecated.
- Measures created for a single report three years ago and never removed because nobody can prove they are unused.
- Near-duplicates that differ only in a filter nobody remembers the reason for.
- Hidden measures that are hidden from report authors but fully visible to the agent through the model metadata.
- Deprecation performed by deletion, which breaks consumers and teaches the organization never to deprecate again.

## Anti-patterns

- **Hiding instead of retiring.** Setting a measure to hidden removes it from the field list and leaves it in the model. Agents read the model, not the field list.
- **Usage-based deletion with no lookback.** Deleting anything unused in 30 days destroys quarter-end and year-end measures.
- **Sprawl audits as a one-time cleanup.** A cleanup with no gate regenerates the sprawl within two release cycles.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Nobody knows how many measures exist. None have ever been retired. |
| 2 | Governed | An inventory exists and a deprecation policy is written. Retirement happens in occasional cleanups. |
| 3 | Contextual | New measures that duplicate an existing definition are blocked at deployment, and deprecated measures are removed from agent-visible metadata. |
| 4 | Operational | Measure count, duplication rate and usage are tracked per model against a target; deprecation follows a consumer-redirect workflow with a stated lookback window. |
| 5 | Autonomous | Duplicate detection and retirement run continuously; unused measures are proposed for deprecation with their consumer impact attached. |

## Diagnostic question

*How many measures exist across your semantic models, how many are duplicates, and when did you last retire one?*

1. We don't know the count.
2. We have an inventory and a written deprecation policy.
3. Duplicates are blocked at deployment and deprecated measures are hidden from agents.
4. Count, duplication and usage are tracked against a target with a redirect-before-delete workflow.
5. Detection and retirement are continuous and automated.

## Evidence to request

- Measure count per model across every workspace.
- The similarity analysis output, if one exists.
- Usage telemetry joined to measures — which measures were queried in the last 90 days, by whom, through which surface.
- The deprecation workflow and the last three measures retired through it.
- What the agent sees: the model metadata exposed to the retrieval layer, and whether hidden measures appear in it.

## Verification

Harvest the measure inventory yourself rather than accepting a count. Sort by name similarity and by expression similarity separately — name similarity finds the `_v2` family, expression similarity finds the genuinely dangerous case where two differently named measures compute the same thing and are used interchangeably. Then check whether hidden measures appear in the agent-visible metadata; they almost always do, which caps the score at 2.

## Article angle

Pairs with canonical metric definitions as the "and then what" piece: defining the right measure is the easy half. The sharper argument is the cost framing — every unretired measure is a permanent line item in every agent request's context budget, which turns a governance chore into a number the CFO can see.

## Sources

- [Metrics Layer vs Semantic Layer](https://www.thoughtspot.com/glossary/metrics-layer-vs-semantic-layer) — metric drift and dashboard drift described as ongoing conditions rather than one-time cleanups, which is the argument for a gate rather than an audit.
- [The Metrics Layer: Your Single Source of Truth for KPI Consistency](https://improvado.io/blog/what-is-a-metrics-layer) — the scale of the problem in practice: hundreds of metrics across dozens of platforms with divergent naming and calculation.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot) — the cost argument for retirement. Every surviving duplicate measure is a candidate in the agent's context on every request, and measured accuracy falls as irrelevant context grows.
