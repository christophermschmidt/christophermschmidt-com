# Escalation paths

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Automation authority and handback](Automation%20authority%20and%20handback.md)
**Verified by:** [Failure handling](Failure%20handling.md), [Accountability trails](Accountability%20trails.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Policy → Escalation paths (coverage: pattern)

## Definition

The defined route a decision takes when it exceeds the agent's authority, competence or confidence: who receives it, in what time, with what context, what happens if they do not respond, and how the case returns to normal flow afterwards.

## Why it matters

Escalation is the pressure-relief valve that makes bounded authority workable. Without it, a limit is just a failure — the agent stops, the process stalls, and the organization learns to widen the limit. With it, tight limits become affordable, which is the precondition for granting any autonomy at all. The part that is consistently unbuilt is the timeout: an escalation with no defined response deadline and no defined behavior when it lapses is a queue, and queues silently absorb the exact cases that were too important for the agent to handle.

## Failure modes

- Escalation to a group mailbox or a shared channel where ownership is diffuse.
- No response deadline, so escalated cases age indefinitely.
- Undefined timeout behavior — nobody has decided whether an unanswered escalation should fail closed or proceed.
- The escalated case arriving without the context the agent had, so the human starts from nothing.
- Escalation volume high enough that the recipients triage by pattern rather than by case.
- No path back: once escalated, the case leaves the automated flow permanently and its resolution never returns as evidence.
- Escalation triggered only by the model's own uncertainty, missing the confident-and-wrong cases entirely.

## Anti-patterns

- **Escalating to the builder.** The engineering team becomes the business decision-maker by default, which is both wrong and unsustainable.
- **A queue as an escalation path.** Named, monitored, and with nobody accountable for a specific case within a specific time.
- **Escalation as the error handler.** Conflating "this exceeds my authority" with "something broke" collapses two different signals into one channel and hides both.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | The agent fails or stops. Someone finds out through the business process. |
| 2 | Governed | Escalation recipients are defined per case type and documented. |
| 3 | Contextual | Escalation routes to a named accountable role with a response deadline, carries the agent's full context and reasoning, and has explicitly defined timeout behavior. |
| 4 | Operational | Escalation volume, response time, timeout rate and outcome are measured per trigger; recurring escalation causes are treated as remediation candidates. |
| 5 | Autonomous | Routing adapts to responder availability and case type, resolutions feed back as training and policy evidence, and an unhandled escalation cannot silently expire. |

## Diagnostic question

*When the agent hits the edge of its authority, who gets it, how long do they have, and what happens if they don't respond?*

1. It stops; someone notices downstream.
2. Recipients are defined per case type.
3. It routes to a named role with a deadline and full context, and timeout behavior is defined.
4. Volume, response time, timeout rate and outcomes are measured per trigger.
5. Routing adapts, resolutions feed back, and nothing expires silently.

## Evidence to request

- The escalation matrix: trigger, recipient role, deadline, timeout behavior.
- Escalation volume and response time distribution for the last 90 days.
- The count of escalations that timed out and what happened to each.
- What the recipient actually sees — the escalation payload.
- The top five recurring escalation causes.

## Verification

Ask for the timeout behavior first; it is the question that separates a designed escalation from a queue, and the usual answer is that nobody has decided. Then look at the aging distribution of the escalation queue rather than the average response time. The oldest open items are the cases the system judged too important to handle itself, which makes their age the most damning number available.

## Aviation parallel

Escalation in aviation is procedural, time-bounded and rehearsed: a declared emergency has a defined recipient, a priority handling protocol and a required acknowledgement. The relevant contrast is the protected reporting system — aviation built a channel where raising a concern is safe and consequential, and its enterprise equivalent barely exists, which is why escalation volume tends to fall over time for reasons that have nothing to do with improving performance.

## Article angle

Best written as the companion to handback rather than standalone: handback is what happens when the human takes control, escalation is what happens when the agent gives it up, and both fail for the same reason — the receiving human gets a notification instead of a briefing. The timeout question is the practical hook, because every reader can check it in their own system in about a minute.

## Sources

- [Authority Gradients](https://skybrary.aero/articles/authority-gradients) — why escalation fails socially rather than technically: steep gradients suppress the flow of concern upward, which is the human analogue of an escalation queue nobody answers.
- [FAA Advisory Circular 120-51E, Crew Resource Management Training](https://www.faa.gov/documentlibrary/media/advisory_circular/ac_120-51e.pdf) — the regulator's specification for how escalation and challenge are trained and rehearsed, including the two-challenge rule.
