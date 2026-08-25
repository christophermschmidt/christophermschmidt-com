# Change safety and versioning

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Semantic contracts](Semantic%20contracts.md), [Lineage](Lineage.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md), [Retrospective causality](Retrospective%20causality.md)
**Microsoft implementation:** not mapped as a discrete row in the reference architecture — Fabric Git integration and deployment pipelines are the raw material; the ontology's lack of schema evolution and the graph store's rebuild requirement are the two hard constraints to design around

## Definition

The discipline that lets the semantic layer change without breaking the systems that depend on it: versioning of definitions, impact analysis before merge, deprecation with a stated window, and the ability to reproduce a past answer using the definitions that were in force when it was given.

## Why it matters

Two things make this urgent under agents that were tolerable under dashboards. First, the consumer population is larger and less visible, so the blast radius of a definition change is unknown at the moment of change. Second, and more seriously, an audit or incident review asks what the system believed at the time — and if definitions are not versioned, a decision made in March cannot be reconstructed in August because the metric it used no longer means the same thing. Retrospective causality in Pillar 2 depends entirely on this capability existing in Pillar 1.

## Failure modes

- Definitions live only in the current state of the model; the previous definition is recoverable only from source control archaeology, if at all.
- A measure's logic changes and every historical report silently restates.
- Deprecation happens by deletion, so consumers discover the change as an outage.
- Impact analysis is dataset-level, so the change owner cannot see which specific consumers break.
- The ontology or graph store cannot evolve schema, so a change requires a rebuild that nobody budgets for and everybody therefore avoids — freezing a wrong model in place.
- Agent-visible metadata and the underlying model version drift apart during a phased deployment.

## Anti-patterns

- **Git as the versioning strategy.** Source control gives you diffs. It does not give you the ability to answer a query as of a past definition, which is the actual requirement.
- **Backward compatibility by never deleting.** Produces the sprawl the framework separately penalises. Deprecation must actually complete.
- **Testing the change, not the consumers.** A change validated against its own unit tests and released into an unmapped consumer population.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Changes are made in place. History of meaning is not retained. |
| 2 | Governed | Definitions are in source control with a review process and a change log. |
| 3 | Contextual | Definitions are versioned as artifacts with impact analysis run before merge; deprecation follows a stated window with consumer redirection, and breaking changes require an explicit version increment. |
| 4 | Operational | The estate can reproduce a past answer using the definitions in force at that time; change failure rate and deprecation compliance are measured. |
| 5 | Autonomous | Breaking changes are detected and blocked automatically, consumers are migrated or pinned without manual coordination, and point-in-time definition reproduction is a supported query. |

## Diagnostic question

*If a metric definition changed in March, can you reproduce the answer a March report gave using the March definition — and what happened to the consumers when it changed?*

1. No, and consumers found out when their reports moved.
2. The change is in source control with a log; consumers were notified informally.
3. Definitions are versioned artifacts, impact analysis runs before merge, and deprecation has a stated window.
4. Past answers are reproducible against past definitions, and change failure rate is measured.
5. Breaking changes are blocked automatically and consumers are migrated or pinned by the platform.

## Evidence to request

- The version history of one headline metric definition, with effective dates.
- The impact analysis output from the most recent semantic change.
- The deprecation policy and the last completed deprecation.
- Evidence of a point-in-time reproduction — an answer regenerated as of a past date.
- The rebuild plan and budget for the ontology or graph layer, if schema evolution is unsupported there.

## Verification

Pick a metric that changed in the last year and ask them to reproduce the pre-change value for a pre-change period, live. This almost always fails, and the failure is the single most useful finding for the Audit layer conversation later in the engagement — it demonstrates that the compliance story they believe they have is not reconstructible.

## Article angle

The point-in-time reproduction requirement is the sharp end and it connects directly to the regulatory frame: high-risk AI obligations require reconstructability of decisions, and a decision cannot be reconstructed if its inputs' definitions have been overwritten. That reframes semantic versioning from engineering hygiene into a compliance dependency, which is a very different budget conversation.

## Sources

- [Time travel: two-dimensional time with bitemporal data](https://aiven.io/blog/two-dimensional-time-with-bitemporal-data) — the mechanism behind point-in-time reproduction: you cannot reconstruct a past answer without recording when each fact was believed as well as when it was true.
- [EU AI Act, Article 12 — Record-Keeping](https://artificialintelligenceact.eu/article/12/) — why reproduction is now an obligation rather than an engineering preference: high-risk systems must support reconstruction of decisions, which a semantic layer that overwrites definitions cannot deliver.
