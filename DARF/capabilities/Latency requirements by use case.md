# Latency requirements by use case

**Pillar:** Operational Readiness
**Layer:** State
**Status:** Scoped
**Prerequisites:** [Live vs. snapshot data](Live%20vs%20snapshot%20data.md)
**Verified by:** [Cost per decision](Cost%20per%20decision.md), [Intelligence routing](Intelligence%20routing.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → State → Latency requirements by use case (coverage: pattern)

## Definition

Each decision type has a stated latency requirement derived from the business process it serves — how quickly the answer must arrive for the action to still be useful — and the architecture is chosen to meet that requirement rather than to maximize speed generally.

## Why it matters

Latency requirements are the discipline that stops real-time architecture becoming a religion. Most enterprise decisions do not need sub-second state and are enormously cheaper to serve if that is admitted early; a minority genuinely do, and building those on batch foundations guarantees the pilot never promotes. The requirement is a business fact — how long is the window in which this action still changes the outcome — and it is almost never elicited, so the architecture is chosen by preference and then defended by anecdote.

## Failure modes

- Latency stated as a technical target ("under two seconds") with no derivation from the decision window.
- A single latency tier applied to every use case, over-engineering the majority and under-serving the few that matter.
- End-to-end latency unmeasured; component latencies are known and their sum is not.
- The reasoning step's latency excluded from the budget, so a 200ms data path feeds a 12-second decision.
- Tail latency ignored, so the decisions that arrive late are exactly the complex ones that mattered most.
- The decision window shrinking as the business changes, with no re-derivation.

## Anti-patterns

- **Real-time everywhere.** Expensive, and it obscures which decisions genuinely have a window.
- **Latency budget without the model call.** The dominant term in an agentic path is usually inference and tool orchestration, not data retrieval.
- **Median-only reporting.** A distribution's median tells you nothing about whether the process is met, and the tail is the part that fails.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Latency is whatever the architecture delivers. No requirement was stated. |
| 2 | Governed | Targets exist per use case, usually set by technical judgment. |
| 3 | Contextual | Each decision type carries a requirement derived from its business window, and the architecture per decision is chosen against it, including the reasoning step in the budget. |
| 4 | Operational | End-to-end latency is measured per decision type at the tail as well as the median, and breach against requirement is reported. |
| 5 | Autonomous | The system routes or degrades per request to meet the requirement, and a decision that cannot meet its window is downgraded to a recommendation rather than delivered late. |

## Diagnostic question

*For each agent decision, what is the latency requirement, where did the number come from, and what is your measured p99 against it?*

1. There's no stated requirement.
2. Technical targets exist per use case.
3. Requirements are derived from the business decision window and drive the architecture, reasoning time included.
4. End-to-end p99 is measured per decision type and breaches are reported.
5. The system routes or degrades per request to hold the requirement.

## Evidence to request

- The latency requirement per decision type and the business reasoning behind each number.
- End-to-end measurement including the reasoning step, at median and p99.
- The latency budget broken into retrieval, reasoning, tool execution and write.
- What happens when a decision exceeds its window — documented and demonstrated.

## Verification

Ask where the latency number came from. "The business needs it fast" is a level-1 answer. Then compare the measured p99 to the requirement — not the median, which is what will be offered. Where no requirement exists, derive one live with the process owner in the room: how long after the event does the action still change the outcome. That question usually produces a much longer window than the architecture assumed, which is a cost finding as much as a design one.

## Article angle

The contrarian piece inside a real-time thesis: most of your decisions do not need real time, and pretending otherwise is why the platform costs what it does. It is credible precisely because it comes from someone selling real-time architecture, and it pairs with cost per decision as the pair of capabilities that make the framework read as honest rather than as vendor content.

## Sources

- [Data Freshness Monitoring: SLA Management](https://www.conduktor.io/glossary/data-freshness-monitoring-sla-management) — the discipline of deriving and measuring a commitment rather than asserting a target, applied to data arrival.
- [AI Inference Cost Economics in 2026: GPU FinOps Playbook](https://www.spheron.network/blog/ai-inference-cost-economics-2026/) — the cost side of the same decision: latency tiers are an architectural spend choice, and over-specifying them is one of the larger silent costs in agentic deployments.

*Literature note:* deriving a latency requirement from the business decision window — how long after the event the action still changes the outcome — is standard in control engineering and essentially absent from data and AI practice.
