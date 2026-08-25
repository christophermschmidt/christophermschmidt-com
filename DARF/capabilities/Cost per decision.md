# Cost per decision

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Intelligence routing](Intelligence%20routing.md), [Minimum sufficient context](Minimum%20sufficient%20context.md)
**Verified by:** [Decision-outcome feedback](Decision-outcome%20feedback.md), [Telemetry design](Telemetry%20design.md)
**Microsoft implementation:** not mapped in the reference architecture — Fabric capacity metrics and Foundry usage telemetry are the raw material; per-decision attribution and the unit-economic model are a build

## Definition

The fully loaded cost of producing one decision — inference, retrieval, orchestration, compute and the human time it consumes — attributed to the decision type, and compared against the value that decision produces.

## Why it matters

The real cost lever in agentic systems is context efficiency, not model price. Token prices fall continuously and context payloads grow to fill whatever window is available, which is why total spend rises while unit cost drops. Without per-decision attribution, an organization sees a platform bill and cannot connect it to anything, so the only available lever is a blunt one: use a cheaper model, which usually costs accuracy to save a fraction of a cost the context was actually driving. This capability sits in Execution because the two things that determine it — how much context is assembled and which kind of intelligence is invoked — are execution decisions.

It also belongs in a readiness framework for a less obvious reason: cost per decision against value per decision is the only number that tells you whether a use case should exist at all, and it is the number that survives into year two when the novelty budget ends.

## Failure modes

- Cost visible only as an aggregate platform bill with no per-use-case attribution.
- Human time in approval and escalation excluded from the cost, which for a supervised agent is frequently the largest term.
- Static context re-sent on every request, so a fixed cost is paid per call forever.
- Retry and failure paths uncosted, so the actual cost per successful decision is well above the nominal.
- No value side, so cost optimisation proceeds with no way to know when it has gone too far.
- Cost per decision known in aggregate but not by decision type, so the expensive minority is invisible.

## Anti-patterns

- **Model downgrade as the cost strategy.** Attacks the smaller term and pays in accuracy. Context reduction and routing usually deliver more, with an accuracy gain rather than a loss.
- **Cost per token as the metric.** The unit the business cares about is the decision. Token cost falling while decision cost rises is the normal case and the metric hides it.
- **Excluding the human.** A decision requiring four minutes of a specialist's review costs more in that review than in every token it consumed.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Cost is an aggregate platform bill. Per-decision cost is unknown. |
| 2 | Governed | Spend is tracked per workload or use case and budgeted. |
| 3 | Contextual | Fully loaded cost per decision, including human time and failure paths, is attributed per decision type and is a design input. |
| 4 | Operational | Cost is tracked against value per decision type, context composition is measured as a cost driver, and cost per decision is trended over time. |
| 5 | Autonomous | The system optimizes context and routing against a cost-per-decision target automatically, and a decision type whose cost exceeds its value is flagged for retirement. |

## Diagnostic question

*What does one of your agent's decisions cost, including the human time it consumes, and what is that decision worth?*

1. We only see the platform bill.
2. We track spend per use case against a budget.
3. Fully loaded cost per decision type is attributed, including human time and failures.
4. Cost is tracked against value, and context composition is measured as a driver.
5. The system optimizes against a cost-per-decision target and flags uneconomic decision types.

## Evidence to request

- Cost attribution by decision type for the last quarter.
- Token volume per request split into static and decision-specific components.
- Human time per supervised decision — from the approval system's own timestamps.
- Cost of the retry and failure paths.
- The value estimate per decision type and its basis.

## Verification

Compute the number yourself for one decision type from token volume, unit price, and approval time from the workflow system. Then compare against what the customer believes it costs. The static-context share is the finding that lands hardest, because it is usually the majority of tokens, it is paid on every single call, and it is the cheapest thing in the entire framework to fix.

## Article angle

The honest counterweight to a real-time, context-rich thesis, and it is more credible coming from someone selling that thesis. The specific argument worth owning: the industry's cost conversation is about model tier because that is the conversation model vendors seed, and the actual lever is context composition — which means the cost fix and the accuracy fix are the same work. That is a strong, non-obvious claim that connects Pillar 2 economics back to Pillar 1 discipline.

## Sources

- [Token Economics working group](https://www.finops.org/wg/token-economics-saas/) — the FinOps Foundation's framing of tokenomics as a discipline, and the point that token invoices are one of nine cost buckets.
- [FinOps X 2026: AI Token Economics](https://www.mavvrik.ai/blog/finops-x-2026-ai-token-economics/) — the numbers behind this page: blended token cost fell 67% year on year while total spend rose, and a review of 127 enterprise agentic projects found 73% over budget.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot) — why the cost lever and the accuracy lever are the same lever.
