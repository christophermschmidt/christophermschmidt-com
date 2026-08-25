# Retrospective causality

**Pillar:** Operational Readiness
**Layer:** Audit
**Status:** Scoped
**Prerequisites:** [Decision logging](Decision%20logging.md), [Lineage](Lineage.md), [State binding correctness](State%20binding%20correctness.md), [Change safety and versioning](Change%20safety%20and%20versioning.md)
**Verified by:** [Decision-outcome feedback](Decision-outcome%20feedback.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Audit → Retrospective causality (coverage: partial), and "Ten things the platform does not do" → point-in-time reconstruction

## Definition

The ability to answer why a specific decision came out the way it did — not merely what was recorded, but which input was decisive, what would have had to differ for the outcome to change, and whether the same inputs would produce the same output today.

## Why it matters

This is where the Audit layer stops being record-keeping and becomes an investigation capability. After a bad outcome, the questions are always counterfactual: what would have had to be different, was this a one-off or a class, and does the same defect still exist. A complete decision record makes those questions answerable; it does not answer them. The hard requirement underneath is point-in-time reconstruction — the ability to re-evaluate the decision against the definitions, policies, model version and state that were in force then — which depends on capabilities in both pillars and is the single strongest argument for why the pillars are assessed together.

## Failure modes

- The record is complete and the definitions behind it have since changed, so replay produces a different answer for reasons unrelated to the incident.
- The model version is no longer available, so the decision cannot be re-executed at all.
- Non-determinism unaccounted for, so replay differences cannot be attributed to a cause.
- No counterfactual capability, so investigations conclude with a narrative rather than a finding.
- Investigation performed by the team that built the agent, which is a competence problem and an independence problem at once.
- Findings not generalized, so the same class of defect is investigated repeatedly as separate incidents.
- No blameless mechanism, so near-misses go unreported and only outcomes visible to a customer ever get investigated.

## Anti-patterns

- **Replay as investigation.** Re-running the decision today answers a different question than the one asked, unless everything has been pinned.
- **Root cause by narrative.** A plausible story assembled from the trace, with no test of whether changing the named factor would have changed the outcome.
- **Investigating only what escalated.** The near-miss population is larger, cheaper to learn from, and invisible without a protected channel.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Post-incident analysis is a conversation and a look at the logs. |
| 2 | Governed | An investigation process exists with a defined trigger and a written output. |
| 3 | Contextual | Decisions can be reconstructed point-in-time against the definitions, policy, model and state in force then, and counterfactual analysis is possible — which input was decisive. |
| 4 | Operational | Investigation is independent of the build team, findings are classified and generalized across decisions, and near-misses are captured through a protected channel. |
| 5 | Autonomous | Anomalous decisions are detected and investigated automatically, and findings feed policy and evaluation without a human initiating the loop. |

## Diagnostic question

*A decision from four months ago turned out badly. Can you determine which input was decisive, and would the same inputs produce the same output today?*

1. We'd read the logs and form a view.
2. We have an investigation process with a written output.
3. We can reconstruct point-in-time and identify the decisive input.
4. As above, with independent investigation, generalized findings and a near-miss channel.
5. Anomalies are auto-detected and investigated, feeding policy and evaluation.

## Evidence to request

- An investigation report from a real incident.
- Evidence of a point-in-time reconstruction — a decision re-evaluated against historical definitions.
- Model, prompt and policy version availability going back through the retention window.
- Who performs investigations and their independence from the build team.
- The near-miss reporting mechanism and its volume.

## Verification

Ask for the last investigation report and read it for a counterfactual. Most contain a narrative and no test of what would have changed the outcome. Then ask whether the model version used four months ago is still available; where it is not, point-in-time reconstruction is impossible regardless of how good the record is, and that is a finding the customer's risk function will care about more than the technical team does.

## Aviation parallel

This is the whole of accident investigation, and three of its design choices are the ones enterprises have not copied. Investigation is independent of the operator and the manufacturer. Findings are published so the industry learns from an event it did not experience. And the confidential reporting system collects near-misses under protection, which is where most of the learning volume comes from — an airline that only investigated crashes would learn almost nothing.

## Article angle

The strongest closing piece for Pillar 2 and the natural anchor for the aviation-safety thesis, because the analogy is structural rather than decorative. The most valuable and least expected argument is the near-miss one: enterprises investigate outcomes that became visible, aviation investigates events that nearly happened, and the difference in learning rate is the entire reason one industry got safe. That reframes audit from a compliance cost into the mechanism by which the system improves.

## Sources

- [NASA Aviation Safety Reporting System](https://asrs.arc.nasa.gov/) — confidential, non-punitive reporting since 1976, over two million reports collected. The design property worth copying is that protection is what produces the reporting volume, not exhortation.
- [Aviation Voluntary Reporting Programs](https://www.faa.gov/newsroom/aviation-voluntary-reporting-programs-1) — the regulator's description of how voluntary reports and recorded flight data are used together: the data says what happened, the reports say why.
- [Decision Evidence Maturity Model for Agentic AI](https://arxiv.org/abs/2605.04093) — the reconstruction method, and the distinction between having a record and being able to answer a specific question from it.
