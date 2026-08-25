# Ambiguous relationship handling

**Pillar:** Semantic Readiness
**Layer:** Context Stability
**Status:** Scoped
**Prerequisites:** [Entity resolution](Entity%20resolution.md), [Grain consistency](Grain%20consistency.md)
**Verified by:** [Filter context correctness](Filter%20context%20correctness.md), [Lineage](Lineage.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Context Stability → Ambiguous relationship handling (coverage: partial)

## Definition

When two entities are connected by more than one path, the model declares which path is authoritative for which question, and no consumer can traverse an ambiguous path without that declaration. Ambiguity includes role-playing dimensions, multiple valid join routes, and inferred versus asserted links.

## Why it matters

A human analyst confronted with two join paths asks which one is meant. An agent picks one. Worse, an agent traversing a knowledge graph will follow an inferred edge — a link some matching or extraction process derived with a confidence score — and present the result with the same assurance as an asserted fact. The distinction between "this supplier ships this part" and "we inferred this supplier probably ships this part" disappears at the answer boundary unless the model carries it.

## Failure modes

- Order date, ship date and invoice date all relate to one date dimension; the agent filters by whichever relationship is active and the answer changes meaning without changing shape.
- Bidirectional cross-filtering enabled to make one report work, creating ambiguity for every other query against that model.
- Inferred graph edges carry a confidence attribute that no consumer surface reads.
- Two paths from customer to revenue exist — one through orders, one through invoices — and they disagree by the value of open orders.
- Relationship semantics were designed once and the graph store cannot evolve schema, so a wrong early decision is permanent until a full rebuild.

## Anti-patterns

- **Bidirectional filtering as a convenience.** It resolves one report's problem and makes the model's behavior non-deterministic for questions nobody has asked yet — which is exactly the population of questions an agent generates.
- **Role-playing dimensions modeled with inactive relationships only.** Correct in DAX with explicit activation, invisible to any consumer that does not know to activate.
- **Confidence stored but not propagated.** The edge has a 0.4 confidence attribute and the answer says "yes."

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Relationships are added as reports require them. Ambiguity surfaces as inconsistent results. |
| 2 | Governed | A relationship design standard exists; role-playing dimensions and multi-path cases are documented. |
| 3 | Contextual | Authoritative paths are declared per question class, role-playing dimensions are modeled physically, and inferred edges are typed distinctly from asserted ones. |
| 4 | Operational | Ambiguous-path queries are detected and reported; confidence on inferred links propagates to the answer surface and is measured. |
| 5 | Autonomous | The model refuses to resolve an ambiguous traversal, returning a disambiguation request instead of a number. |

## Diagnostic question

*When two paths connect the same entities, how does a query — or an agent — know which one to use?*

1. It doesn't; results vary and we investigate when someone notices.
2. The design is documented and modelers follow it.
3. Authoritative paths are declared per question class and inferred edges are typed separately from asserted ones.
4. Ambiguous traversals are detected and reported, and confidence propagates to the answer.
5. The system refuses ambiguous traversal and asks for disambiguation.

## Evidence to request

- The relationship diagram with cross-filter direction and active/inactive state for every relationship.
- The list of role-playing dimensions and how each is modeled.
- The graph schema showing which relationship types are asserted and which are derived, with the derivation process named.
- Any query the agent generated that traversed a multi-path route.

## Verification

Ask a question with a date ambiguity — "what did we ship in March" against a model where order, ship and invoice dates all exist — and inspect the generated query rather than the number. Then ask for an example of an inferred relationship and follow it to the answer surface to see whether the confidence survives the trip. It usually does not, which caps the score at 2.

## Article angle

The inferred-versus-asserted distinction is the strongest angle here and it is barely discussed in the ontology literature, which mostly treats the graph as a set of true statements. The piece writes itself as: your knowledge graph contains guesses, your agent cannot tell them from facts, and nobody has designed the interface that would let it.

## Sources

- [Role-Playing Dimensions](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/role-playing-dimension/) — Kimball Group's canonical treatment, including the requirement that each foreign key reference a separate view of the dimension so the references stay independent. This is the level-3 physical modeling answer.
- [What's the Difference Between an Ontology and a Knowledge Graph?](https://enterprise-knowledge.com/whats-the-difference-between-an-ontology-and-a-knowledge-graph/) — the schema-versus-instance distinction, which is what makes an inferred edge and an asserted edge structurally different objects that most consumers render identically.
