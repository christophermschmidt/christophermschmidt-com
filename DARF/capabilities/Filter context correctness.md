# Filter context correctness

**Pillar:** Semantic Readiness
**Layer:** Context Stability
**Status:** Scoped
**Prerequisites:** [Grain consistency](Grain%20consistency.md), [Ambiguous relationship handling](Ambiguous%20relationship%20handling.md)
**Verified by:** [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md), [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Context Stability → Filter context correctness (coverage: partial)

## Definition

A measure returns the correct value under every filter combination a consumer can apply, including combinations no report ever produced. Correctness here is a property of the measure's interaction with the model, not of the measure's arithmetic.

## Why it matters

Measures are written and tested against the filter contexts the report author had in mind. Agents generate filter contexts nobody designed for: a ratio filtered to a single day, a period-over-period comparison on a partial period, a percentage-of-total where the total was silently restricted by an unrelated slicer. The measure evaluates without error and returns a number that is wrong only in the context the agent invented. Nothing in the stack flags it.

## Failure modes

- Ratios that compute correctly at the aggregate and incorrectly at the row level because the numerator and denominator respond differently to the filter.
- Percentage-of-total measures where the "total" respects a filter it should have removed.
- Period-over-period measures returning a value for a period with no data instead of blank, so a comparison against zero looks like a 100% decline.
- Measures depending on an implicit selection — a slicer default, a report-level filter — that does not exist when the agent queries the model directly.
- Semi-additive measures that behave correctly in the report layout they were built for and wrongly under any other grouping.

## Anti-patterns

- **Testing the measure at one grain.** A measure validated only at the total line will pass and still be wrong at every level below it.
- **Report-level filters carrying semantic meaning.** If a report filter is doing definitional work — "exclude intercompany" applied in the report rather than the measure — the agent will never apply it.
- **Regression suites that test the model, not the agent.** Correct DAX does not imply a correct agent answer; the failure is usually in the query the agent generated.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Measures are validated by eye against the report they were built for. |
| 2 | Governed | Measure authoring standards exist covering filter removal, blank handling and ratio construction. |
| 3 | Contextual | Definitional filters live in the measure, not the report, and measures are tested at multiple grains before release. |
| 4 | Operational | A golden-question regression suite asserting known-correct values under filter-sensitive conditions runs against the agent on every change, not just against the model. |
| 5 | Autonomous | The suite is generated and extended automatically from observed agent query patterns, and a failing measure is withdrawn from agent-visible metadata. |

## Diagnostic question

*How do you know a measure is still correct under a filter combination no report ever produced?*

1. We don't — we validate against the reports we built.
2. Authoring standards cover the common traps and reviewers check them.
3. Definitional filters are in the measure and measures are tested at multiple grains.
4. A golden-question suite runs against the agent on every change.
5. The suite self-extends from observed agent queries and failing measures are withdrawn automatically.

## Evidence to request

- The measure authoring standard.
- The golden-question suite: the questions, their expected values, and the last run against the agent.
- The last three measure changes and what testing they received.
- A sample of the queries the agent generated in the last week, with the filter contexts they produced.

## Verification

Pick a ratio measure and ask the agent for it at four levels — total, a single large category, a single small category, and a category with no data in the period. Check all four by hand. The fourth is where most models fail and it is the one an executive will hit first, because the interesting question is always about the exception.

## Article angle

This is the most technically credible capability in Pillar 1 for a practitioner audience and the hardest to make legible to an executive one. Route it paid: it needs real DAX and a reproducible example. The framing that carries it is that filter context was always a latent defect and reports were an accidental test harness that happened to cover the cases anyone looked at.

## Sources

- [BEAVER: An Enterprise Benchmark for Text-to-SQL](https://arxiv.org/html/2409.02038v3) — built specifically because academic benchmarks do not reproduce enterprise query behavior; the failures it isolates are predominantly semantic rather than syntactic.
- [Text-to-SQL Benchmarks for Enterprise Realities](https://openreview.net/pdf?id=gXkIkSN2Ha) — the evidence for testing the agent rather than the model: correct underlying definitions do not survive an incorrectly generated query.
