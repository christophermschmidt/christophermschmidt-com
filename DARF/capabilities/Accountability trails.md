# Accountability trails

**Pillar:** Operational Readiness
**Layer:** Audit
**Status:** Scoped
**Prerequisites:** [Decision logging](Decision%20logging.md), [Agent identity and delegation](Agent%20identity%20and%20delegation.md)
**Verified by:** [Retrospective causality](Retrospective%20causality.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Audit → Accountability trails, and "The nine that will bite" → creator-delegated execution breaks the accountability model

## Definition

The unbroken chain connecting an action back to the human accountable for it: the acting agent identity, the principal it acted for, the authority grant that permitted it, the person who issued that grant, and any human who approved or was notified along the way — traversable in both directions and surviving every hop.

## Why it matters

Decision logging records the basis of a decision. Accountability trails record who owns it. These separate the moment an incident happens, because the first question is never technical — it is who is answerable. Enterprises consistently discover at that moment that the chain breaks at a hop nobody considered: the agent-to-agent call that dropped the original principal, the action attributed to a service account, the grant with no named grantor, the approval recorded as a status change with no identity. A chain that breaks anywhere provides accountability nowhere.

## Failure modes

- Attribution to the agent's creator, making a person accountable for behavior they did not initiate and could not observe.
- Principal identity lost at an agent-to-agent boundary, so the trail ends at the first hop.
- Approval recorded as a state transition rather than as an identified act by a person.
- The authority grant referenced by role rather than by the person who granted it.
- Trail traversable forward but not backward, so you can see what an actor did and not who is behind an action.
- Downstream system logs recording the integration account, so the enterprise's own systems of record contradict the agent platform's trail.
- Notification recipients unrecorded, so "the business was informed" cannot be substantiated.

## Anti-patterns

- **The audit log as the trail.** A system-of-record audit log records the writing principal, which under a service-account architecture is exactly the wrong name.
- **Accountability by org chart.** Naming a responsible executive in a governance document while the technical trail says something else. The technical trail is what an investigation reads.
- **One-directional tracing.** Sufficient for operations, insufficient for accountability, which always begins from an effect and works backward.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Actions trace to a service account. Human accountability is established by conversation. |
| 2 | Governed | Agents have named owners and approvals are recorded with an identity. |
| 3 | Contextual | The full chain — action, agent identity, delegated principal, authority grant, grantor, approvers — is recorded and traversable in both directions, and survives agent-to-agent hops. |
| 4 | Operational | Chain completeness is measured, breaks are detected and reported, and the trail is reconciled against downstream systems' own audit logs. |
| 5 | Autonomous | An action whose accountability chain would be incomplete cannot execute. |

## Diagnostic question

*Start from an action in a downstream system of record and work backwards. Where does the chain to a named human break?*

1. At the service account, immediately.
2. At the agent — we know its owner, and the rest is conversational.
3. Nowhere; the full chain including grantor and approvers is recorded and traversable both ways.
4. Nowhere, and completeness is measured and reconciled against downstream audit logs.
5. Nowhere, and an unattributable action cannot execute.

## Evidence to request

- A backward trace from a real downstream record to a named human, performed live.
- The chain schema: which links are recorded and where.
- The behavior of the trail across an agent-to-agent call.
- Reconciliation between the agent platform's trail and the target system's own audit log.
- Approval records showing an identity rather than a status change.

## Verification

Always run this backwards, starting in the downstream system rather than in the agent platform. Forward tracing from the platform shows the architecture as designed; backward tracing from the system of record shows what an investigator will actually find, and the two diverge more often than not. The hop where the chain breaks is the finding, and naming it precisely is worth more than the score.

## Aviation parallel

Every consequential act in aviation attaches to a named, qualified individual: the pilot-in-command, the licensed engineer who signed the maintenance release, the dispatcher who released the flight. The signature is the artifact and it is unforgeable in practice because the qualification behind it is registered. Enterprise agentic systems have the acts and not the signatures.

## Article angle

The direct compliance piece, and its force comes from the backward trace rather than from any argument — you start at the effect and show where the name disappears. It also lands on a live commercial reality: identity governance for agents became a funded category in 2026, which means the customer's identity team has budget and a mandate that the data and AI team has never spoken to. Being the person who connects those two rooms is itself the offer.

## Sources

- [Governing Agent Identities](https://learn.microsoft.com/en-us/entra/id-governance/agent-id-governance-overview) — the on-behalf-of delegation model and the requirement that a human principal stay attached to the agent identity, which is the chain this capability traces.
- [Identity Management for Agentic AI](https://arxiv.org/pdf/2510.25819) — the academic treatment of attribution across delegation hops, including why the chain typically breaks at agent-to-agent boundaries.
