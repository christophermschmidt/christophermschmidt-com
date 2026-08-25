# DARF Capabilities

capabilities across the 8 layers (see `README.md` Section 3). Each row links
to its detail page in `capabilities/`. Every page carries a definition, failure
modes, anti-patterns, five maturity anchors, a scored diagnostic question, the
evidence an assessor should request, a verification method, two or more cited
sources, and — where the analogy is exact rather than decorative — an aviation
parallel.

*Last rebuilt 2026-08-11. Grew from the 33-capability seed set to 51: the three
capabilities identified in `../DARF-Aviation-Reconciliation.md` Section 2,
eleven gaps surfaced by a 2026 landscape review (README Section 10), and three
covering the unstructured estate — documents, procedures and conversation —
which the original seed set omitted entirely (README Section 12).*

**Every page stands alone.** A reader who opens one capability page with no
prior knowledge of DARF should be able to understand what the capability is,
why it matters, how to score it, and where the argument comes from. The
framework is what emerges from reading them together, not a precondition for
reading any one of them.

**Sourcing.** Each page cites two or more external sources with a line on what
each establishes. Where the literature is genuinely thin — units of measure,
variance decomposition, live-versus-snapshot for action, procedural capture —
the page says so rather than padding, because an honestly-stated gap is a
publishing opportunity and a fabricated citation is a credibility loss.

**Status key:** every capability is now `Scoped`. `Scoped` means the page has
real definition, maturity anchors, a diagnostic question and verification
guidance — not that the capability has been validated in a live engagement.

**On the "Linked Backlog IDs" column:** removed. The mapping dated from the
2026-07-30 DARF import, IDs had already shifted twice, and `BACKLOG.md` is not
co-located with this folder. Each capability page now carries an *Article angle*
section stating the argument in prose, which is useful whether or not a backlog
ID resolves. Reconcile to backlog IDs in the RTD repo if and when that mapping
is wanted again.

---

## Pillar 1 — Semantic Readiness

*Can you trust the answer?*

### Semantic Integrity

| Capability | Prerequisites |
|---|---|
| [Naming conventions](capabilities/Naming%20conventions.md) | — |
| [Entity resolution](capabilities/Entity%20resolution.md) **new** | Naming conventions |
| [Grain consistency](capabilities/Grain%20consistency.md) | Entity resolution, Naming conventions |
| [Units/currency/time handling](capabilities/Units%20currency%20time%20handling.md) | Naming conventions |
| [Canonical metric definitions](capabilities/Canonical%20metric%20definitions.md) | Naming conventions, Grain consistency, Units/currency/time handling |
| [Measure sprawl](capabilities/Measure%20sprawl.md) | Canonical metric definitions |
| [Semantic parity across surfaces](capabilities/Semantic%20parity%20across%20surfaces.md) **new** | Canonical metric definitions, Units/currency/time handling |

### Context Stability

| Capability | Prerequisites |
|---|---|
| [Ambiguous relationship handling](capabilities/Ambiguous%20relationship%20handling.md) | Entity resolution, Grain consistency |
| [Filter context correctness](capabilities/Filter%20context%20correctness.md) | Grain consistency, Ambiguous relationship handling |
| [RLS design](capabilities/RLS%20design.md) | Entity resolution, Grain consistency |
| [Time intelligence](capabilities/Time%20intelligence.md) | Units/currency/time handling, Grain consistency |
| [Freshness/recency requirements](capabilities/Freshness%20recency%20requirements.md) | Lineage |

### Analytical Explainability

| Capability | Prerequisites |
|---|---|
| [Lineage](capabilities/Lineage.md) | Naming conventions |
| [Drivers vs. correlation](capabilities/Drivers%20vs%20correlation.md) | Lineage, Canonical metric definitions |
| [Contribution analysis](capabilities/Contribution%20analysis.md) | Canonical metric definitions, Grain consistency |
| [Narrative-ready model design](capabilities/Narrative-ready%20model%20design.md) | Canonical metric definitions, Contribution analysis |

### AI Readiness & Interoperability

The largest layer, at 11. It is where the 2026 landscape moved most, and where
the unstructured estate lives. Resist the urge to balance it by splitting.

| Capability | Prerequisites |
|---|---|
| [AI-readable schema design](capabilities/AI-readable%20schema%20design.md) | Naming conventions, Canonical metric definitions |
| [Ontology-vs-semantic-model decision criteria](capabilities/Ontology-vs-semantic-model%20decision%20criteria.md) | Entity resolution, Canonical metric definitions |
| [Semantic contracts](capabilities/Semantic%20contracts.md) | AI-readable schema design, Canonical metric definitions |
| [Change safety and versioning](capabilities/Change%20safety%20and%20versioning.md) | Semantic contracts, Lineage |
| [Unstructured content readiness](capabilities/Unstructured%20content%20readiness.md) **new** | Naming conventions, Entity resolution |
| [Procedural knowledge capture](capabilities/Procedural%20knowledge%20capture.md) **new** | Unstructured content readiness |
| [Conversational and collaboration context](capabilities/Conversational%20and%20collaboration%20context.md) **new** | Unstructured content readiness |
| [RAG grounding quality](capabilities/RAG%20grounding%20quality.md) | AI-readable schema design, Unstructured content readiness |
| [Minimum sufficient context](capabilities/Minimum%20sufficient%20context.md) | AI-readable schema design, RAG grounding quality, Semantic contracts |
| [Adversarial context integrity](capabilities/Adversarial%20context%20integrity.md) | Minimum sufficient context, RAG grounding quality |
| [Evaluation/hallucination-surface reduction](capabilities/Evaluation%20hallucination-surface%20reduction.md) | Canonical metric definitions, RAG grounding quality, Minimum sufficient context |

---

## Pillar 2 — Operational Readiness

*Can you trust the system to act on it?*

### State

| Capability | Prerequisites |
|---|---|
| [Live vs. snapshot data](capabilities/Live%20vs%20snapshot%20data.md) | Freshness/recency requirements |
| [State binding correctness](capabilities/State%20binding%20correctness.md) | Live vs. snapshot data, Entity resolution |
| [Latency requirements by use case](capabilities/Latency%20requirements%20by%20use%20case.md) | Live vs. snapshot data |

### Policy

| Capability | Prerequisites |
|---|---|
| [Agent identity and delegation](capabilities/Agent%20identity%20and%20delegation.md) **new** | — |
| [Explicit authority grants](capabilities/Explicit%20authority%20grants.md) | Agent identity and delegation |
| [Scoped limits](capabilities/Scoped%20limits.md) | Explicit authority grants |
| [Query admissibility](capabilities/Query%20admissibility.md) **new** | Scoped limits, AI-readable schema design |
| [Automation authority and handback](capabilities/Automation%20authority%20and%20handback.md) **new** | Explicit authority grants, Scoped limits |
| [Escalation paths](capabilities/Escalation%20paths.md) | Automation authority and handback |
| [Policy-as-code patterns](capabilities/Policy-as-code%20patterns.md) | Explicit authority grants, Scoped limits |

### Execution

| Capability | Prerequisites |
|---|---|
| [Vendor-agnostic execution-layer selection](capabilities/Vendor-agnostic%20execution-layer%20selection.md) | — |
| [Intelligence routing](capabilities/Intelligence%20routing.md) | Vendor-agnostic execution-layer selection, Query admissibility, Procedural knowledge capture |
| [Action scoping](capabilities/Action%20scoping.md) | Explicit authority grants, Scoped limits |
| [Reversibility and compensating action](capabilities/Reversibility%20and%20compensating%20action.md) **new** | Action scoping, State binding correctness |
| [Failure handling](capabilities/Failure%20handling.md) | Action scoping, Reversibility and compensating action |
| [Multi-agent conflict and concurrency](capabilities/Multi-agent%20conflict%20and%20concurrency.md) **new** | State binding correctness, Action scoping |
| [Shadow mode and staged autonomy](capabilities/Shadow%20mode%20and%20staged%20autonomy.md) **new** | Action scoping, Automation authority and handback, Evaluation/hallucination-surface reduction |
| [Cost per decision](capabilities/Cost%20per%20decision.md) **new** | Intelligence routing, Minimum sufficient context |
| [Response reuse and cache admissibility](capabilities/Response%20reuse%20and%20cache%20admissibility.md) **new** | RLS design, Live vs snapshot data, Change safety and versioning |

### Audit

| Capability | Prerequisites |
|---|---|
| [Telemetry design](capabilities/Telemetry%20design.md) | — |
| [Decision logging](capabilities/Decision%20logging.md) | Telemetry design, Intelligence routing |
| [Accountability trails](capabilities/Accountability%20trails.md) | Decision logging, Agent identity and delegation |
| [Retrospective causality](capabilities/Retrospective%20causality.md) | Decision logging, Lineage, State binding correctness, Change safety and versioning |
| [Decision-outcome feedback](capabilities/Decision-outcome%20feedback.md) **new** | Decision logging, Canonical metric definitions |

---

## Layer counts

Deliberately uneven. The 2×4 layer structure is fixed (see README Section 3);
capability counts per layer are not, and forcing them to balance would mean
inventing capabilities or suppressing real ones.

| Pillar | Layer | Count |
|---|---|---|
| Semantic Readiness | Semantic Integrity | 7 |
| Semantic Readiness | Context Stability | 5 |
| Semantic Readiness | Analytical Explainability | 4 |
| Semantic Readiness | AI Readiness & Interoperability | 11 |
| Operational Readiness | State | 3 |
| Operational Readiness | Policy | 7 |
| Operational Readiness | Execution | 9 |
| Operational Readiness | Audit | 5 |
| | **Total** | **51** |

Pillar 1 carries 27 capabilities and Pillar 2 carries 24. The imbalance is
real and is not a modeling error: Pillar 1 covers a thirty-year-old discipline
with a long list of known failure modes, while Pillar 2 covers a four-year-old
one. Expect Pillar 2 to grow faster.

---

## Root capabilities and cross-pillar dependencies

**Roots** (no prerequisites — the honest place to start any remediation
roadmap): Naming conventions · Agent identity and delegation ·
Vendor-agnostic execution-layer selection · Telemetry design.

**Cross-pillar edges** — the places where a Pillar 2 capability cannot exceed a
Pillar 1 capability's score. These are the framework's structural argument that
the pillars are sequential rather than independent, and they are worth naming
explicitly in an assessment readout:

| Pillar 2 capability | depends on Pillar 1 capability |
|---|---|
| Live vs. snapshot data | Freshness/recency requirements |
| State binding correctness | Entity resolution |
| Query admissibility | AI-readable schema design |
| Intelligence routing | Procedural knowledge capture (a rule can only be routed to if it is written down) |
| Shadow mode and staged autonomy | Evaluation/hallucination-surface reduction |
| Cost per decision | Minimum sufficient context |
| Response reuse and cache admissibility | RLS design, Change safety and versioning |
| Retrospective causality | Lineage, Change safety and versioning |
| Decision-outcome feedback | Canonical metric definitions |

The intelligence-routing edge is the newest and one of the sharpest arguments
for assessing both pillars together: an organization whose operating rules
exist only as tacit knowledge has nothing deterministic to route to, so every
decision goes to the language model by default — not as an architecture choice
but as a consequence of a Pillar 1 gap.

The reuse edge is the bluntest of them. Whether a stored answer may be served to
the next requester is decided entirely by whether the answer depends on who is
asking, which is a property of the row-level security model rather than of the
agent. An organization that cannot state its security model cannot safely reuse
any answer, so a Pillar 1 gap caps a capability whose entire value proposition
is cost.

The reverse edge exists once: [RLS design](capabilities/RLS%20design.md) in
Pillar 1 is verified by [Agent identity and delegation](capabilities/Agent%20identity%20and%20delegation.md)
in Pillar 2, because row-level security cannot be enforced against an actor the
system cannot name. Note it rather than resolve it — it is a real property of
the domain, not a modeling error.

---

## Microsoft implementation

Capability pages are deliberately vendor-neutral. Each one ends with a pointer
to its row in `../MicrosoftIQ.html`, which scores the
original 33 against the Microsoft stack (0 native · 22 partial · 9 pattern ·
2 gap) and states what has to be built. Fourteen capabilities have no row there
because they postdate that pass; their pages say so and name the nearest
primitive.
