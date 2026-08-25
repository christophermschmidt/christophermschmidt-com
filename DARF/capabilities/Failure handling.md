# Failure handling

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Action scoping](Action%20scoping.md), [Reversibility and compensating action](Reversibility%20and%20compensating%20action.md)
**Verified by:** [Telemetry design](Telemetry%20design.md), [Escalation paths](Escalation%20paths.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Execution → Failure handling (coverage: partial), and "The nine that will bite" → Activator is fire-and-forget

## Definition

Defined, tested behavior for every way an action can fail: the tool errors, the tool times out, the tool succeeds but returns something unexpected, the tool's result never arrives, the agent's reasoning fails mid-sequence, or the agent succeeds at every step of a sequence except the last one.

## Why it matters

Agentic execution multiplies failure surface because a single decision becomes a sequence of tool calls across systems with no shared transaction. The partial-completion case is the one that hurts: three of five steps committed, the fourth timed out, and the system's state now describes a business situation that does not exist. Fire-and-forget triggers make this worse — an action dispatched with no acknowledgement path means the agent cannot distinguish success from silence, and will frequently assume the former.

## Failure modes

- Timeouts treated as failures when the action actually committed, leading to duplicate execution on retry.
- Retries without idempotency keys, so a transient network error becomes three payments.
- Multi-step sequences with no compensation for the committed prefix.
- Fire-and-forget dispatch with no acknowledgement, so failure is indistinguishable from success.
- The agent's own reasoning failing mid-sequence, leaving state inconsistent and no handler owning the cleanup.
- Errors returned to the model as text, so the model narrates around a failure and reports success.
- No dead-letter path, so failed actions are logged and lost.

## Anti-patterns

- **Retry as the whole strategy.** Retry without idempotency and without distinguishing failure classes converts a transient problem into a duplicate-action problem.
- **Letting the model handle errors.** A tool error returned into the context is interpreted, and the interpretation is frequently optimistic. Failure handling must be control flow, not a prompt.
- **Success measured by absence of exceptions.** Fire-and-forget systems raise no exception when nothing happened.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Failures surface as exceptions or not at all. Handling is per-integration and ad hoc. |
| 2 | Governed | Retry and timeout conventions exist and error handling is implemented consistently for the main paths. |
| 3 | Contextual | Failure classes are distinguished explicitly, all actions are idempotent with keys, multi-step sequences have defined compensation for partial completion, and every dispatch has an acknowledgement path. |
| 4 | Operational | Failure rates by class are measured per action, partial-completion incidents are tracked, and failure paths are tested deliberately rather than discovered. |
| 5 | Autonomous | Failure modes are exercised continuously against production paths, and an action without a tested failure path cannot be enabled. |

## Diagnostic question

*Your agent's third of five tool calls times out. What is the state of the world, and what happens next?*

1. Unclear — it would depend and someone would investigate.
2. It retries per our convention and logs the error.
3. The failure class is identified, the sequence compensates the committed prefix, and idempotency prevents duplication on retry.
4. As above, plus failure rates by class are measured and failure paths are deliberately tested.
5. Failure paths are continuously exercised; untested paths cannot be enabled.

## Evidence to request

- The failure taxonomy and the handler for each class.
- Idempotency key implementation for every write action.
- The compensation logic for the longest multi-step sequence.
- Failure rate by class over 90 days, and partial-completion incident records.
- Evidence of deliberate failure testing — chaos exercises, fault injection, or a documented drill.

## Verification

Ask what happens on timeout specifically, since timeout is the failure class that is genuinely ambiguous and the one whose handling reveals whether anyone thought about it. Then check whether write actions carry idempotency keys by reading the tool implementation. Retry logic plus no idempotency key is a duplicate-action defect waiting for a bad network day, and it is present in most deployments.

## Aviation parallel

Failure handling in aviation is dominated by two ideas that enterprises skip: failures are enumerated in advance with a procedure per failure, and the procedures are practised in a simulator rather than read. The enterprise equivalent of the simulator is deliberate fault injection against production paths, and its absence is why most failure handling is discovered rather than designed.

## Article angle

The partial-completion problem is the piece, and it is a genuinely under-covered engineering topic in the agentic context. Multi-system sequences with no distributed transaction is an old problem with well-known patterns, and the new element is that the orchestrator is non-deterministic and will narrate its way past an error if you let it. That last point — never return an error into the context and hope — is the practitioner takeaway worth the whole essay.

## Sources

- [Pattern: Saga](https://microservices.io/patterns/data/saga.html) — the partial-completion problem and its compensation semantics, which is the failure class agentic execution reproduces at scale.
- [Fault Tolerance Patterns: Circuit Breaker, Bulkhead, Retry](https://system-design.space/en/chapter/resilience-patterns/) — why retry without idempotency converts a transient fault into a duplicate-action defect, and why timeout is the failure class that needs an explicit decision.
