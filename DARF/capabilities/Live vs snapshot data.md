# Live vs. snapshot data

**Pillar:** Operational Readiness
**Layer:** State
**Status:** Scoped
**Prerequisites:** [Freshness/recency requirements](Freshness%20recency%20requirements.md)
**Verified by:** [State binding correctness](State%20binding%20correctness.md), [Latency requirements by use case](Latency%20requirements%20by%20use%20case.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → State → Live vs. snapshot data (coverage: partial)

## Definition

For every input to an action, the system knows and declares whether it is reading current operational state or a periodic copy of it, and the choice is made deliberately per decision rather than inherited from whatever pipeline already existed.

## Why it matters

This is the boundary between the two pillars, stated as a technical fact. An answer computed from a snapshot may be perfectly good. An *action* taken from a snapshot commits the enterprise to a world that may no longer exist — expediting an order that shipped four hours ago, reordering stock that arrived this morning, escalating a case that closed overnight. The distinguishing feature of Pillar 2 is that the cost of staleness changes from a wrong belief to a wrong act, and most agentic pilots are built on the analytics estate precisely because it was already there.

## Failure modes

- The agent reads the warehouse because that is where the semantic model lives, and the warehouse lags operations by hours.
- Some inputs to one decision are live and others are batch, with no reconciliation, so the composite view describes a moment that never existed.
- A "real-time" dashboard fed by a five-minute micro-batch is treated as live by consumers who were never told the difference.
- Snapshot data used for the check and live data used for the act, or the reverse, so the precondition and the effect disagree.
- Cached results served to an action path with a TTL nobody chose deliberately.
- No declaration at all, so the decision's staleness tolerance was never a design input.

## Anti-patterns

- **Real-time as a platform property.** "We're on a real-time platform" describes an ingestion capability, not the path a specific decision actually takes.
- **Reusing the BI model for action.** The fastest way to a demo and the reason so many pilots cannot be promoted.
- **Mixing without labeling.** A composite view assembled from inputs of different ages, presented as a single current picture.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Whatever data is available is used. The distinction is not made. |
| 2 | Governed | Data paths are documented; teams know which sources are batch and which are streaming. |
| 3 | Contextual | Each decision declares its required state source, actions bind to live state where required, and the answer carries the age and source of every input it used. |
| 4 | Operational | Staleness at decision time is measured per decision type against its declared tolerance, and mixed-age composites are detected. |
| 5 | Autonomous | A decision requiring live state cannot execute against a snapshot; the system blocks or degrades to a recommendation automatically. |

## Diagnostic question

*For your highest-value agent action, is the data it acts on live operational state or a periodic copy — and who decided?*

1. It's whatever the existing pipeline provides.
2. Data paths are documented and teams know the difference.
3. Each decision declares its required source and the answer carries input age.
4. Staleness at decision time is measured against declared tolerance per decision type.
5. Actions requiring live state cannot execute against a snapshot.

## Evidence to request

- The data path diagram for one agent action, from source system to decision point, with latency at each hop.
- The declared state requirement for that decision, if one exists.
- Measured end-to-end staleness at decision time, not pipeline SLA.
- The list of inputs to a composite decision with the age of each.

## Verification

Trace one action end to end and compute the actual age of the data at the moment the action fires, including queue time, refresh cadence and cache TTL. Compare to what the customer believes it is. The gap is typically an order of magnitude, and it is the finding that most reliably reframes an "AI project" as an architecture project.

## Aviation parallel

Air data is sampled continuously and displayed with a failure flag, and the systems that act on it — envelope protection, autothrottle — are wired to the live sensor rather than to a recorded value. The distinction between the flight data recorder and the air data computer is exactly this capability: one is for understanding afterwards, one is for acting now, and confusing them is not a performance problem, it is a category error.

## Article angle

The cleanest statement of why Pillar 2 exists as a separate pillar. Most readers accept "stale data is bad" as a truism and have never separated the two costs — a wrong belief is recoverable by the next refresh, a wrong act is not. That distinction is the framework's whole thesis compressed into one capability, which makes this a strong free-tier piece and a good entry point to the pillar.

## Sources

- [Data Freshness Monitoring: SLA Management](https://www.conduktor.io/glossary/data-freshness-monitoring-sla-management) — the supply side: what it takes to state and hold a freshness commitment rather than a refresh target.
- [Pattern: Saga](https://microservices.io/patterns/data/saga.html) — included for the contrast. Transactional systems have decades of formalism for acting on current state across services; analytics estates have none, which is why agents built on the BI layer inherit a staleness model designed for reading.

*Literature note:* the specific distinction this capability draws — staleness tolerable for an answer versus staleness tolerable for an action — is not well covered anywhere. It is one of the framework's more original claims.
