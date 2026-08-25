# Ontology-vs-semantic-model decision criteria

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Entity resolution](Entity%20resolution.md), [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [Minimum sufficient context](Minimum%20sufficient%20context.md), [Cost per decision](Cost%20per%20decision.md), [Ambiguous relationship handling](Ambiguous%20relationship%20handling.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → AI Readiness & Interoperability → Ontology-vs-semantic-model decision criteria, and "Ten things the platform does not do" → the three-way decision including digital twin builder

*Scope note: this page kept its original name for continuity, but it now covers a four-way decision — semantic model, knowledge graph, ontology, digital twin — because the two-way framing conflated a schema with an instance store and that conflation is the source of most of the confusion in the market. See "The vocabulary" below and README Section 11.*

## Definition

An explicit, defensible basis for deciding which representation a given decision domain requires, and for declaring which questions each representation is authoritative for. The choice is per decision domain, not per platform, and it is revisited as question traffic changes.

## The vocabulary, stated precisely

These four are routinely used interchangeably and are not interchangeable. The distinction is not academic — it determines what you are buying, what you have to maintain, and what you can actually ask.

| | What it is | What it holds | The question it answers well |
|---|---|---|---|
| **Semantic model** | A governed calculation and presentation layer over dimensional data — measures, hierarchies, relationships, formatting | Definitions plus (usually) a materialized copy of the data | "What was net revenue by region last quarter, and is that the number everyone else gets?" |
| **Ontology** | A **schema**. A formal declaration of the classes of thing that exist in a domain, their properties, the relationships that may hold between them, and the rules governing those relationships | Types, not instances. It is empty of business data | "What *kinds* of thing exist here, what may be connected to what, and what can be inferred?" |
| **Knowledge graph** | The **instance data** — actual entities and actual relationships — populated against a schema, typically an ontology | Facts about specific suppliers, parts, patients, orders | "Which suppliers are connected to this part through more than two hops, and by what path?" |
| **Digital twin** | A representation of a physical asset or process, with state over time and usually a simulation capability | Time-series state bound to a modeled physical entity | "What is this machine doing now, and what happens if I change this setpoint?" |

**The one-sentence version: an ontology is the schema, a knowledge graph is that schema populated with data.** You can have an ontology with no knowledge graph — it is just a model nobody has loaded. You cannot have a well-governed knowledge graph without something playing the ontology's role, though many organizations discover the ontology implicitly and badly, one ingestion at a time.

Two consequences that matter commercially. First, "we're doing an ontology project" and "we're building a knowledge graph" are different projects with different costs — the first is modeling work with domain experts, the second is data engineering, entity resolution and ongoing operations. Second, the semantic model and the ontology are **complementary rather than competing**: the semantic model is the authority on the trusted number, the ontology is the authority on the shared vocabulary and the permissible relationships. An organization that treats the ontology as a replacement for the semantic model ends up recomputing governed metrics in a graph query language that is worse at arithmetic.

## Why it matters

This is the most expensive decision in a Pillar 1 program and it is usually made by vendor gravity rather than by criteria. Committing a domain to an ontology and graph when a semantic model would serve it buys years of modeling for questions nobody asked. Committing to a semantic model when the questions are genuinely relational — multi-hop traversal, path finding, network exposure — produces a model that answers the easy questions and cannot express the valuable ones. Both errors are discovered late and cost a rebuild, which is why the criteria belong in the assessment rather than in the build.

## Failure modes

- The choice was made because a platform shipped a feature, not because the question shape required it.
- Ontology and knowledge graph used as synonyms in the same program, so nobody can tell whether the deliverable is a schema or a populated store.
- Both a semantic model and a graph are built with no declared authority per question class, producing two answers and a parity problem.
- An ontology is modeled comprehensively before any decision domain is named, so scope has no natural boundary and the program has no completion criterion.
- The relational questions the graph was built for turn out to be answerable in three joins.
- The dimensional questions the semantic model handles well are re-expressed in the graph and perform badly or aggregate incorrectly.
- Digital-twin-shaped problems — simulation, physical state over time — forced into one of the other three.
- No entity resolution underneath, so the graph is populated with duplicate entities and every traversal is wrong.

## Anti-patterns

- **"Ontology as the control plane" adopted as a conclusion.** A defensible architectural position, and not a criterion. It answers a question the customer has not yet been shown to be asking.
- **Deciding at platform level rather than per decision domain.** Different domains in the same enterprise legitimately land differently.
- **Treating the graph as a superset.** Graph stores in most stacks have real constraints — type support, schema evolution, aggregation behavior — that make them worse at things a dimensional model does trivially.
- **Buying a knowledge graph to avoid doing entity resolution.** The graph makes the resolution problem visible; it does not solve it.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Representation follows whatever the current platform or vendor offers. The vocabulary is used loosely. |
| 2 | Governed | The choice is deliberate and documented for the current program, with reasoning recorded and the terms used consistently. |
| 3 | Contextual | Written criteria exist based on question shape, entity volatility, traversal depth and grain, applied per decision domain, with a declared authoritative representation per question class. |
| 4 | Operational | Actual question traffic is analyzed against the criteria to test whether the choice was right, and the cost and latency of each representation per answered question is known. |
| 5 | Autonomous | Representation choice is revisited automatically as question traffic shifts, and routing between representations is decided per question rather than per domain. |

## Diagnostic question

*Why did you choose the representation you chose for this domain, which questions is each representation authoritative for, and can your team state the difference between your ontology and your knowledge graph?*

1. It came with the platform, and the terms are used interchangeably.
2. It was a deliberate, documented decision for this program.
3. We apply written criteria per decision domain and declare authority per question class.
4. We test the choice against real question traffic and know the cost per answered question.
5. The choice is re-evaluated automatically and routing happens per question.

## Evidence to request

- The criteria document, if it exists, and the decision record for the current domain.
- The list of questions the domain is meant to answer, gathered *before* the representation was chosen.
- The ontology artifact and the graph population statistics, separately — if only one exists, ask which.
- Query traffic by shape: how many questions actually traverse more than two hops.
- The cost and latency profile of each representation for a comparable question.

## Verification

Take the customer's own list of target questions and classify them by shape yourself: aggregation over a known hierarchy, multi-hop traversal, path or network analysis, temporal state of a physical asset. If the large majority are the first kind and an ontology-and-graph program is underway, that mismatch is the highest-value finding in the assessment — and the most commercially delicate to deliver, because someone in the room sponsored it. Separately, ask two people on the program to define ontology and knowledge graph; divergent answers cap the capability at 1 regardless of what has been built.

## Article angle

Genuinely useful and largely unwritten, because the loudest voices in the space all sell one of the answers. Two pieces live here. The first is definitional and will travel furthest: ontology is the schema, knowledge graph is the schema populated, semantic model is the trusted number, digital twin is the physical thing — four words the industry uses as one. The second is the decision table, with the honest admission that most enterprise questions are dimensional and the graph's value shows up in a minority of high-value cases. Being the person who says that while still building graphs is a strong, differentiated position.

## Sources

- [What's the Difference Between an Ontology and a Knowledge Graph?](https://enterprise-knowledge.com/whats-the-difference-between-an-ontology-and-a-knowledge-graph/) — the cleanest statement of the schema-versus-instance distinction: ontologies are generalized semantic data models, and a knowledge graph is what you get when you apply that model to instance data.
- [Ontology vs. Semantic Layer: Differences & How to Choose](https://atlan.com/know/ontology-vs-semantic-layer/) — the complementarity argument, and why most enterprise AI deployments need both rather than choosing between them.
- [Semantic Layer vs Ontology vs Knowledge Graph vs Context Graph](https://timbr.ai/semantic-layer-vs-ontology-vs-knowledge-graph-vs-context-graph/) — the four-way comparison, useful for seeing how vendors themselves draw the lines.
- [Enterprise Knowledge Graph Buyer's Guide 2026](https://promethium.ai/guides/enterprise-knowledge-graph-buyers-guide-2026/) — vendor-side, but carries the maintenance figure worth quoting in a scoping conversation: roughly one FTE of semantic stewardship per 50–100 entity types as an ongoing cost.
