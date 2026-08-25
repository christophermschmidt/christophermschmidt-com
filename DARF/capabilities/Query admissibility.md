# Query admissibility

**Pillar:** Operational Readiness
**Layer:** Policy
**Status:** Scoped
**Prerequisites:** [Scoped limits](Scoped%20limits.md), [AI-readable schema design](AI-readable%20schema%20design.md)
**Verified by:** [Intelligence routing](Intelligence%20routing.md), [Cost per decision](Cost%20per%20decision.md), [Decision logging](Decision%20logging.md)
**Microsoft implementation:** not mapped in the reference architecture — Azure API Management and Foundry tool scoping are the enforcement primitives; the declared decision scope and the admissibility check itself are a build

## Definition

A request is tested against the agent's declared decision scope before any model call is made, by a mechanism that is itself auditable. Admissibility is an allowlist over intents and decision classes, not a blocklist over topics.

## Why it matters

Every mechanism enterprises currently use to keep agents on topic restricts what the model may *say*. None restrict what it is asked or what it is given. The enterprise therefore pays — in tokens, in latency, in evaluation surface, in audit ambiguity — to suppress capability it never wanted in the first place. Admissibility inverts this: the system declares the decision classes it exists to serve, and anything outside them is refused before it costs anything. It is also the only one of these controls that produces a clean audit statement, because "this request was outside declared scope" is a fact about a rule, not a judgment by a model.

## Failure modes

- Scope enforced only by system prompt, which is a request rather than a control and burns context on every call.
- Denied-topic lists used as the mechanism, which requires enumerating the world.
- Admissibility checked after retrieval, so the cost and the data exposure have already happened.
- No declared decision scope to test against, so admissibility has no referent.
- The check performed by the same model that would answer the request.
- In-scope-but-out-of-authority requests conflated with out-of-scope ones, so the refusal message and the audit record are both wrong.

## Anti-patterns

- **Guardrails as scope.** Content safety tooling is built for harm categories, not relevance, and a question about employment law is not harmful.
- **Fine-tuning for scope.** A domain-tuned model still knows everything it knew before. Fine-tuning narrows behavior, not knowledge, so it cannot deliver the scoping benefit it implies.
- **Scope as a support burden.** Treating out-of-scope questions as a user education problem rather than an architectural boundary.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Anything can be asked; the model decides what to answer. |
| 2 | Governed | Scope is stated in the system prompt and topic filters are configured. |
| 3 | Contextual | A declared decision scope exists and requests are classified against it before any model call; out-of-scope requests are refused, and the tool and retrieval surface is itself restricted to that scope. |
| 4 | Operational | Admissibility decisions are logged with their reason, false refusals and scope leakage are measured, and the declared scope is reviewed against real traffic. |
| 5 | Autonomous | Scope boundaries are refined from observed traffic and outcomes, and no path exists by which an inadmissible request reaches a model. |

## Diagnostic question

*What stops someone asking your supply chain agent an employment law question, and where in the pipeline does that happen?*

1. Nothing — the model answers or declines on its own.
2. The system prompt tells it to stay on topic and topic filters are on.
3. Requests are classified against a declared decision scope before any model call, and the tool surface is restricted to that scope.
4. Admissibility decisions are logged with reasons and false-refusal and leakage rates are measured.
5. Scope self-refines from traffic and no path bypasses the check.

## Evidence to request

- The declared decision scope artifact — the enumerated classes of decision the agent exists to make.
- The admissibility mechanism and its position in the request pipeline.
- The complete tool inventory available to the agent, which is the real scope regardless of what the prompt says.
- Admissibility logs with refusal reasons, and the false-refusal rate.

## Verification

Ask an obviously out-of-scope question and observe whether the refusal comes from a rule or from the model — the latency and the phrasing usually reveal which. Then read the tool inventory: if the agent has tools that reach outside the declared decision scope, scope is not enforced architecturally regardless of what the classifier does. Tool surface is the ground truth for scope.

## Aviation parallel

The minimum equipment list and the flight envelope both work by refusing input rather than by asking the operator to be careful, and the envelope is enforced by the airframe. The transferable principle is stated best as a design rule: you do not ask the pilot to avoid the corner of the envelope, you build an aircraft that will not go there.

## Article angle

One of the three genuinely additive capabilities from the aviation reconciliation and the sharpest of them, because it contains a real critique of how the entire industry currently does scoping. The argument — scope belongs at the boundary of what the system can retrieve and do, not at the boundary of what the model is willing to say — is quotable, testable, and directly contradicts both the prompt-engineering and the small-domain-model schools at once.

## Sources

- [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — establishes goal hijack and tool misuse as the top-ranked risks, both of which an admissibility check ahead of the model call structurally prevents.
- [Why Open Policy Agent is the Missing Guardrail for Your AI Agents](https://codilime.com/blog/why-use-open-policy-agent-for-your-ai-agents/) — the argument for an external, auditable decision point rather than model-side judgment, which is the mechanism this capability requires.

*Literature note:* almost all published guidance on scoping addresses what the model may say. The claim on this page — that scope belongs at the retrieval and tool boundary — is argued far less often, which is why it is worth owning.
