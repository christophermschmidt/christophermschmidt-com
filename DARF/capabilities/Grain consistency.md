# Grain consistency

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Entity resolution](Entity%20resolution.md), [Naming conventions](Naming%20conventions.md)
**Verified by:** [Filter context correctness](Filter%20context%20correctness.md), [Contribution analysis](Contribution%20analysis.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Semantic Integrity → Grain consistency (coverage: pattern)

## Definition

Every table, entity and measure has a declared grain — the exact business event or state that one row represents — and that declaration is asserted rather than assumed. Grain consistency means the declared grain is enforced at load and that measures are only ever combined across compatible grains.

## Why it matters

Grain errors are the most expensive class of silent wrongness in analytics because they produce plausible numbers. A fan-out join at the wrong grain inflates revenue by a factor nobody notices until an auditor does. An agent making a recommendation off an inflated number will not hesitate, will not caveat, and will cite the model as its source. Grain is also the structural precondition for correct filter context: DAX and GQL both behave correctly only when the model's grain matches the modeler's mental model.

## Failure modes

- A fact table has duplicate rows at its supposed key and totals are silently doubled for a subset of entities.
- Header and line grain are mixed in one table, so header-level amounts repeat per line and sum wrong.
- A snapshot fact and a transaction fact are joined and summed together.
- Semi-additive measures (balances, headcount, inventory on hand) are summed across time.
- The ontology entity type and the semantic model table claim the same concept at different grains.
- Late-arriving or reprocessed records create additional rows rather than replacing them, so grain degrades over time.

## Anti-patterns

- **Grain in a comment.** A `-- one row per shipment line` note at the top of a SQL file is documentation, not a constraint.
- **DISTINCT as a grain control.** Deduplicating at query time hides a load defect and makes the count depend on which columns the analyst selected.
- **Relationship cardinality as the only guard.** Cardinality declared in the semantic model catches the error at report time, one layer too late and only for consumers who go through that model. The agent may not.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Grain is implicit. Modelers know it; nothing records it. |
| 2 | Governed | Grain is documented per table in a model spec or data dictionary. |
| 3 | Contextual | Grain is declared as metadata and asserted at load — a uniqueness violation on the declared key fails the pipeline, not the report. |
| 4 | Operational | Grain assertions run on every load across all gold tables, results are reported, and combining incompatible grains is blocked in the semantic layer. |
| 5 | Autonomous | Grain is inferred and re-validated continuously; new tables are refused publication without a declared and passing grain assertion. |

## Diagnostic question

*Where is the grain of each gold table declared, and what happens when data violates it?*

1. Nowhere — grain is understood by the people who built the model.
2. It's documented in a data dictionary or model spec.
3. It's declared as metadata and asserted at load; violations fail the pipeline.
4. Assertions run across all gold tables with reporting, and incompatible-grain combinations are blocked in the semantic layer.
5. Publication of a table without a passing grain assertion is impossible.

## Evidence to request

- The grain declaration for every gold-layer table, in whatever form it exists.
- The data-quality constraint definitions or test suite that assert uniqueness on those keys.
- The last 30 days of pipeline runs showing constraint results, including at least one failure.
- The list of semi-additive measures and what stops them being summed over time.

## Verification

Take the three largest fact tables and run a count against a distinct count of the declared key yourself. Any divergence the customer cannot immediately explain is a grain defect. Then ask which measures are semi-additive; if the answer is "none" for a model containing inventory, balance or headcount, the capability scores 1 regardless of what the pipeline does.

## Aviation parallel

Grain is the units problem that killed the Gimli Glider and Mars Climate Orbiter, applied to rows instead of pounds and kilograms. Both failures came from two components each behaving correctly against a different unstated assumption. The fix in aviation was never "be more careful" — it was making the unit an explicit, checked part of the interface.

## Article angle

The rows-are-not-what-you-think piece. Grain is the most teachable failure in the framework because you can show it in six lines of SQL and the reader recognises their own model immediately. Pairs naturally with the argument that agents remove the human sanity check that used to catch grain errors — an analyst notices when revenue triples, an agent does not.

## Sources

- [Grain Theory: Type-Level Granularity Correctness in Data Pipelines](https://arxiv.org/pdf/2601.00995) — formalises grain as a checkable type-level property rather than a modeling convention, which is exactly the level-2-to-level-3 transition this capability scores.
- [Enterprise Data Modelling Methodologies: A Comparative Analysis of Inmon, Kimball, and Data Vault](https://arxiv.org/pdf/2606.29355) — situates grain declaration across the three dominant methodologies and confirms that failure to declare the grain accurately is the most consequential dimensional design error.
