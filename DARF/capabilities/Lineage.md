# Lineage

**Pillar:** Semantic Readiness
**Layer:** Analytical Explainability
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md)
**Verified by:** [Retrospective causality](Retrospective%20causality.md), [Change safety and versioning](Change%20safety%20and%20versioning.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Analytical Explainability → Lineage (coverage: partial)

## Definition

For any number a consumer can see, the complete and queryable path from that number back to the source records and transformations that produced it — column-level, not dataset-level, and available at answer time rather than through a separate governance tool.

## Why it matters

Lineage was a governance asset when its consumer was a data steward doing impact analysis on a change. Under agents it becomes an answer-time asset: the provenance the agent needs to cite, the path an investigator needs to reconstruct a decision, and the dependency graph a change-safety gate needs to know what a modification will break. Dataset-level lineage — "this report uses that lakehouse" — is insufficient for all three, because the question is always about a specific column.

## Failure modes

- Lineage stops at the boundary between tools: complete inside the warehouse, absent through the notebook that enriches it.
- Lineage is dataset-level, so an impact analysis returns "47 reports affected" and nobody can narrow it.
- Transformations performed in code the lineage tool cannot parse — dynamic SQL, notebook logic, a pipeline activity — appear as opaque nodes.
- Lineage exists in the catalog and is not reachable from the answer, so the agent cites the dataset name and nothing more.
- The graph reflects design-time definitions rather than what actually ran, so a pipeline that skipped a step still shows the step.

## Anti-patterns

- **Manual lineage documentation.** A maintained diagram is a snapshot of intent, and it diverges from execution within one release.
- **Lineage as a compliance artifact.** Collected to satisfy an audit question and never wired to anything that consumes it.
- **Confusing lineage with provenance.** Lineage is the structural path; provenance is what actually happened on a specific run. Explainability needs both and most estates have neither at the level required.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Lineage is reconstructed by reading code when someone asks. |
| 2 | Governed | Lineage is captured in a catalog at dataset level and refreshed on a schedule. |
| 3 | Contextual | Column-level lineage is captured automatically across every hop including code-based transformations, and is queryable by systems, not just by people. |
| 4 | Operational | Lineage completeness is measured — the proportion of the estate with unbroken column-level coverage — and gaps are tracked; the graph reflects executed runs, not just definitions. |
| 5 | Autonomous | Lineage is emitted by the runtime as a byproduct of execution, so it cannot be stale, and downstream impact is computed automatically before a change is allowed to merge. |

## Diagnostic question

*For a number on an executive report, can you produce the column-level path back to source — automatically, and including every transformation step?*

1. Only by reading the code.
2. Dataset-level lineage exists in a catalog.
3. Column-level lineage is captured automatically across every hop and is machine-queryable.
4. Coverage is measured and gaps tracked; the graph reflects what actually ran.
5. Lineage is emitted by the runtime and gates changes automatically.

## Evidence to request

- A column-level lineage trace for one named executive metric, produced live.
- The list of transformation steps the lineage tooling cannot parse.
- Lineage coverage as a percentage of gold-layer columns.
- Whether the lineage graph is reachable by an API the agent or the audit layer could call.

## Verification

Name a number on the customer's own executive report and ask them to trace it to source in front of you. Time the exercise. If it takes more than a few minutes or requires a person who happens to know, the capability is at 1 or 2 whatever the catalog shows. Then ask for the same trace through a notebook-based transformation, which is where coverage usually ends.

## Article angle

The reframe is that lineage stopped being a governance feature the moment an agent needed to cite its sources — it became a runtime dependency. Most enterprises have lineage tooling procured for the old job and it is the wrong shape for the new one. Good paid piece because the proof is a live trace.

## Sources

- [Column-Level Lineage](https://openlineage.io/docs/integrations/spark/spark_column_lineage/) — the open standard's column-level facet, which is the specific granularity this capability requires and the level most catalog tooling does not reach.
- [OpenLineage](https://github.com/OpenLineage/OpenLineage) — the specification itself. Its design premise, that lineage should be emitted by jobs as they run rather than reconstructed afterwards, is the level-5 anchor on this page.
