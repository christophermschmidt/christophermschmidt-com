# Naming conventions

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** none — this is a root capability
**Verified by:** [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md), [AI-readable schema design](AI-readable%20schema%20design.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Semantic Integrity → Naming conventions (coverage: pattern)

## Definition

A single, enforced convention governing how tables, columns, entities, properties, relationships and measures are named across every layer a consumer can reach. Naming is the interface between a human's vocabulary, an agent's retrieval, and the physical model.

## Why it matters

An agent resolves a question to a schema element by name. When the same concept is `cust_id`, `CustomerID`, `Customer Key` and `party_ref` in four places, the agent picks one, silently, and is right some of the time. Naming is the cheapest capability in the framework and the one whose absence contaminates every capability above it — you cannot have canonical metrics, an AI-readable schema, or a defensible lineage graph on top of inconsistent names.

## Failure modes

- The same business concept carries different names in the warehouse, the semantic model and the ontology, with no mapping artifact between them.
- Column names encode source-system history (`ZZ_FLD_07`, `LEGACY_AMT2`) that no consumer can interpret.
- Abbreviations are inconsistent within a single model (`qty`, `quantity`, `QTY_ORD`).
- Ontology property names were auto-derived from source columns, so the business vocabulary inherited ERP naming.
- Display names and underlying names diverge, so what the user sees and what the agent queries are different strings.

## Anti-patterns

- **A published standard with no gate.** A naming document in a wiki that nothing in the pipeline reads. This scores 2, not 3, no matter how good the document is.
- **Renaming in the presentation layer only.** Friendly names applied in reports while the model underneath keeps source naming — the agent and the API see the bad names.
- **Treating the ontology's character constraints as a modeling detail.** Length and character restrictions force a rename of nearly every source column; if that mapping is not a governed artifact it becomes an undocumented translation layer.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Names are chosen per project by whoever builds the object. No convention exists. |
| 2 | Governed | A written naming standard exists and is agreed. Compliance depends on review and memory. |
| 3 | Contextual | The convention is enforced at commit or deploy — a non-conforming object fails the pipeline rather than reaching production. |
| 4 | Operational | Conformance is measured across the estate, drift is reported against a target, and the source-to-canonical name mapping is a versioned artifact. |
| 5 | Autonomous | Violations are detected and either auto-corrected or blocked with a suggested conforming name, and new sources are onboarded against the convention without human naming decisions. |

## Diagnostic question

*How is naming consistency enforced across your semantic layer, ontology and warehouse?*

1. It isn't — each team names things its own way.
2. We have a documented standard; compliance is checked in review.
3. Non-conforming names fail an automated gate before deployment.
4. We measure conformance across the estate and hold a target; the source-to-canonical mapping is versioned.
5. The system detects and remediates naming drift on its own.

## Evidence to request

- The naming standard document, with its version and owner.
- The CI or deployment configuration that enforces it — the actual rule file, not a description of one.
- A recent pull request that failed on a naming rule.
- The source-column-to-canonical-name mapping artifact.
- A list of every object added in the last 90 days, with conformance status.

## Verification

Do not accept the standard as evidence of the score. Pick three business concepts the customer named in the discovery conversation and trace each through warehouse, semantic model, ontology and report layer, recording every string it appears as. Three concepts with four consistent names is a 3. Any concept with more than one unmapped name is a 2, regardless of what the pipeline claims to enforce.

## Article angle

The unglamorous capability that gates the whole framework. Everyone agrees naming matters and almost nobody enforces it in code, because naming discipline has historically had no consumer sharp enough to punish its absence. Agents are that consumer. The argument writes itself: the reason your Copilot pilot returns the wrong column is not the model.

## Sources

- [Text-to-SQL Benchmarks for Enterprise Realities](https://openreview.net/pdf?id=gXkIkSN2Ha) — the quantitative case that naming and schema legibility, not model quality, is what breaks enterprise query generation: state-of-the-art models score 77.5 on the academic BIRD benchmark and 39.1% on BIRD-Ent, whose databases average 4,150 columns.
- [AutoLink: Autonomous Schema Exploration and Expansion for Scalable Schema Linking in Text-to-SQL at Scale](https://arxiv.org/pdf/2511.17190) — schema linking is the formal name for the problem an inconsistent naming convention creates, and this is the current state of the art on solving it after the fact rather than preventing it.

*Literature note:* naming conventions have no canonical citable standard — DAMA-DMBOK and Kimball both assume one exists without prescribing it. The strongest available evidence is indirect, from the query-generation benchmarks above.
