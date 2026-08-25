# Multi-agent conflict and concurrency

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [State binding correctness](State%20binding%20correctness.md), [Action scoping](Action%20scoping.md)
**Verified by:** [Decision logging](Decision%20logging.md), [Retrospective causality](Retrospective%20causality.md), [Scoped limits](Scoped%20limits.md)
**Microsoft implementation:** not mapped in the reference architecture — no first-party mechanism arbitrates between agents; ownership boundaries and conflict detection are entirely a build

## Definition

The mechanisms that keep multiple agents — and agents alongside humans and existing automation — from acting on the same entity in contradictory or compounding ways: declared ownership boundaries, conflict detection, arbitration, and awareness of actions another actor has already taken.

## Why it matters

Every enterprise agentic roadmap is a multi-agent roadmap, and almost every pilot is designed as if its agent were alone. The failure is not exotic: a replenishment agent orders stock while an expedite agent expedites the same shortage and a human buyer places a manual order, and the enterprise now holds three times what it needed. Nothing in the standard stack notices, because each action was individually correct, individually within limits, and individually logged. The compounding case is worse than the contradicting case, because contradiction eventually produces a visible error and compounding just produces expense.

## Failure modes

- Two agents with overlapping authority over the same entity class and no declared boundary.
- An agent acting on state that another agent has already changed but not yet materialized into the shared view.
- Agent and existing automation — a scheduled job, an ERP rule — acting on the same trigger.
- Agents consuming each other's outputs as authoritative input, so a single upstream error propagates and amplifies.
- No global view of pending actions, so nothing can see that three effects are in flight for one entity.
- Cross-agent limits absent, so aggregate exposure exceeds every individual limit.
- Feedback loops between agents that oscillate, with no damping and no detection.

## Anti-patterns

- **Orchestrator as coordination.** A supervisor agent that dispatches sub-agents solves ordering within one request and nothing about two independent requests hitting the same entity.
- **Coordination by prompt.** Telling agents about each other in their instructions. Not a control.
- **Assuming the target system arbitrates.** Most systems of record accept concurrent valid writes; that is what they are for.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Agents are built independently. Interaction is unconsidered. |
| 2 | Governed | Ownership boundaries per entity class are documented and agent scopes are designed not to overlap. |
| 3 | Contextual | Entity ownership is enforced at execution, pending actions are visible in a shared registry, and a second actor targeting an entity with an action in flight is blocked or arbitrated. |
| 4 | Operational | Conflicts and near-conflicts are measured, cross-agent aggregate limits are enforced per entity, and inter-agent dependency is mapped. |
| 5 | Autonomous | Conflicts are arbitrated automatically by declared precedence, oscillation is detected and damped, and a new agent cannot be deployed into an entity space without a resolved ownership declaration. |

## Diagnostic question

*If two of your agents, or an agent and a human, act on the same order within the same minute, what happens?*

1. Both actions land; we'd find out from the outcome.
2. Their scopes are designed not to overlap and that's documented.
3. Ownership is enforced at execution and in-flight actions are visible; the second actor is blocked or arbitrated.
4. Conflicts are measured, cross-agent aggregates are enforced, and dependencies are mapped.
5. Arbitration is automatic by declared precedence, and oscillation is detected and damped.

## Evidence to request

- The entity ownership map: which actor owns which action on which entity class.
- The in-flight action registry, or confirmation that none exists.
- Conflict incidents from the last 90 days.
- The inventory of non-agent automation touching the same entities.
- Cross-agent aggregate limits per entity.

## Verification

Ask for the list of every automated actor — agents, scheduled jobs, ERP rules, RPA — that can write to the entity class the assessed agent touches. That inventory is usually incomplete on the first attempt and its completion is the finding. A deployment with two or more writers to one entity class and no ownership declaration has a live conflict risk whether or not it has fired yet.

## Aviation parallel

Two aircraft on converging paths are separated by an external authority with a global picture, not by each crew's good judgment, and the collision-avoidance system that backs it up issues *complementary* instructions to both aircraft — one climbs, one descends — because uncoordinated independent avoidance is how mid-airs happen. Enterprise multi-agent systems currently have neither the external authority nor the coordinated resolution.

## Article angle

Ahead of where most of the market is, which makes it a positioning piece as much as a practical one: everyone is planning multi-agent architectures and nobody is designing for interference. The compounding-versus-contradicting distinction is the original observation worth leading with, because contradiction is the case people imagine and compounding is the case that actually drains money quietly.

## Sources

- [Open Challenges in Multi-Agent Security: Towards Secure Systems of Interacting AI Agents](https://arxiv.org/html/2505.02077v2) — the systematic treatment of hazards that exist only in interaction: cascading failures, information leakage, and miscoordination that no single-agent evaluation surfaces.
- [Emergent Social Intelligence Risks in Generative Multi-Agent Systems](https://arxiv.org/html/2603.27771v1) — the empirical finding that collusion-like coordination and conformity emerge at non-trivial frequency under realistic constraints, without any instruction to do so.
