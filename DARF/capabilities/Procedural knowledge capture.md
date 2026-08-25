# Procedural knowledge capture

**Pillar:** Semantic Readiness
**Layer:** AI Readiness & Interoperability
**Status:** Scoped
**Prerequisites:** [Unstructured content readiness](Unstructured%20content%20readiness.md)
**Verified by:** [Intelligence routing](Intelligence%20routing.md), [Action scoping](Action%20scoping.md), [Automation authority and handback](Automation%20authority%20and%20handback.md)
**Microsoft implementation:** not mapped in the reference architecture. No first-party mechanism turns a written SOP into an executable, versioned procedure an agent can follow and an auditor can check it followed.

## Definition

The organization's actual operating procedures — SOPs, runbooks, escalation trees, decision rules, exception handling, "how we really do this" — exist as current, versioned, machine-readable artifacts rather than as stale documents plus tacit knowledge held by experienced staff.

## Why it matters

An agent asked to *answer* needs data. An agent asked to *act* needs the procedure, and the procedure is the artifact enterprises are worst at maintaining. What exists is usually a three-year-old SOP that describes a process that has since changed, plus the real process, which lives in the heads of four people and in a Teams channel.

This is the bridge capability between the pillars. When the procedure is not captured, three things follow, and all three are Pillar 2 failures with a Pillar 1 cause. The agent improvises the process, which means the process is now non-deterministic. Intelligence routing has nothing deterministic to route to, so a documented business rule gets re-derived probabilistically on every request. And there is no reference against which to judge whether the agent followed the process, so both evaluation and audit lose their standard of correctness.

There is also a timing argument. Procedural knowledge degrades by attrition, and the capture problem gets harder every year the people who hold it are closer to leaving.

## Failure modes

- The documented procedure and the actual procedure have diverged, and everyone knows which one to follow.
- Procedures written as prose narrative rather than as steps with conditions, so no system can execute or check them.
- Exception handling — the part that consumes most of the actual work — undocumented entirely, because the SOP describes the happy path.
- Decision rules embedded in a legacy application's code with no extracted, readable statement of the rule.
- Runbooks that assume tacit context ("escalate to the usual contact," "use the normal threshold").
- No version or effective date, so an agent cannot know which procedure applied to a case from last quarter.
- Procedures owned by nobody, reviewed on no cycle, and updated only after an incident.
- The same process documented differently in three regions with no statement of which variation is intentional.

## Anti-patterns

- **Prompt as procedure.** Encoding the process in an agent's system instructions. It is then unversioned, untestable, invisible to the process owner, and paid for on every request.
- **Process mining as capture.** Mining shows what happened, which is valuable and is not the same as what should happen. The gap between them is precisely the thing worth knowing, and mining alone cannot name it.
- **Letting the LLM write the SOP from the documents.** Produces a fluent synthesis of stale sources with the divergences smoothed over — the specific failure mode that makes the output worse than the inputs.
- **Documenting the happy path and calling it done.** The exceptions are where the authority questions live and where the agent will need to hand back.

## Maturity anchors

| Level | Name | What is true |
|---|---|---|
| 1 | Reactive | Procedures exist as documents of unknown currency plus tacit knowledge. Divergence from practice is known and untracked. |
| 2 | Governed | Key procedures are documented with an owner and a review cycle, and are known to reflect current practice. |
| 3 | Contextual | Procedures are structured as steps, conditions, decision rules and exception paths, versioned with effective dates, and readable by both the process owner and the execution layer. |
| 4 | Operational | Documented procedure is reconciled against observed execution, divergence is measured, exception frequency is tracked, and agent conformance to the procedure is checkable. |
| 5 | Autonomous | Divergence between documented and executed procedure is detected automatically and raised as a change proposal, and an action class with no current procedure cannot be automated. |

## Diagnostic question

*For the process you want the agent to run, where is the current procedure written, when was it last verified against what people actually do, and does it cover the exceptions?*

1. There's an SOP somewhere; the real process is in people's heads.
2. It's documented with an owner and a review cycle and it's current.
3. It's structured as steps, conditions and exception paths, versioned, and readable by both the owner and the execution layer.
4. Documented and observed execution are reconciled and divergence is measured.
5. Divergence is auto-detected and raised, and un-procedured actions cannot be automated.

## Evidence to request

- The procedure for the target process, with version, effective date and owner.
- The exception paths, specifically — ask what happens in the three most common non-standard cases.
- Evidence of the last verification against actual practice, and who performed it.
- The decision rules extracted from any legacy system that participates in the process.
- The agent's system prompt, read for process content that should be in the procedure.

## Verification

Take the documented procedure to someone who performs the process daily and ask them to walk through a recent real case against it. The number of steps they do differently, and the number of decisions they make that the document does not mention, is the score. This is a thirty-minute exercise, it always produces a finding, and it is the one assessment activity that reliably makes the business-side stakeholder an ally — because it validates something they already believe.

## Aviation parallel

Checklists, standard operating procedures and the quick reference handbook are the whole of this capability, executed by humans. Three properties are worth borrowing and are absent from enterprise practice. They are versioned and dated, with a controlled revision process. They cover abnormal and emergency procedures at greater length than normal ones — the opposite of the enterprise SOP's happy-path bias. And compliance is recorded, not merely expected, which is what makes conformance checkable after the fact.

## Article angle

The genuinely overlooked prerequisite to agentic execution, and a strong piece because the reader recognises the situation immediately. The argument: everyone is asking whether the model can follow the process, and nobody has checked whether the process is written down. The aviation contrast does real work here — an industry that automated successfully spent decades writing the abnormal procedures first, and enterprises document the happy path and improvise the rest. Also the cleanest available demonstration that Pillar 1 gaps surface as Pillar 2 failures.

## Sources

- [Knowledge Management Guide: Enterprise AI & Agentic AI](https://www.sinequa.com/resources/assets/knowledge-management-guide/) — the explicit/tacit distinction applied to agentic systems, and the observation that organizations over-index on capturing explicit knowledge while tacit knowledge leaves with the people who hold it.
- [AI Knowledge Management: How Enterprise Ops Leaders Capture and Scale Institutional Intelligence](https://aiassemblylines.com/post/ai-knowledge-management-enterprise-framework) — the operational framing: turning static SOPs into artifacts an agent can act on, and why the reasoning framework around a procedure matters as much as the steps.
- [FAA Advisory Circular 120-51E, Crew Resource Management Training](https://www.faa.gov/documentlibrary/media/advisory_circular/ac_120-51e.pdf) — for the aviation parallel: how procedure, challenge and escalation are specified and rehearsed rather than assumed.

*Literature note:* the available sources here are predominantly vendor-authored knowledge-management content, which is thinner ground than most capabilities in this framework stand on. The academic KM literature on tacit-to-explicit conversion is decades old and predates the agentic use case entirely. Treat the sourcing as directional and the aviation comparison as the stronger evidence.
