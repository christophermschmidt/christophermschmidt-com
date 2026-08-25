# Decision-outcome feedback

**Pillar:** Operational Readiness
**Layer:** Audit
**Status:** Scoped
**Prerequisites:** [Decision logging](Decision%20logging.md), [Canonical metric definitions](Canonical%20metric%20definitions.md)
**Verified by:** [Shadow mode and staged autonomy](Shadow%20mode%20and%20staged%20autonomy.md), [Cost per decision](Cost%20per%20decision.md)
**Microsoft implementation:** not mapped in the reference architecture — no first-party mechanism links a decision record to its business outcome; this is a build and it is the one that makes the platform improvable

## Definition

Every decision is linked to what actually happened as a result — the business outcome, measured against the outcome the decision intended — so that decision quality can be assessed empirically rather than by proxy.

## Why it matters

Without this, every other measurement in the framework is a proxy. Accuracy against a golden set measures agreement with a curated answer; groundedness measures whether the answer traced to a source; approval rate measures human behavior. None of them measure whether the decision was *good*. The outcome link is also the only mechanism that improves the system over time and the only evidence that survives a budget review, which is why its absence tends to show up not as a technical failure but as a program that cannot justify its second year.

The measurement problem is real and worth stating: outcomes are delayed, confounded and often unobservable for the counterfactual. That difficulty is the reason nobody builds it, and it is not a reason it should not be built — it is a reason to design for it deliberately rather than expecting it to emerge.

## Failure modes

- Decisions and outcomes live in different systems with no join key, so the link cannot be made even retrospectively.
- Outcome measured only where it is convenient, which selects for the easy cases.
- No counterfactual, so a good outcome is credited to the decision that preceded it.
- Attribution window undefined, so the outcome is measured before the effect or long after other factors dominate.
- Only negative outcomes captured, through the incident channel, giving a systematically biased picture.
- Outcomes measured against a metric that is not the one the decision was optimizing.
- Feedback collected and never routed anywhere that changes the system.

## Anti-patterns

- **Thumbs up and thumbs down.** Measures satisfaction with the interaction, not the quality of the decision, and the two are frequently inversely related.
- **Proxy metrics as outcomes.** Response time, deflection rate, adoption. All useful operationally and none of them say whether the decision was right.
- **Outcome measurement as a reporting exercise.** Producing a quarterly value slide rather than a per-decision-type quality signal that feeds promotion and demotion.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Outcomes are not linked to decisions. Quality is assessed by complaint volume. |
| 2 | Governed | Aggregate outcome metrics are tracked for the use case and reported. |
| 3 | Contextual | Each decision carries an intended outcome and is joined to the realized outcome within a defined attribution window, per decision type. |
| 4 | Operational | Outcome quality is measured against a baseline or control, both positive and negative outcomes are captured, and the results feed evaluation sets and autonomy-stage decisions. |
| 5 | Autonomous | Outcome feedback closes the loop automatically — policy, routing, thresholds and autonomy level adjust against measured decision quality. |

## Diagnostic question

*For the decisions your agent made last quarter, how many turned out well — and how do you know?*

1. We don't measure that; we hear about the bad ones.
2. We track aggregate outcome metrics for the use case.
3. Each decision carries an intended outcome and is joined to the realized outcome per decision type.
4. Quality is measured against a baseline, both directions are captured, and results feed evaluation and autonomy decisions.
5. The loop is closed automatically against measured decision quality.

## Evidence to request

- The join between decision records and outcome data, and the key it uses.
- The attribution window per decision type and its justification.
- The baseline or control the outcome is compared against.
- How the outcome signal reaches evaluation, policy or the autonomy stage decision.
- Outcome distribution for the last quarter, both directions.

## Verification

Ask for the outcome distribution for one decision type. If the answer is drawn from the incident channel, the measurement is negative-only and structurally biased, which places the capability at 1 or 2. Then check whether the outcome data can be joined to decision records at all — where no key exists, the capability cannot be built retroactively for anything already decided, which makes it urgent rather than merely important.

## Aviation parallel

Safety management systems close the loop deliberately: flight data monitoring analyzes every flight, not only the ones that went wrong, and the findings feed procedure and training changes on a defined cycle. The relevant contrast is population — enterprises examine the tail of bad outcomes, aviation examines the whole distribution, and that is why aviation improves continuously while enterprise AI programs plateau after the first year.

## Article angle

The piece that closes the framework, and the one most likely to change what a reader does on Monday. The argument: you have measured accuracy, latency, groundedness, adoption and cost, and you have not measured whether the decisions were good — and the reason is that it is hard, delayed and confounded, all of which were also true in aviation before flight data monitoring. It also carries a direct commercial edge, because a customer who cannot demonstrate decision quality cannot defend the program's budget, which makes this capability the one that determines whether there is a year two.

## Sources

- [Aviation Safety: Efforts to Implement Flight Operational Quality Assurance Programs (GAO/RCED-98-10)](https://www.gao.gov/assets/rced-98-10.pdf) — the institutional history of FOQA: analyzing every flight rather than only the ones that went wrong, and the organizational obstacles to doing so. The enterprise parallel is exact.
- [Aviation Voluntary Reporting Programs](https://www.faa.gov/newsroom/aviation-voluntary-reporting-programs-1) — the pairing of objective outcome data with subjective reporting, which is the structure a decision-quality loop needs.
- [Causal inference in statistics: An overview](https://ftp.cs.ucla.edu/pub/stat_ser/r350.pdf) — for the counterfactual problem: a good outcome following a decision is not evidence the decision caused it.
