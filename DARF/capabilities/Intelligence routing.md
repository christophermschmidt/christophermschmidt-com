# Intelligence routing

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Vendor-agnostic execution-layer selection](Vendor-agnostic%20execution-layer%20selection.md), [Query admissibility](Query%20admissibility.md), [Procedural knowledge capture](Procedural%20knowledge%20capture.md)
**Verified by:** [Decision logging](Decision%20logging.md), [Cost per decision](Cost%20per%20decision.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** not mapped in the reference architecture — the routing decision and its logged rationale are a build; this is one of the two components named as missing from the platform's control plane

## Definition

The explicit, logged decision about which kind of intelligence answers a given request: retrieval, a governed semantic query, a trained predictive model, a mathematical optimiser, a deterministic rule, or a language model — and only then, within language model work, which tier.

## Why it matters

Most enterprise "AI failures" are routing failures wearing a model costume. An LLM asked to compute an optimal replenishment quantity will produce a number; an optimiser would have produced the right one, deterministically, in milliseconds, for a fraction of the cost. The industry argues almost exclusively about the last routing decision — which model tier — and that is the one with the least value in it. Routing between *kinds* of intelligence is where correctness, cost and auditability are all decided at once, and it is the routing decision nobody logs.

This is also where DARF's exclusion of model capability gets its precision. The framework excludes "is the vendor's model good enough," an intrinsic property of someone else's product. It does not exclude which intelligence the architecture invokes for which decision class, which is an architectural choice: governable, testable, loggable, and squarely inside the framework.

## Failure modes

- Every request goes to a language model because that is what the platform makes easy.
- Arithmetic, optimisation and constraint satisfaction performed by a language model and accepted because the output is well-formatted.
- Deterministic decisions — rules that have existed for a decade — re-derived probabilistically on every request.
- Routing implemented inside the model's own tool selection, so it is non-deterministic where it should be fixed.
- No routing record, so a wrong answer cannot be attributed to the wrong handler having been chosen.
- Model-tier routing implemented and treated as the whole of routing.

## Anti-patterns

- **Tool-calling as routing.** Letting the model choose its tool is a form of routing and it is the least deterministic form, appropriate for exploration and inappropriate for anything with a known handler.
- **Routing by cost alone.** Optimises the cheap path, ignores that the wrong kind of intelligence is wrong at any price.
- **A router that is itself a frontier model call.** Reintroduces the cost and non-determinism the router was supposed to remove.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Everything goes to the language model. |
| 2 | Governed | Some request classes are directed to specific handlers by convention or by hand-built branching. |
| 3 | Contextual | Request classes map to intelligence types by explicit, deterministic rule where a known handler exists; the routing decision and its reason are recorded with every request. |
| 4 | Operational | Routing accuracy is measured — how often the chosen handler was the right one — and cost, latency and accuracy are tracked per route. |
| 5 | Autonomous | Routes are tuned automatically from outcome data, and new request classes are proposed for routing from observed traffic. |

## Diagnostic question

*When your agent produces a number, what decided whether that number came from an optimiser, a trained model, a governed query, a rule, or the LLM — and is that decision recorded?*

1. It's always the LLM.
2. Some classes are hand-routed to specific handlers.
3. Explicit deterministic rules route by request class, and the decision and reason are logged.
4. Routing accuracy, cost, latency and quality are measured per route.
5. Routes self-tune from outcomes.

## Evidence to request

- The routing table or its absence: request classes mapped to handlers.
- Where routing is implemented — application code, gateway, or the model's tool selection.
- Routing logs from real traffic, with reasons.
- The list of decisions currently handled by an LLM that have a deterministic or optimiser-based handler available.
- Cost and accuracy per route, if measured.

## Verification

Take the agent's five most frequent request types and ask what kind of intelligence answers each and why. Then look for the ones that are arithmetic, constrained optimisation, or a documented business rule. Those are misrouted, they are usually the majority of volume, and the finding converts directly into both an accuracy improvement and a cost reduction — which is the rare assessment finding that pays for the assessment.

## Article angle

One of the three additive capabilities from the aviation reconciliation and the most immediately useful to a practitioner. The sharp version of the argument: the industry's routing conversation is about model tier, which is the routing decision with the least value in it, and the reason is that model tier is the decision the model vendors have an interest in discussing. Routing between kinds of intelligence is where the money is, and it is a Pillar 2 capability because it is only governable if the choice is logged with its reason.

## Sources

- [Small Language Models are the Future of Agentic AI](https://arxiv.org/abs/2506.02153) — NVIDIA Research's argument for heterogeneous model use, useful precisely because NVIDIA has no semantic layer to sell. Note that it argues the model-tier case, which this page treats as the least valuable of the four routing decisions.
- [BADGER: Bridging Agentic and Deterministic Evaluation for Generative Enterprise Reasoning](https://arxiv.org/pdf/2606.02109) — the deterministic-versus-generative boundary made measurable, which is the evidence base for routing a request class away from an LLM.
- [A survey of agent interoperability protocols](https://arxiv.org/pdf/2505.02279) — for the mechanics of invoking heterogeneous handlers behind one interface.
