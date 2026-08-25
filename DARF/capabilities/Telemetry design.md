# Telemetry design

**Pillar:** Operational Readiness
**Layer:** Audit
**Status:** Scoped
**Prerequisites:** none — this is a root capability of the Audit layer
**Verified by:** [Decision logging](Decision%20logging.md), [Cost per decision](Cost%20per%20decision.md), [Retrospective causality](Retrospective%20causality.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Audit → Telemetry design (coverage: partial) — OpenTelemetry into Fabric is the documented pattern

## Definition

The deliberate design of what the system emits about its own operation: spans covering the whole agent execution tree — the agent run, each model call, each tool invocation, each retrieval — with a conformant, stable schema, correlation across every hop, and retention matched to the questions the telemetry will have to answer.

## Why it matters

Telemetry is the substrate the entire Audit layer is built on, and it is the one capability where designing late is fatal — you cannot retroactively instrument a decision that has already happened. The specific trap is that telemetry designed for operations answers operational questions (is it up, is it slow, is it erroring) and cannot answer accountability questions (what did it consider, why did it choose that, who was acting). Those need different fields, captured at the same moment, and adding them afterwards costs a re-instrumentation of every path plus a permanent gap in the historical record.

## Failure modes

- Application logs only, with no distributed trace, so a multi-step decision cannot be reassembled.
- Correlation broken at a boundary — an async dispatch, a queue, an agent-to-agent call — so the trace ends mid-decision.
- Prompts and responses logged in full for debugging, creating a data protection problem that later forces retention to be cut.
- Sampling applied uniformly, so the rare consequential decisions are the ones most likely to be discarded.
- Proprietary telemetry format from an agent platform, so instrumentation must be rebuilt on any platform change.
- Retention set by cost rather than by the longest question anyone will need to answer.
- Tool inputs and outputs unlogged, so the trace shows that a tool was called and not what it did.

## Anti-patterns

- **Observability tooling as audit.** APM answers latency and error questions. It does not capture the reasoning inputs, the policy evaluation or the acting principal.
- **Log everything and decide later.** Produces cost, a privacy exposure, and, in practice, retention cuts that remove exactly the history you needed.
- **Instrumenting the platform, not the decision.** Platform-emitted telemetry tells you about the runtime; the decision record needs business fields the runtime does not know about.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Application logs, per component, uncorrelated. |
| 2 | Governed | Structured logging with a convention; a tracing tool is deployed for the main paths. |
| 3 | Contextual | The full agent execution tree is traced under a conformant schema with correlation preserved across every hop including async and inter-agent calls; tool inputs and outputs are captured. |
| 4 | Operational | Telemetry completeness is measured, retention is set from the questions it must answer, sampling protects high-consequence decisions, and sensitive content handling is designed rather than incidental. |
| 5 | Autonomous | Coverage gaps are detected automatically and an uninstrumented action path cannot be deployed. |

## Diagnostic question

*Can you reconstruct the complete execution tree of a single agent decision from three months ago — every model call, tool call and retrieval, correlated?*

1. No; we have component logs.
2. Partly; we have structured logs and tracing on the main paths.
3. Yes; the full tree is traced under a conformant schema with correlation across all hops.
4. Yes, and completeness is measured with retention set by the questions and sampling that protects consequential decisions.
5. Yes, and an uninstrumented path cannot ship.

## Evidence to request

- A complete trace for one real decision, exported.
- The telemetry schema and whether it follows a recognized convention.
- Retention policy per telemetry type, with the reasoning.
- The sampling configuration.
- The list of paths that emit no telemetry.

## Verification

Ask for a trace of a decision old enough to have crossed a retention boundary. Two things fail here routinely: the trace is incomplete across an async or inter-agent hop, and the retention window is shorter than the period a regulator or an investigation would ask about. Both are cheap to state and expensive to have discovered later.

## Aviation parallel

The flight data recorder specification is prescriptive about parameters, sample rates and duration, and it is prescriptive because after an accident is the wrong time to discover a parameter was not recorded. Its enterprise analogue does not exist — nobody has written the mandatory-parameter list for an agent decision — which is exactly the gap this capability and decision logging together describe.

## Article angle

The practitioner piece here has a real news hook: GenAI telemetry conventions matured through 2026 and now model the agent execution tree properly, which makes conformant instrumentation newly practical. The argument that gives it weight is the one-way-door framing — every other capability can be improved retroactively, and this one cannot, so it is the first thing to build and the thing most often deferred.

## Sources

- [How OpenTelemetry Traces LLM Calls, Agent Reasoning, and MCP Tools](https://greptime.com/blogs/2026-05-09-opentelemetry-genai-semantic-conventions) — the current span model: `invoke_agent` as the root with `chat` and `execute_tool` children, which is the execution tree this capability requires.
- [OpenTelemetry for AI Agents: Observability, Tracing and the GenAI Semantic Conventions](https://zylos.ai/research/2026-02-28-opentelemetry-ai-agent-observability/) — status and caveats, including that agent and framework spans remain in development status and moved to a separate `semantic-conventions-genai` repository in June 2026.
- [EU AI Act, Article 12 — Record-Keeping](https://artificialintelligenceact.eu/article/12/) — the requirement that logging conform to recognized standards rather than ad-hoc files, which is why conformance to a published convention is a level-3 property and not a preference.
