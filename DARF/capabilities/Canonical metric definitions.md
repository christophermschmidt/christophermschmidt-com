# Canonical metric definitions

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md), [Grain consistency](Grain%20consistency.md), [Units/currency/time handling](Units%20currency%20time%20handling.md)
**Verified by:** [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md), [Measure sprawl](Measure%20sprawl.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Semantic Integrity → Canonical metric definitions (coverage: partial) and "Ten things the platform does not do" → canonical metric enforcement

## Definition

For every metric the business argues about, exactly one definition is authoritative, has a named owner, and is the only implementation any consumer can reach. Canonical does not mean documented; it means that computing the metric any other way is either impossible or immediately visible.

## Why it matters

This is the capability everyone claims and almost nobody has. The reason it matters more under agents than it did under dashboards is arbitration: when two dashboards disagreed, a human noticed and escalated. When an agent is asked for revenue and twelve definitions exist, it selects one by relevance heuristics and returns a single confident number with no indication that the question was ambiguous. The disagreement doesn't surface — it gets resolved silently, differently each time.

## Failure modes

- Twelve semantic models each define "Net Revenue" and all are endorsed or certified.
- The metric definition in the governance catalog is prose; the definition in the model is DAX; they have diverged and nobody compares them.
- A metric is correct in the semantic model and reimplemented in a notebook, a stored procedure and an API for consumers who bypass the model.
- Ownership is by team, not by person, so no one can approve a change.
- Certification is a badge applied once at publication and never re-evaluated.

## Anti-patterns

- **Endorsement as enforcement.** A "Certified" label is metadata. It constrains nothing. Twelve models can each define a metric differently and all carry the label.
- **The metrics catalog nobody queries.** A registry that documents definitions but sits outside the query path is a level-2 artifact presented as a level-3 one.
- **Canonical-in-one-tool.** The definition is enforced in the BI layer only, so every agent, notebook and API consumer re-derives it.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Metrics are defined in whichever artifact needs them. Duplicates are unknown. |
| 2 | Governed | A metric catalog exists with owners and prose definitions. Compliance is by convention. |
| 3 | Contextual | One implementation is authoritative and reachable by every consumer path; a duplicate definition fails a CI gate before it reaches production. |
| 4 | Operational | Duplicate and near-duplicate definitions across the estate are detected and reported, usage is measured per definition, and change goes through the owner. |
| 5 | Autonomous | The registry is the source of the implementation, drift is impossible by construction, and a proposed metric that duplicates an existing one is rejected with the existing one named. |

## Diagnostic question

*If two people in your organization compute the same headline metric, what makes them get the same number?*

1. Nothing — they usually don't.
2. A documented definition they are both expected to follow.
3. A single implementation both are forced through; duplicates fail a deployment gate.
4. We detect duplicate definitions across the estate and measure which one consumers actually use.
5. Definitions are generated from a registry; divergence is structurally impossible.

## Evidence to request

- The metric registry, with owner and last-reviewed date per metric.
- The CI rule that fails a build on a duplicate or non-registered measure.
- An inventory of measures across all workspaces with similarity analysis — or the absence of one.
- The three most recently changed metric definitions, with their approval records.
- Every non-BI consumer path (notebook, API, stored procedure) and how each obtains the metric.

## Verification

Choose the metric the executive sponsor named in the kickoff. Find every implementation of it across every workspace, notebook and API in the estate and diff them. The count of distinct implementations is the score: one is a 3 or above, more than three is a 1 no matter what the registry says. Then ask the agent the same question twice, phrased differently, and compare.

## Article angle

The strongest free-tier argument in Semantic Integrity, because the reader already believes the premise and has never been shown the consequence. The turn is that the metric layer was never actually load-bearing — dashboards tolerated disagreement because humans arbitrated it. Agents remove the arbitrator, which converts a governance annoyance into a correctness failure.

## Sources

- [Semantic Layer: What it is and when to adopt it](https://www.getdbt.com/blog/semantic-layer-introduction) — the canonical statement of the hub-and-spoke argument: metrics defined once centrally and queried from every tool, API and LLM.
- [Promote and certify Power BI content with endorsement](https://learn.microsoft.com/power-bi/collaborate-share/service-endorsement-overview) — read this as evidence for the anti-pattern rather than the pattern. Endorsement is explicitly a discoverability and trust *signal*; nothing in it constrains a second model from defining the same metric differently and also being certified.
- [Metrics Layer vs Semantic Layer](https://www.thoughtspot.com/glossary/metrics-layer-vs-semantic-layer) — names metric drift and dashboard drift as distinct failure modes, which is the distinction between a definition changing and consumers not following it.
