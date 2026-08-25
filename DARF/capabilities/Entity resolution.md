# Entity resolution

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md)
**Verified by:** [Grain consistency](Grain%20consistency.md), [Lineage](Lineage.md), [State binding correctness](State%20binding%20correctness.md)
**Microsoft implementation:** not mapped in the reference architecture — Microsoft ships no first-party entity resolution service in the Fabric/Foundry stack; this is a build or a third-party dependency

## Definition

The discipline of deciding, provably and repeatably, when two records in different systems refer to the same real-world thing — the same supplier, patient, part, customer or asset — and maintaining that decision as a durable identity that every downstream layer shares. The output is an identity spine: a persistent key per real-world entity, with the evidence for each merge and split retained.

## Why it matters

An ontology is a set of assertions about entities. If the entity does not resolve — if "Acme Packaging Ltd" in the ERP and "ACME PACKAGING" in the supplier risk system are two entities to the system and one entity to the business — then every relationship, every rollup and every agent answer built on top is wrong in a way no amount of semantic modeling will fix. This is the single most common reason ontology programs stall at the binding step, and it is almost never on the readiness checklist because it is treated as an MDM project that finished years ago.

## Failure modes

- Aggregate exposure or spend by counterparty is understated because one counterparty exists under several keys.
- The agent answers a question about "our largest supplier" correctly for one system's view and incorrectly for the enterprise.
- Merge decisions live inside a legacy MDM tool with no exposed key, so the semantic layer cannot reuse them.
- Resolution rules are deterministic-only, so the long tail — the records that matter most in risk and compliance questions — never matches.
- Splits are impossible: once two records are merged, unwinding the merge requires a data-fix ticket.
- Entity identity is stable in the warehouse but recomputed differently in the real-time stream, so state and history disagree about who the entity is.

## Anti-patterns

- **"We have MDM."** An MDM platform that publishes golden records to three consuming systems and nothing else is not an identity spine. The test is whether the semantic layer, the ontology and the event stream all key on the same identifier.
- **Resolution inside the ontology.** Doing fuzzy matching at ontology bind time buries a probabilistic decision inside a layer everyone treats as assertional. Downstream consumers cannot tell a resolved link from a declared one.
- **Confidence discarded at the boundary.** The matching engine produces a score; the published key does not carry it. The agent then presents a 0.62-confidence merge as fact.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Matching is done per-report, usually by joining on name or a cleaned string. Each analysis reinvents it. |
| 2 | Governed | A resolution process exists with documented rules and a stewardship queue. Output is a golden record set consumed by some systems. |
| 3 | Contextual | A persistent enterprise key is published and every layer — warehouse, semantic model, ontology, event stream — binds to it. Match confidence is carried through as an attribute. |
| 4 | Operational | Match precision and recall are measured against a labeled sample, unresolved-entity rates are reported per domain, and steward decisions are logged and reversible. |
| 5 | Autonomous | New sources resolve on onboarding without a manual mapping pass, the model retrains on steward decisions, and low-confidence entities are quarantined from agent-facing surfaces automatically. |

## Diagnostic question

*How does the system know that a record in one source and a record in another refer to the same real-world entity?*

1. Analysts join on name or a cleaned string, per report.
2. An MDM process produces golden records for some domains.
3. A persistent enterprise key is published and every layer binds to it, with confidence carried as an attribute.
4. Resolution quality is measured against a labeled sample and reported per domain.
5. Resolution is continuous and self-improving; low-confidence entities are withheld from agents automatically.

## Evidence to request

- The list of entity domains in scope, and for each: whether a persistent key exists and what publishes it.
- The match rule set or model, with the last date it was changed.
- A precision/recall measurement against a labeled sample — or the admission that none exists.
- The steward decision log, including at least one split.
- Schema evidence that the ontology, the semantic model and the event stream key on the same identifier.

## Verification

Ask for the top 20 counterparties by spend from the ERP and the top 20 from the risk or CRM system, and reconcile the lists yourself. Every unexplained non-match is an entity resolution defect and it will reproduce in every agent answer that aggregates by counterparty. Then ask what the enterprise key is for the largest one and confirm the same string appears in all three layers.

## Article angle

Ontology discourse in 2026 assumes the entities exist. They don't. The unglamorous prerequisite to every knowledge-graph slide is a resolution problem the industry solved badly twenty years ago and then declared finished. Strong companion piece to the ontology-vs-semantic-model argument: the decision criteria are moot if the entity spine isn't there, and the honest first answer for most enterprises is "neither yet."

## Sources

- [What Is Entity Resolution? How It Works & Why It Matters](https://senzing.com/what-is-entity-resolution/) — vendor-authored but the clearest available statement of the problem shape: why deterministic matching fails on the long tail, and why agentic decision-making raises the bar from batch golden records to always-current identity.
- [Enterprise AI Agent Data Readiness: Six-Step Framework](https://atlan.com/know/ai-agent/data-for-ai/how-to-prepare-enterprise-data-for-ai-agents/) — places entity resolution as a precondition rather than a downstream concern, and carries the survey finding that only 29% of technology leaders believe their data meets the quality bar for scaling AI.
- [Master Data Management Success Begins with Entity Resolution](https://senzing.com/master-data-management-mdm/) — the argument for why an MDM program that ended in golden records published to three systems is not an identity spine.
