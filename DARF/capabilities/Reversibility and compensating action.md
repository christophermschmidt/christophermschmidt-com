# Reversibility and compensating action

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Action scoping](Action%20scoping.md), [State binding correctness](State%20binding%20correctness.md)
**Verified by:** [Failure handling](Failure%20handling.md), [Decision-outcome feedback](Decision-outcome%20feedback.md), [Accountability trails](Accountability%20trails.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → "Ten things the platform does not do" → compensating action and failure semantics for agent-initiated writes

## Definition

Every action the agent can take is classified by reversibility, and for each reversible one a defined compensating action exists, is tested, and can be invoked — by a human or automatically — with a known time window and a known residual effect.

## Why it matters

Failure handling asks what happens when an action errors. This asks the harder question: what happens when the action succeeded and was wrong. That is the far more common case and the one nothing in the standard stack addresses. It is also the capability that governs how much autonomy an organization can responsibly grant, because the calculus of granting authority is not the probability of error but the cost of an error that cannot be undone. Classifying actions by reversibility is the cheapest possible risk control and it reframes the autonomy conversation from a debate about trust into an inventory exercise.

## Failure modes

- No reversibility classification, so a payment release and a note added to a case are treated as equivalent risks.
- Compensating actions assumed to exist because the target system has an undo, without anyone testing it from the agent's path.
- Partial completion across multiple systems with no compensation for the steps that succeeded.
- Compensation that restores system state but not real-world state — the order is canceled and the truck has left.
- No time window recorded, so nobody knows how long an action remains reversible.
- Compensation performed manually as an incident response rather than as a designed capability.
- The compensating action itself unlogged, so the record shows the original action and not its reversal.

## Anti-patterns

- **Database rollback as reversibility.** Transactional rollback covers the write and not the email, the ledger entry, the counterparty notification or the physical movement.
- **Undo as a target-system feature.** Whether the target supports undo is irrelevant if the agent's path to it is untested or unauthorized.
- **Treating irreversibility as a reason to require approval and stopping there.** Approval reduces the rate of wrong irreversible actions; it does nothing about the ones that get approved.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Actions are taken. Undoing one is an incident, handled by hand. |
| 2 | Governed | Actions are informally understood as reversible or not, and runbooks exist for the important cases. |
| 3 | Contextual | Every action carries a reversibility classification with a defined, tested compensating action and a stated reversibility window; irreversible actions are gated differently by policy. |
| 4 | Operational | Compensation is exercised on a schedule, not only in incidents; time-to-compensate and residual effect are measured; multi-system partial completion has defined semantics. |
| 5 | Autonomous | Detection of a wrong action triggers compensation within the window automatically, and an action without a tested compensating path cannot be granted autonomous authority. |

## Diagnostic question

*Your agent just did something correct-looking and wrong, and it succeeded. What undoes it, how long do you have, and has that path ever been tested?*

1. Someone would fix it manually as an incident.
2. We know which actions are hard to undo and have runbooks.
3. Every action has a reversibility class, a tested compensating action and a stated window; irreversible actions are gated differently.
4. Compensation is exercised on a schedule and time-to-compensate is measured.
5. Compensation triggers automatically on detection; untested actions cannot be autonomous.

## Evidence to request

- The action inventory with reversibility classification.
- The compensating action defined for each reversible one, and evidence it has been executed successfully.
- The reversibility window per action type.
- Real-world versus system-state effects for the top three actions.
- Whether compensating actions appear in the audit trail as first-class events.

## Verification

Ask them to execute a compensating action in a non-production environment while you watch. This is the strongest test in the Execution layer because the gap between a documented compensation and a working one is enormous and only demonstration closes it. Then ask for the reversibility window; where nobody knows, the classification exists on paper only.

## Aviation parallel

Aviation's equivalent is the go-around: a defined, briefed, practised reversal available up to a specific decision point, after which the manoeuvre is committed. Two things make it work and both transfer. It is a normal procedure rather than an emergency one, so it is rehearsed rather than improvised. And the decision point is explicit — the crew knows exactly when reversibility ends, which is the fact enterprises almost never record.

## Article angle

A genuine gap in the discourse, which is dominated by preventing wrong actions and nearly silent on recovering from them. The reframing that carries the essay: the right question when granting autonomy is not "how often will it be wrong" but "what does wrong cost when it cannot be undone," and that turns an unanswerable trust question into a tractable inventory. Also the natural home for the observation that approval workflows reduce error rate and do nothing for error cost.

## Sources

- [Pattern: Saga](https://microservices.io/patterns/data/saga.html) — Chris Richardson's canonical description, including the requirement that compensating transactions run in reverse order and that each be defined rather than improvised. Originates in Garcia-Molina and Salem, 1987.
- [Mastering Saga Patterns for Distributed Transactions in Microservices](https://temporal.io/blog/mastering-saga-patterns-for-distributed-transactions-in-microservices) — the practical treatment, including the point this capability extends: system-state compensation and real-world compensation are different problems and only the first is automatable.
