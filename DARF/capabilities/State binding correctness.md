# State binding correctness

**Pillar:** Operational Readiness
**Layer:** State
**Status:** Scoped
**Prerequisites:** [Live vs. snapshot data](Live%20vs%20snapshot%20data.md), [Entity resolution](Entity%20resolution.md)
**Verified by:** [Multi-agent conflict and concurrency](Multi-agent%20conflict%20and%20concurrency.md), [Reversibility and compensating action](Reversibility%20and%20compensating%20action.md), [Retrospective causality](Retrospective%20causality.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → State → State binding correctness (coverage: partial)

## Definition

The state the agent evaluated is provably the state that existed for the entity it acted on, at the moment it acted — the right entity, the right version, and no window in which the state could change between the check and the act without detection.

## Why it matters

Live data is necessary and not sufficient. Three separate defects hide here. The agent may read current state for the wrong entity, which is an entity resolution failure surfacing as an operational one. It may read the right entity's state and act after that state has changed, which is a check-then-act race. Or it may act on a state version that a concurrent process has already superseded. All three produce an action that was correct against a world that no longer holds, and none of them are visible in the answer.

## Failure modes

- No version, sequence number or ETag on the state read, so the action cannot assert what it was based on.
- A long reasoning step between reading state and acting on it, during which the state moves.
- The action targets an entity by a natural key that resolves differently in the acting system than in the reading system.
- Event ordering not guaranteed, so a later event is processed before an earlier one and the agent sees a state that never existed.
- Retries re-reading state and acting on the new read while carrying the old decision's rationale.
- The action system accepts the write without checking that the caller's state version is still current.

## Anti-patterns

- **Optimism as a design.** Assuming the window between read and act is too small to matter, in a system whose reasoning step is measured in seconds.
- **Idempotency keys presented as concurrency control.** They prevent duplicate application of the same action; they do nothing about acting on superseded state.
- **Binding to a query result rather than to a state version.** A result set is not a version and cannot be re-asserted at write time.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | State is read and acted on. No binding, no version, no check. |
| 2 | Governed | The risk is recognized; conventions exist for reading state close to the action and for key handling. |
| 3 | Contextual | Every state read carries a version identifier, the action asserts that version at write time, and the write is rejected if state has moved. |
| 4 | Operational | Rejected and stale-state actions are measured, read-to-act latency is tracked per decision type, and event ordering guarantees are declared and tested. |
| 5 | Autonomous | Stale-state conflicts are detected and re-evaluated automatically rather than failing, and binding correctness is asserted continuously in production. |

## Diagnostic question

*Between the moment the agent reads state and the moment it acts, what stops the state changing — and how would you know if it had?*

1. Nothing; we assume the window is small.
2. We keep the read close to the act and follow conventions.
3. Reads carry a version, writes assert it, and stale writes are rejected.
4. Stale-state rejections and read-to-act latency are measured per decision type.
5. Conflicts trigger automatic re-evaluation and binding is continuously asserted.

## Evidence to request

- The action's write path, showing whether a version or concurrency token is passed.
- Measured read-to-act latency distribution for the highest-volume action, including the tail.
- The event ordering guarantee of the streaming layer, as configured rather than as advertised.
- The count of actions rejected for stale state in the last 30 days — a count of zero on a busy system usually means the check does not exist.
- How the acting system identifies the entity, compared to how the reading system does.

## Verification

Read the write path code or API contract yourself and look for a version assertion. Then ask for the read-to-act latency at the 99th percentile rather than the median; the tail is where the race lives and the median always looks fine. A system with a p99 in the tens of seconds and no version assertion has a live correctness defect regardless of whether anyone has noticed it yet.

## Aviation parallel

This is the mode confusion problem in its purest form: the crew's model of the aircraft's state and the aircraft's actual state diverged, and every subsequent correct action was applied to the wrong world. The mitigations aviation arrived at were not better displays but explicit state annunciation and mandatory callouts — the state is asserted out loud before it is acted on, which is precisely what a version check at write time does.

## Article angle

The technically strongest capability in the State layer and the one most likely to earn credibility with an engineering audience, because check-then-act is a familiar bug in an unfamiliar setting. The framing that elevates it beyond a distributed-systems post: agent reasoning time is enormous compared to conventional transaction time, so a race condition that was theoretical in a transactional system is routine in an agentic one.

## Sources

- [Optimistic Locking in a REST API](https://sookocheff.com/post/api/optimistic-locking-in-a-rest-api/) — the ETag and If-Match mechanism that makes a write assert the state version it was based on, which is the level-3 anchor on this page.
- [Optimistic Concurrency in an HTTP API with ETags](https://codeopinion.com/optimistic-concurrency-in-an-http-api-with-etags-hypermedia/) — the same pattern with the failure semantics spelled out, including why a 412 rejection is the desired outcome rather than an error to be retried away.

*Relevance note:* both sources predate agentic systems and neither mentions them. That is the point — check-then-act is a solved problem in transactional engineering, and agent reasoning time reopens it by making the window seconds rather than milliseconds.
