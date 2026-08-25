# Vendor-agnostic execution-layer selection

**Pillar:** Operational Readiness
**Layer:** Execution
**Status:** Scoped
**Prerequisites:** none — this is a root capability of the Execution layer
**Verified by:** [Intelligence routing](Intelligence%20routing.md), [Cost per decision](Cost%20per%20decision.md)
**Microsoft implementation:** `../../MicrosoftIQ.html` → Execution → Vendor-agnostic execution-layer selection (coverage: pattern), and "The nine that will bite" → capability hosts are a one-way door

## Definition

The execution layer — the runtime that actually carries out actions — is chosen deliberately, with the coupling it creates understood and the exit cost known. The layer is an architectural role, not a product: a Foundry Agent Service, an Operations Agent and a Vertex Agent Builder are interchangeable implementations of it.

## Why it matters

The execution layer is where the most consequential and least reversible platform decisions get made, usually early, usually by whoever ran the pilot. Tool definitions, orchestration semantics, memory model, approval mechanics and telemetry format all become properties of the chosen runtime, and moving off it later is a rewrite rather than a migration. The framework's position is not that portability is a virtue in itself — it usually is not worth paying for — but that the coupling must be a decision with a stated cost rather than an accident, because the market is moving fast enough that an 18-month-old choice will be re-litigated.

## Failure modes

- The execution layer is whatever the pilot used, and nobody re-examined it before production.
- Business logic written into the runtime's proprietary orchestration constructs, so the logic cannot be lifted.
- Tool definitions coupled to one runtime's schema and re-authored per platform.
- No abstraction between the agent's reasoning and the action interface, so a runtime change is a full rebuild.
- Multiple execution layers accumulating across business units with no shared policy, telemetry or identity model — the sprawl problem in its most expensive form.
- Selecting for demo velocity and discovering the governance surface — approvals, logging, identity — only after the pilot succeeds.

## Anti-patterns

- **Portability as an unpriced goal.** Building an abstraction over three runtimes nobody will ever use costs more than the lock-in it avoids.
- **Framework-of-frameworks.** An in-house orchestration wrapper that becomes its own maintenance burden and its own hiring problem.
- **Judging on model quality.** The execution layer's differentiators are governance surface, tool model, state handling and telemetry; the model behind it is usually the same model.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | The execution layer is whatever was used first. No selection occurred. |
| 2 | Governed | A deliberate selection was made and documented against stated requirements. |
| 3 | Contextual | Selection criteria cover governance surface, identity, telemetry and tool model, not just capability; business logic and tool contracts sit behind an interface the runtime does not own. |
| 4 | Operational | Coupling is inventoried and exit cost is estimated and revisited; execution layers in use across the organization are known and consolidated on a plan. |
| 5 | Autonomous | Actions are portable across runtimes by construction, and the layer can be substituted per workload without touching business logic. |

## Diagnostic question

*If you had to move to a different agent runtime in twelve months, what would you have to rewrite?*

1. Everything, and we haven't considered it.
2. A lot; the choice was deliberate but coupling wasn't a criterion.
3. Business logic and tool contracts survive; selection criteria included governance and telemetry.
4. Coupling is inventoried, exit cost is estimated and reviewed, and runtimes across the org are being consolidated.
5. Substitution is a configuration change.

## Evidence to request

- The selection decision record and its criteria.
- The inventory of execution layers actually in use across the organization, including business-unit deployments.
- Where business logic lives relative to the runtime's proprietary constructs.
- The tool definition format and whether it is runtime-specific.

## Verification

Ask which execution layers are in use across the whole organization, not just in the program under assessment. The count is usually higher than the sponsor believes, and each additional one multiplies the Policy and Audit work rather than adding to it. Then look at where the business rules physically live; if they are expressed in the runtime's own workflow constructs, the exit cost is a rewrite regardless of what the architecture diagram claims.

## Article angle

The useful and unfashionable position: lock-in at the execution layer is often the right trade, and the failure is not making it consciously. This is also the capability that most directly supports the framework's vendor-agnostic stance — being able to name Foundry, Bedrock and Vertex as interchangeable implementations of one architectural role is what lets the framework be sold on the Microsoft stack without reading as Microsoft marketing.

## Sources

- [A survey of agent interoperability protocols: MCP, ACP, A2A and ANP](https://arxiv.org/pdf/2505.02279) — the comparative map of what is actually standardised across runtimes, which is the basis for estimating exit cost rather than guessing at it.
- [Governance Gaps in Agent Interoperability Protocols: What MCP, A2A and ACP Cannot Express](https://arxiv.org/pdf/2606.31498) — the important counterweight: the protocols standardize invocation and delegation, not authority, policy or audit, so protocol adoption does not deliver the portability it appears to.
