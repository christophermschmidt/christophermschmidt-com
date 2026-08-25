# Freshness/recency requirements

**Pillar:** Semantic Readiness
**Layer:** Context Stability
**Status:** Scoped
**Prerequisites:** [Lineage](Lineage.md)
**Verified by:** [Live vs. snapshot data](Live%20vs%20snapshot%20data.md), [Latency requirements by use case](Latency%20requirements%20by%20use%20case.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Context Stability → Freshness/recency requirements, and "Ten things the platform does not do" → freshness contract exposed to the agent

## Definition

Every dataset carries a stated freshness contract — the maximum age of the data it can return — and that contract is exposed to consumers, including agents, at query time rather than documented elsewhere. Recency requirements are the demand side: each question class states the maximum data age at which its answer remains trustworthy.

## Why it matters

Trust in an answer is a function of the answer and its age together. A correct number computed from a pipeline that last ran nineteen hours ago may be a perfectly good answer to a strategy question and a dangerous one to an operational question, and only the consumer knows which. Agents have no way to make that judgment unless freshness travels with the data. This is the capability that bridges the two pillars: Pillar 1 cares whether the answer is trustworthy, Pillar 2 cares whether it is a safe basis for action, and both depend on the same contract being legible.

## Failure modes

- Data age is knowable from pipeline logs and not from the query result.
- A failed refresh leaves yesterday's data in place and the surface reports normally.
- Freshness is stated as a target ("daily") rather than a contract with a measured breach rate.
- Different tables in one answer have different ages and the answer reports none of them.
- The agent's retrieval index refreshes on a different cadence than the data it indexes, so citations point at content that has changed.
- Freshness is guaranteed for the warehouse and silently absent for the enrichment or reference data joined to it.

## Anti-patterns

- **A last-refreshed timestamp on a dashboard.** Human-readable, in one surface, and not part of the answer the agent returns.
- **SLA without measurement.** A stated daily refresh with no record of how often it was met is a level-2 claim.
- **Stale-serving on failure.** Serving the previous load when the current one fails is a reasonable availability choice and an unreasonable default when the consumer cannot tell.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Freshness is whatever the pipeline achieved. Consumers find out when something looks wrong. |
| 2 | Governed | Freshness targets are documented per dataset and monitored by the data team. |
| 3 | Contextual | Each dataset publishes a freshness contract as queryable metadata; the answer surface carries the age of the data it used, and a breach is signalled rather than served silently. |
| 4 | Operational | Breach rate is measured per dataset against the contract, and question classes carry declared recency requirements that are checked against the contract at query time. |
| 5 | Autonomous | A dataset in breach is withheld from question classes whose recency requirement it can no longer meet, automatically and per request. |

## Diagnostic question

*When the agent answers, how does it — and the person reading it — know how old the underlying data is?*

1. It doesn't; freshness is only visible in pipeline logs.
2. Targets are documented and the data team monitors them.
3. Freshness is queryable metadata and travels with the answer; breaches are signalled.
4. Breach rate is measured, and each question class has a declared recency requirement checked at query time.
5. Datasets in breach are automatically withheld from questions they can no longer serve.

## Evidence to request

- The freshness contract per dataset and where a consumer reads it.
- Refresh success and duration history for the last 90 days, with breach count.
- What the answer surface shows: an actual agent response including its freshness annotation, or the absence of one.
- The recency requirement per question class, if one has ever been written down.
- Behavior on refresh failure — documented and demonstrated, not described.

## Verification

Ask for the refresh history and count breaches yourself rather than accepting the target. Then deliberately look at a dataset whose last refresh failed, if one exists in the window, and see what the agent returns for a question against it. The gap between "we refresh daily" and the measured breach rate is usually the most quotable number in the whole assessment.

## Aviation parallel

Instruments in a cockpit fail with a flag, not with a plausible reading. An attitude indicator that quietly holds its last value is more dangerous than one that visibly dies, which is why comparator warnings and flagged failures are mandatory rather than nice to have. A data surface that serves yesterday's number with today's confidence is an unflagged instrument.

## Article angle

The strongest single bridge piece between the two pillars, and a natural free-tier argument because the failure needs no technical vocabulary. The turn is the instrument-flag framing: the industry has spent a decade improving refresh frequency and almost no time on making staleness legible, and legibility is the part that governs whether an agent should act.

## Sources

- [What Is Data Observability? 5 Key Pillars](https://montecarlo.ai/blog-what-is-data-observability) — freshness as the first of the five canonical observability pillars, and the framing of data downtime as a measurable quantity rather than an incident category.
- [Data Freshness Monitoring: SLA Management](https://www.conduktor.io/glossary/data-freshness-monitoring-sla-management) — the distinction between a freshness target and a measured, contractual freshness commitment, which is the level-2 to level-4 boundary here.
