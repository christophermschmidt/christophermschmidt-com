# Units/currency/time handling

**Pillar:** Semantic Readiness
**Layer:** Semantic Integrity
**Status:** Scoped
**Prerequisites:** [Naming conventions](Naming%20conventions.md)
**Verified by:** [Time intelligence](Time%20intelligence.md), [Semantic parity across surfaces](Semantic%20parity%20across%20surfaces.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Semantic Integrity → Units/currency/time handling (coverage: partial)

## Definition

Every quantity in the model carries its unit, every monetary amount carries its currency and conversion basis, and every timestamp carries its zone and its meaning. Handling means these are modeled as data, not as formatting, and that conversion between them is a governed, single-implementation operation.

## Why it matters

A number without a unit is not a fact. Humans supply the missing unit from context and are usually right; agents supply it from training priors and are confidently wrong. The specific danger in agentic systems is that the model will happily add 400 kg to 400 lb, or compare a EUR figure converted at spot to a EUR figure converted at budget rate, and present the sum with no indication that a conversion occurred at all.

## Failure modes

- Quantity columns with no unit column, where the unit varies by source system or by product line.
- A single `amount` column mixing transaction currency and reporting currency rows.
- Conversion rate applied at a different date in the warehouse than in the reporting layer, so two correct systems disagree.
- Timestamps stored in local time with no zone, or in UTC but labeled with a business-day convention that shifts the date.
- Event time, ingest time and effective time collapsed into one column called `date`.
- Fixed-precision monetary values coerced to floating point somewhere in the pipeline, producing cent-level drift that compounds in aggregates.

## Anti-patterns

- **Format strings as unit semantics.** A currency format string is a display instruction. An agent querying the model does not see it, and two models can format the same column differently.
- **One conversion function per consumer.** Every team implements FX conversion in its own measure. They agree until a rate source changes.
- **"Everything is UTC."** True for storage and insufficient for meaning — a daily close, a shift boundary and a fiscal day are local concepts, and a UTC-only model silently reassigns transactions across day boundaries.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Units and currencies are implicit. Conversion is done per analysis. |
| 2 | Governed | Conventions are documented — canonical currency, canonical unit, UTC storage with a stated local convention. |
| 3 | Contextual | Unit, currency code and conversion basis are columns in the model; a single conversion service or measure is the only implementation, and raw amounts are not exposed without their code. |
| 4 | Operational | Unmarked quantities and unconverted amounts are detected and reported; conversion-basis mismatches between layers are tested for. |
| 5 | Autonomous | The model refuses to publish a quantity without a unit, and conversion drift between layers triggers remediation rather than a ticket. |

## Diagnostic question

*How does a consumer of your model know the unit and currency basis of a number, and how many implementations of currency conversion exist?*

1. From context and convention — there's no column for it.
2. It's documented; conversion is done consistently by agreement.
3. Unit, currency and basis are modeled as data with a single conversion implementation.
4. We detect and report unmarked quantities and cross-layer basis mismatches.
5. Publishing an unmarked quantity is blocked and conversion drift self-remediates.

## Evidence to request

- The schema for the three largest fact tables, showing unit and currency columns.
- Every implementation of currency conversion in the estate — measures, views, notebooks, pipeline steps.
- The unit-of-measure conversion table and its owner.
- The documented time convention: what is stored, in what zone, and how fiscal and local day boundaries are derived.

## Verification

Ask the same monetary question of the semantic model and of the warehouse for a period containing a rate change, and reconcile. Then ask for the definition of "yesterday" in the model and check it against a transaction that occurred at 23:30 local on a day the business considers closed at 22:00. Both tests take minutes and both usually fail.

## Article angle

Strong candidate for a short, high-clarity piece. The Mars Climate Orbiter is overused; the better hook is that an LLM asked to compare two quantities will do the arithmetic regardless of whether the comparison is meaningful, because arithmetic is what it was asked for. This is one of the clearest demonstrations that scoping the answer is not the same as scoping the question.

## Sources

- [Time travel: two-dimensional time with bitemporal data](https://aiven.io/blog/two-dimensional-time-with-bitemporal-data) — the valid-time versus transaction-time distinction, which is the precise reason a single column called `date` cannot carry the meaning three different consumers need from it.
- [Bitemporal Data Modeling](https://softwarepatternslexicon.com/bitemporal-modeling/) — patterns for effective/through columns and as-of query support, the mechanics behind the time half of this capability.

*Literature note:* the currency and unit-of-measure half is genuinely under-served. There is extensive standards work (ISO 4217, UN/CEFACT) and almost no writing on modeling units as first-class data in an analytics layer. That gap is itself a publishable observation.
