# Semantic parity across surfaces

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Canonical metric definitions](Canonical%20metric%20definitions.md), [Units/currency/time handling](Units%20currency%20time%20handling.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** not mapped as a discrete row in the reference architecture — the parity risk is created by the architecture's own multiple query paths (semantic model XMLA, ontology GQL, Eventhouse KQL, direct lakehouse SQL)

## Definition

The same business question, asked through any supported surface — dashboard, conversational agent, API, notebook, embedded application — returns the same answer, or returns an explicit statement of why it cannot. Parity is a property of the estate, not of any one model.

## Why it matters

This is the failure customers notice first and the one that ends pilots. An executive asks the agent a question they already know the dashboard's answer to, gets a different number, and the agent is finished — no amount of subsequent correctness recovers the trust. It is also the failure most likely to be present in an organization that scores well on every other Semantic Integrity capability, because parity breaks at the seams between correctly built components: the ontology query federates differently than the DAX path, the API predates the current metric definition, the real-time surface uses a different watermark.

## Failure modes

- The agent's natural-language-to-query path bypasses the semantic model for some question shapes and re-derives the metric against raw tables.
- Aggregation behaves differently in the graph query language than in DAX for the same logical rollup.
- A row-level security rule is enforced on one surface and not another, so two users comparing notes see different totals and neither is wrong.
- The dashboard reads a cached or imported copy while the agent reads live, so both are correct at different instants and neither says so.
- An embedded API endpoint was built against a metric definition that has since changed.

## Anti-patterns

- **Parity by policy.** "All consumers must use the semantic model" as a written rule, with three known exceptions in production.
- **Testing the model instead of the surface.** A regression suite that validates DAX measures proves nothing about what the agent returns, because the agent's failure is usually in query generation, not evaluation.
- **Explaining the discrepancy rather than removing it.** A documented list of known differences between surfaces is better than nothing and is still a level-2 artifact.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Surfaces are built independently. Discrepancies are discovered by users. |
| 2 | Governed | A rule states which surface is authoritative and known differences are documented. |
| 3 | Contextual | All surfaces resolve through the same definition layer; paths that cannot are blocked rather than tolerated. |
| 4 | Operational | A golden-question set is executed against every surface on every change and divergence is reported as a defect with an owner. |
| 5 | Autonomous | Divergence is detected in production traffic, not just in test, and a diverging surface is degraded or taken out of the routing pool automatically. |

## Diagnostic question

*If the same question is asked of the dashboard, the agent and the API, what guarantees the same answer?*

1. Nothing — we'd expect them to differ.
2. A policy naming one authoritative surface, with documented known differences.
3. All surfaces resolve through one definition layer; non-conforming paths are blocked.
4. A golden-question set runs against every surface on every change and divergence is a tracked defect.
5. Divergence is detected in live traffic and the diverging surface is automatically removed from service.

## Evidence to request

- The list of every surface through which a business number can be obtained, including the ones built by a business unit outside IT.
- The golden-question suite and its last run results, per surface.
- The query the agent actually generated for the last three questions asked of it — not the answer, the query.
- Cache and refresh configuration per surface, with the resulting maximum divergence window.

## Verification

Run the test in the room. Take five questions the customer cares about, ask each of the dashboard, the agent and one API or notebook path, and put the three numbers side by side. This is the single most persuasive five minutes in the entire assessment and it needs no prior access. Score against the count of unexplained divergences, not against the customer's account of why they occur.

## Article angle

The demo-to-production piece. Everything about this failure is legible to a non-technical reader — three screens, three numbers — which makes it the best available on-ramp to the whole Semantic Readiness pillar. The argument underneath: parity is not a testing problem, it is evidence that the definition layer was never actually load-bearing, only conventionally observed.

## Sources

- [Text-to-SQL Benchmarks for Enterprise Realities](https://openreview.net/pdf?id=gXkIkSN2Ha) — why the agent path and the curated-report path diverge: enterprise schemas defeat query generation in ways a hand-built dashboard never exposed.
- [Metrics Layer vs Semantic Layer](https://www.thoughtspot.com/glossary/metrics-layer-vs-semantic-layer) — the single-source-of-truth argument stated as a cross-tool property rather than a per-tool one, which is what parity requires.
