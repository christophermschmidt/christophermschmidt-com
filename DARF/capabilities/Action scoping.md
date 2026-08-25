# Action scoping

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** [Explicit authority grants](Explicit%20authority%20grants.md), [Scoped limits](Scoped%20limits.md)
**Verified by:** [Decision logging](Decision%20logging.md), [Accountability trails](Accountability%20trails.md), [Reversibility and compensating action](Reversibility%20and%20compensating%20action.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Execution → Action scoping (coverage: partial)

## Definition

The precise definition, in the execution layer, of what the agent can and cannot do: the enumerated set of actions available to it, the parameters each accepts, the entities each can affect, and the enforcement that makes the enumeration exhaustive.

## Why it matters

Action scoping is where policy becomes architecture. An authority grant that is not reflected in the tool surface is aspirational, because the real scope of an agent is exactly the set of things its tools can do — nothing more, and, critically, nothing less. This is also the strongest available control against every context-integrity failure: an agent whose tools cannot write to the payments system cannot be talked into writing to the payments system, regardless of what appears in a retrieved document. Scope enforced at the tool boundary is architectural; scope enforced anywhere else is advisory.

## Failure modes

- A general-purpose tool — arbitrary SQL, a generic HTTP client, a shell — that makes the enumerated action list meaningless.
- Tool parameters unconstrained, so an action legitimately available for one entity can be aimed at any entity.
- Write access granted at the system level because the API has no finer granularity, so scope exists only in intent.
- Tools added incrementally during development, each individually reasonable, with no re-review of the resulting combined surface.
- Read and write tools sharing a credential, so scoping the write does not scope the read that informs it.
- No distinction between actions that are reversible and actions that are not, in a single undifferentiated tool list.

## Anti-patterns

- **The escape-hatch tool.** One generic execute-query or call-API tool alongside twenty well-scoped ones. The scope of the agent is the escape hatch.
- **Scoping in the tool description.** Telling the model in prose which entities a tool may be used on, while the tool itself accepts any.
- **Reviewing tools individually.** Each tool passes review; the combination enables something nobody authorized. Compositional risk is invisible to per-tool review.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | The agent has broad access, often through general-purpose tools. Scope is intent, not construction. |
| 2 | Governed | An enumerated tool list exists, is documented, and is reviewed at release. |
| 3 | Contextual | Tools are narrowly defined with constrained parameters and entity scoping enforced server-side, no general-purpose escape hatch exists, and the tool surface corresponds exactly to the authority grants. |
| 4 | Operational | Tool usage is measured against the granted surface, unused tools are removed, and the combined surface is reviewed for compositional risk rather than tool by tool. |
| 5 | Autonomous | The tool surface is generated from the authority grants, so drift between the two is impossible, and an action outside the generated surface has no code path. |

## Diagnostic question

*List everything your agent can actually do. Does that list match what it was authorized to do — and is there a general-purpose tool on it?*

1. It has broad system access; there's no meaningful list.
2. There's a documented tool list reviewed at release.
3. Tools are narrow with server-side parameter and entity constraints, no escape hatch, matching the grants.
4. Usage is measured against the surface and the combination is reviewed for compositional risk.
5. The tool surface is generated from the grants; drift is impossible.

## Evidence to request

- The complete tool manifest, including every tool available in every environment.
- Parameter schemas showing which are constrained and which accept arbitrary values.
- Where entity-level scoping is enforced — in the tool implementation, or in the prompt.
- The mapping from tools to authority grants.
- Usage counts per tool over 90 days.

## Verification

Read the tool manifest and look for the escape hatch first; it is present far more often than architects expect, frequently added for debugging and never removed. Then take the three most consequential grants and find the tool that implements each, checking whether the tool's parameters are narrower than the system's API. If the tool simply forwards to a broad API, the scope lives in the model's judgment and the capability scores 2 at most.

## Aviation parallel

Flight envelope protection is enforced by the flight control system rather than by the pilot's restraint, which is what makes it a protection rather than a procedure. The design rule transfers exactly: put the constraint in a component the constrained component cannot override. A tool that physically cannot express the disallowed action is the enterprise version of an airframe that will not exceed its angle of attack.

## Article angle

The clearest technical statement of the framework's central architectural claim, and it doubles as the answer to the prompt-injection problem without needing to invoke it. The line worth building the piece around: your agent's scope is its tool manifest, everything else is a description of your intentions, and you can read the manifest in ten minutes.

## Sources

- [OWASP Top 10 for Agentic Applications (2026)](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — tool misuse ranks among the top agentic risks, and the mitigation guidance is architectural: narrow the tool surface rather than instruct the model.
- [OpenPort Protocol: A Security Governance Specification for AI Agent Tool Access](https://arxiv.org/pdf/2602.20196) — a formal treatment of scoped tool access, including parameter-level constraint and the compositional risk that per-tool review misses.
