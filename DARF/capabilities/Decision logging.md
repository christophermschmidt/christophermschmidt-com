# Decision logging

**Pillar:** Operational Readiness
**Layer:** Audit
**Status:** Scoped
**Prerequisites:** [Telemetry design](Telemetry%20design.md), [Intelligence routing](Intelligence%20routing.md)
**Verified by:** [Accountability trails](Accountability%20trails.md), [Retrospective causality](Retrospective%20causality.md), [Decision-outcome feedback](Decision-outcome%20feedback.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Audit → Decision logging, and "Ten things the platform does not do" → immutable decision record and point-in-time reconstruction

## Definition

An immutable, queryable record per decision capturing what was decided, the state and context it was based on with their versions, which policy was evaluated and its outcome, which handler produced the answer and why, who or what authorized it, and what was excluded — sufficient to reconstruct the decision without re-executing it.

## Why it matters

Telemetry records what the system did. Decision logging records what the system decided and on what basis, which is a different artifact with different fields and a different consumer. The distinction matters because of a failure pattern worth naming precisely: the presence of an evidence container is routinely mistaken for audit sufficiency. Traces exist, logs exist, a dashboard shows agent activity — and when an external party asks a specific question about a specific decision, the property they need was never captured. Sufficiency is per-property and per-question, not per-container, and it can only be established by trying to answer the questions in advance.

## Failure modes

- The decision's inputs referenced by pointer to mutable data, so the record degrades as the underlying data changes.
- Model version, prompt version, policy version and semantic definition version unrecorded, so the decision cannot be reproduced.
- Policy evaluation not logged, only its effect, so compliance with a rule cannot be demonstrated.
- Rejected alternatives unrecorded, so the record shows the outcome and not the choice.
- Logs mutable or deletable by the same operational team that runs the agent.
- Record written after the action rather than as part of it, so a failure between action and logging produces an unlogged action.
- The excluded-context record absent, so nobody can distinguish what the system did not have from what it had and did not use.

## Anti-patterns

- **The container fallacy.** Pointing at a trace store or an activity log as evidence of auditability without ever testing whether a specific governance question can be answered from it.
- **Logging the prompt as the decision record.** The prompt is one input. A record that is a prompt and a completion cannot answer which policy was applied or what state was current.
- **Pointers to live data.** A record that says "based on order 4471" is not a record of what order 4471 looked like at the time.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Actions appear in system logs. There is no decision record. |
| 2 | Governed | A decision log exists capturing the decision, the actor and a timestamp. |
| 3 | Contextual | Each decision is recorded immutably with its input state and versions, policy evaluation and outcome, handler and routing reason, authorizing principal, and exclusions — written atomically with the action. |
| 4 | Operational | The record is tested against a defined set of governance questions, per-property sufficiency is measured, and retention meets the longest applicable obligation. |
| 5 | Autonomous | Sufficiency is asserted continuously and a decision whose record would be incomplete cannot execute. |

## Diagnostic question

*Pick a decision your agent made three months ago. Reconstruct it: what state, which policy, which handler, whose authority, what was left out.*

1. We can see that an action occurred.
2. We have a decision log with the decision, actor and time.
3. The full record exists immutably with state versions, policy outcome, routing reason, authority and exclusions.
4. The record is tested against defined governance questions and per-property sufficiency is measured.
5. Sufficiency is continuously asserted and incompletely-recordable decisions cannot execute.

## Evidence to request

- A complete decision record for a real past decision, exported.
- The record schema, field by field.
- Immutability controls — who can modify or delete, and what prevents it.
- The governance question set the record is designed to answer, if one exists.
- Retention against the longest applicable regulatory obligation.

## Verification

Do the reconstruction in the room, using a decision the customer picks. Work through the properties one at a time — state and its version, policy and its version, handler and reason, authorizing principal, exclusions — and mark each present or absent. The per-property result is the score, and it is almost always worse than the customer expects, because the container exists and has never been interrogated. This exercise is the single most valuable hour of the assessment for a regulated buyer.

## Aviation parallel

The flight data recorder and the cockpit voice recorder are separate instruments because they answer different questions: one records what the aircraft did, one records what the crew decided and why. Enterprises have built the first and not the second, and the distinction between telemetry and decision logging is exactly that pair.

## Article angle

The container fallacy is the most useful idea available in this layer and it is now named in the literature, so citing it is both honest and credibility-building. The essay is the reconstruction exercise itself: pick a decision, try to rebuild it, list what is missing. It is a piece the reader can run on their own system before they finish reading, which is the highest-converting shape an essay in this framework can take.

## Sources

- [Decision Evidence Maturity Model for Agentic AI: A Property-Level Method Specification](https://arxiv.org/abs/2605.04093) — the source of the container fallacy: the automatic equation of evidence-container presence with audit sufficiency. Its per-property reconstruction method is the basis for the verification exercise on this page.
- [EU AI Act, Article 12 — Record-Keeping](https://artificialintelligenceact.eu/article/12/) — automatic logging over the system lifetime, tamper-evident, retained at least six months, with full reconstructability of decisions. In application for high-risk systems since 2 August 2026.
