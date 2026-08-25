# AI-readable schema design

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md), [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [RAG grounding quality](RAG%20grounding%20quality.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → AI Readiness & Interoperability → AI-readable schema design (coverage: partial)

## Definition

The schema an agent reads is designed for that reader: descriptions written for interpretation rather than for a data dictionary, synonyms and business vocabulary attached, ambiguous or deprecated objects removed from view, and example values or usage hints present where a name alone is insufficient.

## Why it matters

Query generation is a retrieval problem before it is a reasoning problem. The agent's accuracy is bounded by how well the schema it is shown distinguishes the object the asker meant from the six objects that look similar. Most enterprise schemas were designed for a reader who could ask a colleague; the agent cannot. This is the highest-leverage, lowest-cost capability in Pillar 1 — schema description work typically moves agent accuracy more than any model change — and it is almost always skipped because it is tedious and produces no visible artifact.

## Failure modes

- Descriptions absent, or auto-generated restatements of the column name ("CustomerID: the customer ID").
- Business synonyms unmapped, so the agent cannot connect "revenue," "turnover" and "net sales" to the one measure that means it.
- Deprecated, technical and staging objects visible in the metadata the agent reads.
- No indication of which of several similar objects is the one normally used.
- Coded values with no decode, so the agent filters on `STAT = 'C'` and cannot say what C means.
- Descriptions written for compliance in a catalog that is not the metadata the agent actually retrieves.

## Anti-patterns

- **Cataloguing instead of describing.** Populating a governance catalog while the model the agent reads stays undescribed. Two metadata stores, one consumer, wrong one populated.
- **LLM-generated descriptions accepted unreviewed.** They read well, are plausible, and encode the model's guess about the business — which is precisely the guess the description was supposed to prevent.
- **Exposing everything and relying on the prompt to narrow it.** Pays for the whole schema on every request and still leaves the ambiguity intact.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | The agent reads whatever metadata the model happens to carry. Descriptions are sparse. |
| 2 | Governed | A description standard exists and key objects have been described, usually as a one-time pass. |
| 3 | Contextual | Every agent-visible object carries a purposeful description, synonyms and decode where needed; non-consumer objects are excluded from the agent's view by construction. |
| 4 | Operational | Description coverage and quality are measured, and query-generation accuracy is attributed back to specific schema deficiencies. |
| 5 | Autonomous | Failed or ambiguous agent queries generate schema-improvement candidates automatically, and an undescribed object cannot enter the agent-visible surface. |

## Diagnostic question

*What exactly does the agent see when it inspects your model, and who wrote it for that reader?*

1. Whatever metadata exists; nobody wrote it for an agent.
2. A description standard exists and key objects were described once.
3. Every agent-visible object has a purposeful description and synonyms; non-consumer objects are excluded.
4. Coverage and quality are measured and query errors are traced back to schema gaps.
5. The schema improves itself from failed queries; undescribed objects cannot be exposed.

## Evidence to request

- The actual metadata payload the agent retrieves — dump it, do not accept a description of it.
- Description coverage as a percentage of agent-visible objects, and how many descriptions are non-trivial.
- The synonym or glossary mapping and how it reaches the retrieval layer.
- The rule that determines which objects are agent-visible.

## Verification

Dump the agent-visible schema and read it as if you were the agent. Count objects with no description, objects whose description restates the name, and pairs of objects a reader could not choose between. Then ask a question using the business's own vocabulary rather than the schema's — the gap between those two vocabularies is the actual deficit, and it is invisible to anyone who already knows the model.

## Article angle

The cheapest accuracy win in enterprise AI and the one nobody writes about because it is unglamorous manual work. Good practitioner piece with a real before-and-after measurement: same model, same data, same questions, descriptions added, accuracy delta. That is a proof-shaped argument and it directly supports the thesis that context quality beats model capability.

## Sources

- [Text-to-SQL Benchmarks for Enterprise Realities](https://openreview.net/pdf?id=gXkIkSN2Ha) — the single most useful number in Pillar 1. Frontier models reach 77.5 execution accuracy on BIRD and 39.1% on BIRD-Ent, whose schemas average 4,150 columns with knowledge scattered across enterprise documents. The gap is schema legibility, not model capability.
- [AutoLink: Autonomous Schema Exploration and Expansion for Scalable Schema Linking in Text-to-SQL at Scale](https://arxiv.org/pdf/2511.17190) — the current research answer to undescribed schemas, and useful evidence that solving it at query time is far harder than describing the schema once.
