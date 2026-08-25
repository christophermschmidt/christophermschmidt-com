# Narrative-ready model design

**Pillar:** Semantic Readiness
**Layer:** Analytical Explainability
**Status:** Scoped
**Prerequisites:** [Canonical metric definitions](Canonical%20metric%20definitions.md), [Contribution analysis](Contribution%20analysis.md)
**Verified by:** [AI-readable schema design](AI-readable%20schema%20design.md), [Evaluation/hallucination-surface reduction](Evaluation%20hallucination-surface%20reduction.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Analytical Explainability → Narrative-ready model design (coverage: partial)

## Definition

The model carries the elements a defensible narrative requires — thresholds of materiality, expected ranges, targets and benchmarks, directionality (is up good), and business context per metric — so that the explanation is assembled from declared knowledge rather than improvised from numbers.

## Why it matters

The difference between an agent that says "margin fell 40 basis points" and one that says "margin fell 40 basis points, which is within normal monthly variation and is not a concern" is not language ability. It is whether the model knows what normal is. Absent that knowledge, the agent generates significance from the size of the number, which means every large-looking movement becomes a finding and every small one is dropped, regardless of which actually matters. This is the capability that determines whether an agent's output is signal or noise, and it is almost never modeled.

## Failure modes

- No materiality threshold per metric, so a 2% move in a stable metric and a 2% move in a volatile one are reported identically.
- No directionality metadata, so the agent describes a decrease in cost as a decline in performance.
- Targets and forecasts exist in a planning system the semantic layer cannot see, so nothing is compared to plan.
- No expected range or seasonality baseline, so seasonal movement is narrated as change.
- Business context — what the metric is for, who owns it, what actions are available against it — lives in people's heads.
- Metric relationships (this is a component of that; these two trade off) are not modeled, so the narrative treats independent and dependent metrics alike.

## Anti-patterns

- **Prompt-engineering the context.** Putting business context in the system prompt rather than the model puts it outside version control, outside lineage, and inside every request's token budget.
- **Threshold in the alert, not the model.** An alerting rule encodes materiality for one use case and nothing else can reuse it.
- **Confusing narrative generation with narrative readiness.** The generation is the easy part and the part vendors demo. Readiness is the modeled knowledge underneath.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | The model holds numbers only. Any narrative is improvised from magnitude. |
| 2 | Governed | Business context, targets and thresholds are documented, usually per report or per team. |
| 3 | Contextual | Materiality, expected range, directionality, target and owner are modeled as first-class metadata on every headline metric and are read at answer time. |
| 4 | Operational | Threshold quality is reviewed against outcomes — how often a flagged movement mattered — and metric interdependencies are modeled. |
| 5 | Autonomous | Expected ranges are learned and maintained from history, and the system tunes its own materiality thresholds against whether the flagged findings led to action. |

## Diagnostic question

*How does the system know whether a movement it just described is worth mentioning?*

1. It doesn't — significance comes from the size of the number.
2. Thresholds and context are documented per report or team.
3. Materiality, expected range, direction, target and owner are modeled per metric and read at answer time.
4. Threshold quality is reviewed against whether flagged findings mattered, and metric interdependencies are modeled.
5. Ranges and thresholds are learned and self-tuned against outcomes.

## Evidence to request

- The metadata schema for headline metrics — which of materiality, range, direction, target, owner actually exist as fields.
- Where the targets live and whether the semantic layer can reach them.
- The system prompt for the agent, to see how much business context is being smuggled in at request time.
- A recent narrative output, to check whether its significance claims trace to declared thresholds.

## Verification

Ask the agent about a metric that moved slightly and about one that moved a lot but seasonally. If both are described in the same register, or if the seasonal one is called out as a change, the capability is at 1 or 2. Then read the system prompt and count how many business facts are in it that should have been in the model — that count is the size of the ungoverned narrative layer.

## Article angle

The best available argument against prompt engineering as an architecture, made concretely. Every business fact in a system prompt is a fact that is unversioned, unlineaged, untestable and paid for on every single request. Narrative readiness reframes "make the agent sound smart" as a modeling problem, which is the move that puts the work back in the data team's lane and makes it buyable.

## Sources

- [When Generic Prompt Improvements Hurt: Evaluation-Driven Iteration for LLM Applications](https://arxiv.org/pdf/2601.22025) — the evidence for the anti-pattern: business context injected at the prompt layer is unversioned, untestable and frequently counterproductive.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot) — quantifies the cost of carrying business context in every request rather than modeling it once.
