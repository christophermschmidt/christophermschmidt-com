# Minimum sufficient context

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [AI-readable schema design](AI-readable%20schema%20design.md), [RAG grounding quality](RAG%20grounding%20quality.md), [Semantic contracts](Semantic%20contracts.md)
**Verified by:** [Cost per decision](Cost%20per%20decision.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** not mapped in the reference architecture — Fabric IQ's knowledge base and Foundry's tool scoping are the primitives; the assembly and the exclusion record are a build

## Definition

The system can assemble the specific slice of context a given decision requires — no more — and can state what it excluded and why. Sufficiency is the demand-side test (does the slice contain what the decision needs); minimality is the supply-side test (does it contain anything the decision does not).

## Why it matters

The prevailing enterprise pattern is to give the model as much context as the window allows and hope relevance emerges. That is expensive, slow, harder to evaluate, and less accurate — irrelevant context measurably degrades answer quality, not merely cost. But the reason this capability belongs in a readiness framework rather than an engineering guide is the exclusion record: a decision made from an assembled context is only defensible if you can say what the system considered and what it left out. Without that, every post-hoc review of an agent decision reduces to "the model saw some things."

## Failure modes

- Context assembled by filling the window rather than by specification — retrieve top-k until full.
- No declared context specification per decision type, so two runs of the same decision see different inputs and nobody notices.
- Exclusions unrecorded, so an investigator cannot distinguish "the system didn't have it" from "the system had it and didn't use it."
- Static context — glossaries, policies, org facts — re-sent on every request instead of being modeled or cached.
- Context assembly logic living inside application code with no version, no owner and no test.
- The same decision type served by different assembly paths in different channels.

## Anti-patterns

- **Bigger windows as the strategy.** A larger window changes the economics of the problem and none of its structure.
- **Relevance scoring as sufficiency.** A high similarity score says the passage resembles the query, not that the decision's required inputs are present.
- **Context in the system prompt.** Unversioned, untestable, billed on every request, and invisible to lineage.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Context is whatever retrieval returns, sized to the window. |
| 2 | Governed | Context sources per use case are documented and assembly follows an agreed pattern. |
| 3 | Contextual | Each decision type has a versioned context specification stating required inputs, and assembly is a governed service rather than application code. |
| 4 | Operational | Sufficiency is tested — decisions are evaluated against whether the specified context was actually present — and the exclusion record is emitted with every decision. |
| 5 | Autonomous | The specification is refined automatically from decision outcomes and failures, and a decision proceeds only when its required context is verifiably present. |

## Diagnostic question

*For your highest-value agent decision, what is the specification of the context it requires, and can you show what the system left out on a given run?*

1. There's no specification; retrieval fills the window.
2. Sources per use case are documented.
3. A versioned context specification exists per decision type and assembly is a governed service.
4. Sufficiency is tested and an exclusion record is emitted with every decision.
5. The specification self-refines and decisions block when required context is missing.

## Evidence to request

- The context specification artifact for one decision type, with its version and owner.
- A full context payload from a real production run.
- The exclusion record from that same run, or the confirmation that none is produced.
- Token volume per request broken into static and decision-specific components.
- Where assembly logic lives and what tests it has.

## Verification

Capture the full context payload for one real decision and classify every element as required, useful, or irrelevant to that decision. The irrelevant share is the measurement, and it is usually startling. Then ask what the system decided not to include and why — if there is no answer, the capability is capped at 3 no matter how good the specification is, because sufficiency without an exclusion record is not auditable.

## Aviation parallel

The minimum equipment list is the exact analogue and it works in both directions: it states what must be functioning for a flight to be legally dispatched, and it is a positive list, so an item not on it is not required. Enterprises building agent context have the negative version — an ever-growing list of things it might be useful to include — which is why the payload only ever grows.

## Article angle

One of the three capabilities the aviation reconciliation identified as genuinely additive, and the most defensible as original IP. The minimum-equipment-list framing is the differentiator: the industry frames context as a retrieval and cost problem, and reframing it as a dispatch requirement — with an exclusion record as the audit artifact — converts an engineering optimisation into a governance control. That is the move that makes it sellable to risk rather than to engineering.

## Sources

- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot) — Chroma's evaluation across 18 frontier models finding that every one degrades as input length grows, at every increment tested. This is the empirical basis for minimality being an accuracy property and not only a cost one.
- [Context rot explained](https://redis.io/blog/context-rot/) — the mechanisms: lost-in-the-middle positional effects, attention dilution, and distractor interference, with the FLenQA result showing accuracy falling from 0.92 to 0.68 purely by varying irrelevant surrounding text.
