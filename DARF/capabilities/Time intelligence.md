# Time intelligence

**Pillar:** Semantic Readiness
**Layer:** Context Stability
**Status:** Scoped
**Prerequisites:** [Units/currency/time handling](Units%20currency%20time%20handling.md), [Grain consistency](Grain%20consistency.md)
**Verified by:** [Filter context correctness](Filter%20context%20correctness.md), [Retrospective causality](Retrospective%20causality.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Context Stability → Time intelligence (coverage: partial)

## Definition

The model's handling of periods, comparisons and as-of questions: fiscal calendars, partial periods, period-over-period logic, and the distinction between what was true at a point in time and what the current record says was true then.

## Why it matters

Time is where "correct" and "meaningful" diverge most often. A period-over-period comparison against an incomplete current period is arithmetically correct and analytically worthless, and an agent will produce it without hesitation. The as-of problem is worse: most warehouses overwrite dimension attributes, so a question about last quarter's performance by region is answered using this quarter's region assignments. Nobody notices because the number looks reasonable.

## Failure modes

- Month-to-date compared against a full prior month, presented as a decline.
- Fiscal calendar implemented in the report layer, so the agent querying the model gets calendar months.
- No date dimension marked as such, so time functions silently degrade.
- Type-1 dimensions used for attributes that change — territory, manager, product hierarchy — making all historical analysis retroactively restated.
- Multiple date columns with no declaration of which is the reporting date for which question class.
- Event-time versus processing-time confusion at the boundary between the warehouse and the event stream.

## Anti-patterns

- **A date table that is not marked as one.** The functions still return values; they just stop being right at the edges.
- **Restating history silently.** Type-1 overwrites are a legitimate design choice and an illegitimate default. If history restates, the answer surface must say so.
- **Handling partial periods in the visual.** A footnote on a dashboard telling the reader the current month is incomplete does nothing for the agent, which will compare it anyway.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Date logic is written per report. No shared calendar. |
| 2 | Governed | A conformed date dimension and fiscal calendar exist and are documented, including which date column is authoritative per fact. |
| 3 | Contextual | Partial-period comparisons are blocked or explicitly labeled by the model, and attributes requiring historical accuracy are tracked as slowly-changing with as-of query support. |
| 4 | Operational | As-of correctness is tested against known historical values, and the rate of partial-period and restated-history answers is measured. |
| 5 | Autonomous | The model detects an incomparable period pairing and returns the comparison with its own caveat rather than requiring the consumer to know. |

## Diagnostic question

*If someone asks the agent how last quarter compared to the quarter before, what stops it comparing an incomplete period, and does it use last quarter's org structure or today's?*

1. Nothing, and it uses today's structure.
2. We have a conformed calendar and documented conventions; correctness depends on the asker.
3. Partial periods are blocked or labeled by the model and history-sensitive attributes are tracked as slowly-changing.
4. As-of correctness is tested against known values and incomparable-period rates are measured.
5. The model self-caveats incomparable comparisons.

## Evidence to request

- The date dimension definition and its marking, plus the fiscal calendar logic and where it lives.
- The list of dimension attributes tracked as slowly-changing, and the list of history-sensitive attributes that are not.
- An as-of query example — the same report run for a historical date, twice, six months apart.
- The convention for event time versus ingest time at the streaming boundary.

## Verification

Ask the agent for a period-over-period comparison mid-month and see whether the answer carries any indication that the current period is partial. Then ask for a metric broken out by an attribute you know has changed — a sales region reorganization is the usual candidate — for a period before the change, and check whether the answer reflects the old structure or the new one. Both tests take under five minutes and neither requires model access.

## Article angle

The as-of problem is the better half of this capability and the less written-about. The hook is that most enterprises cannot answer "what did we believe at the time," which is the question every post-incident review and every regulator actually asks. That connects Pillar 1 time intelligence directly to Pillar 2's retrospective causality — the same defect, discovered in two very different rooms.

## Sources

- [Time travel: two-dimensional time with bitemporal data](https://aiven.io/blog/two-dimensional-time-with-bitemporal-data) — valid time versus transaction time, which is the formal statement of the as-of problem this capability scores.
- [Bitemporal Data Modeling](https://softwarepatternslexicon.com/bitemporal-modeling/) — the pattern catalog for as-of queries, and the argument that bitemporal dimensions can replace slowly-changing dimensions rather than supplement them.
