# Scoped limits

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Explicit authority grants](Explicit%20authority%20grants.md)
**Verified by:** [Action scoping](Action%20scoping.md), [Multi-agent conflict and concurrency](Multi-agent%20conflict%20and%20concurrency.md), [Telemetry design](Telemetry%20design.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Policy → Scoped limits (coverage: pattern)

## Definition

The quantitative boundaries on granted authority — value per action, cumulative value per period, rate of actions, count of affected entities, and the classes of entity an agent may touch — enforced at execution rather than described in the grant.

## Why it matters

Limits are what make authority survivable when something goes wrong. Every agentic incident of consequence has the same shape: a single defective decision, repeated at machine rate, until something outside the agent stopped it. The per-action limit is the one everybody implements and the least important; the blast-radius limits — actions per hour, total exposure per day, number of distinct entities affected — are the ones that turn a catastrophe into an anomaly. They are also the cheapest control in the entire framework to implement and the most commonly absent.

## Failure modes

- A per-transaction cap with no cumulative or rate limit, so a thousand compliant actions produce a non-compliant outcome.
- Limits enforced in the agent's own logic, so a reasoning failure bypasses them.
- No limit on the breadth of a single action — one update statement affecting every row.
- Limits set at pilot volumes and never revisited as the agent scales.
- No cross-agent aggregate, so five agents each within limits breach collectively.
- Limits that log a warning rather than block.

## Anti-patterns

- **Self-imposed limits.** Instructions in the prompt telling the agent not to exceed a threshold. The component being constrained is the component doing the constraining.
- **Alerting instead of blocking.** An alert on a breach is a detection control presented as a preventive one, and at machine rate the difference is thousands of actions.
- **Limits without a breach procedure.** Blocking with no defined path forward means the first legitimate large case teaches the organization to raise the limit permanently.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | No limits beyond whatever the target system enforces for any caller. |
| 2 | Governed | Limits are defined and documented per agent, and configured where convenient. |
| 3 | Contextual | Per-action, cumulative, rate and breadth limits are enforced outside the agent, at the execution boundary, and a breach blocks rather than warns. |
| 4 | Operational | Utilisation against each limit is measured and reported, cross-agent aggregates are enforced, and limits are reviewed against actual volumes. |
| 5 | Autonomous | Limits adapt to observed normal behavior, anomalous rates trigger automatic suspension, and a new action class inherits limits by default rather than by configuration. |

## Diagnostic question

*If your agent made the same mistake a thousand times in an hour, what would stop it — and at which repetition?*

1. Nothing built for that; someone would notice eventually.
2. Documented limits, configured in places.
3. Per-action, cumulative, rate and breadth limits enforced outside the agent; breaches block.
4. Utilisation is measured, cross-agent aggregates are enforced, limits reviewed against volume.
5. Limits adapt to normal behavior and anomalies auto-suspend.

## Evidence to request

- The limit configuration, in the system that enforces it — not the policy document.
- Where enforcement sits relative to the agent: inside its logic, at a gateway, or in the target system.
- Breach history and what happened on each.
- Cross-agent aggregate limits, if any exist.
- The documented procedure when a legitimate case exceeds a limit.

## Verification

Ask for the cumulative and rate limits specifically; the per-action cap will be offered first and is the least informative. Then ask where enforcement lives and confirm it is outside the agent's own reasoning path. If limits are implemented in the prompt or in agent logic, the capability scores 1 no matter how carefully the thresholds were chosen.

## Aviation parallel

Envelope protection is enforced by the flight control system, not by the pilot's discipline, and it holds regardless of what the pilot commands. The design principle transfers exactly: the constraint must live in a component that the failing component cannot override, which is why prompt-level limits are not limits.

## Article angle

The blast-radius argument is the piece, and the reason it lands is that the per-action cap gives organizations a false sense of having addressed this. A single vivid worked example — a compliant $500 action repeated four thousand times overnight — carries the whole essay, and the aviation framing supplies the design principle without needing the analogy to do heavy lifting.

## Sources

- [Bulkhead pattern](https://en.wikipedia.org/wiki/Bulkhead_pattern) — the blast-radius principle in its original form: partition resources so a failure in one compartment cannot drain the whole system.
- [Fault Tolerance Patterns: Circuit Breaker, Bulkhead, Retry](https://system-design.space/en/chapter/resilience-patterns/) — Nygard's stability pattern set, and specifically the point that limits must live in a component the failing component cannot override.
- [Efficient Fault Tolerance with Circuit Breaker Pattern](https://aerospike.com/blog/circuit-breaker-pattern/) — the trip-and-short-circuit mechanism, which is the level-5 anchor for automatic suspension on anomalous rate.
